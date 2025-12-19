# API Documentation

## Base URL

```
http://localhost:3001/api
```

## Endpoints

### Health Check

```
GET /health
```

Check if the server is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-10T15:45:00.000Z",
  "service": "ai-quest-generator-backend"
}
```

---

### Generate Quest

```
POST /api/quests/generate
```

Generate a new AI-powered fitness quest based on user context.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "string (required)",
  "fitnessLevel": "beginner" | "intermediate" | "advanced",
  "interests": ["string"] (at least 1 required),
  "location": {
    "neighborhood": "string (optional)",
    "city": "string (optional)",
    "state": "string (optional)",
    "landmark": "string (optional)"
  },
  "questStyle": "fun_exploratory" | "challenge_based" | "performance_oriented",
  "duration": 15-60 (minutes)
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | Unique identifier for the user |
| `fitnessLevel` | enum | Yes | User's fitness level |
| `interests` | string[] | Yes | List of activities (min 1) |
| `location` | object | No | Location context for quest |
| `questStyle` | enum | Yes | Narrative style for the quest |
| `duration` | number | Yes | Target duration in minutes (15-60) |

**Quest Styles:**

| Style | Description |
|-------|-------------|
| `fun_exploratory` | Playful, adventure-style challenges. Like a treasure hunt. |
| `challenge_based` | Warm, encouraging tone. Celebrates progress and consistency. |
| `performance_oriented` | Direct, competitive, achievement-focused. For serious athletes. |

**Success Response (200 OK):**
```json
{
  "success": true,
  "quest": {
    "questId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "The Williamsburg Waterfront Wanderer",
    "narrative": "The East River whispers tales of those brave enough...",
    "objectives": [
      {
        "description": "Walk 4,000 steps along the waterfront",
        "metric": "steps",
        "target": 4000,
        "xpReward": 300
      },
      {
        "description": "Take a photo at Domino Park",
        "metric": "photo",
        "target": 1,
        "xpReward": 100
      }
    ],
    "totalXP": 400,
    "coinReward": 40,
    "difficulty": "intermediate",
    "estimatedDuration": 30,
    "tags": ["walking", "waterfront", "scenic"],
    "generatedAt": "2025-12-10T15:45:00.000Z",
    "location": {
      "neighborhood": "Williamsburg",
      "city": "Brooklyn",
      "state": "NY"
    }
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid request body",
  "details": [
    {
      "path": "fitnessLevel",
      "message": "Invalid enum value. Expected 'beginner' | 'intermediate' | 'advanced'"
    }
  ]
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "error": "AI generation failed. Please try again."
}
```

---

### Get Demo Quests

```
GET /api/quests/demo
```

Retrieve pre-generated demo quests for reliable presentations.

**Response (200 OK):**
```json
{
  "success": true,
  "quests": [
    {
      "questId": "demo-quest-1-fun-exploratory",
      "title": "The Williamsburg Waterfront Wanderer",
      "narrative": "The East River whispers tales...",
      "objectives": [...],
      "totalXP": 500,
      "coinReward": 50,
      "difficulty": "intermediate",
      "estimatedDuration": 35,
      "tags": ["walking", "waterfront", "scenic", "photography"],
      "generatedAt": "2025-12-10T15:45:00.000Z",
      "location": {
        "neighborhood": "Williamsburg",
        "city": "Brooklyn",
        "state": "NY",
        "landmark": "Domino Park"
      }
    },
    // ... more quests
  ],
  "metadata": {
    "total": 3,
    "styles": ["fun_exploratory", "challenge_based", "performance_oriented"]
  }
}
```

---

## Data Models

### Quest

```typescript
interface Quest {
  questId: string;           // UUID v4
  title: string;             // 3-6 words, attention-grabbing
  narrative: string;         // 2-4 sentences, 100-200 characters
  objectives: Objective[];   // List of objectives (min 1)
  totalXP: number;           // Sum of all objective XP rewards
  coinReward: number;        // ~10% of totalXP
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // Minutes
  tags: string[];            // For filtering/search
  generatedAt: string;       // ISO 8601 timestamp
  location?: Location;       // Optional location context
}
```

### Objective

```typescript
interface Objective {
  description: string;       // User-facing text
  metric: 'steps' | 'minutes' | 'distance' | 'photo' | 'checkin';
  target: number;            // Numeric goal
  xpReward: number;          // XP earned on completion
}
```

### Location

```typescript
interface Location {
  neighborhood?: string;     // "Williamsburg"
  city?: string;             // "Brooklyn"
  state?: string;            // "NY"
  landmark?: string;         // "Domino Park"
}
```

---

## XP Reward Ranges

| Difficulty | XP Range | Example |
|------------|----------|---------|
| Beginner | 100-300 XP | Easy 15-20 min walks |
| Intermediate | 300-600 XP | Moderate 30 min activities |
| Advanced | 600-1000 XP | Challenging 45-60 min workouts |

**Coin Reward Formula:** `coinReward ≈ totalXP × 0.1`

---

## Rate Limits

Currently, there are no rate limits implemented for the demo. In production, consider implementing:

- Per-user rate limiting
- API key authentication
- Request throttling

---

## CORS

CORS is enabled for all origins in the demo. Configure appropriately for production:

```typescript
app.use(cors({
  origin: ['https://yourdomain.com'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

---

## Example Requests

### cURL

```bash
# Generate a quest
curl -X POST http://localhost:3001/api/quests/generate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "demo-user-123",
    "fitnessLevel": "intermediate",
    "interests": ["walking", "pickleball"],
    "location": {
      "neighborhood": "Williamsburg",
      "city": "Brooklyn",
      "state": "NY"
    },
    "questStyle": "fun_exploratory",
    "duration": 30
  }'

# Get demo quests
curl http://localhost:3001/api/quests/demo
```

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
});

// Generate a quest
const { data } = await api.post('/quests/generate', {
  userId: 'demo-user-123',
  fitnessLevel: 'intermediate',
  interests: ['walking', 'pickleball'],
  questStyle: 'fun_exploratory',
  duration: 30,
});

console.log(data.quest);
```
