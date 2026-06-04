variable "project_name" {
  type    = string
  default = "sars-platform"
}

variable "private_subnet_ids" {
  type    = list(string)
  default = []
}

resource "aws_elasticache_replication_group" "this" {
  replication_group_id = var.project_name
  description          = "Redis cluster for ${var.project_name}"
  engine               = "redis"
  engine_version       = "7.1"
  node_type            = "cache.t3.micro"
  num_cache_clusters   = 2
  parameter_group_name = "default.redis7"

  subnet_group_name          = aws_elasticache_subnet_group.this.name
  security_group_ids         = [aws_security_group.redis.id]
  automatic_failover_enabled = true
  multi_az_enabled           = true

  tags = {
    Name = var.project_name
  }
}

resource "aws_elasticache_subnet_group" "this" {
  name       = var.project_name
  subnet_ids = var.private_subnet_ids
}

resource "aws_security_group" "redis" {
  name        = "${var.project_name}-redis"
  description = "ElastiCache Redis security group"
}

output "endpoint" {
  value = aws_elasticache_replication_group.this.primary_endpoint_address
}
