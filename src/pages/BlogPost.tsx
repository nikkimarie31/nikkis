import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; 
import { motion } from 'framer-motion';


type BlogPost = {
  slug: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  readTime: string;
  summary: string;
  content: string;
};

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/posts.json')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load posts.');
        return response.json();
      })
      .then((data: BlogPost[]) => {
        const foundPost = data.find((p) => p.slug === slug);
        if (!foundPost) throw new Error('Post not found.');
        setPost(foundPost);
        setError(null);
      })
      .catch((err) => setError(err.message));
  }, [slug]);

  if (error) return <div className="text-center text-neonGreen">{error}</div>;
  if (!post) return <div className="text-center text-neonGreen">Loading blog post...</div>;

  return (
    <motion.main
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 text-neonGreen px-4 py-8"
    >
      <section className="max-w-5xl mx-auto">
        <Link to="/blog" className="text-gray-400 hover:text-neonGreen underline mb-4 block">
          ← Back to Blog
        </Link>
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
        <p className="text-sm text-gray-400 mb-6">
          {post.date} • {post.readTime} • {post.author}
        </p>
        
        <article className="prose prose-lg prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </article>
        
        <div className="mt-8">
          {post.tags.map((tag) => (
            <span key={tag} className="bg-gray-700 text-neonGreen px-3 py-1 rounded-full text-sm mr-2">
              #{tag}
            </span>
          ))}
        </div>
      </section>
    </motion.main>
  );
};

export default BlogPost;
