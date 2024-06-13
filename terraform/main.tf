terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region  = var.aws_region
  profile = "personal" #Needs refactoring
}

resource "aws_s3_bucket" "public_bucket" {
  bucket = "${var.project_name}-public"

  tags = {
    Name = "${var.project_name}-public"
  }
}

resource "aws_s3_bucket_public_access_block" "public_access" {
  bucket = aws_s3_bucket.public_bucket.bucket

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Attach the bucket policy to the S3 bucket
resource "aws_s3_bucket_policy" "allow_public_read_access" {
  bucket = aws_s3_bucket.public_bucket.bucket
  policy = data.aws_iam_policy_document.allow_public_read_access.json
}

data "aws_iam_policy_document" "allow_public_read_access" {
  statement {
    sid    = "PublicReadGetObject"
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    actions = [
      "s3:GetObject"
    ]

    resources = [
      "${aws_s3_bucket.public_bucket.arn}/*"
    ]
  }
}


resource "aws_ecr_repository" "ecr_repo" {
  name = "${var.project_name}-${var.env}"

}

#######################################################
#                  ECS CLUSTER                        #
#######################################################
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-${var.env}"
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name       = aws_ecs_cluster.main.name
  capacity_providers = ["FARGATE"]
}

resource "aws_iam_role" "ecs_execution_role" {
  name = "${var.project_name}-ecs-execution-role-${var.env}"
  assume_role_policy = jsonencode({
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      },
    ]
    Version = "2012-10-17"
  })
  managed_policy_arns = ["arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"]
}



resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${var.project_name}-${var.env}"
  retention_in_days = 7 # Adjust retention as needed
}

resource "aws_ecs_task_definition" "nginx-proxy" {
  family                   = "${var.project_name}-nginx-proxy-${var.env}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  execution_role_arn = aws_iam_role.ecs_execution_role.arn
  container_definitions = jsonencode([
    {
      name      = "${var.project_name}-nginx-proxy-${var.env}"
      image     = "211125707335.dkr.ecr.ap-northeast-1.amazonaws.com/${var.project_name}-${var.env}:nginx-proxy-latest"
      essential = true

      environment = [
        { name  = "DNS_ADDRESS"
          value = "10.0.0.2" # X.X.X.2 is AWS Route 53 DNS address
        },
        {
          name  = "LOCATION_HOSTNAME"
          value = "${var.project_name}-location-${var.env}.${var.project_name}-${var.env}"
        }
      ]
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/${var.project_name}-${var.env}"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
    ]
  )
}

resource "aws_ecs_task_definition" "location" {
  family                   = "${var.project_name}-location-${var.env}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  execution_role_arn = aws_iam_role.ecs_execution_role.arn
  container_definitions = jsonencode([
    {
      name      = "${var.project_name}-location-${var.env}"
      image     = "211125707335.dkr.ecr.ap-northeast-1.amazonaws.com/${var.project_name}-${var.env}:location-latest"
      essential = true

      environment = [
        { name  = "MONGODB_USER"
          value = var.MONGODB_USER
        },
        { name  = "MONGODB_PW"
          value = var.MONGODB_PW
        },
        { name  = "MONGODB_DB"
          value = var.MONGODB_LOCATION_DB
        }
      ]

      portMappings = [
        {
          containerPort = 8000
          hostPort      = 8000
          protocol      = "tcp"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/${var.project_name}-${var.env}"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

########################################################
#                     AWS NETWORK                      #
########################################################

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  instance_tenancy     = "default"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "${var.project_name}-vpc-${var.env}"
  }
}

resource "aws_internet_gateway" "default" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "${var.project_name}-default"
  }
}
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "${var.project_name}-public-route-table"
  }
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.default.id
  }
}

resource "aws_subnet" "ecs_public_subnet_0" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.0.0/24"
  tags = {
    Name = "${var.project_name}-public_subnet-${var.env}-0"
  }
}

resource "aws_route_table_association" "ecs_route_table_association_0" {
  subnet_id      = aws_subnet.ecs_public_subnet_0.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_security_group" "ecs_security_group" {
  name        = "${var.project_name}-ecs-security-group-${var.env}"
  description = "Allow HTTP traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-ecs-security-group-${var.env}"
  }
}




# resource "aws_ecs_service" "wsgi_service" {
#   name            = "wsgi-service"
#   cluster         = aws_ecs_cluster.video_gpt_prod.id
#   task_definition = aws_ecs_task_definition.wsgi_server.arn
#   launch_type     = "FARGATE"

#   network_configuration {
#     subnets          = [aws_subnet.ecs_public_subnet_prod.id]
#     security_groups  = [aws_security_group.ecs_security_group.id]
#     assign_public_ip = true
#   }

#   desired_count = 1
# }




########################################################
#                       AWS DNS                        #
########################################################
resource "aws_service_discovery_private_dns_namespace" "main" {
  name        = "${var.project_name}-${var.env}"
  vpc         = aws_vpc.main.id
  description = "Private DNS namespace for ${var.project_name}-${var.env} ECS services"
}

resource "aws_service_discovery_service" "nginx_proxy" {
  name        = "${var.project_name}-nginx-proxy-${var.env}"
  description = "Discovery service for ${var.project_name} NGINX Proxy ${var.env} "

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.main.id

    dns_records {
      ttl  = 10
      type = "A"
    }
  }
  health_check_custom_config {
    failure_threshold = 1
  }
}


resource "aws_service_discovery_service" "location" {
  name        = "${var.project_name}-location-${var.env}"
  description = "Discovery service for ${var.project_name} Location Service ${var.env} "

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.main.id

    dns_records {
      ttl  = 10
      type = "A"
    }
  }
  health_check_custom_config {
    failure_threshold = 1
  }
}
