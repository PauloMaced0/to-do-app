resource "aws_cloudfront_origin_access_control" "s3_origin_access_control" {
    name                              = "${var.s3_bucket_name}-oac"
    description                       = "OAC for ${var.s3_bucket_name}"
    origin_access_control_origin_type = "s3"
    signing_behavior                  = "always"
    signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "cloudfront_distrib" {
    enabled = true
    default_root_object = "index.html"

    origin {
	origin_id                = aws_s3_bucket.todoui.id 
	domain_name              = aws_s3_bucket.todoui.bucket_regional_domain_name
	origin_access_control_id = aws_cloudfront_origin_access_control.s3_origin_access_control.id
    }

    default_cache_behavior {

	target_origin_id = aws_s3_bucket.todoui.id 
	allowed_methods  = ["GET", "HEAD"]
	cached_methods   = ["GET", "HEAD"]

	forwarded_values {
	    query_string = true

	    cookies {
		forward = "all"
	    }
	}

	viewer_protocol_policy = "https-only"
    }

    restrictions {
	geo_restriction {
	    restriction_type = "none"
	}
    }

    viewer_certificate {
	cloudfront_default_certificate = true
    }

    price_class = "PriceClass_100"

}
