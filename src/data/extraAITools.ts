import { AITool } from '../types';

export const extraAITools: AITool[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: 'Jasper',
    description: 'AI content writing and marketing copy generation platform',
    category: 'Content Creation',
    url: 'https://www.jasper.ai',
    image: 'https://images.unsplash.com/photo-1687163155606-e769e7232c37',
    pricing: 'From $39/month',
    rating: 4.8,
    dailyUsers: '500K+',
    modelType: 'Custom GPT',
    easeOfUse: 4.7,
    userExperience: 4.8
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    name: 'Copy.ai',
    description: 'AI copywriting tool for marketing and content creation',
    category: 'Content Creation',
    url: 'https://www.copy.ai',
    image: 'https://images.unsplash.com/photo-1687163155606-e769e7232c37',
    pricing: 'Free / Premium',
    rating: 4.7,
    dailyUsers: '400K+',
    modelType: 'Custom GPT',
    easeOfUse: 4.8,
    userExperience: 4.7
  },
  {
    id: "83c6f7e4-7312-4fd4-a79a-5a7a5fdf6e0b",
    name: 'LandscapioAI',
    description: 'AI landscape design platform for creating outdoor space concepts and visualizations',
    category: 'Design',
    url: 'https://www.landscapioai.com/',
    image: 'https://www.landscapioai.com/favicon.ico',
    pricing: 'Free / Premium',
    rating: 4.7,
    dailyUsers: '10K+',
    modelType: 'Computer Vision',
    easeOfUse: 4.8,
    userExperience: 4.7
  }
  // Note: For brevity, I'm showing just the first two items. 
  // You should add unique UUIDs to ALL items in your actual file
];