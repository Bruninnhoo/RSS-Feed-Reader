import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { fetchAndParseFeed, type FeedItem, type FeedSource } from "../lib/feed-parser";
// @ts-ignore
import sampleFeedsData from "../../data/sample-feeds.json";

interface Category {
  name: string;
  feeds: FeedSource[];
}

type FeedContextType = {
  categories: Category[];
  feedItems: FeedItem[];
  loadingFeeds: boolean;
  refreshFeeds: () => Promise<void>;
};

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export function FeedProvider({ children }: { children: ReactNode }) {
  const { isGuest, user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loadingFeeds, setLoadingFeeds] = useState(false);

  const loadGuestFeeds = async () => {
    setLoadingFeeds(true);
    try {
      const parsedCategories: Category[] = sampleFeedsData.categories;
      setCategories(parsedCategories);

      // Extract all feed URLs from categories to fetch them
      let allItems: FeedItem[] = [];
      const fetchPromises = parsedCategories.flatMap(category =>
        category.feeds.map(async (feed) => {
          try {
            const parsed = await fetchAndParseFeed(feed.feedUrl);
            const items = parsed.items.map((item: any) => ({
              id: item.guid || item.id || item.link,
              title: item.title,
              link: item.link,
              pubDate: item.pubDate || item.isoDate,
              contentSnippet: item.contentSnippet || item.content || item.summary,
              sourceFeedTitle: parsed.title || feed.title,
              sourceFeedUrl: feed.feedUrl,
              isRead: false
            }));
            return items;
          } catch (e) {
            console.error("Skipping failed feed:", feed.title);
            return [];
          }
        })
      );

      const results = await Promise.all(fetchPromises);
      allItems = results.flat().sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

      setFeedItems(allItems);
    } catch (error) {
      console.error("Error loading guest feeds:", error);
    } finally {
      setLoadingFeeds(false);
    }
  };

  const loadUserFeeds = async () => {
    // Phase 4: will implement supabase logic to pull feeds here
    setLoadingFeeds(false);
  };

  const refreshFeeds = async () => {
    if (isGuest) {
      await loadGuestFeeds();
    } else if (user) {
      // await loadUserFeeds();
    }
  };

  useEffect(() => {
    if (isGuest) {
      loadGuestFeeds();
    } else if (user) {
      loadUserFeeds();
    }
  }, [isGuest, user]);

  return (
    <FeedContext.Provider value={{ categories, feedItems, loadingFeeds, refreshFeeds }}>
      {children}
    </FeedContext.Provider>
  );
}

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (context === undefined) {
    throw new Error("useFeed must be used within a FeedProvider");
  }
  return context;
};
