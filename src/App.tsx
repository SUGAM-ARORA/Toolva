import React, { useState, useEffect } from 'react';
import { Search, Sparkles, MessageSquare, Image, Code2, Music, Video, PenTool, BookOpen, Briefcase, LayoutGrid, Star, Heart, LogIn, LogOut, Menu, Zap, Globe, Database, Cpu, Cloud, Palette, FileCode, Headphones, Camera, Keyboard, Microscope, Share2, Gauge, Trophy, Gamepad, List } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { Toaster, toast } from 'react-hot-toast';
import AuthModal from './components/AuthModal';
import ThemeToggle from './components/ThemeToggle';
import Sidebar from './components/Sidebar';
import ToolFinder from './components/ToolFinder';
import CompareTools from './components/CompareTools';
import ToolCard from './components/ToolCard';
import SubmitTool from './components/SubmitTool';
import { AITool, ToolCategory } from './types';

export const categories: ToolCategory[] = [
  { name: 'All', icon: LayoutGrid, description: 'All AI tools', count: 0 },
  { name: 'Chatbots', icon: MessageSquare, description: 'AI chatbots and conversational agents', count: 0 },
  { name: 'Image Generation', icon: Image, description: 'AI image generation and editing tools', count: 0 },
  { name: 'Code', icon: Code2, description: 'AI coding and development tools', count: 0 },
  { name: 'Music', icon: Music, description: 'AI music generation and audio tools', count: 0 },
  { name: 'Video', icon: Video, description: 'AI video creation and editing tools', count: 0 },
  { name: 'Writing', icon: PenTool, description: 'AI writing and content generation tools', count: 0 },
  { name: 'Education', icon: BookOpen, description: 'AI education and learning tools', count: 0 },
  { name: 'Business', icon: Briefcase, description: 'AI business and productivity tools', count: 0 },
  { name: 'APIs', icon: Cloud, description: 'AI APIs and services', count: 0 },
  { name: 'Research', icon: Microscope, description: 'AI research and analysis tools', count: 0 },
  { name: 'Design', icon: Palette, description: 'AI design and creative tools', count: 0 },
  { name: 'Gaming', icon: Gamepad, description: 'AI gaming and entertainment tools', count: 0 },
  { name: 'Analytics', icon: Gauge, description: 'AI analytics and data tools', count: 0 },
  { name: 'Audio', icon: Headphones, description: 'AI audio processing tools', count: 0 },
  { name: '3D', icon: Database, description: 'AI 3D modeling and rendering tools', count: 0 },
  { name: 'Marketing', icon: Share2, description: 'AI marketing and advertising tools', count: 0 },
  { name: 'Productivity', icon: Zap, description: 'AI productivity and automation tools', count: 0 }
];

const existingTools: AITool[] = [
  {
    name: 'ChatGPT',
    description: 'Advanced language model for conversation and text generation',
    category: 'Chatbots',
    url: 'https://chat.openai.com',
    image: 'https://images.unsplash.com/photo-1676299081847-c3c9b2d93517',
    pricing: 'Free / $20 monthly',
    rating: 4.8,
    featured: true,
    dailyUsers: '100M+',
    modelType: 'GPT-4',
    easeOfUse: 5,
    codeQuality: 4.5,
    userExperience: 4.8
  },
  {
    name: 'Google Gemini',
    description: 'Next-generation AI model with advanced reasoning capabilities',
    category: 'Chatbots',
    url: 'https://gemini.google.com',
    image: 'https://images.unsplash.com/photo-1685094488371-5ad47f1ad93f',
    pricing: 'Free / $10 monthly',
    rating: 4.7,
    featured: true,
    dailyUsers: '50M+',
    modelType: 'Gemini Ultra',
    easeOfUse: 4.8,
    codeQuality: 4.7,
    userExperience: 4.6
  },
  {
    name: 'DeepSeek',
    description: 'Advanced coding assistant with deep understanding of software development',
    category: 'Code',
    url: 'https://deepseek.ai',
    image: 'https://images.unsplash.com/photo-1687163155606-e769e7232c37',
    pricing: 'Free Beta',
    rating: 4.6,
    featured: true,
    dailyUsers: '1M+',
    modelType: 'DeepSeek Coder',
    easeOfUse: 4.5,
    codeQuality: 4.9,
    userExperience: 4.7
  },
  {
    name: 'Anthropic Claude',
    description: 'Advanced AI assistant for analysis and content creation',
    category: 'Chatbots',
    url: 'https://claude.ai',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    pricing: 'Free / $20 monthly',
    rating: 4.7,
    featured: true,
    dailyUsers: '10M+',
    modelType: 'Claude 3',
    easeOfUse: 4.6,
    codeQuality: 4.8,
    userExperience: 4.7
  },
  {
    name: 'Midjourney',
    description: 'Create stunning artwork using AI',
    category: 'Image Generation',
    url: 'https://www.midjourney.com',
    image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714',
    pricing: 'From $10 monthly',
    rating: 4.8,
    featured: true,
    dailyUsers: '15M+',
    modelType: 'MJ v6',
    easeOfUse: 4.3,
    codeQuality: 'N/A',
    userExperience: 4.8
  },
  {
    name: 'Stable Diffusion XL',
    description: 'Advanced image generation with high-quality outputs',
    category: 'Image Generation',
    url: 'https://stability.ai',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free / $10 monthly',
    rating: 4.7,
    featured: true,
    dailyUsers: '5M+',
    modelType: 'SDXL',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'GitHub Copilot',
    description: 'AI pair programmer for code completion and suggestions',
    category: 'Code',
    url: 'https://github.com/features/copilot',
    image: 'https://images.unsplash.com/photo-1687163155606-e769e7232c37',
    pricing: 'Free / $10 monthly',
    rating: 4.8,
    featured: true,
    dailyUsers: '2M+',
    modelType: 'Codex',
    easeOfUse: 4.9,
    codeQuality: 4.8,
    userExperience: 4.7
  }
];

