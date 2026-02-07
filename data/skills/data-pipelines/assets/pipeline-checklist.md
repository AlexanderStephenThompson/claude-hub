# Pipeline Design Checklist

## Before Building

- [ ] Data sources identified and documented
- [ ] Schema/contract defined for each stage
- [ ] SLAs defined (freshness, availability)
- [ ] Failure handling strategy decided
- [ ] Backfill requirements understood

---

## Task Design

### Idempotency
- [ ] Task produces same output on retry
- [ ] Uses delete-then-insert or upsert
- [ ] No append-only without deduplication
- [ ] Execution date parameterized

### Atomicity
- [ ] All-or-nothing writes
- [ ] No partial updates on failure
- [ ] Staging table or temp location used

### Isolation
- [ ] Task doesn't depend on other task's timing
- [ ] Dependencies explicitly declared
- [ ] No race conditions between tasks

---

## Data Quality

### Input Validation
- [ ] Schema validation on source data
- [ ] Null checks on required fields
- [ ] Value range validation
- [ ] Referential integrity checks

### Output Validation
- [ ] Row count within expected range
- [ ] No unexpected nulls
- [ ] Uniqueness constraints verified
- [ ] Comparison to previous run (if applicable)

### Anomaly Detection
- [ ] Volume change alerts (>50% swing)
- [ ] Late data alerts
- [ ] Schema drift detection
- [ ] Value distribution monitoring

---

## Error Handling

### Retries
- [ ] Retry count configured
- [ ] Backoff strategy defined
- [ ] Alert after max retries

### Failure Modes
- [ ] Upstream failure handling documented
- [ ] Partial failure recovery plan
- [ ] Manual intervention procedures

### Alerting
- [ ] Alert on task failure
- [ ] Alert on SLA breach
- [ ] Alert on data quality issues
- [ ] Alert destinations configured (Slack, PagerDuty)

---

## Observability

### Logging
- [ ] Start/end timestamps logged
- [ ] Row counts logged
- [ ] Key metrics logged
- [ ] Error details captured

### Metrics
- [ ] Duration tracked
- [ ] Data volume tracked
- [ ] Success/failure rate tracked
- [ ] Queue depth (if applicable)

### Lineage
- [ ] Source to target mapping documented
- [ ] Transformation logic documented
- [ ] Dependencies visible in DAG

---

## Backfill Support

- [ ] Can run for arbitrary date range
- [ ] Backfill doesn't affect production
- [ ] Backfill can be parallelized
- [ ] Backfill tested for at least 30 days

---

## Security

- [ ] Credentials not in code
- [ ] Secrets in vault/secrets manager
- [ ] Minimum required permissions
- [ ] Audit logging enabled
- [ ] PII handling documented

---

## Documentation

- [ ] Purpose and business context
- [ ] Data dictionary for outputs
- [ ] Dependency diagram
- [ ] Runbook for common issues
- [ ] Contact/owner information

---

## Deployment

- [ ] CI/CD pipeline configured
- [ ] Test environment available
- [ ] Rollback procedure documented
- [ ] Monitoring dashboard created
- [ ] Alerts tested

---

## Review Questions

Before deploying, answer:

1. What happens if this runs twice?
2. What happens if the source is empty?
3. What happens if the source is late?
4. How do we backfill if needed?
5. How do we know if it's broken?
6. Who gets paged when it fails?
