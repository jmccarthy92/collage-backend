import { execa } from "execa";
import gifsicle from "gifsicle";

export interface Option {
  resizeMethod?: string;
  width?: number;
  height?: number;
}

export async function resize(
  input: Buffer,
  options: Option = {}
): Promise<string> {
  const { resizeMethod = "lanczos3", width = 600, height = 600 } = options;
  if (!Buffer.isBuffer(input)) {
    throw new TypeError(
      `Expected \`input\` to be of type \`Buffer\` but received type \`${typeof input}\``
    );
  }
  const args = ["--no-warnings", "--no-app-extensions"];

  if (resizeMethod) args.push(`--resize-method=${resizeMethod}`);

  if (width) args.push(`--resize-fit-width=${width}`);

  if (height) args.push(`--resize-fit-height=${height}`);

  const { stdout } = await execa(gifsicle, args, {
    encoding: null,
    input,
  });
  return stdout;
}
