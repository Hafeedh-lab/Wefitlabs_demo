import { useActionState, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { Quest, GenerationRequest } from '../types/quest';
import { generateQuest, QuestApiError } from '../services/questApi';
import { ErrorAlert } from './ErrorAlert';

interface ActionState {
  quest: Quest | null;
  error: string | null;
  errorTitle: string | null;
}

const INTEREST_OPTIONS = [
  'Pickleball',
  'Running',
  'Yoga',
  'Walking',
  'Cycling',
  'Swimming',
  'HIIT',
  'Strength Training',
];

const FITNESS_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;

interface GeneratorControlsProps {
  onQuestGenerated: (quests: Quest[]) => void;
  onLoadingChange?: (isLoading: boolean) => void;
}

export function GeneratorControls({ onQuestGenerated, onLoadingChange }: GeneratorControlsProps) {
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set());
  const [duration, setDuration] = useState(30);

  function toggleInterest(interest: string) {
    setSelectedInterests((prev) => {
      const next = new Set(prev);
      if (next.has(interest)) {
        next.delete(interest);
      } else {
        next.add(interest);
      }
      return next;
    });
  }

  async function submitAction(
    _prevState: ActionState,
    formData: FormData
  ): Promise<ActionState> {
    try {
      if (selectedInterests.size === 0) {
        return {
          quest: null,
          error: 'Please select at least one interest to generate personalized quests.',
          errorTitle: 'Missing Information',
        };
      }

      const baseRequest = {
        userId: crypto.randomUUID(),
        fitnessLevel: formData.get('fitnessLevel') as GenerationRequest['fitnessLevel'],
        interests: Array.from(selectedInterests),
        location: {
          city: (formData.get('city') as string) || undefined,
          neighborhood: (formData.get('neighborhood') as string) || undefined,
        },
        duration: Number(formData.get('duration')),
      };

      const styles: GenerationRequest['questStyle'][] = [
        'fun_exploratory',
        'challenge_based',
        'performance_oriented',
      ];

      const quests = await Promise.all(
        styles.map((style) =>
          generateQuest({ ...baseRequest, questStyle: style })
        )
      );

      onQuestGenerated(quests);
      return { quest: quests[0], error: null, errorTitle: null };
    } catch (err) {
      if (err instanceof QuestApiError) {
        return {
          quest: null,
          error: err.message,
          errorTitle: err.isNetworkError ? 'Connection Error' : 'Generation Failed',
        };
      }
      const message = err instanceof Error ? err.message : 'Failed to generate quests';
      return { quest: null, error: message, errorTitle: 'Error' };
    }
  }

  const [state, formAction, isPending] = useActionState(submitAction, {
    quest: null,
    error: null,
    errorTitle: null,
  });

  // Notify parent about loading state changes
  useEffect(() => {
    onLoadingChange?.(isPending);
  }, [isPending, onLoadingChange]);

  return (
    <form action={formAction} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Fitness Level - Select Dropdown */}
      <div>
        <label
          htmlFor="fitnessLevel"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Fitness Level
        </label>
        <select
          id="fitnessLevel"
          name="fitnessLevel"
          defaultValue="intermediate"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-gray-700"
        >
          {FITNESS_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </div>

      {/* Interests - Toggleable Buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interests
        </label>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${
                selectedInterests.has(interest)
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Location - City and Neighborhood */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="e.g., San Francisco"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
        </div>
        <div>
          <label
            htmlFor="neighborhood"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Neighborhood
          </label>
          <input
            type="text"
            id="neighborhood"
            name="neighborhood"
            placeholder="e.g., Mission District"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
        </div>
      </div>

      {/* Duration - Range Slider */}
      <div>
        <label
          htmlFor="duration"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Duration: <span className="text-indigo-600 font-semibold">{duration} minutes</span>
        </label>
        <input
          type="range"
          id="duration"
          name="duration"
          min="15"
          max="60"
          step="5"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>15 min</span>
          <span>60 min</span>
        </div>
      </div>

      {/* Error Message */}
      {state.error && (
        <ErrorAlert
          title={state.errorTitle || 'Error'}
          message={state.error}
        />
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating Quests...
          </>
        ) : (
          'Generate Quests'
        )}
      </button>
    </form>
  );
}
