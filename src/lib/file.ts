import { createWriteStream, existsSync, mkdirSync } from "fs";
import { get } from "https";

export function downloadFileUrl(url: string, path: string): Promise<string> {
  const file = createWriteStream(path);
  if (!existsSync(process.env.TMP_STORAGE)) mkdirSync(process.env.TMP_STORAGE);

  return new Promise((resolve, reject) => {
    get(url, (response) => {
      response.pipe(file);
      file.on("error", (error: Error) => {
        reject(error);
      });
      file.on("finish", () => {
        file.close();
        console.log("Download Completed");
        resolve(path);
      });
    });
  });
}
