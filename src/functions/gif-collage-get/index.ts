// Third-party dependencies
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Output } from "./types";
import { CosmosClient } from "@azure/cosmos";
const cosmosDb = new CosmosClient({
  endpoint: process.env.COSMOS_DB_URI,
  key: process.env.COSMOS_DB_KEY,
}).database(process.env.COSMOS_DB_NAME || "gifcollage");

/**
 * Retrieves the GifURL Records from cosmos db database
 *
 * @param {Context} context AzureFunction context
 * @param {HttpRequest} req
 * @returns {Promise<Output>} Http Response containing Gif Url records.
 */
const getGifUrls: AzureFunction = async function (
  _: Context,
  { query: { maxItemCount, continuationToken } }: HttpRequest
): Promise<Output> {
  const { container } = await cosmosDb.containers.createIfNotExists({
    id: "gifUrl",
  });
  const results = await container.items
    .query("SELECT * FROM root r", {
      partitionKey: undefined,
      maxItemCount: +maxItemCount,
      continuationToken,
    })
    .fetchNext();
  return {
    res: {
      status: 200,
      body: {
        gifUrls: results.resources,
        continuationToken: results.continuationToken,
      },
    },
  };
};

export default getGifUrls;
