import { VertexAI } from '@google-cloud/vertexai';
import { randomUUID } from 'crypto';
import {
  GenerationRequest,
  Quest,
  QuestGenerationOutputSchema,
} from '../schemas/quest.schema.js';

// Initialize Vertex AI
const project = process.env.GOOGLE_CLOUD_PROJECT_ID;
const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

const vertexAI = new VertexAI({
  project: project || 'undefined',
  location: location,
});

// Style-specific system prompts
const stylePrompts: Record<GenerationRequest['questStyle'], string> = {
  fun_exploratory: `You are a friendly, enthusiastic fitness quest designer who creates fun,
adventure-style challenges. Your tone is playful and exploratory, like a treasure hunt.
Use vivid imagery and make users feel like they're on an exciting journey of discovery.
Think "neighborhood explorer" meets "casual adventurer."`,

  challenge_based: `You are a supportive personal coach who creates achievement-focused fitness quests.
Your tone is warm but motivating, like an encouraging older sibling. Celebrate progress and
consistency. Make fitness feel accessible and rewarding. Use "you" and "your" to be personal.`,

  performance_oriented: `You are a no-nonsense fitness coach who creates intense, goal-driven challenges.
Your tone is direct, competitive, and achievement-focused. Push users to their limits while
respecting their abilities. Think "elite trainer" meets "competitive athlete."`,
};

// XP ranges by difficulty
const xpRanges: Record<GenerationRequest['fitnessLevel'], { min: number; max: number }> = {
  beginner: { min: 100, max: 300 },
  intermediate: { min: 300, max: 600 },
  advanced: { min: 600, max: 1000 },
};

export async function generateQuest(request: GenerationRequest): Promise<Quest> {
  // Ensure Project ID is set
  if (!project) {
    throw new Error('GOOGLE_CLOUD_PROJECT_ID is not set in environment variables');
  }

  const stylePrompt = stylePrompts[request.questStyle];
  const xpRange = xpRanges[request.fitnessLevel];

  const locationContext = request.location
    ? `Location: ${[
        request.location.neighborhood,
        request.location.city,
        request.location.state,
      ]
        .filter(Boolean)
        .join(', ')}${request.location.landmark ? ` (near ${request.location.landmark})` : ''}`
    : 'Location: Not specified (create a generic quest)';

  const systemPrompt = `${stylePrompt}

You are designing fitness quests for WeFit Labs, a social fitness app that gamifies exercise
like Duolingo gamifies language learning.

Quest Design Principles:
1. Narrative Hook: Start with an engaging 2-3 sentence story that makes the user feel motivated
2. Clear Objectives: Define measurable goals (steps, duration, checkpoints)
3. Appropriate Difficulty: Match the user's fitness level—never demotivate beginners or bore advanced users
4. Local Flavor: Reference specific neighborhoods, landmarks, or cultural elements when location is provided
5. Reward Psychology: XP should feel earned (${xpRange.min}-${xpRange.max} XP range for ${request.fitnessLevel} level)

Coin rewards should be approximately 10% of total XP.

IMPORTANT: You must respond with ONLY valid JSON, no markdown, no code blocks, no explanation.
The JSON must match this exact structure:
{
  "title": "string (catchy 3-6 word title)",
  "narrative": "string (2-3 engaging sentences)",
  "objectives": [
    {
      "description": "string (clear action)",
      "metric": "steps" | "minutes" | "distance" | "photo" | "checkin",
      "target": number,
      "xpReward": number
    }
  ],
  "totalXP": number (sum of all objective XP),
  "coinReward": number (approx 10% of totalXP),
  "difficulty": "beginner" | "intermediate" | "advanced",
  "estimatedDuration": number (minutes),
  "tags": ["string"]
}`;

  const userPrompt = `Generate a fitness quest with these parameters:

- Fitness Level: ${request.fitnessLevel}
- Interests: ${request.interests.join(', ')}
- ${locationContext}
- Quest Style: ${request.questStyle.replace('_', ' ')}
- Target Duration: ${request.duration} minutes

Create an engaging quest that fits these criteria. Respond with ONLY the JSON object, nothing else.`;

  // Use Vertex AI Model
  const model = vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });

  const result = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
      },
    ],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 1024,
    },
  });

  const response = result.response;
  // Vertex AI response structure is slightly different, but .text() helper usually exists on the result object in some SDK versions,
  // but simpler to access via candidates.
  // Actually, @google-cloud/vertexai returns a GenerateContentResponse which has candidates.
  // Let's use the standard way to extract text.
  
  const text = response.candidates?.[0].content.parts[0].text;

  if (!text) {
     throw new Error('No content generated from Vertex AI');
  }

  // Clean up the response - remove markdown code blocks if present
  let jsonText = text.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.slice(7);
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.slice(3);
  }
  if (jsonText.endsWith('```')) {
    jsonText = jsonText.slice(0, -3);
  }
  jsonText = jsonText.trim();

  // Parse the JSON response
  let questData;
  try {
    questData = JSON.parse(jsonText);
  } catch {
    console.error('Failed to parse AI response:', text);
    throw new Error('AI failed to generate valid JSON response');
  }

  // Validate and parse the response
  const parseResult = QuestGenerationOutputSchema.safeParse(questData);

  if (!parseResult.success) {
    console.error('Quest validation failed:', parseResult.error.issues);
    throw new Error(`Generated quest failed validation: ${parseResult.error.message}`);
  }

  // Build the complete Quest object
  const quest: Quest = {
    questId: randomUUID(),
    ...parseResult.data,
    generatedAt: new Date().toISOString(),
    location: request.location,
  };

  return quest;
}
