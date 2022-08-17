export function formatSignalRMessage(
  target: string,
  payload: Record<string, any>
) {
  return {
    target,
    arguments: [payload],
  };
}
