terraform {
    required_providers {
	aws = {
	    source  = "hashicorp/aws"
	    version = "~> 5.0"
	}
	null = {
	    source  = "hashicorp/null"
	    version = "~> 3.0"
	}
    }	 
    required_version = "~> 1.5.7"
}
