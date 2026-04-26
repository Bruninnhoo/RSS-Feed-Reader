import { useFeed } from "../contexts/FeedContext";
import { formatDistanceToNow } from "date-fns";

export function Dashboard() {
  const { feedItems, loadingFeeds } = useFeed();

  // Keep a safe snippet extraction since rss parsing can contain HTML
  const stripHtml = (html: string) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--color-border)] pb-4 transition-colors">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">Your Dashboard</h1>
        <p className="text-[var(--color-text-secondary)] mt-1 text-sm">Welcome back to your personalized tech feed.</p>
      </div>

      {loadingFeeds && feedItems.length === 0 ? (
        <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
            {feedItems.map((item) => (
            <article key={item.id} className="p-4 border border-[var(--color-border)] rounded-xl hover:shadow-md transition-all bg-[var(--color-surface)] flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-[var(--color-accent)] bg-[var(--color-accent-subtle)] px-2 py-1 rounded transition-colors">
                    {item.sourceFeedTitle}
                </span>
                <span className="text-xs text-[var(--color-text-tertiary)]">
                    {item.pubDate ? formatDistanceToNow(new Date(item.pubDate), { addSuffix: true }) : 'Unknown date'}
                </span>
                </div>
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="block group">
                    <h2 className="text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] group-hover:underline line-clamp-2 transition-colors">
                        {item.title}
                    </h2>
                </a>
                <p className="text-[var(--color-text-secondary)] text-sm line-clamp-3 mt-1 transition-colors">
                    {stripHtml(item.contentSnippet)}
                </p>
            </article>
            ))}
            {feedItems.length === 0 && !loadingFeeds && (
                <div className="text-center p-12 bg-[var(--color-bg-secondary)] rounded-lg border border-dashed border-[var(--color-border)] transition-colors">
                    <h3 className="text-lg font-medium text-[var(--color-text-primary)]">No items found</h3>
                    <p className="text-[var(--color-text-secondary)] mt-1">Add some feeds to see content here.</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
}
