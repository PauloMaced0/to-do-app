resource "aws_vpc" "vpc" {
    cidr_block              = var.vpc_cidr
    enable_dns_hostnames    = true
    enable_dns_support      = true
}

resource "aws_internet_gateway" "igw" {
    vpc_id                  = aws_vpc.vpc.id
}

resource "aws_nat_gateway" "ngw" {
    allocation_id           = aws_eip.nateip.id
    subnet_id               = aws_subnet.public_subnet_1.id
    depends_on              = [ aws_internet_gateway.igw ]
}

resource "aws_eip" "nateip" {
    domain                  = "vpc"
}

resource "aws_subnet" "private_subnet_1" {
    vpc_id                  = aws_vpc.vpc.id
    cidr_block              = var.private_subnet_1
    availability_zone       = var.availibilty_zone_1
}

resource "aws_subnet" "private_subnet_2" {
    vpc_id                  = aws_vpc.vpc.id
    cidr_block              = var.private_subnet_2
    availability_zone       = var.availibilty_zone_2
}

resource "aws_subnet" "public_subnet_1" {
    vpc_id                  = aws_vpc.vpc.id
    cidr_block              = var.public_subnet_1
    availability_zone       = var.availibilty_zone_1
    map_public_ip_on_launch = true
}

resource "aws_subnet" "public_subnet_2" {
    vpc_id                  = aws_vpc.vpc.id
    cidr_block              = var.public_subnet_2
    availability_zone       = var.availibilty_zone_2
    map_public_ip_on_launch = true
}

resource "aws_route_table" "public" {
    vpc_id                  = aws_vpc.vpc.id
    
}

resource "aws_route" "public" {
    route_table_id          = aws_route_table.public.id
    destination_cidr_block  = "0.0.0.0/0"
    gateway_id              = aws_internet_gateway.igw.id
}

resource "aws_route_table_association" "public1" {
    subnet_id               = aws_subnet.public_subnet_1.id
    route_table_id          = aws_route_table.public.id
}
resource "aws_route_table_association" "public2" {
    subnet_id               = aws_subnet.public_subnet_2.id
    route_table_id          = aws_route_table.public.id
}



resource "aws_route_table" "private" {
    vpc_id                  = aws_vpc.vpc.id
}
  
resource "aws_route" "private" {
    route_table_id          = aws_route_table.private.id
    destination_cidr_block  = "0.0.0.0/0"
    nat_gateway_id          = aws_nat_gateway.ngw.id
}

resource "aws_route_table_association" "private1" {
    subnet_id               = aws_subnet.private_subnet_1.id
    route_table_id          = aws_route_table.private.id
}

resource "aws_route_table_association" "private2" {
    subnet_id               = aws_subnet.private_subnet_2.id
    route_table_id          = aws_route_table.private.id
}

# ends here
resource "aws_ecs_cluster" "todo-ecs-cluster" {
  name = "todo-cluster"
}

resource "aws_ecs_task_definition" "todotf" {
  family                   = "todo-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name      = "todo-container"
      image     = "hub.docker.com/r/nmatsui/hello-world-api"
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "todo-ecs" {
  name            = "todo-service"
  cluster         = aws_ecs_cluster.todo-ecs-cluster.id
  task_definition = aws_ecs_task_definition.todotf.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = []
    security_groups = []
    assign_public_ip = true 
  }
}

resource "aws_lb" "todolb" {
  name               = "todo-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = []
  subnets            = []
}

resource "aws_lb_target_group" "my_app_eg1" {
  name       = "my-app-eg1"
  port       = 3000
  protocol   = "HTTP"
  vpc_id     = aws_vpc.main.id
  slow_start = 0

  load_balancing_algorithm_type = "round_robin"

  stickiness {
    enabled = false
    type    = "lb_cookie"
  }

  health_check {
    enabled             = true
    port                = 3000
    interval            = 30
    protocol            = "HTTP"
    path                = "/"
    matcher             = "200"
    healthy_threshold   = 3
    unhealthy_threshold = 3
  }
}

resource "aws_lb_listener" "todolblistener" {
  load_balancer_arn = aws_lb.todolb.arn
  port              = 3000
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.todotg.arn
  }
}
resource "aws_lb_target_group_attachment" "my_app_eg1" {
  target_group_arn = aws_lb_target_group.my_app_eg1.arn
  target_id        = aws_ecs_service.todo-ecs.id
  port             = 3000
}

