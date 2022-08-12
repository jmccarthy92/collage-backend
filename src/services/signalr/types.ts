export interface SignalRMessage {
  target: string;
  arguments: Record<string, any>[];
}
