import type { GifUrl } from "services/model/types";
// Interfaces
export interface Output {
  res: {
    status: number;
    body: {
      gifUrls: GifUrl[];
      continuationToken: string;
    };
  };
}
