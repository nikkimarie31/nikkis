import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

type BlogPost = {
  slug: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  readTime: string;
  category: string;
  summary: string;
};

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const categories = Array.from(new Set(posts.map((post) => post.category)));

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category === selectedCategory)
    : posts;

  if (error) return <div className="text-center text-neonGreen">{error}</div>;
  if (!posts.length) return <div className="text-center text-neonGreen">Loading blog posts...</div>;

  return (
    <main className="bg-gray-900 text-neonGreen px-4 py-8">
      <section className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Blog</h1>

        {/* Category Menu */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg ${
              !selectedCategory ? 'bg-neonGreen text-darkGray' : 'bg-gray-800'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === category ? 'bg-neonGreen text-darkGray' : 'bg-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-4">Featured Post</h2>
            <div className="bg-darkGray p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow">
              <h3 className="text-2xl font-semibold">{filteredPosts[0]?.title}</h3>
              <p className="text-sm text-gray-400">
                {filteredPosts[0]?.date} • {filteredPosts[0]?.readTime} • {filteredPosts[0]?.author}
              </p>
              <p className="mt-4 text-base">{filteredPosts[0]?.summary}</p>
              <Link
                to={`/blog/${filteredPosts[0]?.slug}`}
                className="text-neonGreen underline mt-4 block"
              >
                Read More
              </Link>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.slice(1).map((post) => (
            <motion.li
              key={post.slug}
              whileHover={{ scale: 1.05 }}
              className="bg-darkGray rounded-lg overflow-hidden shadow-lg"
            >
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
            </motion.li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Blog;
