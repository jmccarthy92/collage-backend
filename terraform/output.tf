output "appname" {
  value = var.appname
}

output "azure_resource_group_name" {
  value = azurerm_resource_group.rg.name
}

output "azure_functions_id" {
  value = azurerm_function_app.azurefunctionapp.id
}

output "azure_storage_conn_string" {
  value     = azurerm_storage_account.storage.primary_connection_string
  sensitive = true
}

output "azure_storage_key" {
  value     = azurerm_storage_account.storage.primary_access_key
  sensitive = true
}

output "azure_storage_account_name" {
  value = azurerm_storage_account.storage.name
}

output "azure_function_app_name" {
  value = azurerm_function_app.azurefunctionapp.name
}
