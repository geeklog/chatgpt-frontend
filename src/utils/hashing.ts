export function uuid2number(uuid: string): number {
  const hex = uuid.replace(/-/g, ' ');
  const bytes = new Uint8Array(hex.match(/[0-9a-f]{2}/gi)!.map((h) => parseInt(h, 16)));
  return bytes.reduce((acc: number, curr: number) => acc + curr)
};