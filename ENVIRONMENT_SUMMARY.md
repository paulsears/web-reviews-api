# Environment Configuration Summary

## Overview

Yes, you **do need** task definitions for QA and PROD! The repository is already set up with all three environments and I've updated them all with the MongoDB configuration.

## Environment Structure

### 🏗️ **Task Definitions** (All Updated ✅)

| Environment | File | AWS Account | Parameter Store Path |
|-------------|------|-------------|---------------------|
| **DEV** | `task-definition.dev.json` | `146283654498` | `/web-reviews-api/secrets/mongodb_connection_string` |
| **QA** | `task-definition.qa.json` | `521312932954` | `/web-reviews-api-qa/secrets/mongodb_connection_string` |
| **PROD** | `task-definition.prod.json` | `451834275279` | `/web-reviews-api-prod/secrets/mongodb_connection_string` |

### 🚀 **Deployment Pipeline**

#### **DEV Environment**

- **Trigger**: Push to `main` branch
- **Workflow**: `.github/workflows/dev.yml`
- **Automatic**: Yes, deploys on every main branch push

#### **QA Environment**  

- **Trigger**: Pre-release (e.g., `v1.0.0-beta.1`)
- **Workflow**: `.github/workflows/release.yml`
- **Manual**: Create a pre-release in GitHub

#### **PROD Environment**

- **Trigger**: Full release (e.g., `v1.0.0`)
- **Workflow**: `.github/workflows/release.yml`  
- **Manual**: Create a full release in GitHub

### 🔐 **Security & Isolation**

Each environment uses:

- **Separate AWS accounts** for complete isolation
- **Separate Parameter Store paths** for secrets
- **Environment-specific IAM roles** and permissions
- **Different MongoDB clusters** (recommended)

## MongoDB Configuration Added

### ✅ **Environment Variables** (Non-sensitive)

All task definitions now include:

```json
{
  "name": "MONGODB_DATABASE_NAME",
  "value": "reviews_db"
}
```

### ✅ **Secrets** (Sensitive)  

All task definitions now include:

```json
{
  "name": "MONGODB_CONNECTION_STRING",
  "valueFrom": "/${SERVICE_NAME}/secrets/mongodb_connection_string"
}
```

## Next Steps Required

### 1. **AWS Parameter Store Setup** (Required before deployment)

You need to add the MongoDB connection strings to each AWS account:

```bash
# DEV (Account: 146283654498)
aws ssm put-parameter \
    --name "/web-reviews-api/secrets/mongodb_connection_string" \
    --value "mongodb+srv://..." \
    --type "SecureString"

# QA (Account: 521312932954)  
aws ssm put-parameter \
    --name "/web-reviews-api-qa/secrets/mongodb_connection_string" \
    --value "mongodb+srv://..." \
    --type "SecureString"

# PROD (Account: 451834275279)
aws ssm put-parameter \
    --name "/web-reviews-api-prod/secrets/mongodb_connection_string" \
    --value "mongodb+srv://..." \
    --type "SecureString"
```

### 2. **Update Service Names** (Required)

Replace `${YOUR_SERVICE_NAME}` with actual service name in all task definitions.

### 3. **MongoDB Collection Names** (Required)

Update the actual collection names in `src/module/reviews/service/reviews.service.ts`.

## Recommended MongoDB Setup

For proper environment isolation:

| Environment | MongoDB Cluster | Database | Collections |
|-------------|----------------|----------|-------------|
| **DEV** | `dev-cluster.mongodb.net` | `reviews_db_dev` | Same structure |
| **QA** | `qa-cluster.mongodb.net` | `reviews_db_qa` | Same structure |  
| **PROD** | `prod-cluster.mongodb.net` | `reviews_db_prod` | Same structure |

This ensures complete data isolation between environments while maintaining consistent structure.
