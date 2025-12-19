# Video Walkthrough Script

**Target Length**: 10 minutes
**Format**: Screen recording with voiceover (Loom recommended)

---

## Introduction (1 minute)

**Show**: Demo homepage

**Script**:
> "Hi, I'm [Name], and this is a demo of the AI Quest Generator for WeFit Labs.
>
> This system uses AI to create personalized, narrative-driven fitness quests
> that adapt to each user's fitness level, interests, and location.
>
> Let me show you how it works."

---

## Demo Functionality (3 minutes)

### Step 1: The Generator Interface

**Show**: GeneratorControls component

**Script**:
> "Here's the quest generator interface. Users can customize their quest by selecting:
>
> 1. **Fitness Level** - Beginner, Intermediate, or Advanced
> 2. **Interests** - Activities like walking, running, pickleball, yoga
> 3. **Location** - City and neighborhood for local flavor
> 4. **Duration** - How long they want the quest to take
>
> Let me generate some quests..."

### Step 2: Generate Quests

**Action**: Fill in the form and click "Generate Quests"

**Show**: Loading skeleton cards

**Script**:
> "When we click Generate, the AI creates three different quests—one for each
> narrative style: Fun Exploratory, Challenge-Based, and Performance-Oriented.
>
> Notice the loading skeletons while we wait for the AI to respond."

### Step 3: View Generated Quests

**Show**: Quest cards grid

**Script**:
> "Here are our three generated quests. Each has:
> - A catchy title
> - An engaging narrative hook
> - Objectives with XP rewards
> - Total XP and coins earned
>
> Notice how each quest has a different tone based on its style."

### Step 4: Quest Details

**Action**: Click on a quest card

**Show**: Quest detail modal

**Script**:
> "Clicking a quest opens the full details view. Here we see:
> - The complete narrative
> - All objectives with progress tracking
> - The reward breakdown
> - An 'Accept Quest' button
>
> This would integrate with WeFit's existing quest tracking system."

### Step 5: Filtering

**Show**: Filter bar

**Script**:
> "Users can filter generated quests by difficulty, duration, or activity tags.
> This helps them quickly find the perfect quest for their current mood and schedule."

---

## Code Tour (4 minutes)

### Backend Architecture

**Show**: `backend/src/` directory structure

**Script**:
> "Let me show you the code architecture.
>
> The backend is built with Express and TypeScript. The key files are:
>
> 1. `questGenerator.ts` - The core AI logic using Vertex AI
> 2. `quest.schema.ts` - Zod schemas for type-safe validation
> 3. `quests.ts` - API routes for generation and demo endpoints"

**Show**: `questGenerator.ts`

**Script**:
> "The quest generator uses Google's Gemini model via Vertex AI.
>
> We have three distinct prompt styles—each creates a different narrative voice.
> The system prompt includes our quest design principles, and the user prompt
> provides the specific parameters for generation.
>
> The AI returns structured JSON that we validate with Zod before sending to the client."

### Frontend Architecture

**Show**: `frontend/src/` directory structure

**Script**:
> "The frontend is React with TypeScript and Tailwind CSS.
>
> Key components include:
> - `GeneratorControls` - The form for customizing quests
> - `QuestCard` - Individual quest display
> - `QuestDetailModal` - Full quest information view
> - `FilterBar` - Quest filtering functionality"

### API Endpoints

**Show**: Terminal with curl commands

**Script**:
> "The API has two main endpoints:
>
> 1. `POST /api/quests/generate` - Creates new AI-generated quests
> 2. `GET /api/quests/demo` - Returns pre-generated quests for reliable demos
>
> Let me show you a quick API call..."

**Action**: Run curl command for demo endpoint

---

## Integration (2 minutes)

**Show**: INTEGRATION.md

**Script**:
> "Integration with WeFit is designed to be seamless.
>
> **Option A**: Deploy as a standalone microservice. WeFit's backend makes HTTP
> calls to this service. Zero changes to the main codebase.
>
> **Option B**: Import the module directly into WeFit's NestJS backend.
> Just copy the questGenerator service and schemas, create a NestJS module,
> and you're done.
>
> We've included comprehensive documentation for both approaches."

**Show**: API.md briefly

**Script**:
> "Full API documentation covers all endpoints, data models, and example requests."

---

## Conclusion (30 seconds)

**Show**: Demo homepage

**Script**:
> "That's the AI Quest Generator demo.
>
> Key takeaways:
> - AI-powered quest generation with three narrative styles
> - Fully validated, type-safe architecture
> - Ready for integration with WeFit's existing stack
> - Comprehensive documentation and tests
>
> Thank you for watching. I'm excited to discuss how this can help WeFit
> scale their content creation. Let's talk soon!"

---

## Recording Tips

1. **Resolution**: 1920x1080 (1080p)
2. **Browser**: Use Chrome in incognito mode (clean interface)
3. **Zoom**: Browser zoom at 100-110% for readability
4. **Audio**: Use a good microphone, speak clearly
5. **Pacing**: Don't rush—pause between sections
6. **Cursor**: Use a cursor highlighter tool for visibility
7. **Practice**: Do a dry run before recording

## Post-Production

1. Trim any long pauses or mistakes
2. Add intro/outro cards with contact info
3. Export as MP4, H.264 codec
4. Upload to Loom or YouTube (unlisted)
5. Share link with WeFit team
