import { useState, useCallback, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { GeneratorControls } from './components/GeneratorControls';
import { QuestCard } from './components/QuestCard';
import { QuestCardSkeleton } from './components/QuestCardSkeleton';
import { QuestDetailModal } from './components/QuestDetailModal';
import { FilterBar, filterQuests, type FilterState } from './components/FilterBar';
import type { Quest } from './types/quest';

const initialFilters: FilterState = {
  difficulty: 'all',
  maxDuration: null,
  tag: null,
};

function App() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const filteredQuests = useMemo(
    () => filterQuests(quests, filters),
    [quests, filters]
  );

  const handleLoadingChange = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const handleAcceptQuest = (quest: Quest) => {
    // For demo purposes, just show an alert and close the modal
    alert(`Quest "${quest.title}" accepted! In production, this would start tracking your progress.`);
    setSelectedQuest(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              WeFit AI Quest Generator
            </h1>
          </div>
          <p className="text-gray-600">
            Create personalized fitness quests powered by AI
          </p>
        </header>

        {/* Main Content */}
        <main className="space-y-12">
          <div className="max-w-2xl mx-auto">
            <GeneratorControls
              onQuestGenerated={setQuests}
              onLoadingChange={handleLoadingChange}
            />
          </div>

          {/* Loading Skeletons */}
          {isLoading && (
            <section aria-label="Loading Quests" className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                Generating Your Quests...
              </h2>
              <p className="text-center text-gray-500">
                Our AI is crafting personalized fitness adventures for you
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <QuestCardSkeleton />
                <QuestCardSkeleton />
                <QuestCardSkeleton />
              </div>
            </section>
          )}

          {/* Generated Quests */}
          {!isLoading && quests.length > 0 && (
            <section aria-label="Generated Quests" className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                Your Generated Quests
              </h2>

              {/* Filter Bar */}
              <FilterBar
                quests={quests}
                filters={filters}
                onFilterChange={setFilters}
              />

              {/* Quest Grid */}
              {filteredQuests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredQuests.map((quest, index) => (
                    <QuestCard
                      key={quest.questId}
                      quest={quest}
                      index={index}
                      onClick={() => setSelectedQuest(quest)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">No quests match your filters.</p>
                  <p className="text-sm mt-2">Try adjusting your filter criteria.</p>
                </div>
              )}
            </section>
          )}

          {/* Quest Detail Modal */}
          {selectedQuest && (
            <QuestDetailModal
              quest={selectedQuest}
              onClose={() => setSelectedQuest(null)}
              onAccept={handleAcceptQuest}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-400">
          Powered by WeFit Labs
        </footer>
      </div>
    </div>
  );
}

export default App;
