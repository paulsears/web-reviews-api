#!/usr/bin/env bash

# Load environment variables
if [ -f ".env-local-dev" ]; then
  source .env-local-dev
fi

if [ -f ".env-local-dev-secrets" ]; then
  source .env-local-dev-secrets
fi

echo "Environment loaded:"
echo "MONGODB_CONNECTION_STRING: $MONGODB_CONNECTION_STRING"
echo "MONGODB_DATABASE_NAME: $MONGODB_DATABASE_NAME"
echo ""

# Start the development server
pnpm run start:dev
