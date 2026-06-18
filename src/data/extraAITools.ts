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
    id: "550e8400-e29b-41d4-a716-446655440099",
    name: 'Roblox GUI Maker',
    description: 'Free AI planning tool for Roblox Studio ScreenGui layouts, HUDs, menus, and Lua starter code ideas',
    category: 'Code',
    url: 'https://robloxguimaker.dev/',
    image: 'https://res.cloudinary.com/dqp362rzh/image/upload/v1781751810/bihytjivjlx3d4fd50jy.png',
    pricing: 'Free',
    rating: 4.7,
    dailyUsers: 'New',
    modelType: 'AI UI Planning',
    easeOfUse: 4.8,
    codeQuality: 4.6,
    userExperience: 4.7
  }
  // Additional community-submitted tools can be appended here with unique UUIDs.
];
