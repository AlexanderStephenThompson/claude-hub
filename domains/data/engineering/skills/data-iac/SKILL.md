---
name: data-iac
description: Infrastructure as Code patterns - Terraform, CDK, CloudFormation
user-invocable: false
---

# Data IaC Skill

**Version:** 1.0
**Stack:** Terraform, AWS CDK, CloudFormation

Infrastructure without code is infrastructure without memory. Manual console changes create drift that nobody notices until a deploy fails. Hardcoded values mean dev and prod diverge silently. Local state files mean one laptop death away from losing track of what's deployed.

IaC makes infrastructure reviewable, repeatable, and recoverable — the same code for every environment means what works in staging works in prod. These patterns aren't about tidiness. They're about being able to recover when things go wrong, which they always do.

---

## Scope and Boundaries

**This skill covers:**
- Terraform module patterns
- AWS CDK constructs
- State management
- Environment promotion
- Secret handling
- Tagging and cost allocation

**Defers to other skills:**
- `security`: IAM policies, encryption settings
- `data-aws`: Service-specific configurations

**Use this skill when:** Writing infrastructure code for data systems.

---

## Core Principles

1. **Modules for Reuse** — Extract patterns into versioned modules.
2. **Environment Parity** — Dev, staging, prod use same code, different vars.
3. **Least Privilege** — IAM grants minimum required access.
4. **State is Sacred** — Remote state, locking, never manual edits.
5. **Tag Everything** — Cost allocation, ownership, environment.

---

## Patterns

### Terraform Module Structure

```
modules/
├── data-lake/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── README.md
└── glue-job/
    ├── main.tf
    ├── variables.tf
    └── outputs.tf

environments/
├── dev/
│   ├── main.tf
│   └── terraform.tfvars
├── staging/
│   └── ...
└── prod/
    └── ...
```

### Required Tags

```hcl
locals {
  common_tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "terraform"
    Owner       = var.owner_email
    CostCenter  = var.cost_center
  }
}

resource "aws_s3_bucket" "data_lake" {
  bucket = "${var.project_name}-${var.environment}-data-lake"
  tags   = local.common_tags
}
```

### CDK Stack Pattern

```typescript
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';

interface DataLakeStackProps extends cdk.StackProps {
  environment: string;
  projectName: string;
}

export class DataLakeStack extends cdk.Stack {
  public readonly rawBucket: s3.Bucket;
  public readonly curatedBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: DataLakeStackProps) {
    super(scope, id, props);

    this.rawBucket = new s3.Bucket(this, 'RawBucket', {
      bucketName: `${props.projectName}-${props.environment}-raw`,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    this.curatedBucket = new s3.Bucket(this, 'CuratedBucket', {
      bucketName: `${props.projectName}-${props.environment}-curated`,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });
  }
}
```

### Remote State (Terraform)

```hcl
terraform {
  backend "s3" {
    bucket         = "company-terraform-state"
    key            = "data-platform/${var.environment}/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| Local state files | Lost state, no collaboration | Use remote backend with locking |
| Hardcoded values | Can't promote between envs | Use variables, tfvars per env |
| No modules | Copy-paste, drift between envs | Extract reusable modules |
| Manual console changes | Drift, undocumented | Import or recreate in code |
| Secrets in code/state | Security risk | Use Secrets Manager, reference by ARN |
| No tagging | Can't track costs or ownership | Tag everything |

---

## Checklist

- [ ] Remote state with locking
- [ ] All resources tagged (environment, project, owner)
- [ ] No secrets in code or variables
- [ ] Modules versioned and documented
- [ ] Same code for all environments
- [ ] Plan reviewed before apply

---

## References

- `references/terraform-modules.md` — Module structure and patterns

## Assets

- `assets/iac-checklist.md` — Infrastructure as Code best practices checklist
