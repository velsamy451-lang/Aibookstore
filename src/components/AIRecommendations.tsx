import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface AIRecommendation {
  title: string;
  author: string;
  reason: string;
}

export function AIRecommendations() {
  const [interests, setInterests] = useState('');
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getRecommendations = async () => {
    if (!interests.trim()) {
      setError('Please enter your interests');
      return;
    }

    setLoading(true);
    setError('');
    setRecommendations([]);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/book-recommendations`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interests: interests.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError('Failed to get recommendations. Please try again.');
      console.error('Error getting recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-8 h-8 text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-900">AI Book Recommendations</h2>
      </div>
      <p className="text-gray-600 mb-6">
        Tell us about your interests, and our AI will suggest perfect books for you!
      </p>

      <div className="mb-6">
        <textarea
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="E.g., I love science fiction, time travel, and philosophical themes..."
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
        />
      </div>

      <button
        onClick={getRecommendations}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Getting Recommendations...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Get Recommendations
          </>
        )}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Recommended Books for You:
          </h3>
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h4 className="font-bold text-lg text-gray-900 mb-2">
                {rec.title}
              </h4>
              <p className="text-gray-600 mb-2">by {rec.author}</p>
              <p className="text-gray-700 italic">"{rec.reason}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
