data "aws_iam_policy_document" "policy" {
  statement {
    effect    = "Allow"
    actions   = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:DescribeLogStreams"
    ]
    resources = ["*"]
  }
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions               = ["sts:AssumeRole"]

    principals {
      type                = "Service"
      identifiers         = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ecsTaskExecutionRole" {
    name                  = "test-app-ecsTaskExecutionRole"
    assume_role_policy    = data.aws_iam_policy_document.assume_role_policy.json
}

resource "aws_iam_role" "ecsTaskRole" {
    name                  = "ecsTaskRole"
    assume_role_policy    = data.aws_iam_policy_document.assume_role_policy.json   
}

resource "aws_iam_policy" "policy" {
  name        = "ecs-logs-policy"
  description = "ECS permissions to write on logs"
  policy      = data.aws_iam_policy_document.policy.json
}

resource "aws_iam_role_policy_attachment" "ecsTaskExecutionRole_policy" {
    role                  = aws_iam_role.ecsTaskExecutionRole.name
    policy_arn            = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "ecsTaskExecutionRole_policy_logs" {
    role                  = aws_iam_role.ecsTaskExecutionRole.name
    policy_arn            = aws_iam_policy.policy.arn
}


resource "aws_iam_role_policy_attachment" "ecsTaskRole_policy_logs" {
    role                  = aws_iam_role.ecsTaskRole.name
    policy_arn            = aws_iam_policy.policy.arn
}
