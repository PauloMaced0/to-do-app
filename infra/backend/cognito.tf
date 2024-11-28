module "cognito" {
  source = "../modules/cognito"

  user_pool_name                = "todo-auth"
  client_name                   = "todo-client"
  domain                        = "todo-domain"
  identity_pool_name            = "todo-identity-pool"
  region                        = "eu-west-1"
  callback_urls                 = ["${aws_apigatewayv2_api.apigw.api_endpoint}/reminders"] 
  logout_urls                   = ["${aws_apigatewayv2_api.apigw.api_endpoint}/"]
  allowed_oauth_flows           = ["code", "implicit"]
  allowed_oauth_scopes          = ["email", "openid", "profile", "aws.cognito.signin.user.admin"]
  explicit_auth_flows           = ["ALLOW_CUSTOM_AUTH", "ALLOW_REFRESH_TOKEN_AUTH", "ALLOW_USER_PASSWORD_AUTH", "ALLOW_USER_SRP_AUTH"]
  supported_identity_providers  = ["COGNITO"]
  refresh_token_validity        = 4
  access_token_validity         = 1
  id_token_validity             = 1
  allow_unauthenticated_identities = false
  server_side_token_check       = true
}
