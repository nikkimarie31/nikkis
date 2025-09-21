import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Check environment variables (without exposing sensitive values)
    const envCheck = {
      AZURE_CLIENT_ID: !!process.env.AZURE_CLIENT_ID,
      AZURE_CLIENT_SECRET: !!process.env.AZURE_CLIENT_SECRET,
      AZURE_TENANT_ID: !!process.env.AZURE_TENANT_ID,
      CONTACT_EMAIL: !!process.env.CONTACT_EMAIL,
      NODE_ENV: process.env.NODE_ENV
    };

    res.status(200).json({
      message: 'Debug endpoint',
      environment: envCheck,
      timestamp: new Date().toISOString()
    });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}