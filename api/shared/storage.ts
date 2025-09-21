// Shared storage for the application
// In production, this would be replaced with a real database

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'premium_writer' | 'free_writer' | 'reader';
  subscriptionStatus: 'active' | 'trial' | 'cancelled' | 'none';
  subscriptionEnd?: string;
  createdAt: string;
  emailVerified: boolean;
  bio?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  totalPosts: number;
  approvedPosts: number;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  rejectionReason?: string;
  featuredImage?: string;
  readTime: number;
  views: number;
  likes: number;
}

// Global storage
let users: User[] = [];
let blogPosts: BlogPost[] = [];

// User management functions
export const getUsers = (): User[] => users;

export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const addUser = (user: User): void => {
  users.push(user);
};

export const updateUser = (id: string, updates: Partial<User>): User | null => {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return null;

  users[index] = { ...users[index], ...updates };
  return users[index];
};

// Blog post management functions
export const getBlogPosts = (): BlogPost[] => blogPosts;

export const getBlogPostById = (id: string): BlogPost | undefined => {
  return blogPosts.find(post => post.id === id);
};

export const addBlogPost = (post: BlogPost): void => {
  blogPosts.push(post);
};

export const updateBlogPost = (id: string, updates: Partial<BlogPost>): BlogPost | null => {
  const index = blogPosts.findIndex(post => post.id === id);
  if (index === -1) return null;

  blogPosts[index] = { ...blogPosts[index], ...updates };
  return blogPosts[index];
};

export const deleteBlogPost = (id: string): boolean => {
  const index = blogPosts.findIndex(post => post.id === id);
  if (index === -1) return false;

  blogPosts.splice(index, 1);
  return true;
};

export const getBlogPostsByAuthor = (authorId: string): BlogPost[] => {
  return blogPosts.filter(post => post.authorId === authorId);
};

export const getBlogPostsByStatus = (status: BlogPost['status']): BlogPost[] => {
  return blogPosts.filter(post => post.status === status);
};

// Initialize with some demo data
const initializeData = () => {
  // Add admin user if doesn't exist
  if (!getUserByEmail('nicole.eddy@inmyop1nion.com')) {
    addUser({
      id: 'admin_user_1',
      email: 'nicole.eddy@inmyop1nion.com',
      name: 'Nicole Eddy',
      password: '$2a$12$defaultHashedPasswordForAdmin', // This should be properly hashed in production
      role: 'admin',
      subscriptionStatus: 'active',
      createdAt: new Date().toISOString(),
      emailVerified: true,
      totalPosts: 0,
      approvedPosts: 0
    });
  }

  // Add some sample blog posts for testing
  if (blogPosts.length === 0) {
    addBlogPost({
      id: 'sample_post_1',
      title: 'Welcome to InMyOpinion',
      content: 'This is a sample blog post to demonstrate the platform. Users can write, submit, and have their content reviewed before publication.',
      excerpt: 'A sample blog post to demonstrate the platform capabilities.',
      authorId: 'admin_user_1',
      authorName: 'Nicole Eddy',
      status: 'approved',
      tags: ['welcome', 'blogging'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      readTime: 2,
      views: 150,
      likes: 25
    });
  }
};

// Initialize data when the module is imported
initializeData();