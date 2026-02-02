# AWS Data Infrastructure Checklist

## S3 Setup

### Bucket Configuration
- [ ] Bucket naming follows convention (`{project}-{env}-{purpose}`)
- [ ] Versioning enabled for critical data
- [ ] Server-side encryption enabled (SSE-S3 or SSE-KMS)
- [ ] Public access blocked
- [ ] Lifecycle rules configured for old data
- [ ] Access logging enabled

### Data Organization
- [ ] Clear folder structure (raw/staged/curated)
- [ ] Partitioning scheme defined (year/month/day)
- [ ] Consistent file naming
- [ ] Manifest files for batch loads (if applicable)

### Cost Control
- [ ] S3 Intelligent-Tiering for unknown access
- [ ] Glacier for archival (>90 days untouched)
- [ ] S3 Analytics enabled to find optimization opportunities
- [ ] Object size reasonable (not millions of tiny files)

---

## Athena Setup

### Table Configuration
- [ ] Tables registered in Glue Catalog
- [ ] Partitions defined (or projection enabled)
- [ ] Columnar format used (Parquet/ORC)
- [ ] Compression enabled

### Query Optimization
- [ ] Partition projection enabled (if applicable)
- [ ] Workgroups configured per team/use case
- [ ] Query result location configured
- [ ] Saved queries for common patterns

### Cost Control
- [ ] Workgroup query limits set
- [ ] CloudWatch billing alerts
- [ ] Regular review of expensive queries

---

## Glue Setup

### Job Configuration
- [ ] Appropriate DPU allocation (start small)
- [ ] Timeout configured
- [ ] Retry count set
- [ ] Job bookmarks enabled (for incremental)
- [ ] CloudWatch logging enabled

### Catalog
- [ ] Tables defined with explicit schemas
- [ ] No crawlers in production (or minimal)
- [ ] Schema versioning tracked
- [ ] Sensitive columns tagged

### Security
- [ ] IAM role follows least privilege
- [ ] Connections use secrets manager
- [ ] VPC configured (if accessing private resources)

---

## Lambda Setup

### Function Configuration
- [ ] Memory sized appropriately (more memory = more CPU)
- [ ] Timeout set (default 3s is often too short)
- [ ] Reserved concurrency (if needed)
- [ ] Dead letter queue configured
- [ ] X-Ray tracing enabled

### Code
- [ ] Dependencies in layer (not in package)
- [ ] Connection reuse (outside handler)
- [ ] Idempotent operations
- [ ] Structured logging

### Triggers
- [ ] S3 event notifications configured
- [ ] EventBridge rules for scheduling
- [ ] Error handling for trigger failures

---

## Redshift Setup

### Cluster/Serverless
- [ ] Appropriate size/RPU for workload
- [ ] VPC security group restricts access
- [ ] Encryption enabled
- [ ] Automated snapshots configured
- [ ] Maintenance window set

### Tables
- [ ] Sort keys defined (query patterns)
- [ ] Distribution keys defined (join patterns)
- [ ] Compression encodings applied
- [ ] VACUUM/ANALYZE scheduled

### Users
- [ ] Role-based access (not individual users)
- [ ] Query monitoring rules enabled
- [ ] Concurrency scaling configured (if needed)

---

## Step Functions Setup

### State Machine
- [ ] Error handling on each state
- [ ] Retry policies configured
- [ ] Timeouts set
- [ ] Catch blocks for failures
- [ ] CloudWatch logging enabled

### Execution
- [ ] Execution name includes timestamp/id
- [ ] Input validation at start
- [ ] Output limited to necessary data

---

## Monitoring & Alerting

### CloudWatch
- [ ] Dashboard for key metrics
- [ ] Alarms for job failures
- [ ] Alarms for cost thresholds
- [ ] Log retention configured
- [ ] Log insights queries saved

### Alerts
- [ ] SNS topic for alerts
- [ ] Slack/PagerDuty integration
- [ ] Escalation path defined

---

## Security

### IAM
- [ ] Service roles follow least privilege
- [ ] No inline policies (use managed)
- [ ] Cross-account access via roles (not keys)
- [ ] Regular access review

### Secrets
- [ ] Credentials in Secrets Manager
- [ ] Rotation enabled (if supported)
- [ ] No secrets in code or environment variables

### Networking
- [ ] VPC endpoints for S3/Glue (no public internet)
- [ ] Security groups restrict access
- [ ] Private subnets for processing

---

## Documentation

- [ ] Architecture diagram
- [ ] Data flow documentation
- [ ] Runbook for common issues
- [ ] Cost breakdown by service
- [ ] Owner contact information
