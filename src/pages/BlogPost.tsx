import { useParams } from 'react-router-dom';

const BlogPost = () => {
  const { slug } = useParams(); // Get the slug from the URL.

  const posts = [
    {
      slug: "react-tips-and-tricks",
      title: "React Tips and Tricks",
      content:  `
      React is a powerful tool for building dynamic web applications. In this post, we'll explore advanced tips and tricks to elevate your React skills:
            
      ### Optimize Component Re-Renders
      Prevent unnecessary re-renders with \`React.memo\` for functional components or \`PureComponent\` for class components. This ensures better performance.
      
      ### Utilize Custom Hooks
      Custom hooks simplify complex logic. Create reusable hooks like \`useFetch\` or \`useDebounce\` to streamline your workflow.
      
      ### Lazy Loading
      Enhance performance with code-splitting. Use \`React.lazy\` and \`Suspense\` for on-demand loading of components.
            `,
    },
    {
      slug: "building-responsive-websites",
      title: "Building Responsive Websites",
      content:  `
Responsiveness is key in modern web design. Learn how to make your website adaptable for all screen sizes:

### CSS Frameworks and Grid Systems
Frameworks like Tailwind CSS or Bootstrap simplify responsive design. Use grid systems and utility classes effectively.

### Media Queries
Media queries allow custom styling based on screen size. Target breakpoints to achieve a fluid layout.

### Flexible Units
Use relative units like \`em\`, \`rem\`, and percentages instead of fixed \`px\` values to ensure elements resize proportionally.
      `,
    },
    {
        slug: "accessing-the-web",
        title: "Accessing The Web",
        content: `
The web is a vast resource of information. Discover how browsers fetch content, interpret it, and display websites.

### How Browsers Work
Understand the role of HTML, CSS, and JavaScript in rendering web pages. Learn how DOM manipulation affects performance.

### Web Accessibility
Incorporate accessibility features like alt text, ARIA labels, and semantic HTML to make your site inclusive.
      `,
      },
      {
        slug: "dark-web-purchases",
        title: "Dark Web Purchases",
        content: `
The dark web is a hidden layer of the internet. While intriguing, engaging in dark web purchases carries risks:

### Understanding the Dark Web
Learn about the Tor network and onion routing that powers the dark web. Discover how anonymity is maintained.

### Risks and Ethical Considerations
Be aware of legal and security risks. Many activities are illegal, and transactions often lack buyer protection.

### Alternatives to Explore
Consider ethical and legitimate ways to learn about cybersecurity and privacy without engaging in illegal activities.
      `,
      },
      {
        slug: "dating-a-narcissist",
        title: "Dating A Narcissist",
        content: `
        Being in a relationship with a narcissist can be emotionally draining. Here are signs, challenges, and tips for coping:
        
        ### Recognizing the Signs
        Understand patterns of manipulation, lack of empathy, and excessive need for admiration.
        
        ### Setting Boundaries
        Learn the importance of asserting boundaries to protect your mental health.
        
        ### Seeking Support
        Connect with therapists or support groups to navigate and heal from a toxic relationship.
              `,
      },
  ];

  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return <div className="text-center mt-10 text-neon-green">Post Not Found</div>;
  }

  return (
    <main className="bg-gray-900 text-neon-green px-4 py-8">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p>{post.content}</p>
      </section>
    </main>
  );
};

export default BlogPost;
