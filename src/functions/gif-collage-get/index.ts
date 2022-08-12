// Third-party dependencies
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import type { GifUrl } from "services/model/types";
import { Output } from "./types";
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
  gifUrls: GifUrl[]
): Promise<Output> {
  return {
    res: {
      status: 200,
      body: gifUrls,
    },
  };
};

export default getGifUrls;
