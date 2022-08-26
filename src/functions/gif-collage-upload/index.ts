// Third-party dependencies
import { AzureFunction, Context } from "@azure/functions";
import { GifDimension, Output } from "functions/gif-collage-listener/types";
import { formatSignalRMessage } from "lib/signalr";
import { initializeContainerClient } from "lib/storage";
import { EventGridEvent } from "./types";
import { promisify } from "util";
import * as fs from "fs";
import sizeOf from "image-size";
import { BlockBlobClient } from "@azure/storage-blob";
import { GifUrl } from "services/model/types";
const sizeOfAsync = promisify(sizeOf);

const BLOB_DIR = "files";

/**
 * Retrieves the GifURL Records from cosmos db database
 *
 * @param {Context} context AzureFunction context
 * @param {HttpRequest} req
 * @returns {Promise<Output>} Http Response containing Gif Url records.
 */
const gifListener: AzureFunction = async function (
  context: Context,
  { data: { url, contentType: mimeType, contentLength: size } }: EventGridEvent
): Promise<Output> {
  const blobFullName = url.slice(url.lastIndexOf("/") + 1);
  const blobClient = initializeContainerClient().getBlockBlobClient(
    `${BLOB_DIR}/${blobFullName}`
  );
  if (mimeType === "image/gif") {
    const { height, width } = await getImageDimension(blobFullName, blobClient);
    const gifUrl: GifUrl = { height, width, url };
    return {
      gifUrl,
      signalRGif: [formatSignalRMessage("newGif", gifUrl)],
    };
  } else {
    await blobClient.deleteIfExists();
    // Return Errors to client through WebSocket via SignalR
    return {
      signalRGif: [
        formatSignalRMessage("errorGif", {
          error: `Only GIF file format is supported, the following type was uploaded: ${mimeType}.`,
        }),
      ],
    };
  }
};

async function getImageDimension(
  fileName: string,
  blobClient: BlockBlobClient
): Promise<GifDimension> {
  const path = `${process.env.TMP_STORAGE}/${fileName}`;
  await blobClient.downloadToFile(path);
  const { height, width } = await sizeOfAsync(path);
  fs.unlinkSync(path);
  return { height, width };
}

export default gifListener;