const additionalTools: AITool[] = [
  {
    name: 'PydanticAI',
    description: 'Python agent framework for production-grade Generative AI applications',
    category: 'Code',
    url: 'https://ai.pydantic.dev',
    github: 'https://github.com/pydantic/pydantic-ai',
    image: 'https://images.unsplash.com/photo-1687163155606-e769e7232c37',
    pricing: 'Free / Open Source',
    rating: 4.6,
    dailyUsers: '100K+',
    modelType: 'Custom',
    easeOfUse: 4.4,
    codeQuality: 4.8,
    userExperience: 4.5
  },
  {
    name: 'Pipecat Flows',
    description: 'Open source Voice AI agent builder',
    category: 'APIs',
    url: 'https://flows.pipecat.ai',
    github: 'https://github.com/pipecat-ai/pipecat',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    pricing: 'Free / Open Source',
    rating: 4.5,
    dailyUsers: '50K+',
    modelType: 'Various',
    easeOfUse: 4.3,
    codeQuality: 4.7,
    userExperience: 4.4
  },
  {
    name: 'Hyperwrite',
    description: 'AI writer for content generation, research, and more',
    category: 'Writing',
    url: 'https://www.hyperwriteai.com',
    image: 'https://images.unsplash.com/photo-1686191128892-3b37add4c844',
    pricing: 'Free / Premium',
    rating: 4.6,
    dailyUsers: '1M+',
    modelType: 'Custom GPT',
    easeOfUse: 4.8,
    codeQuality: 'N/A',
    userExperience: 4.7
  },
  {
    name: 'Mubert',
    description: 'AI-powered music generation and streaming platform',
    category: 'Music',
    url: 'https://mubert.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free / $9 monthly',
    rating: 4.5,
    dailyUsers: '500K+',
    modelType: 'Music Gen',
    easeOfUse: 4.6,
    userExperience: 4.5
  },
  {
    name: 'Descript',
    description: 'AI-powered video and audio editing platform',
    category: 'Video',
    url: 'https://www.descript.com',
    image: 'https://images.unsplash.com/photo-1682687221073-53ad74c2cad7',
    pricing: 'From $15/month',
    rating: 4.7,
    dailyUsers: '1M+',
    modelType: 'Video Gen',
    easeOfUse: 4.8,
    userExperience: 4.7
  },
  {
    name: 'AI Tool 1',
    description: 'Description for AI Tool 1',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 2',
    description: 'Description for AI Tool 2',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 3',
    description: 'Description for AI Tool 3',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 4',
    description: 'Description for AI Tool 4',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 5',
    description: 'Description for AI Tool 5',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 6',
    description: 'Description for AI Tool 6',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 7',
    description: 'Description for AI Tool 7',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 8',
    description: 'Description for AI Tool 8',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 9',
    description: 'Description for AI Tool 9',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 10',
    description: 'Description for AI Tool 10',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 11',
    description: 'Description for AI Tool 11',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 12',
    description: 'Description for AI Tool 12',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 13',
    description: 'Description for AI Tool 13',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 14',
    description: 'Description for AI Tool 14',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 15',
    description: 'Description for AI Tool 15',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 16',
    description: 'Description for AI Tool 16',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 17',
    description: 'Description for AI Tool 17',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 18',
    description: 'Description for AI Tool 18',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 19',
    description: 'Description for AI Tool 19',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 20',
    description: 'Description for AI Tool 20',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 21',
    description: 'Description for AI Tool 21',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 22',
    description: 'Description for AI Tool 22',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 23',
    description: 'Description for AI Tool 23',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 24',
    description: 'Description for AI Tool 24',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 25',
    description: 'Description for AI Tool 25',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 26',
    description: 'Description for AI Tool 26',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 27',
    description: 'Description for AI Tool 27',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 28',
    description: 'Description for AI Tool 28',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 29',
    description: 'Description for AI Tool 29',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 30',
    description: 'Description for AI Tool 30',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 31',
    description: 'Description for AI Tool 31',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Openapp AI',
    description: 'Napkin AI - for text to diagrams',
    category: 'Design',
    url: 'https://openapp.ai',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Figma',
    description: 'For designing',
    category: 'Design',
    url: 'https://www.figma.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free / Premium',
    rating: 4.7,
    dailyUsers: '1M+',
    modelType: 'Design Tool',
    easeOfUse: 4.8,
    userExperience: 4.7
  },
  {
    name: 'Relume',
    description: 'Wireframe tool',
    category: 'Design',
    url: 'https://relume.io',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.6,
    dailyUsers: '500K+',
    modelType: 'Wireframe Tool',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Langflow',
    description: 'AI tool for language processing',
    category: 'APIs',
    url: 'https://langflow.ai',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Language Processing',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Lovable',
    description: 'AI tool for creating lovable designs',
    category: 'Design',
    url: 'https://lovable.ai',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Design Tool',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Bolt New',
    description: 'AI tool for rapid prototyping',
    category: 'Productivity',
    url: 'https://boltnew.ai',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Prototyping Tool',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Hugging Face',
    description: 'API that gives 1000s of ML models',
    category: 'APIs',
    url: 'https://huggingface.co',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.8,
    dailyUsers: '1M+',
    modelType: 'ML Models',
    easeOfUse: 4.7,
    userExperience: 4.8
  },
  {
    name: 'AssemblyAI',
    description: '416 free hours of speech to text',
    category: 'APIs',
    url: 'https://assemblyai.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.6,
    dailyUsers: '500K+',
    modelType: 'Speech to Text',
    easeOfUse: 4.6,
    userExperience: 4.7
  },
  {
    name: 'Eden AI',
    description: 'Access to multiple AIs',
    category: 'APIs',
    url: 'https://edenai.co',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'AI Access',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Abacus AI',
    description: 'AI tool for data science and machine learning',
    category: 'APIs',
    url: 'https://abacus.ai',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.7,
    dailyUsers: '200K+',
    modelType: 'Data Science',
    easeOfUse: 4.6,
    userExperience: 4.7
  },
  {
    name: 'Cursor AI',
    description: 'AI tool for code completion and suggestions',
    category: 'Code',
    url: 'https://cursor.ai',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.8,
    dailyUsers: '300K+',
    modelType: 'Code Completion',
    easeOfUse: 4.8,
    userExperience: 4.7
  },
  {
    name: 'Codestral AI API',
    description: 'API for AI-driven code analysis',
    category: 'APIs',
    url: 'https://codestral.ai',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Code Analysis',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Grok',
    description: 'AI tool for understanding complex data',
    category: 'Analytics',
    url: 'https://grok.ai',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.6,
    dailyUsers: '200K+',
    modelType: 'Data Analysis',
    easeOfUse: 4.6,
    userExperience: 4.7
  },
  {
    name: 'Replit Agent',
    description: 'AI tool for collaborative coding',
    category: 'Code',
    url: 'https://replit.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.7,
    dailyUsers: '500K+',
    modelType: 'Collaboration',
    easeOfUse: 4.7,
    userExperience: 4.8
  },
  {
    name: 'Hey Gen',
    description: 'AI video maker',
    category: 'Video',
    url: 'https://heygen.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Video Generation',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'TempoAI',
    description: 'React apps faster now',
    category: 'Productivity',
    url: 'https://tempo.ai',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.6,
    dailyUsers: '200K+',
    modelType: 'Productivity',
    easeOfUse: 4.6,
    userExperience: 4.7
  },
  {
    name: 'Playwright',
    description: 'End-to-end testing framework',
    category: 'Code',
    url: 'https://playwright.dev',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.7,
    dailyUsers: '300K+',
    modelType: 'Testing',
    easeOfUse: 4.7,
    userExperience: 4.8
  },
  {
    name: 'Puppeteer',
    description: 'Headless browser automation',
    category: 'Code',
    url: 'https://pptr.dev',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.6,
    dailyUsers: '200K+',
    modelType: 'Automation',
    easeOfUse: 4.6,
    userExperience: 4.7
  },
  {
    name: 'No Code Apps',
    description: 'Platforms for building apps without code',
    category: 'Productivity',
    url: 'https://nocodeapps.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'No Code',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'BuildwithAI Tool',
    description: 'AI tool for building with AI',
    category: 'Productivity',
    url: 'https://buildwithai.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.6,
    dailyUsers: '200K+',
    modelType: 'AI Building',
    easeOfUse: 4.6,
    userExperience: 4.7
  },
  {
    name: 'Vo',
    description: 'Any interface AI tool',
    category: 'APIs',
    url: 'https://vo.ai',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Interface',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Windsurf',
    description: 'Similar to Lovable',
    category: 'Design',
    url: 'https://windsurf.ai',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Design Tool',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Google AI Studio',
    description: 'AI tool for creating and managing AI models',
    category: 'APIs',
    url: 'https://ai.google.com/studio',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.7,
    dailyUsers: '500K+',
    modelType: 'AI Studio',
    easeOfUse: 4.7,
    userExperience: 4.8
  },
  {
    name: 'Hexona System',
    description: 'AI tool for system management',
    category: 'Productivity',
    url: 'https://hexona.systems',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.6,
    dailyUsers: '200K+',
    modelType: 'System Management',
    easeOfUse: 4.6,
    userExperience: 4.7
  },
  {
    name: 'High Level',
    description: 'AI tool for high-level management',
    category: 'Business',
    url: 'https://highlevel.ai',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Management',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'DeepSeek',
    description: 'AI tool for deep learning and analysis',
    category: 'Research',
    url: 'https://deepseek.ai',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.7,
    dailyUsers: '300K+',
    modelType: 'Deep Learning',
    easeOfUse: 4.7,
    userExperience: 4.8
  },
  {
    name: 'Make',
    description: 'AI tool for creating and automating workflows',
    category: 'Productivity',
    url: 'https://make.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.6,
    dailyUsers: '200K+',
    modelType: 'Workflow Automation',
    easeOfUse: 4.6,
    userExperience: 4.7
  },
  {
    name: 'Notebook LLM',
    description: 'AI tool for managing large language models',
    category: 'APIs',
    url: 'https://notebookllm.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Language Model Management',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Sora',
    description: 'AI tool for collaborative research',
    category: 'Research',
    url: 'https://sora.ai',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.6,
    dailyUsers: '200K+',
    modelType: 'Research Collaboration',
    easeOfUse: 4.6,
    userExperience: 4.7
  },
  {
    name: 'Napkin AI',
    description: 'AI tool for quick sketches and diagrams',
    category: 'Design',
    url: 'https://napkin.ai',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Sketching',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Heygen',
    description: 'AI tool for generating video content',
    category: 'Video',
    url: 'https://heygen.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.6,
    dailyUsers: '200K+',
    modelType: 'Video Generation',
    easeOfUse: 4.6,
    userExperience: 4.7
  },
  {
    name: 'Eleven Apps',
    description: 'AI tool for app development',
    category: 'Productivity',
    url: 'https://elevenapps.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'App Development',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Fal AI',
    description: 'AI tool for financial analysis',
    category: 'Business',
    url: 'https://fal.ai',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.6,
    dailyUsers: '200K+',
    modelType: 'Financial Analysis',
    easeOfUse: 4.6,
    userExperience: 4.7
  },
  {
    name: 'Eraser AI',
    description: 'AI tool for removing unwanted elements from images',
    category: 'Image Generation',
    url: 'https://eraser.ai',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Image Editing',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Game Maker',
    description: 'AI tool for creating games',
    category: 'Gaming',
    url: 'https://gamemaker.ai',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.6,
    dailyUsers: '200K+',
    modelType: 'Game Development',
    easeOfUse: 4.6,
    userExperience: 4.7
  },
  {
    name: 'Magai',
    description: 'Best in class image generation',
    category: 'Image Generation',
    url: 'https://magai.co',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.7,
    dailyUsers: '300K+',
    modelType: 'Image Generation',
    easeOfUse: 4.7,
    userExperience: 4.8
  },
  {
    name: 'Tool 1',
    description: 'Description for Tool 1',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Tool 2',
    description: 'Description for Tool 2',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Tool 3',
    description: 'Description for Tool 3',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Tool 4',
    description: 'Description for Tool 4',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Tool 5',
    description: 'Description for Tool 5',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Tool 6',
    description: 'Description for Tool 6',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Tool 7',
    description: 'Description for Tool 7',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Tool 8',
    description: 'Description for Tool 8',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Tool 9',
    description: 'Description for Tool 9',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Tool 10',
    description: 'Description for Tool 10',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Tool 11',
    description: 'Description for Tool 11',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Tool 12',
    description: 'Description for Tool 12',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Tool 13',
    description: 'Description for Tool 13',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Tool 14',
    description: 'Description for Tool 14',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Tool 15',
    description: 'Description for Tool 15',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Tool 16',
    description: 'Description for Tool 16',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Tool 17',
    description: 'Description for Tool 17',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Tool 18',
    description: 'Description for Tool 18',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Tool 19',
    description: 'Description for Tool 19',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Tool 20',
    description: 'Description for Tool 20',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 51',
    description: 'Description for AI Tool 51',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 52',
    description: 'Description for AI Tool 52',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 53',
    description: 'Description for AI Tool 53',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 54',
    description: 'Description for AI Tool 54',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 55',
    description: 'Description for AI Tool 55',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 56',
    description: 'Description for AI Tool 56',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 57',
    description: 'Description for AI Tool 57',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 58',
    description: 'Description for AI Tool 58',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 59',
    description: 'Description for AI Tool 59',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 60',
    description: 'Description for AI Tool 60',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 61',
    description: 'Description for AI Tool 61',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 62',
    description: 'Description for AI Tool 62',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 63',
    description: 'Description for AI Tool 63',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 64',
    description: 'Description for AI Tool 64',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 65',
    description: 'Description for AI Tool 65',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 66',
    description: 'Description for AI Tool 66',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 67',
    description: 'Description for AI Tool 67',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 68',
    description: 'Description for AI Tool 68',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 69',
    description: 'Description for AI Tool 69',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 70',
    description: 'Description for AI Tool 70',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 71',
    description: 'Description for AI Tool 71',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 72',
    description: 'Description for AI Tool 72',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 73',
    description: 'Description for AI Tool 73',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 74',
    description: 'Description for AI Tool 74',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 75',
    description: 'Description for AI Tool 75',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 76',
    description: 'Description for AI Tool 76',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 77',
    description: 'Description for AI Tool 77',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 78',
    description: 'Description for AI Tool 78',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 79',
    description: 'Description for AI Tool 79',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 80',
    description: 'Description for AI Tool 80',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 81',
    description: 'Description for AI Tool 81',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 82',
    description: 'Description for AI Tool 82',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 83',
    description: 'Description for AI Tool 83',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 84',
    description: 'Description for AI Tool 84',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 85',
    description: 'Description for AI Tool 85',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 86',
    description: 'Description for AI Tool 86',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 87',
    description: 'Description for AI Tool 87',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 88',
    description: 'Description for AI Tool 88',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 89',
    description: 'Description for AI Tool 89',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 90',
    description: 'Description for AI Tool 90',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 91',
    description: 'Description for AI Tool 91',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 92',
    description: 'Description for AI Tool 92',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 93',
    description: 'Description for AI Tool 93',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 94',
    description: 'Description for AI Tool 94',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 95',
    description: 'Description for AI Tool 95',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 96',
    description: 'Description for AI Tool 96',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 97',
    description: 'Description for AI Tool 97',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 98',
    description: 'Description for AI Tool 98',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 99',
    description: 'Description for AI Tool 99',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'AI Tool 100',
    description: 'Description for AI Tool 100',
    category: 'Category',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free',
    rating: 4.5,
    dailyUsers: '100K+',
    modelType: 'Model Type',
    easeOfUse: 4.5,
    userExperience: 4.6
  }
];

