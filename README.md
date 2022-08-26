# Introduction

Serverless backend for the Gif-Collage application utilizing Azure Functions, SignalR, EventGrid, CosmosDB, and Blob Storage.

# Getting Started

## Terraform Setup

Terraform is not required, but makes setting up Azure Services seamless. **NOTE: A change in the backend "remote" block in `provider.tf` may be required**. Run the following commands once Terraform Cloud is connected.

```bash
terraform workspace new prod # or dev
terraform init
terraform apply
```

This will run the Terraform IaC to set-up the serverless infrastructure required to run GifCollage.

## Prerequisites

- Install Ngrok: [Click here for download link](https://ngrok.com/download)
- Azure Subscription

### Steps to Run App

1. Install ngrok, then run the following command: `ngrok http -host-header=localhost 7071`.
2. Fill out the necessary configurations in `local.settings.json` using the `sample.local.settings.json` file as a template.
3. Run `npm install`.
4. Run `npm run offline` command to run the azure function app locally.
5. (Optional / Required for File Uploads) Navigate to the Event-Grid System Topic in Azure Portal for the `storagifcollage<env>` i.e: `storagegifcollageprod` account. Use this page for creating the event-grid subscription for the local "gifCollageUpload" Function. The steps for setting up can be found in the following wiki provided by Azure: [Here](https://docs.microsoft.com/en-us/azure/azure-functions/functions-debug-event-grid-trigger-local#add-a-storage-event). You can use the following guide below to create the new event subscription.
   - Basic tab
     - Event Subscription Name: `filesavesub-gifurl-local`
     - Event Scheme: "Event Grid Scheme"
     - Filter to Event Types: "Blob Created"
     - Endpoint Type: Webhook
     - Subscriber Endpoint: `<ngrok url>/runtime/webhooks/EventGrid?functionName=gifCollageUpload`
   - Filters tab
     - Enable Subject Filtering
     - Subject begins with: `/blobServices/default/containers/gifcollage/blobs/files/`

**NOTE**: Every time you start ngrok, the HTTPS URL is regenerated and the value changes. Therefore you must create a new Event Subscription each time you expose your function to Azure via ngrok.

# Resources

- [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Serverless Framework integration with Azure Function](https://www.serverless.com/framework/docs/providers/azure/)
- [Azurite](https://www.npmjs.com/package/azurite)
- [Azure Storage Simulator: PC](ttps://go.microsoft.com/fwlink/?linkid=717179&clcid=0x409)
- [Microsoft Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/#overview)
- [Jest](https://jestjs.io/docs/getting-started)
- [Husky](https://typicode.github.io/husky/#/)
- [Azure Cosmos Node DB Client](https://www.npmjs.com/package/@azure/cosmos)
- [Docker](https://www.docker.com/)
- [Webpack](https://webpack.js.org/concepts/)
