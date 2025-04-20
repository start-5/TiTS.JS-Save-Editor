export function log(message: string, ...params: any[]) {
  const now = new Date()
    .toISOString()
    .replace('T', ' ')
    .replace('Z', '');

  console.log(`[${now}] ${message}`, ...params);
}