const newTools: AITool[] = [
  {
    name: 'Rendora AI',
    description: 'Advanced text-to-3D model generation platform',
    category: 'Design',
    url: 'https://rendora.ai',
    image: 'https://images.unsplash.com/photo-1682687220923-c58b9a4592ae',
    pricing: 'Free beta',
    rating: 4.6,
    dailyUsers: '50K+',
    modelType: '3D Gen',
    easeOfUse: 4.4,
    codeQuality: 'N/A',
    userExperience: 4.5
  },
  {
    name: 'Windsurf AI',
    description: 'AI-powered UI/UX design assistant',
    category: 'Design',
    url: 'https://windsurf.ai',
    image: 'https://images.unsplash.com/photo-1682687220923-c58b9a4592ae',
    pricing: 'From $19/month',
    rating: 4.5,
    dailyUsers: '20K+',
    modelType: 'Custom',
    easeOfUse: 4.7,
    codeQuality: 'N/A',
    userExperience: 4.6
  },
  {
    name: 'Groq Cloud',
    description: 'Ultra-fast LLM inference platform',
    category: 'APIs',
    url: 'https://groq.com',
    github: 'https://github.com/groq',
    image: 'https://images.unsplash.com/photo-1687163155606-e769e7232c37',
    pricing: 'Pay per use',
    rating: 4.8,
    dailyUsers: '100K+',
    modelType: 'LLM',
    easeOfUse: 4.6,
    codeQuality: 4.8,
    userExperience: 4.7
  },
  {
    name: 'Leonardo.ai',
    description: 'AI art generation platform with advanced customization',
    category: 'Image Generation',
    url: 'https://leonardo.ai',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'From $10/month',
    rating: 4.6,
    dailyUsers: '500K+',
    modelType: 'Custom',
    easeOfUse: 4.7,
    userExperience: 4.6
  },
  {
    name: 'Replicate',
    description: 'Platform for running and deploying AI models',
    category: 'APIs',
    url: 'https://replicate.com',
    image: 'https://images.unsplash.com/photo-1687163155606-e769e7232c37',
    pricing: 'Pay per use',
    rating: 4.7,
    dailyUsers: '200K+',
    modelType: 'Various',
    easeOfUse: 4.5,
    codeQuality: 4.8,
    userExperience: 4.6
  }
];

