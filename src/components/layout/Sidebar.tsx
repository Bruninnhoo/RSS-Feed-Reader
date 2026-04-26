import { useState } from "react";
import { Bookmark, LayoutGrid, Plus, Rss, Hash } from "lucide-react";
import { useFeed } from "../../contexts/FeedContext";
import { AddFeedModal } from "../feed/AddFeedModal";

export function Sidebar() {
  const { categories, loadingFeeds } = useFeed();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <aside className="w-[var(--spacing-sidebar)] h-screen border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] flex flex-col p-4 flex-shrink-0 transition-colors">
      <div className="flex items-center gap-2 font-bold text-xl mb-8 text-[var(--color-text-primary)]">
        <div className="w-8 h-8 rounded bg-[var(--color-accent)] flex items-center justify-center text-white">
          <Rss size={20} />
        </div>
        Frontpage
      </div>

      <nav className="flex-1 overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">
            Menu
          </h3>
          <ul className="space-y-1">
            <li>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-[var(--color-accent-subtle)] text-[var(--color-accent)] transition-colors">
                <LayoutGrid size={18} />
                All Feeds
              </button>
            </li>
            <li>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-colors">
                <Bookmark size={18} />
                Saved
              </button>
            </li>
          </ul>
        </div>

        {categories.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">
              Categories
            </h3>
            {categories.map((category) => (
              <div key={category.name} className="mb-3">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-colors">
                  <Hash size={16} className="text-[var(--color-text-tertiary)]" />
                  {category.name} ({category.feeds.length})
                </button>
              </div>
            ))}
          </div>
        )}

        {loadingFeeds && (
          <div className="text-sm p-4 text-[var(--color-text-tertiary)] flex justify-center w-full transition-colors">
            Loading your feeds...
          </div>
        )}
      </nav>

      <div className="mt-auto pt-4 border-t border-[var(--color-border)] transition-colors">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <Plus size={16} />
          Add Feed
        </button>
      </div>

      <AddFeedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </aside>
  );
}
