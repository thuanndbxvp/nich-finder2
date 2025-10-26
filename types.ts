export enum ApiProvider {
  Gemini = 'gemini',
  ChatGPT = 'chatgpt',
}

export interface Niche {
  title: string;
  description: string;
}

// Updated with more models
export const GEMINI_MODELS = ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-flash-latest'] as const;
export const CHATGPT_MODELS = ['gpt-5', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'] as const; // Mock models

export type GeminiModel = typeof GEMINI_MODELS[number];
export type ChatGptModel = typeof CHATGPT_MODELS[number];

export interface AiRequestOptions {
    apiKey: string;
    model: string;
}
