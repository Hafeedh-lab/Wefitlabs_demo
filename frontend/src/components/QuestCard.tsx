import { Trophy, Clock, Coins, Target, MapPin } from 'lucide-react';
import type { Quest } from '../types/quest';
import type { Ref } from 'react';

interface QuestCardProps {
  quest: Quest;
  ref?: Ref<HTMLDivElement>;
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
} as const;

const metricLabels = {
  steps: 'steps',
  minutes: 'min',
  distance: 'm',
  photo: 'photos',
  checkin: 'check-ins',
} as const;

export function QuestCard({ quest, ref }: QuestCardProps) {
  return (
    <div
      ref={ref}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{quest.title}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[quest.difficulty]}`}
              >
                {quest.difficulty}
              </span>
              <span className="flex items-center gap-1 text-indigo-100 text-sm">
                <Clock className="w-4 h-4" />
                {quest.estimatedDuration} min
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Narrative */}
        <p className="text-gray-600 mb-4 leading-relaxed">{quest.narrative}</p>

        {/* Location if present */}
        {quest.location && (
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
            <MapPin className="w-4 h-4" />
            <span>
              {[
                quest.location.landmark,
                quest.location.neighborhood,
                quest.location.city,
              ]
                .filter(Boolean)
                .join(', ')}
            </span>
          </div>
        )}

        {/* Objectives */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            Objectives
          </h3>
          <ul className="space-y-2">
            {quest.objectives.map((objective, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
              >
                <span className="text-gray-700 text-sm">
                  {objective.description}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    {objective.target} {metricLabels[objective.metric]}
                  </span>
                  <span className="text-xs font-medium text-indigo-600">
                    +{objective.xpReward} XP
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quest.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Rewards */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold text-indigo-600">
              {quest.totalXP} XP
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" />
            <span className="font-semibold text-amber-500">
              {quest.coinReward} Coins
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
