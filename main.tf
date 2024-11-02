provider "aws" {
  region = "eu-west-1"
}

# S3 bucket for UI
resource "aws_s3_bucket" "ui_bucket" {
  bucket = "your-ui-bucket"
  acl    = "public-read"

  website {
    index_document = "index.html"
  }
}

resource "aws_s3_bucket_policy" "ui_bucket_policy" {
  bucket = aws_s3_bucket.ui_bucket.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:GetObject",
        Resource  = "${aws_s3_bucket.ui_bucket.arn}/*"
      }
    ]
  })
}

# RDS instance
resource "aws_db_instance" "db" {
  allocated_storage    = 20
  engine               = "mysql"
  engine_version       = "8.0"
  instance_class       = "db.t3.micro"
  name                 = "mydatabase"
  username             = "admin"
  password             = "password"
  parameter_group_name = "default.mysql8.0"
  skip_final_snapshot  = true
}

# ECR repository
resource "aws_ecr_repository" "fastapi_repo" {
  name = "fastapi-repo"
}

# Fargate task definition
resource "aws_ecs_task_definition" "fastapi_task" {
  family                   = "fastapi-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name  = "fastapi-container"
      image = "${aws_ecr_repository.fastapi_repo.repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
        }
      ]
    }
  ])
}

# Fargate service
resource "aws_ecs_service" "fastapi_service" {
  name            = "fastapi-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.fastapi_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = [aws_subnet.main.id]
    security_groups = [aws_security_group.main.id]
  }
}

# Cognito User Pool
resource "aws_cognito_user_pool" "user_pool" {
  name = "user-pool"
}

resource "aws_cognito_user_pool_client" "user_pool_client" {
  name         = "user-pool-client"
  user_pool_id = aws_cognito_user_pool.user_pool.id
}
