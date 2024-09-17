

resource "aws_ecs_service" "location" {
  name                               = "location"
  cluster                            = aws_ecs_cluster.main.id
  task_definition                    = aws_ecs_task_definition.location.arn
  launch_type                        = "FARGATE"
  deployment_minimum_healthy_percent = 0
  network_configuration {
    subnets          = [aws_subnet.ecs_public_subnet_0.id]
    security_groups  = [aws_security_group.ecs_security_group.id]
    assign_public_ip = true
  }
  service_registries {
    registry_arn = aws_service_discovery_service.location.arn
  }
  desired_count = 0
}


resource "aws_ecs_service" "auth" {
  name                               = "auth"
  cluster                            = aws_ecs_cluster.main.id
  task_definition                    = aws_ecs_task_definition.auth.arn
  launch_type                        = "FARGATE"
  deployment_minimum_healthy_percent = 0
  network_configuration {
    subnets          = [aws_subnet.ecs_public_subnet_0.id]
    security_groups  = [aws_security_group.ecs_security_group.id]
    assign_public_ip = true
  }
  service_registries {
    registry_arn = aws_service_discovery_service.auth.arn
  }
  desired_count = 0


}


resource "aws_ecs_service" "nginx_proxy_ec2" {
  name            = "nginx-proxy"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.nginx_proxy.arn
  launch_type     = "EC2"

  service_registries {
    registry_arn   = aws_service_discovery_service.nginx_proxy.arn
    container_name = "${var.project_name}-nginx-proxy-${var.env}"
    container_port = 443
  }

  desired_count = 1
}


########################################################
#                        AWS EC2                       #
########################################################
resource "aws_iam_role" "ecs_instance_role" {
  name = "ecsInstanceRole"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "ec2.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })


  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
  ]
}

resource "aws_iam_instance_profile" "ecs_instance_profile" {
  name = "ecsInstanceProfile"
  role = aws_iam_role.ecs_instance_role.name
}

resource "aws_instance" "ecs_instance" {
  ami                    = "ami-02fafeee0a3a29281" #ECS-optimized AMI
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.ecs_public_subnet_0.id
  vpc_security_group_ids = [aws_security_group.ecs_security_group.id]
  iam_instance_profile   = aws_iam_instance_profile.ecs_instance_profile.name
  user_data              = templatefile("./ecs_instance_user_data.sh", { cluster_name = "how-to-sea-prod" })
  key_name               = "deployer-key" # Add your SSH key here
  private_ip             = "10.0.0.12"
  tags = {
    Name = "ecs-instance-"
  }
}

resource "aws_eip" "default" {
  domain                    = "vpc"
  associate_with_private_ip = "10.0.0.12"
  instance                  = aws_instance.ecs_instance.id
}
