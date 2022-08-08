resource "azurerm_cosmosdb_account" "dbaccount" {
  name                = "cosmos-gif-collage-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"
  enable_free_tier    = true

  consistency_policy {
    consistency_level = "Session"
  }

  capabilities {
    name = "EnableServerless"
  }

  geo_location {
    location          = azurerm_resource_group.rg.location
    failover_priority = 0
  }

  tags = {
    environment = var.environment
  }
}

resource "azurerm_cosmosdb_sql_database" "db" {
  name                = "gif-collage-${var.environment}"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.dbaccount.name
}

resource "azurerm_cosmosdb_sql_container" "gifurlcontainer" {
  name                = "gifUrl"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.dbaccount.name
  database_name       = azurerm_cosmosdb_sql_database.db.name
  partition_key_path  = "/definition/id"
  unique_key {
    paths = ["/url"]
  }
}
