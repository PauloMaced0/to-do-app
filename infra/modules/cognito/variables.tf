variable "user_pool_name" {
  description = "Name of the Cognito User Pool"
  type        = string
}

variable "client_name" {
  description = "Name of the Cognito User Pool Client"
  type        = string
}

variable "domain" {
  description = "Domain for the Cognito User Pool"
  type        = string
}

variable "identity_pool_name" {
  description = "Name of the Cognito Identity Pool"
  type        = string
}

variable "region" {
  description = "AWS Region"
  type        = string
}

variable "callback_urls" {
  description = "List of callback URLs for the User Pool Client"
  type        = list(string)
}

variable "logout_urls" {
  description = "List of logout URLs for the User Pool Client"
  type        = list(string)
}

variable "allowed_oauth_flows" {
  description = "Allowed OAuth flows for the User Pool Client"
  type        = list(string)
}

variable "allowed_oauth_scopes" {
  description = "Allowed OAuth scopes for the User Pool Client"
  type        = list(string)
}

variable "explicit_auth_flows" {
  description = "Explicit authentication flows for the User Pool Client"
  type        = list(string)
}

variable "supported_identity_providers" {
  description = "Supported identity providers for the User Pool Client"
  type        = list(string)
}

variable "refresh_token_validity" {
  description = "Refresh token validity (in hours)"
  type        = number
}

variable "access_token_validity" {
  description = "Access token validity (in hours)"
  type        = number
}

variable "id_token_validity" {
  description = "ID token validity (in hours)"
  type        = number
}

variable "allow_unauthenticated_identities" {
  description = "Whether to allow unauthenticated identities"
  type        = bool
}

variable "server_side_token_check" {
  description = "Make server-side token check"
  type        = bool
}
