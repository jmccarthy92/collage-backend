resource "azurerm_resource_group" "rg" {
  name     = "rg-${var.appname}-${var.environment}"
  location = var.location

  tags = {
    environment = var.environment
  }
}

resource "azurerm_app_service_plan" "sp" {
  name                = "sp-${var.appname}-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  kind                = "Windows"
  reserved            = false

  sku {
    tier = "Free"
    size = "F1"
  }

  tags = {
    environment = var.environment
  }
}

locals {
  prod_only_mapping = {
    test = 0
    dev  = 0
    prod = 1
  }

  prod_only = local.prod_only_mapping[var.environment]

  allowed_origins = var.environment == "dev" ? ["*"] : [data.terraform_remote_state.clientapp_services.outputs.react_app_url]
}

resource "azurerm_application_insights" "application_insights" {
  name                = "func-app-insights-${var.appname}-${var.environment}"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "web"
}

resource "azurerm_function_app" "azurefunctionapp" {
  name                       = "func-${var.appname}-${var.environment}"
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  app_service_plan_id        = azurerm_app_service_plan.sp.id
  storage_account_name       = azurerm_storage_account.storage.name
  storage_account_access_key = azurerm_storage_account.storage.primary_access_key
  version                    = "~4"

  site_config {
    cors {
      allowed_origins = local.allowed_origins
    }
  }

  app_settings = {
    "APPINSIGHTS_INSTRUMENTATIONKEY"        = azurerm_application_insights.application_insights.instrumentation_key,
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = azurerm_application_insights.application_insights.connection_string,
    "AzureSignalRConnectionString"          = azurerm_signalr_service.sr.primary_connection_string,
    "AzureWebJobsStorage"                   = azurerm_storage_account.storage.primary_connection_string,
    "AzureStorageQueue"                     = azurerm_storage_account.storage.primary_connection_string,
    "CLIENT_ORIGIN"                         = "*",
    "COSMOS_DB_CONNECTION"                  = azurerm_cosmosdb_account.dbaccount.connection_strings[0],
    "ENV_NAME"                              = var.environment,
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE"   = "false",
  }

  tags = {
    environment = var.environment
  }
}
