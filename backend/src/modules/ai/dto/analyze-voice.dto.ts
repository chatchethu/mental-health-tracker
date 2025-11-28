export class AnalyzeVoiceDto {
  /** data: URL string like "data:audio/webm;base64,AAAA..." OR pure base64 */
  audioBase64!: string;
  /** optional hint, e.g. "audio/webm" or "audio/wav" */
  mimeType?: string;
}
