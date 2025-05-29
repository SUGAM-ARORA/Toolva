import { ToolCategory } from '../types';
import { aiTools } from './aiTools';
import {
  Bot,
  Image,
  Code,
  Music,
  Video,
  PenTool,
  GraduationCap,
  Briefcase,
  Layout,
  Mic2,
  Globe,
  Cpu,
  LineChart,
  Shield,
  Database,
  Layers,
  Microscope,
  Brain,
  Lightbulb,
  Rocket
} from 'lucide-react';

// Function to get the actual count of tools in each category
const getCategoryCount = (categoryName: string): number => {
  if (categoryName === 'All') {
    return aiTools.length;
  }
  return aiTools.filter(tool => tool.category === categoryName).length;
};

export const categories: ToolCategory[] = [
  {
    name: 'All',
    description: 'Browse all AI tools',
    icon: Brain,
    count: getCategoryCount('All')
  },
  {
    name: 'Chatbots',
    description: 'AI-powered conversational agents',
    icon: Bot,
    count: getCategoryCount('Chatbots')
  },
  {
    name: 'Image Generation',
    description: 'Create and edit images with AI',
    icon: Image,
    count: getCategoryCount('Image Generation')
  },
  {
    name: 'Code',
    description: 'AI-powered development tools',
    icon: Code,
    count: getCategoryCount('Code')
  },
  {
    name: 'Music',
    description: 'AI music creation and processing',
    icon: Music,
    count: getCategoryCount('Music')
  },
  {
    name: 'Video',
    description: 'AI video creation and editing',
    icon: Video,
    count: getCategoryCount('Video')
  },
  {
    name: 'Writing',
    description: 'AI writing and content creation',
    icon: PenTool,
    count: getCategoryCount('Writing')
  },
  {
    name: 'Education',
    description: 'AI-powered learning tools',
    icon: GraduationCap,
    count: getCategoryCount('Education')
  },
  {
    name: 'Business',
    description: 'AI tools for business',
    icon: Briefcase,
    count: getCategoryCount('Business')
  },
  {
    name: 'Design',
    description: 'AI-powered design tools',
    icon: Layout,
    count: getCategoryCount('Design')
  },
  {
    name: 'Audio',
    description: 'AI audio processing tools',
    icon: Mic2,
    count: getCategoryCount('Audio')
  },
  {
    name: 'APIs',
    description: 'AI APIs and integrations',
    icon: Globe,
    count: getCategoryCount('APIs')
  },
  {
    name: 'Machine Learning',
    description: 'ML tools and frameworks',
    icon: Cpu,
    count: getCategoryCount('Machine Learning')
  },
  {
    name: 'Analytics',
    description: 'AI-powered analytics tools',
    icon: LineChart,
    count: getCategoryCount('Analytics')
  },
  {
    name: 'Security',
    description: 'AI security tools',
    icon: Shield,
    count: getCategoryCount('Security')
  },
  {
    name: 'Database',
    description: 'AI-powered databases',
    icon: Database,
    count: getCategoryCount('Database')
  },
  {
    name: 'DevOps',
    description: 'AI tools for DevOps',
    icon: Layers,
    count: getCategoryCount('DevOps')
  },
  {
    name: 'Research',
    description: 'AI research tools',
    icon: Microscope,
    count: getCategoryCount('Research')
  },
  {
    name: 'Productivity',
    description: 'AI productivity tools',
    icon: Lightbulb,
    count: getCategoryCount('Productivity')
  },
  {
    name: 'Startups',
    description: 'AI tools for startups',
    icon: Rocket,
    count: getCategoryCount('Startups')
  }
];