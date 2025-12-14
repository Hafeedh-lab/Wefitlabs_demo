import Anthropic from '@anthropic-ai/sdk';
import { randomUUID } from 'crypto';
import {
  GenerationRequest,
  Quest,
  QuestGenerationOutputSchema,
} from '../schemas/quest.schema.js';

const anthropic = new Anthropic();

// Tool definition for structured output
const printQuestTool: Anthropic.Tool = {
  name: 'print_quest',
  description: 'Output the generated fitness quest in the required JSON format',
  input_schema: {
    type: 'object' as const,
    properties: {
      title: {
        type: 'string',
        description: 'Catchy 3-6 word title for the quest',
      },
      narrative: {
        type: 'string',
        description: '2-3 engaging sentences setting up the quest story',
      },
      objectives: {
        type: 'array',
        description: 'List of measurable objectives for the quest',
        items: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
              description: 'Clear action to complete',
            },
            metric: {
              type: 'string',
              enum: ['steps', 'minutes', 'distance', 'photo', 'checkin'],
              description: 'Type of measurement for this objective',
            },
            target: {
              type: 'number',
              description: 'Numeric goal for this objective',
            },
            xpReward: {
              type: 'number',
              description: 'XP earned on completing this objective',
            },
          },
          required: ['description', 'metric', 'target', 'xpReward'],
        },
      },
      totalXP: {
        type: 'number',
        description: 'Total XP reward (sum of all objective XP rewards)',
      },
      coinReward: {
        type: 'number',
        description: 'Coin reward (approximately 10% of totalXP)',
      },
      difficulty: {
        type: 'string',
        enum: ['beginner', 'intermediate', 'advanced'],
        description: 'Difficulty level matching user fitness level',
      },
      estimatedDuration: {
        type: 'number',
        description: 'Estimated completion time in minutes',
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Relevant searchable tags for the quest',
      },
    },
    required: [
      'title',
      'narrative',
      'objectives',
      'totalXP',
      'coinReward',
      'difficulty',
      'estimatedDuration',
      'tags',
    ],
  },
};

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

Coin rewards should be approximately 10% of total XP.`;

  const userPrompt = `Generate a fitness quest with these parameters:

- Fitness Level: ${request.fitnessLevel}
- Interests: ${request.interests.join(', ')}
- ${locationContext}
- Quest Style: ${request.questStyle.replace('_', ' ')}
- Target Duration: ${request.duration} minutes

Create an engaging quest that fits these criteria. Use the print_quest tool to output your quest.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    tools: [printQuestTool],
    tool_choice: { type: 'tool', name: 'print_quest' },
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  // Extract tool use from response
  const toolUseBlock = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
  );

  if (!toolUseBlock || toolUseBlock.name !== 'print_quest') {
    throw new Error('AI failed to generate quest using the expected tool format');
  }

  // Validate and parse the tool input
  const parseResult = QuestGenerationOutputSchema.safeParse(toolUseBlock.input);

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
