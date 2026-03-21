# Infrastructure as Code Checklist

## Before Starting

- [ ] State backend configured (S3 + DynamoDB for AWS)
- [ ] Provider versions pinned
- [ ] Terraform version pinned
- [ ] Module structure decided
- [ ] Naming convention defined
- [ ] Tagging strategy defined

---

## State Management

### Remote State Setup
- [ ] S3 bucket for state (versioned, encrypted)
- [ ] DynamoDB table for locking
- [ ] State file per environment
- [ ] Backend config in separate file (for flexibility)

```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "company-terraform-state"
    key            = "project/env/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

### State Hygiene
- [ ] Never edit state manually
- [ ] Use `terraform state` commands for moves
- [ ] Backup before risky operations
- [ ] Review state diffs carefully

---

## Code Organization

### Directory Structure
```
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   ├── staging/
│   └── prod/
├── modules/
│   ├── data-lake/
│   ├── glue-jobs/
│   └── networking/
└── README.md
```

### File Organization
- [ ] One `main.tf` per module (or split by resource type)
- [ ] All variables in `variables.tf`
- [ ] All outputs in `outputs.tf`
- [ ] Provider config in `versions.tf`
- [ ] Environment-specific values in `terraform.tfvars`

---

## Variables

- [ ] All variables have descriptions
- [ ] Sensitive variables marked `sensitive = true`
- [ ] Validation blocks for constrained values
- [ ] Defaults only where sensible
- [ ] No secrets in `.tfvars` files

```hcl
variable "environment" {
  type        = string
  description = "Deployment environment"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Must be dev, staging, or prod."
  }
}
```

---

## Resources

### Naming
- [ ] Consistent naming: `${project}-${env}-${purpose}`
- [ ] All resources tagged
- [ ] Tags include: Environment, Project, ManagedBy, Owner

### Dependencies
- [ ] Explicit dependencies with `depends_on` only when needed
- [ ] Implicit dependencies via references preferred
- [ ] No circular dependencies

### Lifecycle
- [ ] `prevent_destroy` on critical resources
- [ ] `create_before_destroy` where needed
- [ ] `ignore_changes` for externally managed attributes

---

## Security

### Secrets
- [ ] No secrets in code
- [ ] No secrets in state (or state encrypted)
- [ ] Use AWS Secrets Manager/Parameter Store
- [ ] Reference secrets by ARN, not value

### IAM
- [ ] Least privilege policies
- [ ] No `*` permissions (or documented exception)
- [ ] Roles over users
- [ ] Managed policies over inline

### Networking
- [ ] Private subnets for compute
- [ ] VPC endpoints for AWS services
- [ ] Security groups restrict ingress
- [ ] No 0.0.0.0/0 ingress (or documented exception)

---

## Testing

### Local
- [ ] `terraform fmt` passes
- [ ] `terraform validate` passes
- [ ] `terraform plan` reviewed

### CI/CD
- [ ] Plan runs on PR
- [ ] Apply requires approval
- [ ] State locking prevents concurrent applies
- [ ] Drift detection scheduled

---

## Deployment

### Pre-Apply
- [ ] Plan output reviewed
- [ ] Destructive changes identified
- [ ] Team notified of significant changes
- [ ] Rollback plan documented

### Post-Apply
- [ ] Resources verified
- [ ] Monitoring confirms health
- [ ] Documentation updated

---

## Documentation

- [ ] README with purpose and usage
- [ ] Architecture diagram
- [ ] Input/output documentation
- [ ] Example tfvars
- [ ] Runbook for common operations

---

## Review Questions

Before merging, answer:

1. Is the plan output expected?
2. Are there any destructive changes?
3. Will this work in all environments?
4. Are secrets properly managed?
5. Are resources properly tagged?
6. Is the change reversible?
