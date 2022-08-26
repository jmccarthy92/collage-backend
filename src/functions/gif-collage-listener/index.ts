// Third-party dependencies
import { promisify } from "util";
import { AzureFunction, Context } from "@azure/functions";
import { GifDimension, Output } from "./types";
import * as fs from "fs";
// import { resize } from "lib/gifResize";
// import { initializeContainerClient } from "lib/storage";
// import { BlobUploadCommonResponse } from "@azure/storage-blob";
import { CosmosClient, StatusCodes } from "@azure/cosmos";
import { formatSignalRMessage } from "lib/signalr";
import sizeOf from "image-size";
import { downloadFileUrl } from "lib/file";
import { GifUrl } from "services/model/types";
const sizeOfAsync = promisify(sizeOf);

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
  const fileName = url.split("/").pop();
  // await uploadResizedFile(fileURI);
  // const CONTAINER_NAME = process.env.BLOB_CONTAINER_NAME || "gifcollage";
  // const resizedGifUrl = `https://${blobClient.accountName}.blob.core.windows.net/${CONTAINER_NAME}/${blobName}`;
  const { container } = await cosmosDb.containers.createIfNotExists({
    id: "gifUrl",
  });
  const { height, width } = await getImageDimension(url, fileName);
  const gifUrl: GifUrl = { url, height, width };
  try {
    const { item } = await container.items.create(gifUrl);
    gifUrl.id = item.id;
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
    signalRGif: [formatSignalRMessage("newGif", gifUrl)],
  };
};

async function getImageDimension(
  url: string,
  fileName: string
): Promise<GifDimension> {
  const path = `${process.env.TMP_STORAGE}/${fileName}`;
  const tempPath = await downloadFileUrl(url, path);
  const { height, width } = await sizeOfAsync(tempPath);
  fs.unlinkSync(path);
  return { height, width };
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
