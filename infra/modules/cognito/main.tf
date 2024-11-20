resource "aws_cognito_user_pool" "pool" {
  name = var.user_pool_name

  username_attributes = ["email"]
  auto_verified_attributes = ["email"]


  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true

    string_attribute_constraints {
      min_length = 5
      max_length = 256
    }
  }

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

  callback_urls = var.callback_urls

  logout_urls = var.logout_urls

  allowed_oauth_scopes = var.allowed_oauth_scopes

  allowed_oauth_flows = var.allowed_oauth_flows

  explicit_auth_flows = var.explicit_auth_flows

  supported_identity_providers = var.supported_identity_providers 

  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "hours"
  }

  refresh_token_validity = var.refresh_token_validity
  access_token_validity  = var.access_token_validity
  id_token_validity      = var.id_token_validity
}

resource "aws_cognito_user_pool_domain" "domain" {
  domain       = var.domain
  user_pool_id = aws_cognito_user_pool.pool.id
}

resource "aws_cognito_identity_pool" "identity_pool" {
  identity_pool_name               = var.identity_pool_name
  allow_unauthenticated_identities = var.allow_unauthenticated_identities 

  cognito_identity_providers {
    client_id       = aws_cognito_user_pool_client.client.id 
    provider_name   = "cognito-idp.${var.region}.amazonaws.com/${aws_cognito_user_pool.pool.id}"
    server_side_token_check = var.server_side_token_check
  }
}
