
resource "aws_ecs_service" "nginx_proxy" {
  name            = "nginx-proxy"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.nginx-proxy.arn
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.ecs_public_subnet_0.id]
    security_groups  = [aws_security_group.ecs_security_group.id]
    assign_public_ip = true
  }
  service_registries {
    registry_arn = aws_service_discovery_service.nginx_proxy.arn
  }
  desired_count = 0
}


resource "aws_ecs_service" "location" {
  name            = "location"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.location.arn
  launch_type     = "FARGATE"

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
