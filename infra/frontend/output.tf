# output "s3_endpoint" {
#   value = try(aws_s3_bucket_website_configuration.todoui_config.website_endpoint, null)
#   description = "Endpoint for the website"
# }

output "cloudfront_distribution_arn" {
  value = aws_cloudfront_distribution.cloudfront_distrib.arn
}

output "cloudfront_distribution_domain_name" {
  value = aws_cloudfront_distribution.cloudfront_distrib.domain_name
}
