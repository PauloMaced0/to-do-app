output "user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = aws_cognito_user_pool.pool.id
}

output "user_pool_client_id" {
  description = "ID of the Cognito User Pool Client"
  value       = aws_cognito_user_pool_client.client.id
}

output "domain" {
  description = "Cognito User Pool Domain"
  value       = aws_cognito_user_pool_domain.domain.id
}

output "user_pool_endpoint" {
  description = "Cognito User Pool Endpoint"
  value = aws_cognito_user_pool.pool.endpoint
}
