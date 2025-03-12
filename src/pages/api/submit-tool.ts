import { NextApiRequest, NextApiResponse } from 'next';
import { ToolSubmission } from '../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const submission = req.body as ToolSubmission;

    // Validate the submission
    if (!submission.name || !submission.description || !submission.url || !submission.category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send notification email
    // 3. Queue for review
    
    // For now, we'll just simulate a successful submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    return res.status(200).json({ 
      message: 'Tool submitted successfully',
      submission 
    });
  } catch (error) {
    console.error('Error submitting tool:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 