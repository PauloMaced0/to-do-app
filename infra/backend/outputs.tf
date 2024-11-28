output "api_endpoint" {
  description = "The DNS name of the api gateway"
  value       = try(aws_apigatewayv2_api.apigw.api_endpoint, null)
}

output "region" {
  value = var.region
  description = "The AWS region where resources are deployed"
}

output "user_pool_id" {
  value = module.cognito.user_pool_id
  description = "The Cognito User Pool ID"
}

output "user_pool_client_id" {
  value = module.cognito.user_pool_client_id
  description = "The Cognito User Pool Client ID"
}

output "cognito_domain" {
  value = module.cognito.domain
  description = "The Cognito custom domain for authentication"
}
