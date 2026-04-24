export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Your Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Welcome back to your personalized tech feed.</p>
      </div>

      {/* Placeholder Feed List */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <article key={i} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-6 rounded-sm bg-blue-100 flex-shrink-0"></div>
              <span className="text-sm font-medium text-gray-600">Sample Feed Source • 2h ago</span>
            </div>
            <h2 className="text-lg font-semibold mb-2">This is an example article title to show the layout</h2>
            <p className="text-gray-600 text-sm line-clamp-2">This is some placeholder text representing the excerpt of an RSS feed. It shows what it would look like when the user scroll through their dashboard.</p>
          </article>
        ))}
      </div>
    </div>
  );
}
