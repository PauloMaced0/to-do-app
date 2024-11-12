# ------------------------------------------------------------------------------
# Security Group for ECS app
# ------------------------------------------------------------------------------
resource "aws_security_group" "ecs_sg" {
    vpc_id                      = aws_vpc.vpc.id
    name                        = "demo-sg-ecs"
    description                 = "Security group for ecs app"
    revoke_rules_on_delete      = true
}
# ------------------------------------------------------------------------------
# Security Group for alb
# ------------------------------------------------------------------------------
resource "aws_security_group" "alb_sg" {
    vpc_id                      = aws_vpc.vpc.id
    name                        = "demo-sg-alb"
    description                 = "Security group for alb"
    revoke_rules_on_delete      = true
}
# ------------------------------------------------------------------------------
# Security Group for rds
# ------------------------------------------------------------------------------
resource "aws_security_group" "rds_sg" {
    vpc_id                      = aws_vpc.vpc.id
    name                        = "demo-sg-rds"
    description                 = "Security group for rds"
    revoke_rules_on_delete      = true
}
# ------------------------------------------------------------------------------
# Security Group for apigw
# ------------------------------------------------------------------------------
resource "aws_security_group" "api_sg" {
    vpc_id                      = aws_vpc.vpc.id
    name                        = "demo-sg-api"
    description                 = "Security group for api"
    revoke_rules_on_delete      = true
}
# ------------------------------------------------------------------------------
# ECS app Security Group Rules - INBOUND
# ------------------------------------------------------------------------------
resource "aws_vpc_security_group_ingress_rule" "ecs_alb_ingress" {
    ip_protocol                     = "-1"
    description                     = "Allow inbound traffic from ALB"
    security_group_id               = aws_security_group.ecs_sg.id
    referenced_security_group_id    = aws_security_group.alb_sg.id
}
# ------------------------------------------------------------------------------
# ECS app Security Group Rules - OUTBOUND
# ------------------------------------------------------------------------------
resource "aws_vpc_security_group_egress_rule" "ecs_all_egress" {
    ip_protocol                 = "-1"
    description                 = "Allow outbound traffic from ECS"
    security_group_id           = aws_security_group.ecs_sg.id
    cidr_ipv4                   = "0.0.0.0/0"
}

# ------------------------------------------------------------------------------
# Alb Security Group Rules - INBOUND
# ------------------------------------------------------------------------------
resource "aws_vpc_security_group_ingress_rule" "alb_http_ingress" {
    from_port                       = 80
    to_port                         = 80
    ip_protocol                     = "TCP"
    description                     = "Allow http inbound traffic from internet"
    security_group_id               = aws_security_group.alb_sg.id
    referenced_security_group_id    = aws_security_group.api_sg.id
}
# ------------------------------------------------------------------------------
# Alb Security Group Rules - OUTBOUND
# ------------------------------------------------------------------------------
resource "aws_vpc_security_group_egress_rule" "alb_egress" {
    ip_protocol                 = "-1"
    description                 = "Allow outbound traffic from alb"
    security_group_id           = aws_security_group.alb_sg.id
    cidr_ipv4                   = "0.0.0.0/0" 
}

# ------------------------------------------------------------------------------
# Rds Security Group Rules - INBOUND
# ------------------------------------------------------------------------------
resource "aws_vpc_security_group_ingress_rule" "rds_ingress" {
    from_port                       = 5432
    to_port                         = 5432
    ip_protocol                     = "TCP"
    description                     = "Allow http inbound traffic from internet"
    security_group_id               = aws_security_group.rds_sg.id
    referenced_security_group_id    = aws_security_group.ecs_sg.id
}
# ------------------------------------------------------------------------------
# Rds Security Group Rules - OUTBOUND
# ------------------------------------------------------------------------------
resource "aws_vpc_security_group_egress_rule" "rds_egress" {
    ip_protocol                 = "-1"
    description                 = "Allow outbound traffic from alb"
    security_group_id           = aws_security_group.rds_sg.id
    cidr_ipv4                   = "0.0.0.0/0" 
}

# ------------------------------------------------------------------------------
# Api Security Group Rules - INBOUND
# ------------------------------------------------------------------------------
resource "aws_vpc_security_group_ingress_rule" "api_http_ingress" {
    from_port                   = 80
    to_port                     = 80
    ip_protocol                 = "TCP"
    description                 = "Allow http inbound traffic from internet"
    security_group_id           = aws_security_group.api_sg.id
    cidr_ipv4                   = "0.0.0.0/0" 
}
resource "aws_vpc_security_group_ingress_rule" "api_https_ingress" {
    from_port                   = 443
    to_port                     = 443
    ip_protocol                 = "TCP"
    description                 = "Allow https inbound traffic from internet"
    security_group_id           = aws_security_group.api_sg.id
    cidr_ipv4                   = "0.0.0.0/0"
}
# ------------------------------------------------------------------------------
# Api Security Group Rules - OUTBOUND
# ------------------------------------------------------------------------------
resource "aws_vpc_security_group_egress_rule" "api_egress" {
    ip_protocol                 = "-1"
    description                 = "Allow outbound traffic from api"
    security_group_id           = aws_security_group.api_sg.id
    cidr_ipv4                   = "0.0.0.0/0" 
}
