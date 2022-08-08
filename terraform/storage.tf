resource "azurerm_storage_account" "storage" {
  name                     = "storage${var.appname}${var.environment}"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "RAGRS"
  allow_blob_public_access = true

  tags = {
    environment = var.environment
  }

  blob_properties {
    default_service_version = "2020-06-12"

    cors_rule {
      allowed_headers    = ["*"]
      allowed_methods    = ["GET", "HEAD", "POST", "OPTIONS", "PUT", "PATCH"]
      allowed_origins    = ["*"]
      exposed_headers    = ["x-ms-meta"]
      max_age_in_seconds = 0
    }
  }
}