const additionalNewTools: AITool[] = [
  {
    name: 'Perplexity AI',
    description: 'Advanced research assistant with real-time information access',
    category: 'Research',
    url: 'https://perplexity.ai',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Free / $20 monthly',
    rating: 4.7,
    dailyUsers: '2M+',
    modelType: 'Custom LLM',
    easeOfUse: 4.8,
    userExperience: 4.7
  },
  {
    name: 'Synthesia',
    description: 'Create professional AI videos with custom avatars',
    category: 'Video',
    url: 'https://synthesia.io',
    image: 'https://images.unsplash.com/photo-1682687221073-53ad74c2cad7',
    pricing: 'From $30/video',
    rating: 4.6,
    dailyUsers: '500K+',
    modelType: 'Video Gen',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Runway Gen-2',
    description: 'Advanced AI video generation and editing platform',
    category: 'Video',
    url: 'https://runway.ml',
    image: 'https://images.unsplash.com/photo-1682687221080-5cb261c645cb',
    pricing: 'From $15/month',
    rating: 4.8,
    dailyUsers: '1M+',
    modelType: 'Gen-2',
    easeOfUse: 4.4,
    userExperience: 4.7
  },
  {
    name: 'Stable Audio',
    description: 'Generate custom music and sound effects with AI',
    category: 'Music',
    url: 'https://stable.audio',
    image: 'https://images.unsplash.com/photo-1682687221363-72518513620e',
    pricing: 'Credits based',
    rating: 4.5,
    dailyUsers: '200K+',
    modelType: 'Audio Gen',
    easeOfUse: 4.3,
    userExperience: 4.4
  },
  {
    name: 'Gamma',
    description: 'AI-powered presentation and document creation',
    category: 'Business',
    url: 'https://gamma.app',
    image: 'https://images.unsplash.com/photo-1682687221203-d5bf269962b9',
    pricing: 'Free / $10 monthly',
    rating: 4.7,
    dailyUsers: '300K+',
    modelType: 'Custom',
    easeOfUse: 4.8,
    userExperience: 4.7
  },
  {
    name: 'Codeium',
    description: 'AI code completion and explanation assistant',
    category: 'Code',
    url: 'https://codeium.com',
    image: 'https://images.unsplash.com/photo-1682687221248-3116ba6ab483',
    pricing: 'Free for individuals',
    rating: 4.6,
    dailyUsers: '400K+',
    modelType: 'Code LLM',
    easeOfUse: 4.7,
    userExperience: 4.6
  },
  {
    name: 'Tome',
    description: 'AI-powered storytelling and presentation platform',
    category: 'Business',
    url: 'https://tome.app',
    image: 'https://images.unsplash.com/photo-1682687221123-4673装饰3',
    pricing: 'Free / $20 monthly',
    rating: 4.7,
    dailyUsers: '250K+',
    modelType: 'Custom',
    easeOfUse: 4.6,
    userExperience: 4.7
  },
  {
    name: 'Soundraw',
    description: 'AI music generation for content creators',
    category: 'Music',
    url: 'https://soundraw.io',
    image: 'https://images.unsplash.com/photo-1682687221299-c29175402c9c',
    pricing: 'From $15/month',
    rating: 4.5,
    dailyUsers: '150K+',
    modelType: 'Music Gen',
    easeOfUse: 4.4,
    userExperience: 4.5
  },
  {
    name: 'Pictory',
    description: 'Automated video creation from long-form content',
    category: 'Video',
    url: 'https://pictory.ai',
    image: 'https://images.unsplash.com/photo-1682687221213-c2dd49d75d97',
    pricing: 'From $25/month',
    rating: 4.6,
    dailyUsers: '100K+',
    modelType: 'Video Gen',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Copy.ai',
    description: 'AI-powered copywriting and content generation platform',
    category: 'Writing',
    url: 'https://www.copy.ai',
    image: 'https://images.unsplash.com/photo-1686191128892-3b37add4c844',
    pricing: 'From $49/month',
    rating: 4.6,
    dailyUsers: '1M+',
    modelType: 'GPT-4',
    easeOfUse: 4.8,
    userExperience: 4.7
  },
  {
    name: 'Jasper',
    description: 'AI content creation platform for marketing and business',
    category: 'Writing',
    url: 'https://www.jasper.ai',
    image: 'https://images.unsplash.com/photo-1686191128892-3b37add4c844',
    pricing: 'From $39/month',
    rating: 4.7,
    dailyUsers: '2M+',
    modelType: 'Custom GPT',
    easeOfUse: 4.8,
    userExperience: 4.7
  }
];

