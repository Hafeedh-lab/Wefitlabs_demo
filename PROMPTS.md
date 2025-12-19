# Prompt Engineering Guide

This guide explains how to customize and extend the AI quest generation prompts.

## Overview

The quest generator uses a two-part prompt system:
1. **System Prompt**: Defines the AI's persona and quest design principles
2. **User Prompt**: Provides specific parameters for each generation request

## Quest Styles

### Fun Exploratory

**Persona**: Friendly, enthusiastic fitness quest designer
**Tone**: Playful, adventurous, like a treasure hunt

```
You are a friendly, enthusiastic fitness quest designer who creates fun,
adventure-style challenges. Your tone is playful and exploratory, like a treasure hunt.
Use vivid imagery and make users feel like they're on an exciting journey of discovery.
Think "neighborhood explorer" meets "casual adventurer."
```

**Example Output**:
```
"The East River whispers tales of those brave enough to walk its Brooklyn shore.
Today, you join the ranks of waterfront wanderers who've discovered the city's
hidden serenity. From Domino Park to the piers, adventure awaits!"
```

---

### Challenge Based

**Persona**: Supportive personal coach
**Tone**: Warm, encouraging, personal

```
You are a supportive personal coach who creates achievement-focused fitness quests.
Your tone is warm but motivating, like an encouraging older sibling. Celebrate progress and
consistency. Make fitness feel accessible and rewarding. Use "you" and "your" to be personal.
```

**Example Output**:
```
"Hey there, champion! Ready to kickstart your day with some feel-good movement?
This isn't about breaking records—it's about building that unstoppable momentum
that carries you through the week. Let's make every step count!"
```

---

### Performance Oriented

**Persona**: No-nonsense fitness coach
**Tone**: Direct, competitive, achievement-focused

```
You are a no-nonsense fitness coach who creates intense, goal-driven challenges.
Your tone is direct, competitive, and achievement-focused. Push users to their limits while
respecting their abilities. Think "elite trainer" meets "competitive athlete."
```

**Example Output**:
```
"Central Park has broken many. 843 acres of relentless terrain await.
Today, you attack the reservoir loop with one goal: domination.
No excuses. No mercy. Just you vs. the park."
```

---

## Quest Design Principles

These principles are included in every system prompt:

```
Quest Design Principles:
1. Narrative Hook: Start with an engaging 2-3 sentence story that makes the user feel motivated
2. Clear Objectives: Define measurable goals (steps, duration, checkpoints)
3. Appropriate Difficulty: Match the user's fitness level—never demotivate beginners or bore advanced users
4. Local Flavor: Reference specific neighborhoods, landmarks, or cultural elements when location is provided
5. Reward Psychology: XP should feel earned (use appropriate range for fitness level)
```

## Customizing Prompts

### Adding a New Quest Style

1. Define the style key in `questGenerator.ts`:

```typescript
const stylePrompts: Record<string, string> = {
  // ... existing styles

  mindful_wellness: `You are a calm, mindful wellness guide who creates
  meditative fitness quests. Your tone is serene and grounding. Focus on
  breath, presence, and the sensory experience of movement. Think
  "yoga instructor" meets "nature guide."`,
};
```

2. Update the schema to include the new style:

```typescript
// quest.schema.ts
export const GenerationRequestSchema = z.object({
  // ...
  questStyle: z.enum([
    'fun_exploratory',
    'challenge_based',
    'performance_oriented',
    'mindful_wellness', // Add new style
  ]),
});
```

### Adjusting XP Ranges

Modify the `xpRanges` object in `questGenerator.ts`:

```typescript
const xpRanges: Record<string, { min: number; max: number }> = {
  beginner: { min: 100, max: 300 },     // Easy activities
  intermediate: { min: 300, max: 600 }, // Moderate activities
  advanced: { min: 600, max: 1000 },    // Challenging activities
};
```

### Adding Location-Specific Context

Enhance location handling in the system prompt:

```typescript
const locationContext = request.location
  ? `Location: ${[
      request.location.neighborhood,
      request.location.city,
      request.location.state,
    ]
      .filter(Boolean)
      .join(', ')}${
      request.location.landmark
        ? ` (near ${request.location.landmark})`
        : ''
    }

    IMPORTANT: Reference this specific location in your quest narrative.
    Include local landmarks, street names, or cultural elements that
    make the quest feel authentically local.`
  : 'Location: Not specified (create a generic quest)';
```

## Output Schema

The AI is instructed to output JSON matching this schema:

```json
{
  "title": "string (catchy 3-6 word title)",
  "narrative": "string (2-3 engaging sentences)",
  "objectives": [
    {
      "description": "string (clear action)",
      "metric": "steps" | "minutes" | "distance" | "photo" | "checkin",
      "target": "number",
      "xpReward": "number"
    }
  ],
  "totalXP": "number (sum of all objective XP)",
  "coinReward": "number (approx 10% of totalXP)",
  "difficulty": "beginner" | "intermediate" | "advanced",
  "estimatedDuration": "number (minutes)",
  "tags": ["string"]
}
```

## Best Practices

### 1. Be Specific About Tone

Instead of:
```
Write in a fun tone.
```

Use:
```
Your tone is playful and exploratory, like a treasure hunt. Use vivid imagery
and make users feel like they're on an exciting journey of discovery.
```

### 2. Provide Examples

Include example outputs in the system prompt:

```
Example narrative for this style:
"Legend speaks of a runner who completes three laps before sunrise and
unlocks untold endurance. The path awaits, brave adventurer—will you
answer the call of the ancient loop?"
```

### 3. Set Clear Constraints

```
IMPORTANT:
- Narrative must be exactly 2-3 sentences
- Title must be 3-6 words
- XP rewards must be within the specified range for the difficulty level
- Always respond with valid JSON only, no markdown formatting
```

### 4. Handle Edge Cases

```
If location is not specified:
- Do NOT reference specific places
- Use generic terms like "your neighborhood" or "the local park"
- Focus on the activity itself rather than surroundings
```

## Troubleshooting

### AI Returns Invalid JSON

Add this to the system prompt:
```
CRITICAL: You must respond with ONLY valid JSON. No markdown code blocks,
no explanations, no additional text. Just the JSON object.
```

### Narratives Are Too Long

Add length constraints:
```
Narrative Requirements:
- Exactly 2-3 sentences
- Maximum 200 characters
- Must hook the reader immediately
```

### XP Rewards Are Inconsistent

Add explicit instructions:
```
XP Reward Rules:
- totalXP must equal the sum of all objective xpRewards
- coinReward = Math.round(totalXP * 0.1)
- Individual objective XP should be proportional to difficulty
```

## Testing Prompts

Use this testing approach:

1. Generate 10+ quests with the same parameters
2. Check for:
   - Consistent tone across generations
   - Valid JSON output
   - Appropriate XP ranges
   - Relevant location references
3. Score narrative quality (1-5)
4. Iterate on prompts based on results

## Advanced: Few-Shot Learning

For more consistent outputs, add examples to the prompt:

```
Here are examples of excellent quests for reference:

Example 1 (fun_exploratory, beginner, walking):
{
  "title": "The Hidden Alley Explorer",
  "narrative": "Every neighborhood has secrets waiting to be discovered...",
  ...
}

Example 2 (challenge_based, intermediate, running):
{
  "title": "Your Weekly Momentum Builder",
  "narrative": "Hey there! This week is YOUR week...",
  ...
}

Now generate a quest matching the user's parameters.
```

---

## Support

For prompt engineering assistance or custom style development, contact the development team.
