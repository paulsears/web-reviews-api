terraform {
  required_version = "1.9.8"
  backend "s3" {
    bucket         = "apfm-terraform-state-backend"
    dynamodb_table = "devx-terraform-lock"
    encrypt        = true
    key            = "stacks/prod/apfm-nestjs-template/alerts/terraform.tfstate"
    region         = "us-west-2"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.75"
    }
    newrelic = {
      source  = "newrelic/newrelic"
    }
  }
}

provider "aws" {
  region     = "us-west-2"
  retry_mode = "adaptive"
  assume_role {
    external_id  = "8Q87R108WypLN8wqL8Rg"
    role_arn     = "arn:aws:iam::451834275279:role/TerraformApply"
    session_name = "terraform-dev-apply"
  }
}

provider "newrelic" {
  account_id = 383185
  region     = "US"
}
