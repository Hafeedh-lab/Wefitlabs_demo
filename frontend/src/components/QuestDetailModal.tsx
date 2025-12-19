import { X, Trophy, Coins, Clock, MapPin, Target, Circle } from 'lucide-react';
import type { Quest } from '../types/quest';

interface QuestDetailModalProps {
  quest: Quest;
  onClose: () => void;
  onAccept: (quest: Quest) => void;
}

const difficultyConfig = {
  beginner: { label: 'Beginner', stars: 1, color: 'text-green-600' },
  intermediate: { label: 'Intermediate', stars: 2, color: 'text-yellow-600' },
  advanced: { label: 'Advanced', stars: 3, color: 'text-red-600' },
} as const;

const metricLabels = {
  steps: 'steps',
  minutes: 'min',
  distance: 'meters',
  photo: 'photos',
  checkin: 'check-ins',
} as const;

export function QuestDetailModal({ quest, onClose, onAccept }: QuestDetailModalProps) {
  const difficulty = difficultyConfig[quest.difficulty];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-900 transition-colors shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-white">
          <h2 className="text-2xl font-bold mb-2 pr-10">{quest.title}</h2>
          <div className="flex items-center gap-4">
            <span className={`flex items-center gap-1 ${difficulty.color} bg-white/90 px-3 py-1 rounded-full text-sm font-medium`}>
              {'★'.repeat(difficulty.stars)}{'☆'.repeat(3 - difficulty.stars)} {difficulty.label}
            </span>
            <span className="flex items-center gap-1 text-indigo-100">
              <Clock className="w-4 h-4" />
              {quest.estimatedDuration} min
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Narrative */}
          <div>
            <p className="text-gray-700 text-lg leading-relaxed">{quest.narrative}</p>
          </div>

          {/* Location */}
          {quest.location && (
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="w-5 h-5 text-indigo-500" />
              <span>
                {[
                  quest.location.landmark,
                  quest.location.neighborhood,
                  quest.location.city,
                  quest.location.state,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </div>
          )}

          {/* Objectives Checklist */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Objectives
            </h3>
            <div className="space-y-3">
              {quest.objectives.map((objective, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100"
                >
                  <Circle className="w-5 h-5 text-gray-300 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-gray-700 font-medium">{objective.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-gray-500">
                        Target: {objective.target} {metricLabels[objective.metric]}
                      </span>
                      <span className="text-sm font-medium text-indigo-600">
                        +{objective.xpReward} XP
                      </span>
                    </div>
                    {/* Progress bar (static at 0%) */}
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: '0%' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {quest.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Rewards Breakdown */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Rewards</h3>
            <div className="flex items-center justify-around">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-indigo-600">
                  <Trophy className="w-8 h-8" />
                  <span className="text-3xl font-bold">{quest.totalXP}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Experience Points</p>
              </div>
              <div className="h-12 w-px bg-gray-200" />
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-amber-500">
                  <Coins className="w-8 h-8" />
                  <span className="text-3xl font-bold">{quest.coinReward}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Coins</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => onAccept(quest)}
            className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Accept Quest
          </button>
        </div>
      </div>
    </div>
  );
}
