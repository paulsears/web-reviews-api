module "${YOUR_SERVICE_NAME}" {
  source            = "git::git@github.com:aplaceformom/terraform-modules.git//modules/fargate-service?ref=v0.1.0"
  name              = "${YOUR_SERVICE_NAME}"
  cluster_name      = "default"
  container_port    = 4000
  public_access     = false
  health_check_path = "/health"
}
