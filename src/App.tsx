import { useState, useEffect } from 'react';
import { Search, ShoppingCart as CartIcon, BookOpen } from 'lucide-react';
import { supabase } from './lib/supabase';
import type { Book, Category } from './lib/database.types';
import { CartProvider, useCart } from './context/CartContext';
import { BookCard } from './components/BookCard';
import { ShoppingCart } from './components/ShoppingCart';
import { AIRecommendations } from './components/AIRecommendations';

function BookStoreContent() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { getTotalItems } = useCart();

  useEffect(() => {
    fetchCategories();
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching books:', error);
    } else {
      setBooks(data || []);
    }
    setLoading(false);
  };

  const filterBooks = () => {
    let filtered = books;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (book) => book.category_id === selectedCategory
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.description?.toLowerCase().includes(query)
      );
    }

    setFilteredBooks(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">BookStore AI</h1>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <CartIcon className="w-5 h-5" />
              <span>Cart</span>
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <AIRecommendations />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search books by title, author, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Books
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading books...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No books found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </main>

      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <BookStoreContent />
    </CartProvider>
  );
}

export default App;
