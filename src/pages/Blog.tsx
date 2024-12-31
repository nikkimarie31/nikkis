import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Define the type for a blog post
type BlogPost = {
  slug: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  readTime: string;
  summary: string;
};

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]); // State for blog posts
  const [error, setError] = useState<string | null>(null); // State for error messages

  // Fetch blog posts from the JSON file
  useEffect(() => {
    fetch('/posts.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: BlogPost[]) => {
        setPosts(data); // Save posts in state
        setError(null); // Clear errors if successful
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setError('Failed to fetch blog posts.');
      });
  }, []);

  if (error) {
    return <div className="text-center text-neonGreen">{error}</div>;
  }

  if (!posts.length) {
    return <div className="text-center text-neonGreen">Loading blog posts...</div>;
  }

  return (
    <main className="bg-gray-900 text-neonGreen px-4 py-8">
      <section className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Blog</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.slug} className="mb-6 border-b border-gray-700 pb-4">
              <h2 className="text-2xl font-bold">{post.title}</h2>
              <p className="text-sm text-gray-400">{post.date}</p>
              <p className="text-base mb-2">{post.summary}</p>
              <Link
                to={`/blog/${post.slug}`}
                className="text-neonGreen underline hover:text-gray-300"
              >
                Read More
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Blog;
