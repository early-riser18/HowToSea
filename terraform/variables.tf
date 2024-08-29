variable "aws_region" {
  type    = string
  default = "ap-northeast-1"
}

variable "env" {
  description = "Environment name (e.g., prod or stage)"
  type        = string
}

variable "MONGODB_USER" {
  description = "Username for Mongo connection string"
  type        = string
}

variable "MONGODB_PW" {
  description = "Password for Mongo connection string"
  type        = string
}

variable "MONGODB_LOCATION_DB" {
  description = "Database name for Location service"
  type        = string
}

variable "project_name" {
  type    = string
  default = "how-to-sea"
}

variable "AUTH0_CLIENT_ID" {
  description = "Auth0 Client ID"
  type        = string
}
variable "AUTH0_CLIENT_SECRET" {
  description = "Auth0 Client Secret"
  type        = string
}
