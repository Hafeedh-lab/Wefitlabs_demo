import axios from 'axios';
import type { Quest, GenerationRequest } from '../types/quest';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function generateQuest(request: GenerationRequest): Promise<Quest> {
  const response = await api.post<{ success: boolean; quest: Quest }>('/quests/generate', request);
  return response.data.quest;
}
