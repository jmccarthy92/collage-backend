import { GifUrl } from "services/model/types";
import { SignalRMessage } from "services/signalr/types";

export interface Output {
  gifUrl?: GifUrl;
  signalRGif: SignalRMessage[];
}

export interface GifDimension {
  height: number;
  width: number;
}
