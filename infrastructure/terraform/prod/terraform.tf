terraform {
  required_version = "1.9.8"
  backend "s3" {
    bucket         = "apfm-terraform-state-backend"
    dynamodb_table = "devx-terraform-lock"
    encrypt        = true
    key            = "stacks/prod/${SERVICE_NAME}/terraform.tfstate"
    region         = "us-west-2"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.75"
    }
  }
}

provider "aws" {
  region     = "us-west-2"
  retry_mode = "adaptive"
  assume_role {
    external_id  = "iTstScj0BAjAUBed"
    role_arn     = "arn:aws:iam::146283654498:role/TerraformApply"
    session_name = "terraform-dev-apply"
  }
}