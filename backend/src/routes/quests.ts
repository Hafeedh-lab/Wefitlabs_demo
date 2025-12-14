import { Router, Request, Response } from 'express';
import { GenerationRequestSchema } from '../schemas/quest.schema.js';
import { generateQuest } from '../services/questGenerator.js';
import { ZodError } from 'zod';

const router = Router();

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

export default router;
