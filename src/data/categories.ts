import { ToolCategory } from '../types';
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

export const categories: ToolCategory[] = [
  {
    name: 'All',
    description: 'Browse all AI tools',
    icon: Brain,
    count: 300
  },
  {
    name: 'Chatbots',
    description: 'AI-powered conversational agents',
    icon: Bot,
    count: 45
  },
  {
    name: 'Image Generation',
    description: 'Create and edit images with AI',
    icon: Image,
    count: 35
  },
  {
    name: 'Code',
    description: 'AI-powered development tools',
    icon: Code,
    count: 40
  },
  {
    name: 'Music',
    description: 'AI music creation and processing',
    icon: Music,
    count: 20
  },
  {
    name: 'Video',
    description: 'AI video creation and editing',
    icon: Video,
    count: 25
  },
  {
    name: 'Writing',
    description: 'AI writing and content creation',
    icon: PenTool,
    count: 30
  },
  {
    name: 'Education',
    description: 'AI-powered learning tools',
    icon: GraduationCap,
    count: 15
  },
  {
    name: 'Business',
    description: 'AI tools for business',
    icon: Briefcase,
    count: 25
  },
  {
    name: 'Design',
    description: 'AI-powered design tools',
    icon: Layout,
    count: 20
  },
  {
    name: 'Audio',
    description: 'AI audio processing tools',
    icon: Mic2,
    count: 15
  },
  {
    name: 'APIs',
    description: 'AI APIs and integrations',
    icon: Globe,
    count: 30
  },
  {
    name: 'Machine Learning',
    description: 'ML tools and frameworks',
    icon: Cpu,
    count: 20
  },
  {
    name: 'Analytics',
    description: 'AI-powered analytics tools',
    icon: LineChart,
    count: 15
  },
  {
    name: 'Security',
    description: 'AI security tools',
    icon: Shield,
    count: 10
  },
  {
    name: 'Database',
    description: 'AI-powered databases',
    icon: Database,
    count: 10
  },
  {
    name: 'DevOps',
    description: 'AI tools for DevOps',
    icon: Layers,
    count: 15
  },
  {
    name: 'Research',
    description: 'AI research tools',
    icon: Microscope,
    count: 10
  },
  {
    name: 'Productivity',
    description: 'AI productivity tools',
    icon: Lightbulb,
    count: 20
  },
  {
    name: 'Startups',
    description: 'AI tools for startups',
    icon: Rocket,
    count: 15
  }
];