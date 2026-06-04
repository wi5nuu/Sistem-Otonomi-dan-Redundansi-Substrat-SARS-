variable "project_name" {
  type    = string
  default = "sars-platform"
}

variable "private_subnet_ids" {
  type    = list(string)
  default = []
}

resource "aws_db_instance" "this" {
  identifier        = var.project_name
  engine            = "postgres"
  engine_version    = "16.3"
  instance_class    = "db.t3.medium"
  allocated_storage = 50
  storage_type      = "gp3"

  db_name  = "sars"
  username = "sars_admin"
  password = random_password.master.result

  skip_final_snapshot = false
  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:05:00-sun:06:00"

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.this.name

  tags = {
    Name = var.project_name
  }
}

resource "random_password" "master" {
  length  = 32
  special = false
}

resource "aws_db_subnet_group" "this" {
  name       = var.project_name
  subnet_ids = var.private_subnet_ids
}

resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds"
  description = "RDS PostgreSQL security group"
}

output "endpoint" {
  value = aws_db_instance.this.endpoint
}

output "master_password" {
  value     = random_password.master.result
  sensitive = true
}
