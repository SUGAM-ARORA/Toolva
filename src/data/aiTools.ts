import { AITool } from '../types';
import { moreAITools } from './moreAITools';
import { extraAITools } from './extraAITools';

const baseTools: AITool[] = [
  // Unrated submission: rating 0 is a placeholder pending editorial review.
  {
    "id": "c6683f9e-1b58-4dc2-9d6d-35117f026a35",
    "name": "만화 번역기 AI",
    "description": "만화 번역기 AI는 Ficory LLC가 제공하는 기업용 만화 리더이자 AI 만화 번역기로, 만화 이미지의 글자를 인식하고 대사를 번역한 뒤 원문을 지우고 번역문을 배치한 이미지를 제공합니다. 이 서비스는 100개 이상의 언어를 지원하며, 개인 사용자가 여러 페이지를 일괄 번역하고 번역 설정을 조정할 수 있도록 돕습니다. 스튜디오 사용자는 Photoshop과 유사한 완전한 온라인 편집기에서 대사, 글꼴, 색상, 텍스트 상자와 페이지 배치를 직접 수정할 수 있습니다. 개발자와 기업 팀은 API를 개인 또는 팀의 기존 작업 흐름에 연결하여 이미지 배치를 제출하고 번역 작업 상태를 조회할 수 있습니다. 사용자는 제한된 무료 크레딧으로 기능을 시험하고, 추가 사용량에 크레딧 팩이나 구독을 선택할 수 있습니다.",
    "category": "Design",
    "url": "https://www.mangatranslate.com/ko/ai-manga-translator/",
    "image": "https://www.mangatranslate.com/static/manga_translate/images/x_er.hero.webp?v=257",
    "pricing": "Limited free credits / Paid credit packs and subscriptions",
    "rating": 0,
    "dailyUsers": "Not publicly disclosed",
    "modelType": "Manga / Ultra / EagleEye",
    "easeOfUse": "Not reviewed",
    "userExperience": "Not reviewed",
    "featured": false
  },

  {
    id: "550e8400-e29b-41d4-a716-446655440000",
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
    id: "550e8400-e29b-41d4-a716-446655440001",
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
    id: "550e8400-e29b-41d4-a716-446655440002",
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
];

import { awesomeToolsData } from './awesomeToolsData';

// Combine all tools into one array
export const aiTools: AITool[] = [...baseTools, ...moreAITools, ...extraAITools, ...awesomeToolsData];
