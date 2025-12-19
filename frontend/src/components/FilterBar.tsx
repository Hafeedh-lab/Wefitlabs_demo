import { Filter, X } from 'lucide-react';
import type { Quest } from '../types/quest';

export interface FilterState {
  difficulty: Quest['difficulty'] | 'all';
  maxDuration: number | null;
  tag: string | null;
}

interface FilterBarProps {
  quests: Quest[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const DIFFICULTY_OPTIONS = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;

const DURATION_OPTIONS = [
  { value: null, label: 'Any Duration' },
  { value: 20, label: '≤ 20 min' },
  { value: 30, label: '≤ 30 min' },
  { value: 45, label: '≤ 45 min' },
  { value: 60, label: '≤ 60 min' },
] as const;

export function FilterBar({ quests, filters, onFilterChange }: FilterBarProps) {
  // Extract unique tags from all quests
  const allTags = Array.from(
    new Set(quests.flatMap((quest) => quest.tags))
  ).sort();

  const hasActiveFilters =
    filters.difficulty !== 'all' ||
    filters.maxDuration !== null ||
    filters.tag !== null;

  const clearFilters = () => {
    onFilterChange({
      difficulty: 'all',
      maxDuration: null,
      tag: null,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold text-gray-800">Filter Quests</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Difficulty Filter */}
        <div className="flex-1 min-w-[150px]">
          <label
            htmlFor="filter-difficulty"
            className="block text-xs font-medium text-gray-500 mb-1"
          >
            Difficulty
          </label>
          <select
            id="filter-difficulty"
            value={filters.difficulty}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                difficulty: e.target.value as FilterState['difficulty'],
              })
            }
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-gray-700 text-sm"
          >
            {DIFFICULTY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Duration Filter */}
        <div className="flex-1 min-w-[150px]">
          <label
            htmlFor="filter-duration"
            className="block text-xs font-medium text-gray-500 mb-1"
          >
            Max Duration
          </label>
          <select
            id="filter-duration"
            value={filters.maxDuration ?? ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                maxDuration: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-gray-700 text-sm"
          >
            {DURATION_OPTIONS.map((option) => (
              <option key={option.value ?? 'any'} value={option.value ?? ''}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="flex-1 min-w-[150px]">
            <label
              htmlFor="filter-tag"
              className="block text-xs font-medium text-gray-500 mb-1"
            >
              Activity Tag
            </label>
            <select
              id="filter-tag"
              value={filters.tag ?? ''}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  tag: e.target.value || null,
                })
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-gray-700 text-sm"
            >
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to filter quests based on filter state
export function filterQuests(quests: Quest[], filters: FilterState): Quest[] {
  return quests.filter((quest) => {
    // Difficulty filter
    if (filters.difficulty !== 'all' && quest.difficulty !== filters.difficulty) {
      return false;
    }

    // Duration filter
    if (filters.maxDuration !== null && quest.estimatedDuration > filters.maxDuration) {
      return false;
    }

    // Tag filter
    if (filters.tag !== null && !quest.tags.includes(filters.tag)) {
      return false;
    }

    return true;
  });
}
