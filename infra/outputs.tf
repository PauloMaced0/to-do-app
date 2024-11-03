output "dns_name" {
  description = "The DNS name of the load balancer"
  value       = try(aws_alb.application_load_balancer.dns_name, null)
}
