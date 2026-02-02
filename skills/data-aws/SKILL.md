---
name: data-aws
description: AWS data service patterns - Glue, Lambda, S3, Redshift, Athena
user-invocable: false
---

# Data AWS Skill

**Version:** 1.0
**Stack:** AWS (Glue, Lambda, S3, Redshift, Athena, Step Functions)

> Patterns for AWS data services and architectures.

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
2. **Partition Everything** — S3 paths and tables partitioned by date.
3. **Right-Size Compute** — Lambda for small, Glue for large, Redshift for served.
4. **Cost Awareness** — Monitor and optimize; data costs compound.
5. **Event-Driven When Possible** — S3 events trigger processing.

---

## Patterns

### S3 Path Structure

```
s3://bucket/
├── raw/
│   └── source={source}/year={YYYY}/month={MM}/day={DD}/
├── staged/
│   └── table={table}/year={YYYY}/month={MM}/day={DD}/
├── curated/
│   └── table={table}/year={YYYY}/month={MM}/day={DD}/
└── aggregated/
    └── table={table}/year={YYYY}/month={MM}/day={DD}/
```

### Athena Partition Projection

```sql
CREATE EXTERNAL TABLE events (
    event_id STRING,
    user_id STRING,
    event_type STRING,
    payload STRING
)
PARTITIONED BY (year STRING, month STRING, day STRING)
LOCATION 's3://bucket/events/'
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
    'storage.location.template' = 's3://bucket/events/year=${year}/month=${month}/day=${day}'
);
```

### Lambda Data Pattern

```python
import json
import boto3

s3 = boto3.client("s3")

def handler(event, context):
    """Process S3 event, transform, write to output."""
    for record in event["Records"]:
        bucket = record["s3"]["bucket"]["name"]
        key = record["s3"]["object"]["key"]

        # Read
        response = s3.get_object(Bucket=bucket, Key=key)
        data = json.loads(response["Body"].read())

        # Transform
        result = transform(data)

        # Write
        output_key = key.replace("raw/", "staged/")
        s3.put_object(
            Bucket=bucket,
            Key=output_key,
            Body=json.dumps(result)
        )
```

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| Unpartitioned S3/tables | Full scans, slow and expensive | Partition by date at minimum |
| Lambda for large files | Timeout, memory limits | Use Glue or Fargate |
| Glue crawlers in production | Schema drift, unpredictable | Define schemas explicitly |
| Redshift without sort keys | Poor query performance | Define sort/dist keys |
| Athena without partition pruning | Scans entire dataset | Always filter on partition columns |

---

## Checklist

- [ ] S3 paths partitioned (year/month/day minimum)
- [ ] Athena tables use partition projection
- [ ] Lambda sized for workload (<15 min, <10GB)
- [ ] Glue jobs have explicit schemas
- [ ] Redshift tables have sort/dist keys
- [ ] Cost alerts configured

---

## References

- `references/service-selection.md` — When to use which AWS data service

## Assets

- `assets/aws-data-checklist.md` — Complete AWS data infrastructure checklist
