import axios, { AxiosError } from 'axios';
import type { Quest, GenerationRequest } from '../types/quest';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 second timeout for AI generation
});

interface ApiErrorResponse {
  success: false;
  error: string;
}

export class QuestApiError extends Error {
  readonly statusCode?: number;
  readonly isNetworkError: boolean;

  constructor(message: string, statusCode?: number, isNetworkError: boolean = false) {
    super(message);
    this.name = 'QuestApiError';
    this.statusCode = statusCode;
    this.isNetworkError = isNetworkError;
  }
}

function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    // Network error (server not running, no internet, etc.)
    if (!axiosError.response) {
      throw new QuestApiError(
        'Unable to connect to the server. Please check that the backend is running on port 3001.',
        undefined,
        true
      );
    }

    // Server responded with an error
    const status = axiosError.response.status;
    const serverMessage = axiosError.response.data?.error;

    if (status === 400) {
      throw new QuestApiError(
        serverMessage || 'Invalid request. Please check your inputs.',
        status
      );
    }

    if (status === 429) {
      throw new QuestApiError(
        'Too many requests. Please wait a moment before generating more quests.',
        status
      );
    }

    if (status === 500) {
      throw new QuestApiError(
        serverMessage || 'The AI service encountered an error. Please try again.',
        status
      );
    }

    if (status === 503) {
      throw new QuestApiError(
        'The AI service is temporarily unavailable. Please try again in a few moments.',
        status
      );
    }

    throw new QuestApiError(
      serverMessage || `Server error (${status}). Please try again.`,
      status
    );
  }

  // Unknown error
  throw new QuestApiError(
    error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'
  );
}

export async function generateQuest(request: GenerationRequest): Promise<Quest> {
  try {
    const response = await api.post<{ success: boolean; quest: Quest }>('/quests/generate', request);
    return response.data.quest;
  } catch (error) {
    handleApiError(error);
  }
}

export async function getDemoQuests(): Promise<Quest[]> {
  try {
    const response = await api.get<{ success: boolean; quests: Quest[] }>('/quests/demo');
    return response.data.quests;
  } catch (error) {
    handleApiError(error);
  }
}
