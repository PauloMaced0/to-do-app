resource "aws_db_subnet_group" "default" {
  name       = "db-subnet"
  subnet_ids = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
}

resource "aws_db_instance" "todo_rds" {
  allocated_storage       = 10
  db_name                 = "todo_db"
  engine                  = "postgres"
  engine_version          = "16.4"
  instance_class          = "db.t3.micro"
  username                = var.db_username
  password                = var.db_password
  skip_final_snapshot     = true

  db_subnet_group_name    = aws_db_subnet_group.default.name
  availability_zone       = var.availibilty_zone_1
  vpc_security_group_ids  = [aws_security_group.rds_sg.id]
}
