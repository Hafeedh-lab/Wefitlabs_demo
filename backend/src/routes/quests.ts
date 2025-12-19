import { Router, Request, Response } from 'express';
import { GenerationRequestSchema, Quest } from '../schemas/quest.schema.js';
import { generateQuest } from '../services/questGenerator.js';
import { ZodError } from 'zod';

const router = Router();

// Pre-generated demo quests for reliable demo presentations
const DEMO_QUESTS: Quest[] = [
  {
    questId: 'demo-quest-1-fun-exploratory',
    title: 'The Williamsburg Waterfront Wanderer',
    narrative:
      'The East River whispers tales of those brave enough to walk its Brooklyn shore. Today, you join the ranks of waterfront wanderers who\'ve discovered the city\'s hidden serenity. From Domino Park to the piers, adventure awaits!',
    objectives: [
      {
        description: 'Walk 4,000 steps along the Williamsburg waterfront',
        metric: 'steps',
        target: 4000,
        xpReward: 300,
      },
      {
        description: 'Take a photo at Domino Park',
        metric: 'photo',
        target: 1,
        xpReward: 100,
      },
      {
        description: 'Check in at 2 waterfront landmarks',
        metric: 'checkin',
        target: 2,
        xpReward: 100,
      },
    ],
    totalXP: 500,
    coinReward: 50,
    difficulty: 'intermediate',
    estimatedDuration: 35,
    tags: ['walking', 'waterfront', 'scenic', 'photography'],
    generatedAt: new Date().toISOString(),
    location: {
      neighborhood: 'Williamsburg',
      city: 'Brooklyn',
      state: 'NY',
      landmark: 'Domino Park',
    },
  },
  {
    questId: 'demo-quest-2-challenge-based',
    title: 'Your Morning Movement Momentum',
    narrative:
      "Hey there, champion! Ready to kickstart your day with some feel-good movement? This isn't about breaking records—it's about building that unstoppable momentum that carries you through the week. Let's make every step count!",
    objectives: [
      {
        description: 'Complete a 20-minute morning walk',
        metric: 'minutes',
        target: 20,
        xpReward: 200,
      },
      {
        description: 'Hit 3,000 steps before noon',
        metric: 'steps',
        target: 3000,
        xpReward: 150,
      },
    ],
    totalXP: 350,
    coinReward: 35,
    difficulty: 'beginner',
    estimatedDuration: 25,
    tags: ['walking', 'morning', 'routine', 'wellness'],
    generatedAt: new Date().toISOString(),
    location: {
      neighborhood: 'Your Neighborhood',
      city: 'Any City',
    },
  },
  {
    questId: 'demo-quest-3-performance-oriented',
    title: 'The Central Park Conquest',
    narrative:
      'Central Park has broken many. 843 acres of relentless terrain await. Today, you attack the reservoir loop with one goal: domination. No excuses. No mercy. Just you vs. the park.',
    objectives: [
      {
        description: 'Complete the reservoir loop (1.58 miles)',
        metric: 'distance',
        target: 2543,
        xpReward: 400,
      },
      {
        description: 'Maintain a pace under 10 min/mile',
        metric: 'minutes',
        target: 16,
        xpReward: 300,
      },
      {
        description: 'Finish with 8,000+ total steps',
        metric: 'steps',
        target: 8000,
        xpReward: 200,
      },
    ],
    totalXP: 900,
    coinReward: 90,
    difficulty: 'advanced',
    estimatedDuration: 45,
    tags: ['running', 'challenge', 'park', 'performance'],
    generatedAt: new Date().toISOString(),
    location: {
      neighborhood: 'Central Park',
      city: 'Manhattan',
      state: 'NY',
      landmark: 'Jacqueline Kennedy Onassis Reservoir',
    },
  },
];

// POST /api/quests/generate
router.post('/generate', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedRequest = GenerationRequestSchema.parse(req.body);

    // Generate quest using Claude
    const quest = await generateQuest(validatedRequest);

    res.json({
      success: true,
      quest,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: 'Invalid request body',
        details: error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
      return;
    }

    console.error('Quest generation error:', error);

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'AI generation failed. Please try again.',
    });
  }
});

// GET /api/quests/demo - Returns pre-generated demo quests
router.get('/demo', (_req: Request, res: Response) => {
  // Update generatedAt to current time for freshness
  const questsWithCurrentTime = DEMO_QUESTS.map((quest) => ({
    ...quest,
    generatedAt: new Date().toISOString(),
  }));

  res.json({
    success: true,
    quests: questsWithCurrentTime,
    metadata: {
      total: questsWithCurrentTime.length,
      styles: ['fun_exploratory', 'challenge_based', 'performance_oriented'],
    },
  });
});

export default router;
