# Deployment Setup Guide

## AWS Systems Manager Parameter Store Configuration

Before deploying to AWS ECS, you need to configure the MongoDB connection string in AWS Systems Manager Parameter Store.

### 1. Set Up MongoDB Connection String Secret

Replace `${YOUR_SERVICE_NAME}` with your actual service name (e.g., `web-reviews-api`).

#### Using AWS CLI

```bash
# For development environment
aws ssm put-parameter \
    --name "/web-reviews-api/secrets/mongodb_connection_string" \
    --value "mongodb+srv://username:password@dev-cluster.mongodb.net/reviews_db?retryWrites=true&w=majority" \
    --type "SecureString" \
    --description "MongoDB connection string for reviews API - DEV environment"

# For QA environment
aws ssm put-parameter \
    --name "/web-reviews-api-qa/secrets/mongodb_connection_string" \
    --value "mongodb+srv://username:password@qa-cluster.mongodb.net/reviews_db?retryWrites=true&w=majority" \
    --type "SecureString" \
    --description "MongoDB connection string for reviews API - QA environment"

# For production environment
aws ssm put-parameter \
    --name "/web-reviews-api-prod/secrets/mongodb_connection_string" \
    --value "mongodb+srv://username:password@prod-cluster.mongodb.net/reviews_db?retryWrites=true&w=majority" \
    --type "SecureString" \
    --description "MongoDB connection string for reviews API - PRODUCTION environment"
```

#### Using AWS Console

1. Go to AWS Systems Manager → Parameter Store
2. Click "Create parameter"
3. Create parameters for each environment:
   - DEV: `/web-reviews-api/secrets/mongodb_connection_string`
   - QA: `/web-reviews-api-qa/secrets/mongodb_connection_string`
   - PROD: `/web-reviews-api-prod/secrets/mongodb_connection_string`
4. Type: `SecureString`
5. Value: Your MongoDB connection string for each environment
6. Description: `MongoDB connection string for reviews API - [ENVIRONMENT] environment`

### 2. Update Task Definition Service Name

In `infrastructure/tasks/task-definition.dev.json`, replace all instances of `${YOUR_SERVICE_NAME}` with your actual service name:

```json
{
  "name": "web-reviews-api",
  "value": "web-reviews-api"
}
```

And update the secrets path:

```json
{
  "name": "MONGODB_CONNECTION_STRING",
  "valueFrom": "/web-reviews-api/secrets/mongodb_connection_string"
}
```

### 3. Verify IAM Permissions

Ensure your ECS task execution role has permission to read from Parameter Store:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ssm:GetParameters",
                "ssm:GetParameter"
            ],
            "Resource": [
                "arn:aws:ssm:*:*:parameter/web-reviews-api/secrets/*"
            ]
        }
    ]
}
```

### 4. Environment-Specific Configuration

The repository includes task definition files for all environments:

- `task-definition.dev.json` ✅ (Updated with MongoDB config)
- `task-definition.qa.json` ✅ (Updated with MongoDB config)
- `task-definition.prod.json` ✅ (Updated with MongoDB config)

Each references the appropriate parameter store path for that environment:

- DEV: `/web-reviews-api/secrets/mongodb_connection_string`
- QA: `/web-reviews-api-qa/secrets/mongodb_connection_string`
- PROD: `/web-reviews-api-prod/secrets/mongodb_connection_string`

### 5. AWS Account Structure

Note the different AWS account IDs for each environment:

- **DEV**: Account `146283654498`
- **QA**: Account `521312932954`  
- **PROD**: Account `451834275279`

Each environment uses its own AWS account for isolation and security.

## Local Development Verification

Test that your local environment variables are working:

```bash
# Allow direnv to load the environment
direnv allow .

# Verify environment variables are loaded
echo $MONGODB_CONNECTION_STRING
echo $MONGODB_DATABASE_NAME

# Start the application
pnpm start:dev
```

## Collection Names Configuration

Don't forget to update the actual MongoDB collection names in:
`src/module/reviews/service/reviews.service.ts`

Replace the placeholder collection names with your actual collection names:

```typescript
// Current placeholders - UPDATE THESE
this.reviewsCollection1 = this.db.collection<ReviewDocument>("reviews_collection_1");
this.reviewsCollection2 = this.db.collection<ReviewDocument>("reviews_collection_2");
this.reviewsCollection3 = this.db.collection<ReviewDocument>("reviews_collection_3");
```
