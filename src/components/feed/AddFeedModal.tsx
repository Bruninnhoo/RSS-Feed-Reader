import { useState } from "react";
import { X, Rss, Loader2, AlertCircle } from "lucide-react";
import { fetchAndParseFeed } from "../../lib/feed-parser";
import { useFeed } from "../../contexts/FeedContext";

interface AddFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddFeedModal({ isOpen, onClose }: AddFeedModalProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { categories, addFeedToCategory } = useFeed();
  const [selectedCategory, setSelectedCategory] = useState("General"); // Default to General

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Validate the feed by parsing it
      const parsedFeed = await fetchAndParseFeed(url);
      
      // 2. We got valid feed data. Now add it via Context.
      const newFeedPayload = {
        title: parsedFeed.title || "Unknown Feed",
        feedUrl: url,
        siteUrl: parsedFeed.link || "",
        description: parsedFeed.description || ""
      };

      await addFeedToCategory(newFeedPayload, selectedCategory);
      
      // 3. Reset and close on success
      setUrl("");
      onClose();
    } catch (err: any) {
      setError("Failed to parse this URL. Are you sure it's a valid RSS or Atom feed?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-[var(--color-bg-primary)] rounded-xl shadow-lg w-full max-w-md overflow-hidden border border-[var(--color-border)] transform transition-all">
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--color-text-primary)]">
            <Rss className="text-[var(--color-accent)]" size={24} />
            Add New Feed
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 text-[var(--color-error)] text-sm flex gap-2">
              <AlertCircle size={18} className="flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                RSS or Atom Feed URL
              </label>
              <input
                type="url"
                required
                placeholder="https://example.com/feed.xml"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] placeholder:text-[var(--color-text-tertiary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              >
                <option value="General">General (Default)</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                Selecting a category organizes your sidebar.
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium border border-[var(--color-border)] rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !url}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Validating..." : "Add Feed"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
