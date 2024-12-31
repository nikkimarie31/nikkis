import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Define the type for a blog post
type BlogPost = {
  slug: string;
  title: string;
  content: string;
};

const BlogPost = () => {
  const { slug } = useParams(); // Get slug from URL
  const [post, setPost] = useState<BlogPost | null>(null); // State for the post
  const [error, setError] = useState<string | null>(null); // State for error handling

  useEffect(() => {
    // Fetch data from posts.json
    fetch('/posts.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: BlogPost[]) => {
        const foundPost = data.find((p: BlogPost) => p.slug === slug);
        if (!foundPost) {
          throw new Error('Post not found');
        }
        setPost(foundPost); // Save post in state
        setError(null); // Clear errors if successful
      })
      .catch((error) => {
        console.error('Error fetching post:', error);
        setError('Failed to load blog post.');
      });
  }, [slug]);

  if (error) {
    return <div className="text-center text-neonGreen">{error}</div>;
  }

  if (!post) {
    return <div className="text-center text-neonGreen">Loading blog post...</div>;
  }

  return (
    <main className="bg-gray-900 text-neonGreen px-4 py-8">
      <section className="max-w-4xl mx-auto">
        <Link to="/blog" className="text-gray-400 hover:text-neonGreen underline mb-4 block">
          ← Back to Blog
        </Link>
        <h1 className="text-4xl font-bold mb-6 neon-title">{post.title}</h1>
        <div
          className="prose prose-lg prose-invert"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </section>
    </main>
  );
};

export default BlogPost;
