import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  interests: string;
}

interface Recommendation {
  title: string;
  author: string;
  reason: string;
}

function generateRecommendations(interests: string): Recommendation[] {
  const lowerInterests = interests.toLowerCase();
  const recommendations: Recommendation[] = [];

  const bookDatabase = [
    {
      title: "Dune",
      author: "Frank Herbert",
      keywords: ["science fiction", "sci-fi", "space", "politics", "desert", "epic"],
      reason: "An epic science fiction masterpiece with complex political intrigue and world-building",
    },
    {
      title: "1984",
      author: "George Orwell",
      keywords: ["dystopian", "political", "philosophy", "surveillance", "totalitarian"],
      reason: "A powerful exploration of totalitarianism and the nature of truth",
    },
    {
      title: "The Hitchhiker's Guide to the Galaxy",
      author: "Douglas Adams",
      keywords: ["science fiction", "humor", "comedy", "space", "adventure"],
      reason: "A hilarious and absurd journey through space with philosophical undertones",
    },
    {
      title: "Sapiens",
      author: "Yuval Noah Harari",
      keywords: ["history", "philosophy", "humanity", "evolution", "anthropology", "non-fiction"],
      reason: "A fascinating exploration of human history and our place in the universe",
    },
    {
      title: "The Time Machine",
      author: "H.G. Wells",
      keywords: ["time travel", "science fiction", "classic", "adventure"],
      reason: "A classic time travel story that explores the future of humanity",
    },
    {
      title: "Foundation",
      author: "Isaac Asimov",
      keywords: ["science fiction", "space", "empire", "mathematics", "epic"],
      reason: "An epic tale of a galactic empire's fall and rebirth through psychohistory",
    },
    {
      title: "Brave New World",
      author: "Aldous Huxley",
      keywords: ["dystopian", "philosophy", "society", "technology"],
      reason: "A thought-provoking examination of a technologically advanced dystopia",
    },
    {
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      keywords: ["fantasy", "adventure", "epic", "magic", "quest"],
      reason: "The ultimate high fantasy epic with rich world-building and heroic quests",
    },
    {
      title: "Neuromancer",
      author: "William Gibson",
      keywords: ["cyberpunk", "technology", "hacker", "ai", "virtual reality"],
      reason: "A groundbreaking cyberpunk novel that defined the genre",
    },
    {
      title: "The Martian",
      author: "Andy Weir",
      keywords: ["science fiction", "space", "survival", "science", "humor"],
      reason: "A thrilling survival story with hard science and humor",
    },
    {
      title: "Ready Player One",
      author: "Ernest Cline",
      keywords: ["science fiction", "virtual reality", "gaming", "adventure", "dystopian"],
      reason: "An exciting adventure through virtual reality and pop culture",
    },
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      keywords: ["philosophy", "adventure", "spiritual", "self-discovery"],
      reason: "An inspiring tale about following your dreams and personal legend",
    },
    {
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      keywords: ["psychology", "decision-making", "non-fiction", "science"],
      reason: "A fascinating exploration of how we think and make decisions",
    },
    {
      title: "The Three-Body Problem",
      author: "Liu Cixin",
      keywords: ["science fiction", "physics", "aliens", "china", "hard sci-fi"],
      reason: "A mind-bending hard science fiction novel with innovative concepts",
    },
  ];

  for (const book of bookDatabase) {
    const matchScore = book.keywords.filter(keyword =>
      lowerInterests.includes(keyword)
    ).length;

    if (matchScore > 0) {
      recommendations.push({
        title: book.title,
        author: book.author,
        reason: book.reason,
      });
    }
  }

  if (recommendations.length === 0) {
    return [
      {
        title: "The Midnight Library",
        author: "Matt Haig",
        reason: "A beautiful exploration of life's infinite possibilities and second chances",
      },
      {
        title: "Atomic Habits",
        author: "James Clear",
        reason: "A practical guide to building good habits and breaking bad ones",
      },
      {
        title: "Project Hail Mary",
        author: "Andy Weir",
        reason: "An exciting science fiction adventure with humor and heart",
      },
    ];
  }

  return recommendations.slice(0, 5);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { interests }: RequestBody = await req.json();

    if (!interests || typeof interests !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid request: interests is required' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const recommendations = generateRecommendations(interests);

    return new Response(
      JSON.stringify({ recommendations }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
