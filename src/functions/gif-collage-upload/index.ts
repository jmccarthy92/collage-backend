// Third-party dependencies
import { AzureFunction, Context } from "@azure/functions";
import { Output } from "functions/gif-collage-listener/types";
import { formatSignalRMessage } from "lib/signalr";
import { initializeContainerClient } from "lib/storage";
import { EventGridEvent } from "./types";

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
  if (mimeType === "image/gif") {
    return {
      gifUrl: {
        url,
      },
      signalRGif: [formatSignalRMessage("newGif", { url })],
    };
  } else {
    const blobFullName = url.slice(url.lastIndexOf("/") + 1);
    await initializeContainerClient()
      .getBlockBlobClient(`${BLOB_DIR}/${blobFullName}`)
      .deleteIfExists();
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

export default gifListener;
