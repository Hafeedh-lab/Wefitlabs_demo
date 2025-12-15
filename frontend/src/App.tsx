import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { GeneratorControls } from './components/GeneratorControls';
import { QuestCard } from './components/QuestCard';
import type { Quest } from './types/quest';

function App() {
  const [quests, setQuests] = useState<Quest[]>([]);

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
            <GeneratorControls onQuestGenerated={setQuests} />
          </div>

          {quests.length > 0 && (
            <section aria-label="Generated Quests" className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                Your Generated Quests
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quests.map((quest) => (
                  <QuestCard key={quest.questId} quest={quest} />
                ))}
              </div>
            </section>
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
