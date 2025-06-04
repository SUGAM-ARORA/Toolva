import { AITool } from '../types';
import { moreAITools } from './moreAITools';
import { extraAITools } from './extraAITools';

export const aiTools: AITool[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000", // Added UUID
    name: 'Stable Diffusion XL Turbo',
    description: 'Ultra-fast image generation with high quality',
    category: 'Image Generation',
    url: 'https://stability.ai',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Pay per use',
    rating: 4.7,
    dailyUsers: '2M+',
    modelType: 'SDXL Turbo',
    easeOfUse: 4.8,
    userExperience: 4.7
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001", // Added UUID
    name: 'Anthropic Claude 3 Haiku',
    description: 'Fast and efficient AI assistant for quick tasks',
    category: 'Chatbots',
    url: 'https://claude.ai',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    pricing: 'Free / $5 monthly',
    rating: 4.5,
    dailyUsers: '4M+',
    modelType: 'Claude 3 Haiku',
    easeOfUse: 4.9,
    userExperience: 4.6
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002", // Added UUID
    name: 'Google Gemini Pro Vision',
    description: 'Advanced AI model for image and text understanding',
    category: 'Chatbots',
    url: 'https://gemini.google.com',
    image: 'https://images.unsplash.com/photo-1685094488371-5ad47f1ad93f',
    pricing: 'Free / $10 monthly',
    rating: 4.7,
    dailyUsers: '2M+',
    modelType: 'Gemini Pro Vision',
    easeOfUse: 4.7,
    userExperience: 4.7
  }
  // ... Rest of the tools array with added UUIDs
];

// Note: You'll need to add unique UUIDs for all tools in the array
// The example shows the pattern for the first few items