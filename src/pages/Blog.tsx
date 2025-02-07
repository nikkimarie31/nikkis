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
        // Sort posts by date (newest first)
        const sortedPosts = [...data].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setPosts(sortedPosts);
        setError(null);
      })
      .catch((err) => setError(err.message));
  }, []);

  const categories = Array.from(new Set(posts.map((post) => post.category)));

  // Filter posts based on selected category
  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category === selectedCategory)
    : posts;

  // Set the most recent post as featured and the rest as regular posts
  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const remainingPosts = filteredPosts.slice(1);

  if (error) return <div className="text-center text-neonGreen">{error}</div>;
  if (!posts.length) return <div className="text-center text-neonGreen">Loading blog posts...</div>;

  return (
    <main className="bg-gray-900 text-neonGreen px-4 py-8">
      <section className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Blog</h1>

        {/* Category Menu */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
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
        {featuredPost && selectedCategory === null && (
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-4">Featured Post</h2>
            <div className="blog-card">
              <h3 className="text-xl font-semibold">{featuredPost.title}</h3>
              <p className="meta text-gray-400">
                {featuredPost.date} • {featuredPost.readTime} • {featuredPost.author}
              </p>
              <p className="mt-2">{featuredPost.summary}</p>
              <Link to={`/blog/${featuredPost.slug}`} className="text-neonGreen underline mt-4 block">
                Read More
              </Link>
            </div>
          </div>
        )}

        {/* Blog Cards */}
        <div className="blog-card-container">
          {remainingPosts.map((post) => (
            <motion.div
              key={post.slug}
              whileHover={{ scale: 1.05 }}
              className="blog-card"
            >
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="meta text-gray-400">
                {post.date} • {post.readTime} • {post.author}
              </p>
              <p className="mt-2">{post.summary}</p>
              <Link to={`/blog/${post.slug}`} className="text-neonGreen underline">
                Read More
              </Link>
            </motion.div>
          ))}
        </div>

        {/* No Posts Found */}
        {filteredPosts.length === 0 && (
          <div className="text-center text-gray-400 mt-8">No posts found for this category.</div>
        )}
      </section>
    </main>
  );
};

export default Blog;
