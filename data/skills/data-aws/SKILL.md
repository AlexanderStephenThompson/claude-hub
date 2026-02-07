---
name: data-aws
description: AWS data service patterns - Glue, Lambda, S3, Redshift, Athena
user-invocable: false
---

# Data AWS Skill

**Version:** 1.1
**Stack:** AWS (Glue, Lambda, S3, Redshift, Athena, Step Functions)

AWS data services charge by usage — every query scans data, every DPU-hour costs money, every unpartitioned table means full scans at $5/TB. The difference between a well-architected data lake and a poorly-structured one isn't just performance — it's real dollars. Unpartitioned Athena queries can cost 100x what partitioned queries cost for the same result. Glue jobs at default DPU count waste compute. Lambda functions with clients initialized inside the handler waste cold start time on every invocation.

These patterns aren't just best practices — they're cost controls.

---

## Scope and Boundaries

**This skill covers:**
- S3 data lake patterns
- Glue ETL jobs and crawlers
- Lambda for data processing
- Athena query patterns
- Redshift optimization
- Step Functions orchestration

**Defers to other skills:**
- `data-iac`: Terraform/CDK for infrastructure
- `data-pipelines`: General ETL patterns
- `security`: IAM, encryption, secrets

**Use this skill when:** Building data solutions on AWS.

---

## Core Principles

1. **S3 as the Foundation** — Data lake first, warehouse for served data.
2. **Partition Everything** — S3 paths and tables partitioned by date at minimum.
3. **Right-Size Compute** — Lambda for small (<10 GB, <15 min), Glue for large, Redshift for served.
4. **Cost Awareness** — Every query scans data, every DPU costs money. Partition, compress, columnar.
5. **Event-Driven When Possible** — S3 events trigger processing, not polling.
6. **Explicit Schemas** — Define schemas in Glue Catalog, never rely on crawlers in production.

---

## Service Selection

| Data Size | Frequency | Latency Need | Use |
|-----------|-----------|-------------|-----|
| <10 GB | Event-driven | Seconds | **Lambda** |
| >10 GB | Scheduled | Minutes | **Glue** |
| Any | Ad-hoc SQL | Seconds | **Athena** |
| Large | Concurrent BI users | Sub-second | **Redshift** |
| Streaming | Continuous | Milliseconds | **Kinesis** |

See `references/service-selection.md` for detailed comparison and cost breakdown.

---

## S3 Data Lake

### Path Structure

```
s3://{project}-{env}-data/
├── raw/                                    # Immutable source data
│   └── source={source}/year={YYYY}/month={MM}/day={DD}/
├── staged/                                 # Cleaned, validated
│   └── table={table}/year={YYYY}/month={MM}/day={DD}/
├── curated/                                # Business logic applied
│   └── table={table}/year={YYYY}/month={MM}/day={DD}/
└── aggregated/                             # Pre-computed metrics
    └── table={table}/year={YYYY}/month={MM}/day={DD}/
```

**Rules:**
- Hive-style partitions (`key=value/`) for automatic Athena partition discovery
- Parquet format for staged and beyond (columnar, compressed, splittable)
- Raw stays in original format (JSON, CSV) — never modify source data
- One file per partition minimum, avoid millions of small files (aim for 128 MB–1 GB each)

---

## Athena

### Partition Projection

Eliminates `MSCK REPAIR TABLE` and partition management overhead:

```sql
CREATE EXTERNAL TABLE events (
    event_id STRING,
    user_id STRING,
    event_type STRING,
    payload STRING
)
PARTITIONED BY (year STRING, month STRING, day STRING)
ROW FORMAT SERDE 'org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe'
STORED AS PARQUET
LOCATION 's3://bucket/curated/table=events/'
TBLPROPERTIES (
    'projection.enabled' = 'true',
    'projection.year.type' = 'integer',
    'projection.year.range' = '2020,2030',
    'projection.month.type' = 'integer',
    'projection.month.range' = '1,12',
    'projection.month.digits' = '2',
    'projection.day.type' = 'integer',
    'projection.day.range' = '1,31',
    'projection.day.digits' = '2',
    'storage.location.template' =
        's3://bucket/curated/table=events/year=${year}/month=${month}/day=${day}'
);
```

### Query Cost Control

Athena charges **$5 per TB scanned**. Reduce cost by:
- Always filtering on partition columns (`WHERE year = '2026' AND month = '02'`)
- Using columnar formats (Parquet scans only requested columns)
- Using `LIMIT` during exploration
- Setting workgroup query data scan limits

---

## Glue ETL

### PySpark Job Pattern

