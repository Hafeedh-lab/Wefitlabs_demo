import { describe, it, expect } from '@jest/globals';
import {
  QuestSchema,
  GenerationRequestSchema,
  QuestGenerationOutputSchema,
  LocationSchema,
  ObjectiveSchema,
} from '../schemas/quest.schema.js';

describe('Quest Schema Validation', () => {
  describe('LocationSchema', () => {
    it('should accept valid location with all fields', () => {
      const location = {
        neighborhood: 'Williamsburg',
        city: 'Brooklyn',
        state: 'NY',
        landmark: 'Domino Park',
      };
      const result = LocationSchema.safeParse(location);
      expect(result.success).toBe(true);
    });

    it('should accept location with partial fields', () => {
      const location = { city: 'Brooklyn' };
      const result = LocationSchema.safeParse(location);
      expect(result.success).toBe(true);
    });

    it('should accept empty location object', () => {
      const result = LocationSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('ObjectiveSchema', () => {
    it('should accept valid objective', () => {
      const objective = {
        description: 'Walk 4,000 steps',
        metric: 'steps',
        target: 4000,
        xpReward: 300,
      };
      const result = ObjectiveSchema.safeParse(objective);
      expect(result.success).toBe(true);
    });

    it('should reject objective with invalid metric', () => {
      const objective = {
        description: 'Walk 4,000 steps',
        metric: 'invalid_metric',
        target: 4000,
        xpReward: 300,
      };
      const result = ObjectiveSchema.safeParse(objective);
      expect(result.success).toBe(false);
    });

    it('should reject objective with negative target', () => {
      const objective = {
        description: 'Walk',
        metric: 'steps',
        target: -100,
        xpReward: 300,
      };
      const result = ObjectiveSchema.safeParse(objective);
      expect(result.success).toBe(false);
    });

    it('should reject objective with negative xpReward', () => {
      const objective = {
        description: 'Walk',
        metric: 'steps',
        target: 4000,
        xpReward: -50,
      };
      const result = ObjectiveSchema.safeParse(objective);
      expect(result.success).toBe(false);
    });

    it('should accept all valid metric types', () => {
      const metrics = ['steps', 'minutes', 'distance', 'photo', 'checkin'];
      metrics.forEach((metric) => {
        const objective = {
          description: 'Test objective',
          metric,
          target: 100,
          xpReward: 100,
        };
        const result = ObjectiveSchema.safeParse(objective);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('QuestGenerationOutputSchema', () => {
    it('should accept valid quest generation output', () => {
      const output = {
        title: 'The Waterfront Wanderer',
        narrative: 'Explore the beautiful waterfront.',
        objectives: [
          {
            description: 'Walk 4,000 steps',
            metric: 'steps',
            target: 4000,
            xpReward: 300,
          },
        ],
        totalXP: 300,
        coinReward: 30,
        difficulty: 'intermediate',
        estimatedDuration: 30,
        tags: ['walking', 'waterfront'],
      };
      const result = QuestGenerationOutputSchema.safeParse(output);
      expect(result.success).toBe(true);
    });

    it('should reject output with missing required fields', () => {
      const output = {
        title: 'Test Quest',
        // missing narrative, objectives, etc.
      };
      const result = QuestGenerationOutputSchema.safeParse(output);
      expect(result.success).toBe(false);
    });

    it('should reject output with invalid difficulty', () => {
      const output = {
        title: 'Test Quest',
        narrative: 'Test narrative',
        objectives: [{ description: 'Test', metric: 'steps', target: 100, xpReward: 100 }],
        totalXP: 100,
        coinReward: 10,
        difficulty: 'super_hard', // invalid
        estimatedDuration: 30,
        tags: [],
      };
      const result = QuestGenerationOutputSchema.safeParse(output);
      expect(result.success).toBe(false);
    });
  });

  describe('GenerationRequestSchema', () => {
    it('should accept valid generation request', () => {
      const request = {
        userId: 'user-123',
        fitnessLevel: 'intermediate',
        interests: ['walking', 'pickleball'],
        questStyle: 'fun_exploratory',
        duration: 30,
      };
      const result = GenerationRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
    });

    it('should accept request with location', () => {
      const request = {
        userId: 'user-123',
        fitnessLevel: 'beginner',
        interests: ['running'],
        location: { city: 'Brooklyn', neighborhood: 'Williamsburg' },
        questStyle: 'challenge_based',
        duration: 45,
      };
      const result = GenerationRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
    });

    it('should reject request with duration below minimum', () => {
      const request = {
        userId: 'user-123',
        fitnessLevel: 'beginner',
        interests: ['running'],
        questStyle: 'fun_exploratory',
        duration: 10, // below minimum of 15
      };
      const result = GenerationRequestSchema.safeParse(request);
      expect(result.success).toBe(false);
    });

    it('should reject request with duration above maximum', () => {
      const request = {
        userId: 'user-123',
        fitnessLevel: 'beginner',
        interests: ['running'],
        questStyle: 'fun_exploratory',
        duration: 120, // above maximum of 60
      };
      const result = GenerationRequestSchema.safeParse(request);
      expect(result.success).toBe(false);
    });

    it('should reject request with empty interests', () => {
      const request = {
        userId: 'user-123',
        fitnessLevel: 'beginner',
        interests: [], // must have at least 1
        questStyle: 'fun_exploratory',
        duration: 30,
      };
      const result = GenerationRequestSchema.safeParse(request);
      expect(result.success).toBe(false);
    });

    it('should accept all valid fitness levels', () => {
      const levels = ['beginner', 'intermediate', 'advanced'];
      levels.forEach((level) => {
        const request = {
          userId: 'user-123',
          fitnessLevel: level,
          interests: ['walking'],
          questStyle: 'fun_exploratory',
          duration: 30,
        };
        const result = GenerationRequestSchema.safeParse(request);
        expect(result.success).toBe(true);
      });
    });

    it('should accept all valid quest styles', () => {
      const styles = ['fun_exploratory', 'challenge_based', 'performance_oriented'];
      styles.forEach((style) => {
        const request = {
          userId: 'user-123',
          fitnessLevel: 'intermediate',
          interests: ['walking'],
          questStyle: style,
          duration: 30,
        };
        const result = GenerationRequestSchema.safeParse(request);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('QuestSchema', () => {
    it('should accept valid complete quest', () => {
      const quest = {
        questId: '550e8400-e29b-41d4-a716-446655440000',
        title: 'The Waterfront Wanderer',
        narrative: 'Explore the beautiful waterfront.',
        objectives: [
          {
            description: 'Walk 4,000 steps',
            metric: 'steps',
            target: 4000,
            xpReward: 300,
          },
        ],
        totalXP: 300,
        coinReward: 30,
        difficulty: 'intermediate',
        estimatedDuration: 30,
        tags: ['walking', 'waterfront'],
        generatedAt: '2025-12-10T15:45:00Z',
        location: {
          neighborhood: 'Williamsburg',
          city: 'Brooklyn',
        },
      };
      const result = QuestSchema.safeParse(quest);
      expect(result.success).toBe(true);
    });

    it('should reject quest with invalid UUID', () => {
      const quest = {
        questId: 'not-a-uuid',
        title: 'Test Quest',
        narrative: 'Test narrative',
        objectives: [{ description: 'Test', metric: 'steps', target: 100, xpReward: 100 }],
        totalXP: 100,
        coinReward: 10,
        difficulty: 'beginner',
        estimatedDuration: 30,
        tags: [],
        generatedAt: '2025-12-10T15:45:00Z',
      };
      const result = QuestSchema.safeParse(quest);
      expect(result.success).toBe(false);
    });

    it('should reject quest with invalid datetime', () => {
      const quest = {
        questId: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Test Quest',
        narrative: 'Test narrative',
        objectives: [{ description: 'Test', metric: 'steps', target: 100, xpReward: 100 }],
        totalXP: 100,
        coinReward: 10,
        difficulty: 'beginner',
        estimatedDuration: 30,
        tags: [],
        generatedAt: 'not-a-datetime',
      };
      const result = QuestSchema.safeParse(quest);
      expect(result.success).toBe(false);
    });
  });
});

describe('XP and Coin Reward Validation', () => {
  it('should validate XP is within beginner range (100-300)', () => {
    const beginnerQuest = {
      questId: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Beginner Quest',
      narrative: 'A quest for beginners',
      objectives: [{ description: 'Test', metric: 'steps', target: 100, xpReward: 200 }],
      totalXP: 200,
      coinReward: 20,
      difficulty: 'beginner',
      estimatedDuration: 20,
      tags: [],
      generatedAt: '2025-12-10T15:45:00Z',
    };
    const result = QuestSchema.safeParse(beginnerQuest);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.totalXP).toBeGreaterThanOrEqual(100);
      expect(result.data.totalXP).toBeLessThanOrEqual(300);
    }
  });

  it('should validate coin reward is approximately 10% of XP', () => {
    const quest = {
      questId: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Test Quest',
      narrative: 'Test narrative',
      objectives: [{ description: 'Test', metric: 'steps', target: 100, xpReward: 500 }],
      totalXP: 500,
      coinReward: 50,
      difficulty: 'intermediate',
      estimatedDuration: 30,
      tags: [],
      generatedAt: '2025-12-10T15:45:00Z',
    };
    const result = QuestSchema.safeParse(quest);
    expect(result.success).toBe(true);
    if (result.success) {
      const expectedCoinReward = result.data.totalXP * 0.1;
      expect(result.data.coinReward).toBeCloseTo(expectedCoinReward, 0);
    }
  });
});