const moreTools: AITool[] = [
  {
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
  },
  {
    name: 'Stable Video 3',
    description: 'Next-generation AI video generation platform',
    category: 'Video',
    url: 'https://stability.ai/stable-video',
    image: 'https://images.unsplash.com/photo-1682687221073-53ad74c2cad7',
    pricing: 'Pay per use',
    rating: 4.8,
    dailyUsers: '1M+',
    modelType: 'Stable Video 3',
    easeOfUse: 4.7,
    userExperience: 4.8
  },
  {
    name: 'Meta AudioCraft 3',
    description: 'Advanced AI music generation with improved quality',
    category: 'Music',
    url: 'https://audiocraft.metademolab.com',
    image: 'https://images.unsplash.com/photo-1682687221363-72518513620e',
    pricing: 'Free / Open Source',
    rating: 4.7,
    dailyUsers: '1M+',
    modelType: 'AudioCraft 3',
    easeOfUse: 4.6,
    userExperience: 4.7
  },
  {
    name: 'DALL-E 3',
    description: 'Advanced AI image generation with high-quality, photorealistic outputs',
    category: 'Image Generation',
    url: 'https://openai.com/dall-e-3',
    image: 'https://images.unsplash.com/photo-1682687220742-aba19b11a105',
    pricing: 'Pay per use',
    rating: 4.9,
    featured: true,
    dailyUsers: '10M+',
    modelType: 'DALL-E 3',
    easeOfUse: 4.8,
    userExperience: 4.9
  },
  {
    name: 'Anthropic Claude 3',
    description: 'Next-generation AI assistant with advanced reasoning and analysis capabilities',
    category: 'Chatbots',
    url: 'https://claude.ai',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    pricing: 'Free / $20 monthly',
    rating: 4.8,
    featured: true,
    dailyUsers: '5M+',
    modelType: 'Claude 3',
    easeOfUse: 4.7,
    userExperience: 4.8
  },
  {
    name: 'Google Gemini Pro',
    description: 'Advanced AI model for complex reasoning and multimodal tasks',
    category: 'Chatbots',
    url: 'https://gemini.google.com',
    image: 'https://images.unsplash.com/photo-1685094488371-5ad47f1ad93f',
    pricing: 'Free / $10 monthly',
    rating: 4.7,
    featured: true,
    dailyUsers: '8M+',
    modelType: 'Gemini Pro',
    easeOfUse: 4.6,
    userExperience: 4.7
  },
  {
    name: 'Stable Video',
    description: 'AI-powered video generation from text and images',
    category: 'Video',
    url: 'https://stability.ai/stable-video',
    image: 'https://images.unsplash.com/photo-1682687221073-53ad74c2cad7',
    pricing: 'Pay per use',
    rating: 4.6,
    featured: true,
    dailyUsers: '1M+',
    modelType: 'Stable Video',
    easeOfUse: 4.5,
    userExperience: 4.6
  },
  {
    name: 'Meta AudioCraft',
    description: 'Advanced AI music generation and audio processing',
    category: 'Music',
    url: 'https://audiocraft.metademolab.com',
    image: 'https://images.unsplash.com/photo-1682687221363-72518513620e',
    pricing: 'Free / Open Source',
    rating: 4.5,
    featured: true,
    dailyUsers: '500K+',
    modelType: 'AudioCraft',
    easeOfUse: 4.4,
    userExperience: 4.5
  }
];

