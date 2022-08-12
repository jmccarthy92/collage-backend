import { HttpRequestHeaders } from "@azure/functions";

export interface Output {
  res: {
    body: any;
    headers: HttpRequestHeaders;
  };
}
