import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {
  BlobServiceClient,
  ContainerSASPermissions,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { Output } from "./types";

const generate: AzureFunction = async function (
  _: Context,
  req: HttpRequest
): Promise<Output> {
  const { container, permissions } = req.body;
  if (container && permissions)
    return {
      res: {
        body: { token: generateSasToken(container, permissions) },
      },
    };
  else
    return {
      res: {
        status: 400,
        body: "Specify a value for the following: 'container', 'permissions' ",
      },
    };
};

function generateSasToken(container: string, permissions: string): string {
  // Set start to to five mins ago to avoid clock skew
  const startsOn = new Date();
  startsOn.setMinutes(startsOn.getMinutes() - 5);

  // Expire in one hour
  const expiresOn = new Date(startsOn);
  expiresOn.setMinutes(startsOn.getMinutes() + 60);

  const storageAccountName = BlobServiceClient.fromConnectionString(
    process.env.AzureWebJobsStorage
  ).accountName;

  const storageAccountKey = process.env.STORAGE_ACCOUNT_KEY;

  return generateBlobSASQueryParameters(
    {
      containerName: container,
      permissions: ContainerSASPermissions.parse(permissions),
      startsOn,
      expiresOn,
    },
    new StorageSharedKeyCredential(storageAccountName, storageAccountKey)
  ).toString();
}

export default generate;
