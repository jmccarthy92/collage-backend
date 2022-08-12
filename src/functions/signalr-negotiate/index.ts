import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Output } from "./types";

const negotiate: AzureFunction = async function (
  _: Context,
  __: HttpRequest,
  connectionInfo
): Promise<Output> {
  return {
    res: {
      body: connectionInfo,
      headers: {
        "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "*",
      },
    },
  };
};

export default negotiate;
