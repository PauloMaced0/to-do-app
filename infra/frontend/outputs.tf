# output "s3_endpoint" {
#   value = try(aws_s3_bucket_website_configuration.todoui_config.website_endpoint, null)
#   description = "Endpoint for the website"
# }

# output "cloudfront_distribution_arn" {
#   value = aws_cloudfront_distribution.cloudfront_distrib.arn
# }

output "cloudfront_distribution_domain_name" {
  description = "Cloudfront domain name"
  value = try(aws_cloudfront_distribution.cloudfront_distrib.domain_name, null)
}

output "s3_bucket_name" {
  description = "The name of the S3 bucket"
  value = try(aws_s3_bucket.todoui.id, null)
}
