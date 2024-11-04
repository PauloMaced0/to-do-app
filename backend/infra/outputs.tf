output "api_endpoint" {
  description = "The DNS name of the api gateway"
  value       = try(aws_apigatewayv2_api.apigw.api_endpoint, null)
}
