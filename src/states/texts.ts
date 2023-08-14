
export const texts = {
  initialPrompts: [
    '随便告诉我一些有趣的事情吧，50个字以内',
    '你能做什么，50个字以内，以“我能”开头',
    '我现在想和你聊天，但是不知道说什么好，你欢迎一下我吧，然后介绍一下你自己，50个字以内',
    '请列举一下你的能力, 20个字以内, 以“我能”开头'
  ],
  welcomePrompts: [
    'You are ChatGPT, Now you write a sentence to welcome me to join the conversation with you as a natural start of a conversation, only in the language of my locale, my locale is {locale}, you should shortly introduce yourself, and the capabilities you have, make it a full sentence. Do not show the translation!'
  ]
}

export function s(text: string, replacement: Record<string, string>) {
  for (let key in replacement) {
    text = text.replace(`{${key}}`, replacement[key]);
  }
  return text;
}