```python
import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from awsglue.context import GlueContext
from awsglue.job import Job
from pyspark.context import SparkContext

args = getResolvedOptions(sys.argv, ["JOB_NAME", "SOURCE_DATABASE", "SOURCE_TABLE", "OUTPUT_PATH"])

sc = SparkContext()
glue_context = GlueContext(sc)
spark = glue_context.spark_session
job = Job(glue_context)
job.init(args["JOB_NAME"], args)

# Read from Glue Catalog
source_frame = glue_context.create_dynamic_frame.from_catalog(
    database=args["SOURCE_DATABASE"],
    table_name=args["SOURCE_TABLE"],
    push_down_predicate="year='2026' AND month='02'"  # Partition pruning
)

# Transform
mapped_frame = ApplyMapping.apply(
    frame=source_frame,
    mappings=[
        ("event_id", "string", "event_id", "string"),
        ("user_id", "string", "user_id", "string"),
        ("event_type", "string", "event_type", "string"),
        ("timestamp", "string", "event_ts", "timestamp"),
    ]
)

filtered_frame = Filter.apply(
    frame=mapped_frame,
    f=lambda row: row["event_type"] is not None
)

# Write as Parquet, partitioned
glue_context.write_dynamic_frame.from_options(
    frame=filtered_frame,
    connection_type="s3",
    connection_options={
        "path": args["OUTPUT_PATH"],
        "partitionKeys": ["year", "month", "day"]
    },
    format="parquet",
    format_options={"compression": "snappy"}
)

job.commit()
```

### Glue Rules

- **Start small**: 2 DPUs, increase only if job is slow. Each DPU costs $0.44/hr.
- **Job bookmarks**: Enable for incremental processing (avoids reprocessing old data).
- **No crawlers in production**: Schema drift breaks downstream. Define schemas explicitly in Glue Catalog.
- **Push down predicates**: Filter at read time, not after loading all data.

---

## Lambda

### S3 Event Processing Pattern

```python
import json
import logging
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize outside handler for connection reuse across invocations
s3 = boto3.client("s3")

def handler(event, context):
    """Process S3 event: read from raw, transform, write to staged."""
    processed = 0
    errors = 0

    for record in event["Records"]:
        bucket = record["s3"]["bucket"]["name"]
        key = record["s3"]["object"]["key"]

        try:
            response = s3.get_object(Bucket=bucket, Key=key)
            data = json.loads(response["Body"].read())

            result = transform(data)

            output_key = key.replace("raw/", "staged/")
            s3.put_object(
                Bucket=bucket,
                Key=output_key,
                Body=json.dumps(result),
                ContentType="application/json"
            )
            processed += 1

        except ClientError as e:
            logger.error("S3 error processing %s: %s", key, e.response["Error"]["Code"])
            errors += 1
        except (json.JSONDecodeError, KeyError) as e:
            logger.error("Data error processing %s: %s", key, e)
            errors += 1

    logger.info("Processed %d records, %d errors", processed, errors)
    return {"processed": processed, "errors": errors}
```

### Lambda Rules

- **Clients outside handler**: `boto3.client()` calls reuse TCP connections across warm invocations.
- **Memory = CPU**: Increasing memory also increases CPU allocation. Profile to find the cost-optimal setting.
- **Idempotent operations**: S3 events can deliver duplicates. Writing the same output twice should be safe.
- **Dead letter queue**: Configure SQS DLQ to capture failed events for reprocessing.

---

## Redshift

### Table Design

```sql
CREATE TABLE fact_orders (
    order_id        BIGINT        NOT NULL ENCODE az64,
    customer_id     BIGINT        NOT NULL ENCODE az64,
    order_date      DATE          NOT NULL ENCODE az64,
    product_id      BIGINT        NOT NULL ENCODE az64,
    quantity         INTEGER       NOT NULL ENCODE az64,
    total_amount    DECIMAL(12,2) NOT NULL ENCODE az64,
    region          VARCHAR(50)   ENCODE zstd
)
DISTSTYLE KEY
DISTKEY (customer_id)     -- Collocates joins on customer_id
SORTKEY (order_date);     -- Optimizes date range filters
```

**Key design decisions:**
- **DISTKEY**: Column used most in JOIN conditions. Collocates matching rows on the same node.
- **SORTKEY**: Column used most in WHERE/ORDER BY. Enables zone map pruning.
- **DISTSTYLE EVEN**: When no clear join column. Spreads rows equally.
- **DISTSTYLE ALL**: For small dimension tables (<1M rows). Copies to every node.

### Loading Data with COPY

```sql
COPY fact_orders
FROM 's3://bucket/curated/table=orders/'
IAM_ROLE 'arn:aws:iam::123456789012:role/redshift-s3-read'
FORMAT AS PARQUET;
```

Always use COPY over INSERT for bulk loads — it reads directly from S3 in parallel across all nodes.

