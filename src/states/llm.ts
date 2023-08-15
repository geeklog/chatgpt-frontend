import { ModelType } from "../types";

export type ModelConfig = {
  name: string,
  fg: string,
  bg: string,
  icon: string
}

export const globalModelConfigs: Record<ModelType, ModelConfig> = {
  ChatGPT: {
    name: 'ChatGPT',
    fg: 'white',
    bg: '#11a37f',
    icon: 'chatgpt.webp'
  },
  GPT4: {
    name: 'GPT-4',
    fg: 'white',
    bg: '#333',
    icon: 'gpt4.png'
  },
  Claude2: {
    name: 'Claude 2',
    fg: 'black',
    bg: '#cc9b7b',
    icon: 'claude.webp'
  }
};