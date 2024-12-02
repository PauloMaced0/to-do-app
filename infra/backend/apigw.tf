# Create the API Gateway HTTP endpoint
resource "aws_apigatewayv2_api" "apigw" {
  name          = "todo-apigw"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["https://${var.frontend_url}"]
    allow_methods = [
      # "POST", 
      # "GET", 
      # "OPTIONS", 
      # "PUT", 
      # "DELETE",
      "*",
    ]
    allow_headers = [
      # "Content-Type",
      # "Authorization",
      # "Accept",
      # "X-Requested-With",
      # "Origin",
      # "Cache-Control",
      # "Access-Control-Request-Method",
      "*",
    ]
    expose_headers = [
      "*",
    ]
    max_age = 300
    allow_credentials = false
  }
}

# Create the VPC Link configured with the private subnets. Security groups are kept empty here, but can be configured as required.
resource "aws_apigatewayv2_vpc_link" "vpclink_apigw_to_alb" {
  name                = "vpclink_apigw_to_alb"
  security_group_ids  = [aws_security_group.api_sg.id]
  subnet_ids          = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
}

# Create the API Gateway HTTP_PROXY integration between the created API and the private load balancer via the VPC Link.
# Ensure that the 'DependsOn' attribute has the VPC Link dependency.
# This is to ensure that the VPC Link is created successfully before the integration and the API GW routes are created.
resource "aws_apigatewayv2_integration" "apigw_integration" {
  api_id           = aws_apigatewayv2_api.apigw.id
  integration_type = "HTTP_PROXY"
  integration_uri  = aws_lb_listener.listener.arn

  integration_method = "ANY"
  connection_type    = "VPC_LINK"
  connection_id      = aws_apigatewayv2_vpc_link.vpclink_apigw_to_alb.id
  payload_format_version = "1.0"
}

# API GW route with ANY method
resource "aws_apigatewayv2_route" "apigw_route" {
  api_id    = aws_apigatewayv2_api.apigw.id
  route_key = "ANY /{proxy+}"
  target = "integrations/${aws_apigatewayv2_integration.apigw_integration.id}"
  authorization_type = "JWT"
  authorizer_id = aws_apigatewayv2_authorizer.auth.id
}

resource "aws_apigatewayv2_route" "apigw_options_route" {
  api_id    = aws_apigatewayv2_api.apigw.id
  route_key = "OPTIONS /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.apigw_integration.id}"
  authorization_type = "NONE"
}

# Set a default stage
resource "aws_apigatewayv2_stage" "apigw_stage" {
  api_id = aws_apigatewayv2_api.apigw.id
  name   = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.apigw_logs.arn
    format          = jsonencode({
      requestId       = "$context.requestId",
      ip              = "$context.identity.sourceIp",
      caller          = "$context.identity.caller",
      user            = "$context.identity.user",
      requestTime     = "$context.requestTime",
      httpMethod      = "$context.httpMethod",
      resourcePath    = "$context.resourcePath",
      status          = "$context.status",
      protocol        = "$context.protocol",
      responseLength  = "$context.responseLength"
    })
  }
}
# Integrate with cognito
resource "aws_apigatewayv2_authorizer" "auth" {
  api_id           = aws_apigatewayv2_api.apigw.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "cognito-authorizer"

  jwt_configuration {
    audience = [module.cognito.user_pool_client_id]
    issuer   = "https://${module.cognito.user_pool_endpoint}"
  }
}

resource "aws_cloudwatch_log_group" "apigw_logs" {
  name = "/aws/apigateway/todo-apigw"
  retention_in_days = 7
}
