#!/bin/bash
mkdir -p /etc/ecs
touch /etc/ecs/ecs.config
/bin/echo "ECS_CLUSTER=${cluster_name}" >> /etc/ecs/ecs.config
