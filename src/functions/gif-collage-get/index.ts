// Third-party dependencies
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
// Interfaces
interface Output {
  res: {
    status: number;
    body: any[];
  };
}

/**
 * Retrieves the GifURL Records from cosmos db database
 *
 * @param {Context} context AzureFunction context
 * @param {HttpRequest} req
 * @returns {Promise<Output>} Http Response containing Gif Url records.
 */
const getGifUrls: AzureFunction = async function (
  _: Context,
  __: HttpRequest,
  gifUrls: any[]
): Promise<Output> {
  return {
    res: {
      status: 200,
      body: gifUrls,
    },
  };
};

export default getGifUrls;
