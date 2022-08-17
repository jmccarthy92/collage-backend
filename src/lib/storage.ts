import { BlobServiceClient } from "@azure/storage-blob";

export function initializeContainerClient() {
  return BlobServiceClient.fromConnectionString(
    process.env.AzureWebJobsStorage
  ).getContainerClient(process.env.BLOB_CONTAINER_NAME || "gifcollage");
}
