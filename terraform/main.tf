terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    auth0 = {
      source  = "auth0/auth0"
      version = "1.4.0"
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

resource "aws_ecs_task_definition" "nginx_proxy" {
  family                   = "${var.project_name}-nginx-proxy-${var.env}"
  network_mode             = "host"
  requires_compatibilities = ["EC2"]
  cpu                      = "256"
  memory                   = "512"

  execution_role_arn = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "${var.project_name}-nginx-proxy-${var.env}"
      image     = "211125707335.dkr.ecr.ap-northeast-1.amazonaws.com/${var.project_name}-${var.env}:nginx-proxy-latest"
      essential = true

      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        },
        {
          containerPort = 443
          hostPort      = 443
          protocol      = "tcp"
        }
      ]

      mountPoints = [
        { containerPath = "/etc/letsencrypt"
          sourceVolume  = "nginx-letsencrypt"
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
  volume {
    name = "nginx-letsencrypt"
    docker_volume_configuration {
      driver        = "local"
      scope         = "shared"
      autoprovision = "true"
    }
  }
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

resource "aws_ecs_task_definition" "auth" {
  family                   = "${var.project_name}-auth-${var.env}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  execution_role_arn = aws_iam_role.ecs_execution_role.arn
  container_definitions = jsonencode([
    {
      name      = "${var.project_name}-auth-${var.env}"
      image     = "211125707335.dkr.ecr.ap-northeast-1.amazonaws.com/${var.project_name}-${var.env}:auth-latest"
      essential = true

      environment = [
        {
          name  = "AUTH0_CLIENT_ID"
          value = var.AUTH0_CLIENT_ID
        },
        {
          name  = "AUTH0_CLIENT_SECRET"
          value = var.AUTH0_CLIENT_SECRET
        },
        {
          name  = "AUTH0_DOMAIN"
          value = var.AUTH0_DOMAIN
        },
        {
          name  = "AUTH0_DB_CONNECTION"
          value = var.AUTH0_DB_CONNECTION
        },
        {
          name  = "FLASK_SECRET_KEY"
          value = var.FLASK_SECRET_KEY
        },
        {
          name  = "GOOGLE_OAUTH_CLIENT_ID"
          value = var.GOOGLE_OAUTH_CLIENT_ID
        },
        {
          name  = "GOOGLE_OAUTH_CLIENT_SECRET"
          value = var.GOOGLE_OAUTH_CLIENT_SECRET
        },
        {
          name  = "BACKEND_API_URL"
          value = var.BACKEND_API_URL
        },
        {
          name  = "SERVICE_URL"
          value = var.AUTH_SERVICE_URL
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

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
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
      ttl  = 15
      type = "SRV"
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
      ttl  = 15
      type = "A"
    }
  }
  health_check_custom_config {
    failure_threshold = 1
  }
}

resource "aws_service_discovery_service" "auth" {
  name        = "${var.project_name}-auth-${var.env}"
  description = "Discovery service for ${var.project_name} Auth Service ${var.env} "

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.main.id

    dns_records {
      ttl  = 15
      type = "A"
    }
  }
  health_check_custom_config {
    failure_threshold = 1
  }
}



########################################################
#                   AWS LAMBDA                         #
########################################################

resource "aws_iam_role" "lambda_api" {

  name = "how-to-sea-lambda-api-lambda-role"

  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "sts:AssumeRole"
        ],
        "Principal" : {
          "Service" : [
            "lambda.amazonaws.com"
          ]
        }
      }
    ]
  })
}


resource "aws_iam_policy" "lambda_api_permissions" {
  name        = "How-To-Sea-Lambda_API_Permissions"
  description = "Policy to allow required permissions for how to sea lambda api"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["ecs:UpdateService", "ecs:DescribeServices"],
        Resource = ["arn:aws:ecs:ap-northeast-1:211125707335:service/how-to-sea-prod/location", "arn:aws:ecs:ap-northeast-1:211125707335:service/how-to-sea-prod/auth"]
      },
      {
        Effect = "Allow"
        Action = [
          "cloudwatch:*",
          "logs:*",
          "events:*"
        ]
        Resource = "*"
      }
    ]
  })
}


resource "aws_iam_role_policy_attachment" "lambda_api_permissions" {
  role       = aws_iam_role.lambda_api.name
  policy_arn = aws_iam_policy.lambda_api_permissions.arn
}

resource "aws_lambda_function" "lambda_api" {

  function_name = "lambda-api"
  role          = aws_iam_role.lambda_api.arn
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.ecr_repo.repository_url}:lambda_api-latest"
  timeout       = 300
  memory_size   = 128
  environment {
    variables = {
      ENV = "lambda"
    }
  }

}
resource "aws_lambda_function_url" "lambda_api" {
  function_name      = aws_lambda_function.lambda_api.function_name
  authorization_type = "NONE"
}



provider "auth0" {
  domain        = "early-riser18.eu.auth0.com"
  client_id     = var.AUTH0_CLIENT_ID
  client_secret = var.AUTH0_CLIENT_SECRET
  debug         = true
}
