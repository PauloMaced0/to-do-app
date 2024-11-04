provider "aws" {
    region                    = var.region
    shared_config_files       = [var.shared_config_files]
    shared_credentials_files  = [var.shared_credentials_files]
    profile                   = var.credential_profile
    default_tags {
		tags = var.default_tags
	}
}
