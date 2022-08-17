export interface EventGridEvent {
  /** An unique identifier for the event. */
  id: string;
  /** The resource path of the event source. */
  topic?: string;
  /** A resource path relative to the topic path. */
  subject: string;
  /** Event data specific to the event type. */
  data: {
    url: string;
    contentType: string;
    contentLength: number;
  };
  /** The type of the event that occurred. */
  eventType: string;
  /** The time (in UTC) the event was generated. */
  eventTime: Date;
  /**
   * The schema version of the event metadata.
   * NOTE: This property will not be serialized. It can only be populated by the server.
   */
  readonly metadataVersion?: string;
  /** The schema version of the data object. */
  dataVersion: string;
}
