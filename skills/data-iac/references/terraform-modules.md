# Terraform Module Reference

## Module Structure

```
modules/
└── data-lake/
    ├── main.tf           # Resource definitions
    ├── variables.tf      # Input variables
    ├── outputs.tf        # Output values
    ├── versions.tf       # Provider requirements
    └── README.md         # Documentation
```

---

## Variable Patterns

### Required vs Optional

```hcl
# Required - no default
variable "environment" {
  type        = string
  description = "Environment name (dev, staging, prod)"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

# Optional - has default
variable "enable_versioning" {
  type        = bool
  description = "Enable S3 versioning"
  default     = true
}
```

### Complex Types

```hcl
variable "tags" {
  type        = map(string)
  description = "Tags to apply to all resources"
  default     = {}
}

variable "buckets" {
  type = list(object({
    name    = string
    purpose = string
  }))
  description = "List of buckets to create"
}
```

---

## Output Patterns

```hcl
# Simple output
output "bucket_arn" {
  description = "ARN of the data lake bucket"
  value       = aws_s3_bucket.data_lake.arn
}

# Sensitive output
output "db_password" {
  description = "Database password"
  value       = random_password.db.result
  sensitive   = true
}

# Conditional output
output "bucket_domain" {
  description = "Bucket domain name (if created)"
  value       = var.create_bucket ? aws_s3_bucket.main[0].bucket_domain_name : null
}
```

---

## Module Composition

### Root Module

```hcl
# environments/prod/main.tf

module "data_lake" {
  source = "../../modules/data-lake"

  environment  = "prod"
  project_name = "analytics"
  tags         = local.common_tags
}

module "glue_jobs" {
  source = "../../modules/glue-jobs"

  environment    = "prod"
  data_lake_arn  = module.data_lake.bucket_arn  # Reference other module
  jobs           = var.glue_job_configs
}
```

### Module Dependencies

```hcl
# Explicit dependency
module "processing" {
  source = "./modules/processing"

  depends_on = [module.data_lake]  # Wait for data lake
}
```

---

## Conditional Resources

```hcl
# Create resource conditionally
resource "aws_s3_bucket" "logs" {
  count  = var.enable_logging ? 1 : 0
  bucket = "${var.project}-logs"
}

# Reference conditional resource
resource "aws_s3_bucket_logging" "main" {
  count = var.enable_logging ? 1 : 0

  bucket        = aws_s3_bucket.main.id
  target_bucket = aws_s3_bucket.logs[0].id  # Note the [0]
  target_prefix = "logs/"
}
```

---

## For Each Patterns

```hcl
# Map of buckets
variable "buckets" {
  type = map(object({
    versioning = bool
    lifecycle  = string
  }))
}

resource "aws_s3_bucket" "buckets" {
  for_each = var.buckets

  bucket = "${var.project}-${each.key}"
  tags   = merge(local.common_tags, { Purpose = each.key })
}

resource "aws_s3_bucket_versioning" "buckets" {
  for_each = { for k, v in var.buckets : k => v if v.versioning }

  bucket = aws_s3_bucket.buckets[each.key].id
  versioning_configuration {
    status = "Enabled"
  }
}
```

---

## Local Values

```hcl
locals {
  # Common tags applied everywhere
  common_tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "terraform"
    Owner       = var.owner_email
  }

  # Computed values
  bucket_prefix = "${var.project_name}-${var.environment}"

  # Conditional logic
  is_production = var.environment == "prod"
}
```

---

## Data Sources

```hcl
# Get current AWS account
data "aws_caller_identity" "current" {}

# Get current region
data "aws_region" "current" {}

# Look up existing resource
data "aws_iam_role" "existing" {
  name = "existing-role-name"
}

# Use in resources
resource "aws_s3_bucket" "main" {
  bucket = "${local.bucket_prefix}-${data.aws_caller_identity.current.account_id}"
}
```

---

## Module Versioning

```hcl
# From registry
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"
}

# From git
module "custom" {
  source = "git::https://github.com/org/repo.git//modules/custom?ref=v1.2.0"
}

# Local
module "local" {
  source = "../../modules/local-module"
}
```

---

## Best Practices

### Module Design
- [ ] Single responsibility (one purpose per module)
- [ ] All inputs have descriptions
- [ ] All outputs documented
- [ ] Sensible defaults where appropriate
- [ ] Validation on inputs

### Naming
- [ ] Resources named with `${var.project}-${var.environment}-${purpose}`
- [ ] Tags applied consistently
- [ ] Outputs named clearly

### Documentation
- [ ] README with usage examples
- [ ] Input/output tables
- [ ] Prerequisites listed
