// @ts-ignore
import Parser from 'rss-parser/dist/rss-parser.min.js';

// Define the shape of our internal Feed Item
export interface FeedItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  sourceFeedTitle: string;
  sourceFeedUrl: string;
  isRead: boolean;
}

export interface FeedSource {
  title: string;
  feedUrl: string;
  siteUrl?: string;
  description?: string;
}

// We use corsproxy.io to bypass browser CORS constraints when fetching directly from client
const CORS_PROXY = "https://corsproxy.io/?";

const parser = new Parser({
  customFields: {
    item: ['media:content', 'media:thumbnail']
  }
});

export async function fetchAndParseFeed(feedUrl: string): Promise<any> {
    try {
        const response = await fetch(`${CORS_PROXY}${encodeURIComponent(feedUrl)}`);
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        
        const xmlData = await response.text();
        const parsedData = await parser.parseString(xmlData);
        
        return parsedData;
    } catch (error) {
        console.error(`Failed to fetch or parse feed: ${feedUrl}`, error);
        throw error;
    }
}
