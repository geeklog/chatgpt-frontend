export function uuid2number(uuid: string): number {
  const hex = uuid.replace(/-/g, ' ');
  const bytes = new Uint8Array(hex.match(/[0-9a-f]{2}/gi)!.map((h) => parseInt(h, 16)));
  return bytes.reduce((acc: number, curr: number) => acc + curr)
};

export function b64EncodeUnicode(str: string): string {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
          return String.fromCharCode(Number('0x' + p1));
  }));
}

export function b64DecodeUnicode(str: string): string {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}