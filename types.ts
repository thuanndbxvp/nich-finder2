export enum ApiProvider {
  Gemini = 'gemini',
  ChatGPT = 'chatgpt',
}

export interface Score {
  score: number; // Điểm số từ 1 đến 10
  explanation: string; // Giải thích ngắn gọn cho điểm số
}

export interface AnalyzedNiche {
  title: string;
  description: string;
  monetization_potential: Score;
  audience_potential: Score;
  competition_level: Score; // Điểm cao hơn nghĩa là cạnh tranh hơn (khó hơn)
  content_direction: string;
  keywords: string[];
}


export const GEMINI_MODELS = ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-flash-latest'] as const;
export const CHATGPT_MODELS = ['gpt-5', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'] as const; // Mock models

export type GeminiModel = typeof GEMINI_MODELS[number];
export type ChatGptModel = typeof CHATGPT_MODELS[number];

export interface AiRequestOptions {
    apiKey: string;
    model: string;
}

// New types for API Key Management
export enum ApiKeyStatus {
  Unvalidated = 'unvalidated',
  Validating = 'validating',
  Valid = 'valid',
  Invalid = 'invalid',
}

export interface ApiKey {
  id: string;
  provider: ApiProvider;
  key: string;
  name: string;
  status: ApiKeyStatus;
}

// New type for Saved Sessions
export interface SavedSession {
  id: string;
  name: string;
  timestamp: string;
  topic: string;
  niches: AnalyzedNiche[];
  selectedNiche: AnalyzedNiche | null;
  script: string;
  provider: ApiProvider;
}