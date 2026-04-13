export function normalizeFileUri(uri: string): string {
  if (uri.startsWith("file://") || uri.startsWith("content://")) {
    return uri;
  }
  return uri.startsWith("/") ? `file://${uri}` : uri;
}