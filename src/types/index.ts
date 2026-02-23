import type { Book } from '../lib/database.types';

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface AIRecommendation {
  title: string;
  author: string;
  reason: string;
}
