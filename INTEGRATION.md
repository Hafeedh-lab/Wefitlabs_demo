# Integration Guide

This guide explains how to integrate the AI Quest Generator into your existing application.

## Overview

The AI Quest Generator is designed as a standalone module that can be:
1. **Option A**: Deployed as a separate microservice (zero-integration API calls)
2. **Option B**: Imported directly into your NestJS/Express backend

## Option A: Standalone Deployment

### Step 1: Deploy the Backend

```bash
# Clone and install
cd backend
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your Google Cloud credentials:
# GOOGLE_CLOUD_PROJECT_ID=your-project-id
# GOOGLE_CLOUD_LOCATION=us-central1

# Start the server
npm run dev
```

### Step 2: Call from Your Application

Make HTTP requests to the Quest Generator API:

```typescript
// Example: Call from your existing backend
const response = await fetch('https://your-quest-api.com/api/quests/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userId: 'user-123',
    fitnessLevel: 'intermediate',
    interests: ['walking', 'pickleball'],
    location: {
      neighborhood: 'Williamsburg',
      city: 'Brooklyn',
      state: 'NY',
    },
    questStyle: 'fun_exploratory',
    duration: 30,
  }),
});

const { quest } = await response.json();
```

## Option B: Module Import (NestJS)

### Step 1: Copy the Module

Copy these files into your NestJS project:

```
src/
├── services/
│   └── questGenerator.ts      # Core AI logic
├── schemas/
│   └── quest.schema.ts        # Zod validation schemas
```

### Step 2: Create a NestJS Module

```typescript
// quest-generator.module.ts
import { Module } from '@nestjs/common';
import { QuestGeneratorService } from './quest-generator.service';
import { QuestGeneratorController } from './quest-generator.controller';

@Module({
  providers: [QuestGeneratorService],
  controllers: [QuestGeneratorController],
  exports: [QuestGeneratorService],
})
export class QuestGeneratorModule {}
```

### Step 3: Create the Service

```typescript
// quest-generator.service.ts
import { Injectable } from '@nestjs/common';
import { generateQuest } from './questGenerator';
import type { GenerationRequest, Quest } from './quest.schema';

@Injectable()
export class QuestGeneratorService {
  async generate(request: GenerationRequest): Promise<Quest> {
    return generateQuest(request);
  }
}
```

### Step 4: Create the Controller

```typescript
// quest-generator.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { QuestGeneratorService } from './quest-generator.service';
import { GenerationRequestSchema } from './quest.schema';

@Controller('quests')
export class QuestGeneratorController {
  constructor(private readonly questService: QuestGeneratorService) {}

  @Post('generate')
  async generate(@Body() body: unknown) {
    const request = GenerationRequestSchema.parse(body);
    const quest = await this.questService.generate(request);
    return { success: true, quest };
  }
}
```

### Step 5: Import in AppModule

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { QuestGeneratorModule } from './quest-generator/quest-generator.module';

@Module({
  imports: [QuestGeneratorModule],
})
export class AppModule {}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_CLOUD_PROJECT_ID` | Your Google Cloud project ID | Yes |
| `GOOGLE_CLOUD_LOCATION` | GCP region (default: `us-central1`) | No |
| `PORT` | Server port (default: `3001`) | No |

## Google Cloud Setup

1. Create a Google Cloud project
2. Enable the Vertex AI API
3. Create a service account with Vertex AI permissions
4. Download the service account key JSON
5. Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
```

## Database Integration

The module is designed to work with any database. To persist quests:

```typescript
// Example: Save quest to your database
@Post('generate')
async generate(@Body() body: GenerationRequestDto) {
  const quest = await this.questService.generate(body);

  // Save to your database
  await this.questRepository.save({
    ...quest,
    userId: body.userId,
    status: 'pending',
  });

  return { success: true, quest };
}
```

## Error Handling

The API returns structured error responses:

```typescript
// 400 Bad Request
{
  "success": false,
  "error": "Invalid request body",
  "details": [
    { "path": "fitnessLevel", "message": "Invalid enum value" }
  ]
}

// 500 Internal Server Error
{
  "success": false,
  "error": "AI generation failed. Please try again."
}
```

## Testing

Run the test suite:

```bash
cd backend
npm test
```

## Support

For questions or issues, please open a GitHub issue or contact the development team.
