variable "region" {
  description = "Main region for all resources"
  type        = string
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the main VPC"
}

variable "public_subnet_1" {
  type        = string
  description = "CIDR block for public subnet 1"
}

variable "public_subnet_2" {
  type        = string
  description = "CIDR block for public subnet 2"
}

variable "private_subnet_1" {
  type        = string
  description = "CIDR block for private subnet 1"
}

variable "private_subnet_2" {
  type        = string
  description = "CIDR block for private subnet 2"
}

variable "availibilty_zone_1" {
  type        = string
  description = "First availibility zone"
}

variable "availibilty_zone_2" {
  type        = string
  description = "First availibility zone"
}
  
variable "default_tags" {
  type = map
  default = {
    Application = "Demo App"
    Environment = "Dev"
  }
}

variable "container_port" {
  description = "Port that needs to be exposed for the application"
  type        = number
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

variable "db_username" {
  description = "Database username"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
}

variable "frontend_url" {
  description = "Frontend url for callback and logout"
  type = string
}

