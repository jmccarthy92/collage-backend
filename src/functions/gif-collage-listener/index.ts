// Third-party dependencies
import { AzureFunction, Context } from "@azure/functions";
// Interfaces
interface Output {
  gifUrl: {
    url: string;
  };
  signalRGif: any;
}

/**
 * Retrieves the GifURL Records from cosmos db database
 *
 * @param {Context} context AzureFunction context
 * @param {HttpRequest} req
 * @returns {Promise<Output>} Http Response containing Gif Url records.
 */
const gifListener: AzureFunction = async function (
  _: Context,
  invocation: any,
  gifUrl: string
): Promise<Output> {
  return {
    gifUrl: {
      url: gifUrl,
    },
    signalRGif: [
      {
        target: "newGif",
        arguments: [
          {
            url: gifUrl,
          },
        ],
      },
    ],
  };
};

export default gifListener;
