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
    id: 'b6f3a91d-8c2e-4e73-a54b-0d9f1267c842',
    name: 'GPTGeminiGrok.AI',
    description: 'Browser workspace for multi-model AI chat, image generation, and file analysis',
    category: 'Chatbots',
    url: 'https://trygrokai.asia/',
    image: 'https://trygrokai.asia/app/logo.png',
    pricing: 'Freemium - 10 requests/day',
    rating: 0,
    dailyUsers: 'N/A',
    modelType: 'Multi-model AI',
    easeOfUse: 'N/A',
    userExperience: 'N/A'
  }
  // Note: For brevity, I'm showing just the first two items. 
  // You should add unique UUIDs to ALL items in your actual file
];