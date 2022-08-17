// Third-party dependencies
import { AzureFunction, Context } from "@azure/functions";
import { Output } from "./types";
import { get } from "https";
import { createWriteStream, readFileSync, existsSync, mkdirSync } from "fs";
// import { resize } from "lib/gifResize";
// import { initializeContainerClient } from "lib/storage";
// import { BlobUploadCommonResponse } from "@azure/storage-blob";
import { CosmosClient, StatusCodes } from "@azure/cosmos";
import { formatSignalRMessage } from "lib/signalr";
const cosmosDb = new CosmosClient({
  endpoint: process.env.COSMOS_DB_URI,
  key: process.env.COSMOS_DB_KEY,
}).database(process.env.COSMOS_DB_NAME || "gifUrl");

/**
 * Retrieves the GifURL Records from cosmos db database
 *
 * @param {Context} context AzureFunction context
 * @param {HttpRequest} req
 * @returns {Promise<Output>} Http Response containing Gif Url records.
 */
const gifListener: AzureFunction = async function ({
  bindingData: {
    payload: { url },
  },
}: Context): Promise<Output> {
  // @TODO: Resize GIFs to a more appropriate size
  // const fileURI = url.split("/").pop();
  // await uploadResizedFile(fileURI);
  // const CONTAINER_NAME = process.env.BLOB_CONTAINER_NAME || "gifcollage";
  // const resizedGifUrl = `https://${blobClient.accountName}.blob.core.windows.net/${CONTAINER_NAME}/${blobName}`;
  const { container } = await cosmosDb.containers.createIfNotExists({
    id: "gifUrl",
  });
  try {
    await container.items.create({ url });
  } catch (error) {
    if (error.code === StatusCodes.Conflict) {
      return {
        signalRGif: [
          formatSignalRMessage("errorGif", {
            error: "GIF Url Already Exists in Collage.",
          }),
        ],
      };
    }
    throw error;
  }

  return {
    signalRGif: [formatSignalRMessage("newGif", { url })],
  };
};

function downloadFile(url: string, path: string): Promise<string> {
  const file = createWriteStream(path);
  if (!existsSync(process.env.TMP_STORAGE)) mkdirSync(process.env.TMP_STORAGE);

  return new Promise((resolve, reject) => {
    get(url, (response) => {
      response.pipe(file);
      file.on("error", (error: Error) => {
        reject(error);
      });
      file.on("finish", () => {
        file.close();
        console.log("Download Completed");
        resolve(path);
      });
    });
  });
}

// async function uploadResizedFile(
//   fileURI: string
// ): Promise<BlobUploadCommonResponse> {
//   const filePath = `${process.env.TMP_STORAGE}/${fileURI}`;
//   const containerClient = initializeContainerClient();
//   const buffer = readFileSync(filePath);
//   const resizedGif = await resize(buffer);
//   const blobName = `resized/${fileURI}`;
//   const blobClient = containerClient.getBlockBlobClient(blobName);
//   return blobClient.uploadFile(filePath);
// }

export default gifListener;
