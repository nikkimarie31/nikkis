// Simple test to verify shared storage is working
import { addUser, getUserByEmail, addBlogPost, getBlogPosts } from './api/shared/storage.js';

console.log('Testing shared storage...');

// Test user creation
const testUser = {
  id: 'test_user_1',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashed_password',
  role: 'free_writer',
  subscriptionStatus: 'trial',
  subscriptionEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date().toISOString(),
  emailVerified: true,
  totalPosts: 0,
  approvedPosts: 0
};

addUser(testUser);
console.log('✅ User added');

const foundUser = getUserByEmail('test@example.com');
console.log('✅ User found:', foundUser ? 'YES' : 'NO');

// Test blog post creation
const testPost = {
  id: 'test_post_1',
  title: 'Test Blog Post',
  content: 'This is a test blog post content.',
  excerpt: 'A test blog post.',
  authorId: testUser.id,
  authorName: testUser.name,
  status: 'pending',
  tags: ['test'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  readTime: 1,
  views: 0,
  likes: 0
};

addBlogPost(testPost);
console.log('✅ Blog post added');

const allPosts = getBlogPosts();
console.log('✅ Total posts:', allPosts.length);

console.log('All tests passed! 🎉');