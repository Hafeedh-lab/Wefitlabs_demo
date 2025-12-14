import { z } from 'zod';

// Location schema
export const LocationSchema = z.object({
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  landmark: z.string().optional(),
});

// Objective schema
export const ObjectiveSchema = z.object({
  description: z.string().min(1),
  metric: z.enum(['steps', 'minutes', 'distance', 'photo', 'checkin']),
  target: z.number().positive(),
  xpReward: z.number().positive(),
});

// Quest schema (what the AI generates)
export const QuestSchema = z.object({
  questId: z.string().uuid(),
  title: z.string().min(1),
  narrative: z.string().min(1),
  objectives: z.array(ObjectiveSchema).min(1),
  totalXP: z.number().positive(),
  coinReward: z.number().nonnegative(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedDuration: z.number().positive(),
  tags: z.array(z.string()),
  generatedAt: z.string().datetime(),
  location: LocationSchema.optional(),
});

// Schema for AI tool output (without questId and generatedAt - those are added server-side)
export const QuestGenerationOutputSchema = z.object({
  title: z.string().min(1),
  narrative: z.string().min(1),
  objectives: z.array(ObjectiveSchema).min(1),
  totalXP: z.number().positive(),
  coinReward: z.number().nonnegative(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedDuration: z.number().positive(),
  tags: z.array(z.string()),
});

// Generation request schema
export const GenerationRequestSchema = z.object({
  userId: z.string().min(1),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  interests: z.array(z.string()).min(1),
  location: LocationSchema.optional(),
  questStyle: z.enum(['fun_exploratory', 'challenge_based', 'performance_oriented']),
  duration: z.number().min(15).max(60),
});

// Inferred TypeScript types
export type Location = z.infer<typeof LocationSchema>;
export type Objective = z.infer<typeof ObjectiveSchema>;
export type Quest = z.infer<typeof QuestSchema>;
export type QuestGenerationOutput = z.infer<typeof QuestGenerationOutputSchema>;
export type GenerationRequest = z.infer<typeof GenerationRequestSchema>;
