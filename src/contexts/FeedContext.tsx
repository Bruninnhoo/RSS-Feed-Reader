/* eslint-disable react-refresh/only-export-components */
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
  addFeedToCategory: (newFeed: FeedSource, categoryName: string) => Promise<void>;
};

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export function FeedProvider({ children }: { children: ReactNode }) {
  const { isGuest, user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loadingFeeds, setLoadingFeeds] = useState(false);

  const loadGuestFeeds = async () => {
    try {
      setLoadingFeeds(true);
      
      // Load custom guest feeds from localStorage or fallback to defaults
      const savedGuestFeeds = localStorage.getItem("frontpage-guestFeeds");
      const parsedCategories: Category[] = savedGuestFeeds ? JSON.parse(savedGuestFeeds) : sampleFeedsData.categories;
      
      setCategories(parsedCategories);

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
    setLoadingFeeds(false);
  };

  const refreshFeeds = async () => {
    if (isGuest) {
      await loadGuestFeeds();
    } else if (user) {
      // await loadUserFeeds();
    }
  };

  const addFeedToCategory = async (newFeed: FeedSource, categoryName: string) => {
    // 1. Update the categories definition
    setCategories(prev => {
      const existingCategoryIndex = prev.findIndex(c => c.name.toLowerCase() === categoryName.toLowerCase());

      const newArray = [...prev];
      if (existingCategoryIndex >= 0) {
        newArray[existingCategoryIndex] = {
          ...newArray[existingCategoryIndex],
          feeds: [...newArray[existingCategoryIndex].feeds, newFeed]
        };
      } else {
        newArray.push({
          name: categoryName,
          feeds: [newFeed]
        });
      }
      
      // If guest, persist right away
      if (isGuest) {
        localStorage.setItem("frontpage-guestFeeds", JSON.stringify(newArray));
      }
      
      return newArray;
    });

    // 2. Refresh the feedItems so it parses the new feed alongside existing ones
    // Note: in a real implementation we'd append just the new feed to the items array or refetch
    // For guest mode, we just re-run loadGuestFeeds or we can manually push the parsed items to state.
    // To be cleaner, we can just trigger a manual fetch of just this feed:
    setLoadingFeeds(true);
    try {
      const parsed = await fetchAndParseFeed(newFeed.feedUrl);
      const items = parsed.items.map((item: any) => ({
        id: item.guid || item.id || item.link,
        title: item.title,
        link: item.link,
        pubDate: item.pubDate || item.isoDate,
        contentSnippet: item.contentSnippet || item.content || item.summary,
        sourceFeedTitle: parsed.title || newFeed.title,
        sourceFeedUrl: newFeed.feedUrl,
        isRead: false
      }));

      setFeedItems(prev => {
        const newItems = [...prev, ...items].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
        return newItems;
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingFeeds(false);
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
    <FeedContext.Provider value={{ categories, feedItems, loadingFeeds, refreshFeeds, addFeedToCategory }}>
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
