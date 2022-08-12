// Third-party dependencies
import { AzureFunction, Context } from "@azure/functions";
import { Output } from "./types";
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
  return {
    gifUrl: {
      url,
    },
    signalRGif: [
      {
        target: "newGif",
        arguments: [
          {
            url,
          },
        ],
      },
    ],
  };
};

export default gifListener;
