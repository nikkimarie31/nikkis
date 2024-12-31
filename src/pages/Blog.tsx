import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/posts.json')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load posts.');
        return response.json();
      })
      .then((data: BlogPost[]) => {
        setPosts(data);
        setError(null);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="text-center text-neonGreen">{error}</div>;
  if (!posts.length) return <div className="text-center text-neonGreen">Loading blog posts...</div>;

  return (
    <main className="bg-gray-900 text-neonGreen px-4 py-8">
      <section className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Blog</h1>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug} className="bg-darkGray rounded-lg overflow-hidden shadow-lg">
      
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                <p className="text-sm text-gray-400">
                  {post.date} • {post.readTime} • {post.author}
                </p>
                <p className="text-base my-2">{post.summary}</p>
                <Link to={`/blog/${post.slug}`} className="text-neonGreen underline hover:text-gray-300">
                  Read More
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Blog;
