// Location for quest context
export interface Location {
  neighborhood?: string;
  city?: string;
  state?: string;
  landmark?: string;
}

// Single objective within a quest
export interface Objective {
  description: string;
  metric: 'steps' | 'minutes' | 'distance' | 'photo' | 'checkin';
  target: number;
  xpReward: number;
}

// Complete quest object returned from the API
export interface Quest {
  questId: string;
  title: string;
  narrative: string;
  objectives: Objective[];
  totalXP: number;
  coinReward: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  tags: string[];
  generatedAt: string;
  location?: Location;
}

// Request payload for quest generation
export interface GenerationRequest {
  userId: string;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
  location?: Location;
  questStyle: 'fun_exploratory' | 'challenge_based' | 'performance_oriented';
  duration: number;
}

// Form state for the generator controls
export interface GeneratorFormState {
  fitnessLevel: GenerationRequest['fitnessLevel'];
  interests: string[];
  location: string;
  questStyle: GenerationRequest['questStyle'];
  duration: number;
}
