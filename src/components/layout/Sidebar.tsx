import { Bookmark, LayoutGrid, Plus, Rss } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-[var(--spacing-sidebar)] h-screen border-r border-[#e1e4e8] bg-[#f8f9fa] flex flex-col p-4 flex-shrink-0">
      <div className="flex items-center gap-2 font-bold text-xl mb-8">
        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white">
          <Rss size={20} />
        </div>
        Frontpage
      </div>

      <nav className="flex-1 overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Menu
          </h3>
          <ul className="space-y-1">
            <li>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-blue-50 text-blue-700">
                <LayoutGrid size={18} />
                All Feeds
              </button>
            </li>
            <li>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
                <Bookmark size={18} />
                Saved
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
          <Plus size={16} />
          Add Feed
        </button>
      </div>
    </aside>
  );
}
