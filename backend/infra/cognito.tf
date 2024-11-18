resource "aws_cognito_user_pool" "pool" {
  name = var.pool_name

  username_attributes = ["email"]
  auto_verified_attributes = ["email"]

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }
}

resource "aws_cognito_user_pool_client" "client" {
  name = var.client_name
  user_pool_id = aws_cognito_user_pool.pool.id
  allowed_oauth_flows_user_pool_client = true

  callback_urls = [
    "http://localhost:3000/reminders",
  ]

  logout_urls = [
    "http://localhost:3000/" 
  ]

  allowed_oauth_scopes = [
    "email",
    "openid",
    "profile",
    "aws.cognito.signin.user.admin"
  ]

  allowed_oauth_flows = [
    "code",
    "implicit"
  ]

  explicit_auth_flows = [
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]

  supported_identity_providers = ["COGNITO"]

  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "hours"
  }

  refresh_token_validity = 4
  access_token_validity  = 1
  id_token_validity      = 1
}

resource "aws_cognito_user_pool_domain" "domain" {
  domain       = var.domain
  user_pool_id = aws_cognito_user_pool.pool.id
}

resource "aws_cognito_identity_pool" "identity_pool" {
  identity_pool_name               = var.identity_pool_name
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id       = aws_cognito_user_pool_client.client.id 
    provider_name   = "cognito-idp.${var.region}.amazonaws.com/${aws_cognito_user_pool.pool.id}"
    server_side_token_check = true
  }
}
