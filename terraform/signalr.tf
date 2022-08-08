data "azurerm_function_app_host_keys" "keys" {
  name                = "func-${var.appname}-${var.environment}"
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_signalr_service" "sr" {
  name                = "signalr-${var.appname}-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  sku {
    name     = "Free_F1"
    capacity = 1
  }

  cors {
    allowed_origins = ["*"]
  }

  features {
    flag  = "ServiceMode"
    value = "Serverless"
  }

  upstream_endpoint {
    category_pattern = ["connections", "messages"]
    event_pattern    = ["SendGif"]
    hub_pattern      = ["gif-collage"]
    url_template     = "https://${azurerm_function_app.azurefunctionapp.name}.azurewebsites.net/runtime/webhooks/signalr?code=${azurerm_function_app_host_keys.keys.signalr_extension_key}"
  }

  tags = {
    environment = var.environment
  }
}
