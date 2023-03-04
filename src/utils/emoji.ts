export function randomEmoji(): string {
  const MIN = 0x1f600; // UTF-8 emoji范围的最小值
  const MAX = 0x1f64f; // UTF-8 emoji范围的最大值
  const code = Math.floor(Math.random() * (MAX - MIN + 1) + MIN); // 随机一个在范围内的code值
  return String.fromCodePoint(code); // 返回对应code的Emoji
}

export function uuidToEmoji(uuid: string): string {
  const emojiTable = [ '😀', '😎', '👽', '🎃', '🐶', '🐱', '🦄', '🐙', '🐵', '🍕' ];
  const hex = uuid.replace(/-/g, ' ');
  const bytes = new Uint8Array(hex.match(/[0-9a-f]{2}/gi)!.map((h) => parseInt(h, 16)));
  const reducer = (acc: number, curr: number) => acc + curr;
  const sum = bytes.reduce(reducer);
  return emojiTable[sum % emojiTable.length];
};