export function QuestCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-indigo-400 to-indigo-300 px-6 py-4">
        <div className="h-6 bg-indigo-300 rounded w-3/4 mb-2" />
        <div className="flex items-center gap-3 mt-2">
          <div className="h-5 bg-indigo-300 rounded-full w-20" />
          <div className="h-4 bg-indigo-200 rounded w-16" />
        </div>
      </div>

      {/* Body Skeleton */}
      <div className="p-6">
        {/* Narrative */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>

        {/* Objectives */}
        <div className="mb-4">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
          <div className="space-y-2">
            <div className="h-12 bg-gray-100 rounded-lg" />
            <div className="h-12 bg-gray-100 rounded-lg" />
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-indigo-50 rounded-lg w-16" />
          <div className="h-6 bg-indigo-50 rounded-lg w-20" />
          <div className="h-6 bg-indigo-50 rounded-lg w-14" />
        </div>

        {/* Rewards */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <div className="h-5 bg-gray-200 rounded w-20" />
          <div className="h-5 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
}
