resource "azurerm_eventgrid_system_topic" "egsystopic" {
  name                   = "filestoragesystemtopic-${var.appname}-${var.environment}"
  resource_group_name    = azurerm_resource_group.rg.name
  location               = azurerm_resource_group.rg.location
  source_arm_resource_id = azurerm_storage_account.storage.id
  topic_type             = "Microsoft.Storage.StorageAccounts"

  tags = {
    environment = var.environment
  }
}

# resource "azurerm_eventgrid_system_topic_event_subscription" "egfilesavesub" {
#   name                = "filesavesub-${var.appname}-${var.environment}"
#   system_topic        = azurerm_eventgrid_system_topic.egsystopic.name
#   resource_group_name = azurerm_resource_group.rg.name

#   included_event_types = ["Microsoft.Storage.BlobCreated"]

#   azure_function_endpoint {
#     function_id                       = "${azurerm_function_app.azurefunctionapp.id}/functions/gifCollageUpload"
#     max_events_per_batch              = 100
#     preferred_batch_size_in_kilobytes = 64
#   }

#   subject_filter {
#     subject_begins_with = "/blobServices/default/containers/gifUrl/blobs/files/"
#   }

# }