const allTools: AITool[] = [
  ...existingTools,
  ...additionalTools,
  ...newTools,
  ...additionalNewTools,
  ...moreTools
];

export const aiTools = allTools;

// Update category counts
categories.forEach(category => {
  category.count = allTools.filter(tool => 
    category.name === 'All' ? true : tool.category === category.name
  ).length;
});

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [priceFilters, setPriceFilters] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [userCountFilters, setUserCountFilters] = useState<string[]>([]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const [itemsPerPage, setItemsPerPage] = useState(12);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    setIsDarkMode(theme === 'dark');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
  };

  const filteredTools = allTools.filter(tool => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = priceFilters.length === 0 || priceFilters.some(price => tool.pricing.toLowerCase().includes(price.toLowerCase()));
    const matchesRating = !tool.rating || tool.rating >= minRating;
    const matchesUserCount = userCountFilters.length === 0 || userCountFilters.some(count => tool.dailyUsers?.includes(count));

    return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesUserCount;
  });

  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
  const paginatedTools = filteredTools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePriceFilterChange = (price: string) => {
    setPriceFilters(prev => {
      if (prev.includes(price)) {
        return prev.filter(p => p !== price);
      }
      return [...prev, price];
    });
  };

  const handleUserCountFilterChange = (count: string) => {
    setUserCountFilters(prev => {
      if (prev.includes(count)) {
        return prev.filter(c => c !== count);
      }
      return [...prev, count];
    });
  };

  const toggleFavorite = (tool: AITool) => {
    setFavorites(prev => {
      if (prev.includes(tool.name)) {
        return prev.filter(name => name !== tool.name);
      }
      return [...prev, tool.name];
    });
    toast.success(`${favorites.includes(tool.name) ? 'Removed from' : 'Added to'} favorites`);
  };

  const renderPagination = () => {
    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  const renderContent = () => {
        return (
      <div className="space-y-8">
        {/* View Toggle and Items Per Page */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            >
              <option value={12}>12 per page</option>
              <option value={24}>24 per page</option>
              <option value={48}>48 per page</option>
            </select>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentView('grid')}
                className={`p-2 rounded-lg ${
                  currentView === 'grid' 
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentView('list')}
                className={`p-2 rounded-lg ${
                  currentView === 'list' 
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Submit Tool
          </button>
        </div>

            {/* Featured Tools */}
              <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Featured Tools
                </h2>
          <div className={`grid ${
            currentView === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
            } gap-6`}
          >
            {paginatedTools
              .filter(tool => tool.featured)
              .map(tool => (
                    <ToolCard
                      key={tool.name}
                      tool={tool}
                  onFavorite={() => toggleFavorite(tool)}
                  isFavorited={favorites.includes(tool.name)}
                    />
                  ))}
                </div>
              </section>

        {/* All Tools */}
            <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  All Tools
                </h2>
          <div className={`grid ${
            currentView === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
            } gap-6`}
          >
            {paginatedTools.map(tool => (
                  <ToolCard
                    key={tool.name}
                    tool={tool}
                onFavorite={() => toggleFavorite(tool)}
                isFavorited={favorites.includes(tool.name)}
                  />
                ))}
              </div>
          {renderPagination()}
            </section>
          </div>
        );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="bottom-right" />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-sm z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                className="fixed top-4 left-4 z-50 p-3 bg-blue-600 text-white rounded-r-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex-shrink-0 flex items-center">
                <Sparkles className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                  AI Tools Directory
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-64 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />

                <button
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
                </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onPriceFilterChange={handlePriceFilterChange}
          onRatingFilterChange={setMinRating}
          onUserCountFilterChange={handleUserCountFilterChange}
          toolCount={allTools.length}
          isOpen={isSidebarVisible}
          onClose={() => setIsSidebarVisible(false)}
          className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg transform ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-40`}
        >
          <button
            onClick={() => setIsSidebarVisible(false)}
            className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Close
          </button>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 pt-16">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>
      </div>
      </div>

      {/* Modals */}
      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}

      {isSubmitModalOpen && (
        <SubmitTool onClose={() => setIsSubmitModalOpen(false)} />
      )}
    </div>
  );
}

export default App;