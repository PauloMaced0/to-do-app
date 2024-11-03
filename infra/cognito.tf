resource "aws_cognito_user_pool" "user_pool" {
  name = var.pool_name
}

resource "aws_cognito_user_pool_client" "client" {
  name = var.client_name
  user_pool_id = aws_cognito_user_pool.user_pool.id
}

resource "aws_cognito_user_pool_domain" "domain" {
  domain       = var.domain
  user_pool_id = aws_cognito_user_pool.user_pool.id
}
