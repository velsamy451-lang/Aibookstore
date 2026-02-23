import { Star, ShoppingCart } from 'lucide-react';
import type { Book } from '../lib/database.types';
import { useCart } from '../context/CartContext';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-64 bg-gray-200">
        {book.image_url ? (
          <img
            src={book.image_url}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
        {book.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {book.description}
          </p>
        )}
        <div className="flex items-center mb-3">
          {book.rating && (
            <>
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 text-sm text-gray-700">{book.rating}</span>
            </>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            ${book.price.toFixed(2)}
          </span>
          <button
            onClick={() => addToCart(book)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
