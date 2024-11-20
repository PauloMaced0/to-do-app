variable "region" {
  description = "Main region for all resources"
  type        = string
}

variable "s3_bucket_name" {
  description = "S3 Bucket name TODO UI"
  type        = string
}

variable "default_tags" {
  type = map
  default = {
    Application = "Frontend"
    Environment = "Dev"
  }
}

variable "shared_config_files" {
  description = "Path of your shared config file in .aws folder"
  type        = string
}
  
variable "shared_credentials_files" {
  description = "Path of your shared credentials file in .aws folder"
  type        = string
}

variable "credential_profile" {
  description = "Profile name in your credentials file"
  type        = string
}
