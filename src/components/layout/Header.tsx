import { Search, Bell, Settings } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 flex-shrink-0">
      <h2 className="text-lg font-semibold text-gray-900">All Feeds</h2>

      <div className="flex flex-1 max-w-xl mx-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="search"
          placeholder="Search feeds..."
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-gray-700">
          <Bell size={20} />
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <Settings size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300"></div>
      </div>
    </header>
  );
}
