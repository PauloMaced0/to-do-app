provider "aws" {
  region = "eu-west-1"
}

# S3 bucket for UI
resource "aws_s3_bucket" "todoui" {
  bucket = "todoapppaulo"
}

resource "aws_s3_bucket_website_configuration" "todoui_config" {
  bucket = aws_s3_bucket.todoui.id

  index_document {
    suffix = "index.html"
  }
}

# RDS instance
resource "aws_db_instance" "todo_rds" {
allocated_storage    = 10
db_name              = "tododatabase"
engine               = "mysql"
engine_version       = "8.0"
instance_class       = "db.t3.micro"
username             = "admin"
password             = "foobarbaz"
parameter_group_name = "default.mysql8.0"
skip_final_snapshot  = true
}

# ECR repository
resource "aws_ecr_repository" "todo_ecr" {
  name                 = "todo_ecr"
}

# Cognito User Pool
resource "aws_cognito_user_pool" "todo_pool" {
  name = "todo_pool"
}