### Maintenance

```sql
-- Run after significant data changes
VACUUM FULL fact_orders;    -- Reclaims space, re-sorts rows
ANALYZE fact_orders;        -- Updates query planner statistics
```

---

## Step Functions

### ETL Workflow Pattern

```json
{
  "StartAt": "RunGlueJob",
  "States": {
    "RunGlueJob": {
      "Type": "Task",
      "Resource": "arn:aws:states:::glue:startJobRun.sync",
      "Parameters": {
        "JobName": "etl-raw-to-curated",
        "Arguments": {
          "--SOURCE_DATABASE": "raw_db",
          "--SOURCE_TABLE": "events",
          "--OUTPUT_PATH": "s3://bucket/curated/table=events/"
        }
      },
      "Retry": [
        {
          "ErrorEquals": ["Glue.AWSGlueException"],
          "IntervalSeconds": 60,
          "MaxAttempts": 2,
          "BackoffRate": 2.0
        }
      ],
      "Catch": [
        {
          "ErrorEquals": ["States.ALL"],
          "Next": "NotifyFailure"
        }
      ],
      "Next": "RefreshAthenaPartitions"
    },
    "RefreshAthenaPartitions": {
      "Type": "Task",
      "Resource": "arn:aws:states:::athena:startQueryExecution.sync",
      "Parameters": {
        "QueryString": "MSCK REPAIR TABLE curated_db.events",
        "WorkGroup": "data-team"
      },
      "Next": "NotifySuccess"
    },
    "NotifySuccess": {
      "Type": "Task",
      "Resource": "arn:aws:states:::sns:publish",
      "Parameters": {
        "TopicArn": "arn:aws:sns:us-east-1:123456789012:etl-alerts",
        "Message": "ETL pipeline completed successfully"
      },
      "End": true
    },
    "NotifyFailure": {
      "Type": "Task",
      "Resource": "arn:aws:states:::sns:publish",
      "Parameters": {
        "TopicArn": "arn:aws:sns:us-east-1:123456789012:etl-alerts",
        "Message.$": "States.Format('ETL pipeline failed: {}', $.Error)"
      },
      "End": true
    }
  }
}
```

**Rules:**
- **`.sync` suffix**: Waits for the job to complete (otherwise Step Functions just starts it and moves on).
- **Retry before Catch**: Let transient failures auto-recover before falling to error handling.
- **Timeouts on every state**: Prevents stuck executions from running indefinitely.

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| Unpartitioned S3/tables | Full scans, slow and expensive | Partition by date at minimum |
| Millions of small files | Slow listing, high request costs | Compact into 128 MB–1 GB files |
| Lambda for large files | Timeout, memory limits | Use Glue or Fargate for >10 GB |
| Glue crawlers in production | Schema drift, unpredictable | Define schemas explicitly |
| Redshift without sort/dist keys | Poor query performance, reshuffling | Define keys based on query patterns |
| Athena without partition pruning | Scans entire dataset at $5/TB | Always filter on partition columns |
| Polling S3 for new files | Wasteful, delayed | Use S3 event notifications or EventBridge |
| Hardcoded ARNs/paths | Breaks across environments | Parameterize with job arguments or SSM |

---

## Cost Rules of Thumb

| Service | Cost Driver | Save Money By |
|---------|-------------|---------------|
| S3 | Storage + requests | Compress, lifecycle to Glacier, avoid tiny files |
| Athena | $5/TB scanned | Partition, Parquet, select only needed columns |
| Glue | $0.44/DPU-hour | Start at 2 DPUs, use push-down predicates |
| Lambda | Duration x memory | Right-size memory, reuse connections |
| Redshift | RPU-hours or node-hours | Pause when idle, use Serverless for variable loads |

---

## Checklist

- [ ] S3 paths use Hive-style partitions (year/month/day minimum)
- [ ] Data in Parquet format from staged layer onward
- [ ] File sizes between 128 MB and 1 GB (no tiny file problem)
- [ ] Athena tables use partition projection or managed partitions
- [ ] Lambda functions <15 min, <10 GB, with DLQ configured
- [ ] Glue jobs have explicit schemas (no crawlers in prod)
- [ ] Glue jobs start at minimum DPUs with bookmarks enabled
- [ ] Redshift tables have sort keys and distribution keys defined
- [ ] Step Functions have retry, catch, and timeout on every state
- [ ] Cost alerts configured in CloudWatch

---

## References

- `references/service-selection.md` — When to use which AWS data service, cost comparison

## Assets

- `assets/aws-data-checklist.md` — Complete AWS data infrastructure checklist (S3, Athena, Glue, Lambda, Redshift, Step Functions, monitoring, security)
