import Fuse from 'fuse.js';

export interface SearchOptions<T> {
  keys: Array<keyof T | string>;
  threshold?: number;
  includeScore?: boolean;
  minMatchCharLength?: number;
  ignoreLocation?: boolean;
}

/**
 * Client-side search utility using Fuse.js for fuzzy matching
 * Replaces server-side AI search with fast, client-side fuzzy search
 */
export class ClientSearch<T> {
  private fuse: Fuse<T>;
  private data: T[];

  constructor(data: T[], options: SearchOptions<T>) {
    this.data = data;
    
    // Configure Fuse.js with sensible defaults for fuzzy matching
    const fuseOptions = {
      keys: options.keys as string[],
      threshold: options.threshold ?? 0.3, // 0 = exact match, 1 = match anything
      includeScore: options.includeScore ?? false,
      minMatchCharLength: options.minMatchCharLength ?? 2,
      ignoreLocation: options.ignoreLocation ?? true, // Don't care where in the string the match is
      useExtendedSearch: false,
      findAllMatches: true,
    };

    this.fuse = new Fuse(data, fuseOptions);
  }

  /**
   * Search for items matching the query
   * @param query - Search query string
   * @returns Array of matching items
   */
  search(query: string): T[] {
    if (!query || query.trim().length === 0) {
      return this.data;
    }

    const results = this.fuse.search(query);
    return results.map((result: any) => result.item);
  }

  /**
   * Update the search data
   * @param newData - New data to search through
   */
  updateData(newData: T[]): void {
    this.data = newData;
    this.fuse.setCollection(newData);
  }

  /**
   * Get all data without filtering
   * @returns All data items
   */
  getAllData(): T[] {
    return this.data;
  }
}

/**
 * Create a search instance for questions
 * Configured specifically for interview/scenario/live/community questions
 */
export function createQuestionSearch<T extends { question: string; answer?: string; author?: string }>(
  questions: T[]
): ClientSearch<T> {
  return new ClientSearch(questions, {
    keys: ['question', 'answer', 'author'],
    threshold: 0.3,
    minMatchCharLength: 2,
    ignoreLocation: true,
  });
}
