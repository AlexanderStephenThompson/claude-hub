# AWS Data Service Selection Reference

## Decision Matrix

| Use Case | Service | Why |
|----------|---------|-----|
| Store raw data | **S3** | Cheap, durable, any format |
| Ad-hoc SQL queries | **Athena** | Serverless, pay-per-query |
| ETL jobs | **Glue** | Managed Spark, schema registry |
| Small transforms | **Lambda** | Serverless, <15min, <10GB |
| BI dashboards | **Redshift** | Fast analytics, BI tool support |
| Real-time ingest | **Kinesis** | Streaming, millisecond latency |
| Orchestration | **Step Functions** | Visual workflows, error handling |
| Scheduling | **EventBridge** | Cron, event-driven triggers |

---

## S3: The Foundation

**Use for:**
- Raw data landing zone
- Processed data storage
- Cross-service data exchange
- Long-term archival

**Key patterns:**
```
s3://bucket/
├── raw/           # Immutable source data
├── staged/        # Cleaned, validated
├── curated/       # Business logic applied
└── aggregated/    # Pre-computed metrics
```

**Cost optimization:**
- Use S3 Intelligent-Tiering for unknown access patterns
- Lifecycle rules to move old data to Glacier
- Compress with gzip/snappy for Parquet

---

## Athena: Serverless SQL

**Use for:**
- Ad-hoc exploration
- Infrequent queries
- Quick analysis without infrastructure

**Best practices:**
- Partition tables (reduces scan cost)
- Use columnar format (Parquet/ORC)
- Enable partition projection
- Use workgroups for cost control

**Cost: $5/TB scanned** — partitioning is critical

---

## Glue: Managed ETL

**Use for:**
- Complex transformations
- Large-scale processing (>10GB)
- Schema registry needs
- Jobs requiring Spark

**Components:**
- **Glue Jobs**: Spark/Python Shell ETL
- **Glue Crawlers**: Schema discovery (use sparingly in prod)
- **Glue Catalog**: Metadata store (like Hive metastore)
- **Glue DataBrew**: Visual data prep (for non-engineers)

**Avoid crawlers in production** — schema drift risk. Define schemas explicitly.

---

## Lambda: Lightweight Processing

**Use for:**
- Small files (<10GB)
- Quick transforms (<15 min)
- Event-driven processing
- API endpoints

**Constraints:**
- 15 minute timeout
- 10GB memory max
- 512MB /tmp storage
- Cold starts add latency

**When to switch to Glue:**
- Processing >10GB
- Jobs >15 minutes
- Complex Spark logic needed

---

## Redshift: Data Warehouse

**Use for:**
- BI dashboards
- Complex analytics
- Concurrent users
- Sub-second queries on large data

**Architecture:**
- Columnar storage
- MPP (massively parallel processing)
- Best with sort/dist keys defined

**Redshift Serverless** for variable workloads
**Redshift Provisioned** for predictable, heavy workloads

---

## Kinesis: Real-Time

**Use for:**
- Streaming data
- Real-time analytics
- Log aggregation
- IoT data

**Options:**
- **Kinesis Data Streams**: Raw streaming, you manage consumers
- **Kinesis Firehose**: Auto-delivery to S3/Redshift
- **Kinesis Analytics**: SQL on streams

**If you can batch, use S3 + Athena/Glue instead** — much cheaper

---

## Step Functions: Orchestration

**Use for:**
- Multi-step workflows
- Error handling and retries
- Human approval steps
- Complex branching logic

**Integrates with:**
- Lambda
- Glue
- ECS/Fargate
- Athena
- SNS/SQS

**Alternative**: Airflow (MWAA) for complex DAGs with Python logic

---

## Service Combinations

### Batch ETL
```
S3 (raw) → Glue Job → S3 (curated) → Athena/Redshift
```

### Event-Driven
```
S3 Event → Lambda → S3 (processed)
```

### Real-Time
```
Kinesis Firehose → S3 → Athena
```

### Complex Workflow
```
EventBridge (schedule) → Step Functions → [Glue, Lambda, Athena]
```

---

## Cost Comparison (Rough)

| Service | Cost Model | Typical Monthly |
|---------|------------|-----------------|
| S3 | Storage + requests | $0.02/GB stored |
| Athena | Per query scan | $5/TB scanned |
| Glue | DPU-hours | $0.44/DPU-hour |
| Lambda | Duration + requests | Often <$10 |
| Redshift Serverless | RPU-hours | $0.36/RPU-hour |
| Kinesis | Shard-hours + PUT | $0.015/shard-hour |

---

## Checklist: Choosing a Service

1. How big is the data? (<10GB = Lambda, >10GB = Glue)
2. How often does it run? (Infrequent = Athena, Frequent = Redshift)
3. How fast must it be? (Real-time = Kinesis, Batch = S3+Glue)
4. Who needs access? (Engineers = Athena, BI users = Redshift)
5. What's the budget? (Tight = S3+Athena, Flexible = Redshift)
