import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, ArrowRight, Save, Play, Download, Share2, Code, Settings, Database, Zap, Trash2, Copy, GitBranch, Brain, Target, Workflow, Sparkles, Clock, Users, Star, BarChart3, Eye, Layers, Cpu, Globe, Shield, FileText, Palette, Music, Video, PenTool, Briefcase, X, ChevronDown, ChevronUp, RotateCcw, Pause, Square, AlertCircle, CheckCircle, Timer, Activity, TrendingUp, Award, Lightbulb, Rocket, Filter, Search, Grid, List, Maximize2, Minimize2, RefreshCw, Upload, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { AITool } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface WorkflowStep {
  id: string;
  toolId: string;
  tool?: AITool;
  config: Record<string, unknown>;
  position: { x: number; y: number };
  inputs: WorkflowPort[];
  outputs: WorkflowPort[];
  status: 'idle' | 'running' | 'completed' | 'error' | 'paused';
  executionTime?: number;
  errorMessage?: string;
  progress?: number;
  metadata?: {
    description?: string;
    notes?: string;
    tags?: string[];
  };
}

interface WorkflowPort {
  id: string;
  name: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'data' | 'code' | 'json';
  required: boolean;
  description?: string;
}

interface Connection {
  id: string;
  from: string;
  to: string;
  fromOutput: string;
  toInput: string;
  animated?: boolean;
  color?: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: WorkflowStep[];
  connections: Connection[];
  estimatedTime: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  usageCount: number;
  rating: number;
  author: string;
  tags: string[];
  thumbnail?: string;
  featured?: boolean;
}

interface WorkflowBuilderProps {
  tools: AITool[];
}

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ tools }) => {
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedTool, setSelectedTool] = useState('');
  const [workflowName, setWorkflowName] = useState('My AI Workflow');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [viewMode, setViewMode] = useState<'canvas' | 'list' | 'timeline'>('canvas');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [executionLogs, setExecutionLogs] = useState<any[]>([]);
  const [workflowStats, setWorkflowStats] = useState({
    totalSteps: 0,
    estimatedTime: '0 min',
    complexity: 'Beginner' as const,
    efficiency: 0,
    totalConnections: 0,
    avgExecutionTime: 0,
    successRate: 0
  });

  const canvasRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const categories = [
    { name: 'All', icon: Brain, color: 'from-blue-500 to-indigo-600' },
    { name: 'Content Creation', icon: PenTool, color: 'from-purple-500 to-pink-600' },
    { name: 'Data Processing', icon: Database, color: 'from-green-500 to-emerald-600' },
    { name: 'Image Generation', icon: Palette, color: 'from-orange-500 to-red-600' },
    { name: 'Audio Processing', icon: Music, color: 'from-cyan-500 to-blue-600' },
    { name: 'Video Creation', icon: Video, color: 'from-violet-500 to-purple-600' },
    { name: 'Business Automation', icon: Briefcase, color: 'from-pink-500 to-rose-600' },
    { name: 'Code Generation', icon: Code, color: 'from-indigo-500 to-blue-600' }
  ];

  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: '1',
      name: 'AI Content Pipeline',
      description: 'Complete content creation workflow from ideation to publication',
      category: 'Content Creation',
      steps: [],
      connections: [],
      estimatedTime: '25 min',
      complexity: 'Intermediate',
      usageCount: 2450,
      rating: 4.8,
      author: 'ContentMaster',
      tags: ['content', 'writing', 'seo', 'social media'],
      featured: true
    },
    {
      id: '2',
      name: 'Data Analysis & Visualization',
      description: 'Advanced data processing with AI insights and automated reporting',
      category: 'Data Processing',
      steps: [],
      connections: [],
      estimatedTime: '35 min',
      complexity: 'Advanced',
      usageCount: 1890,
      rating: 4.9,
      author: 'DataScientist',
      tags: ['data', 'analytics', 'visualization', 'insights'],
      featured: true
    },
    {
      id: '3',
      name: 'Social Media Automation',
      description: 'Automated social media content creation and scheduling',
      category: 'Business Automation',
      steps: [],
      connections: [],
      estimatedTime: '15 min',
      complexity: 'Beginner',
      usageCount: 3200,
      rating: 4.6,
      author: 'SocialGuru',
      tags: ['social media', 'automation', 'marketing'],
      featured: false
    },
    {
      id: '4',
      name: 'AI Video Production',
      description: 'End-to-end video creation with AI narration and editing',
      category: 'Video Creation',
      steps: [],
      connections: [],
      estimatedTime: '45 min',
      complexity: 'Expert',
      usageCount: 980,
      rating: 4.7,
      author: 'VideoCreator',
      tags: ['video', 'ai narration', 'editing', 'production'],
      featured: true
    },
    {
      id: '5',
      name: 'Code Review & Optimization',
      description: 'Automated code analysis, review, and optimization suggestions',
      category: 'Code Generation',
      steps: [],
      connections: [],
      estimatedTime: '20 min',
      complexity: 'Advanced',
      usageCount: 1560,
      rating: 4.8,
      author: 'DevExpert',
      tags: ['code', 'review', 'optimization', 'quality'],
      featured: false
    },
    {
      id: '6',
      name: 'Podcast Production Suite',
      description: 'Complete podcast workflow from script to distribution',
      category: 'Audio Processing',
      steps: [],
      connections: [],
      estimatedTime: '40 min',
      complexity: 'Intermediate',
      usageCount: 720,
      rating: 4.5,
      author: 'PodcastPro',
      tags: ['podcast', 'audio', 'script', 'distribution'],
      featured: false
    }
  ];

  const calculateWorkflowStats = useCallback(() => {
    const totalSteps = workflow.length;
    const totalConnections = connections.length;
    const estimatedMinutes = totalSteps * 3 + totalConnections * 1; // More realistic estimation
    
    let complexity: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' = 'Beginner';
    if (totalSteps <= 3) complexity = 'Beginner';
    else if (totalSteps <= 6) complexity = 'Intermediate';
    else if (totalSteps <= 10) complexity = 'Advanced';
    else complexity = 'Expert';

    const efficiency = Math.min(100, Math.max(0, 100 - (totalConnections * 3) + (totalSteps * 8)));
    const avgExecutionTime = workflow.reduce((acc, step) => acc + (step.executionTime || 0), 0) / Math.max(1, workflow.length);
    const successRate = workflow.length > 0 ? 
      (workflow.filter(step => step.status === 'completed').length / workflow.length) * 100 : 0;

    setWorkflowStats({
      totalSteps,
      estimatedTime: `${estimatedMinutes} min`,
      complexity,
      efficiency,
      totalConnections,
      avgExecutionTime,
      successRate
    });
  }, [workflow, connections]);

  useEffect(() => {
    calculateWorkflowStats();
  }, [calculateWorkflowStats]);

  const generateStepPorts = (tool: AITool): { inputs: WorkflowPort[], outputs: WorkflowPort[] } => {
    const inputs: WorkflowPort[] = [
      { id: 'input-1', name: 'Input Data', type: 'data', required: true, description: 'Primary input data' }
    ];
    
    const outputs: WorkflowPort[] = [
      { id: 'output-1', name: 'Result', type: 'data', required: false, description: 'Processed output' }
    ];

    // Add category-specific ports
    if (tool.category === 'Image Generation') {
      inputs.push({ id: 'prompt', name: 'Prompt', type: 'text', required: true, description: 'Image generation prompt' });
      outputs[0] = { id: 'image', name: 'Generated Image', type: 'image', required: false, description: 'Generated image output' };
    } else if (tool.category === 'Code') {
      inputs.push({ id: 'code', name: 'Source Code', type: 'code', required: true, description: 'Code to process' });
      outputs[0] = { id: 'code-output', name: 'Processed Code', type: 'code', required: false, description: 'Processed code output' };
    } else if (tool.category === 'Writing') {
      inputs.push({ id: 'topic', name: 'Topic', type: 'text', required: true, description: 'Writing topic or prompt' });
      outputs[0] = { id: 'content', name: 'Generated Content', type: 'text', required: false, description: 'Generated text content' };
    }

    return { inputs, outputs };
  };

  const addStep = () => {
    if (!selectedTool) return;
    
    const tool = tools.find(t => t.name === selectedTool);
    if (!tool) return;

    const { inputs, outputs } = generateStepPorts(tool);

    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      toolId: selectedTool,
      tool,
      config: {},
      position: {
        x: 100 + workflow.length * 300,
        y: 200 + (Math.random() - 0.5) * 100
      },
      inputs,
      outputs,
      status: 'idle',
      metadata: {
        description: `${tool.name} processing step`,
        notes: '',
        tags: [tool.category.toLowerCase()]
      }
    };

    setWorkflow([...workflow, newStep]);
    setSelectedTool('');
    toast.success(`${tool.name} added to workflow`);
  };

  const removeStep = (stepId: string) => {
    setWorkflow(workflow.filter(step => step.id !== stepId));
    setConnections(connections.filter(conn => conn.from !== stepId && conn.to !== stepId));
    if (selectedStep === stepId) setSelectedStep(null);
    toast.success('Step removed from workflow');
  };

  const duplicateStep = (stepId: string) => {
    const step = workflow.find(s => s.id === stepId);
    if (!step) return;

    const newStep: WorkflowStep = {
      ...step,
      id: `step-${Date.now()}`,
      position: {
        x: step.position.x + 50,
        y: step.position.y + 50
      },
      status: 'idle'
    };

    setWorkflow([...workflow, newStep]);
    toast.success('Step duplicated');
  };

  const connectSteps = (fromStepId: string, toStepId: string, fromOutput: string, toInput: string) => {
    const newConnection: Connection = {
      id: `conn-${Date.now()}`,
      from: fromStepId,
      to: toStepId,
      fromOutput,
      toInput,
      animated: true,
      color: '#4c5cdf'
    };

    setConnections([...connections, newConnection]);
    toast.success('Steps connected');
  };

  const runWorkflow = async () => {
    if (workflow.length === 0) {
      toast.error('Add steps to your workflow first');
      return;
    }

    setIsRunning(true);
    setIsPaused(false);
    setExecutionLogs([]);
    
    const startTime = Date.now();
    
    try {
      for (let i = 0; i < workflow.length; i++) {
        if (isPaused) break;
        
        const step = workflow[i];
        const stepStartTime = Date.now();
        
        // Update step status to running
        setWorkflow(prev => prev.map(s => 
          s.id === step.id ? { ...s, status: 'running', progress: 0 } : s
        ));
        
        // Add execution log
        setExecutionLogs(prev => [...prev, {
          id: Date.now(),
          stepId: step.id,
          message: `Starting ${step.tool?.name || 'Unknown Tool'}`,
          timestamp: new Date(),
          type: 'info'
        }]);
        
        // Simulate processing with progress updates
        for (let progress = 0; progress <= 100; progress += 20) {
          if (isPaused) break;
          
          setWorkflow(prev => prev.map(s => 
            s.id === step.id ? { ...s, progress } : s
          ));
          
          await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
        }
        
        const executionTime = Date.now() - stepStartTime;
        
        // Update step status to completed
        setWorkflow(prev => prev.map(s => 
          s.id === step.id ? { 
            ...s, 
            status: 'completed', 
            progress: 100,
            executionTime 
          } : s
        ));
        
        // Add completion log
        setExecutionLogs(prev => [...prev, {
          id: Date.now(),
          stepId: step.id,
          message: `Completed ${step.tool?.name || 'Unknown Tool'} in ${executionTime}ms`,
          timestamp: new Date(),
          type: 'success'
        }]);
      }

      const totalTime = Date.now() - startTime;
      
      if (!isPaused) {
        toast.success(`Workflow completed successfully in ${(totalTime / 1000).toFixed(1)}s!`);
        setExecutionLogs(prev => [...prev, {
          id: Date.now(),
          stepId: 'workflow',
          message: `Workflow completed in ${(totalTime / 1000).toFixed(1)}s`,
          timestamp: new Date(),
          type: 'success'
        }]);
      }
    } catch (error) {
      toast.error('Workflow execution failed');
      setExecutionLogs(prev => [...prev, {
        id: Date.now(),
        stepId: 'workflow',
        message: `Workflow failed: ${error}`,
        timestamp: new Date(),
        type: 'error'
      }]);
    } finally {
      setIsRunning(false);
      setIsPaused(false);
    }
  };

  const pauseWorkflow = () => {
    setIsPaused(true);
    setIsRunning(false);
    toast.info('Workflow paused');
  };

  const stopWorkflow = () => {
    setIsRunning(false);
    setIsPaused(false);
    setWorkflow(prev => prev.map(step => ({ ...step, status: 'idle', progress: 0 })));
    toast.info('Workflow stopped');
  };

  const resetWorkflow = () => {
    setWorkflow(prev => prev.map(step => ({ 
      ...step, 
      status: 'idle', 
      progress: 0, 
      executionTime: undefined,
      errorMessage: undefined 
    })));
    setExecutionLogs([]);
    toast.info('Workflow reset');
  };

  const saveWorkflow = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to save workflows');
        return;
      }

      const workflowData = {
        name: workflowName,
        description: workflowDescription,
        steps: workflow,
        connections,
        user_id: user.id,
        metadata: {
          created: new Date().toISOString(),
          version: '2.0',
          stats: workflowStats,
          tags: Array.from(new Set(workflow.flatMap(step => step.metadata?.tags || [])))
        }
      };

      localStorage.setItem(`workflow_${Date.now()}`, JSON.stringify(workflowData));
      toast.success('Workflow saved successfully!');
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast.error('Failed to save workflow');
    }
  };

  const exportWorkflow = () => {
    const workflowData = {
      name: workflowName,
      description: workflowDescription,
      steps: workflow,
      connections,
      metadata: {
        created: new Date().toISOString(),
        version: '2.0',
        stats: workflowStats,
        exportedBy: 'ToolVa Workflow Builder'
      }
    };

    const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowName.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Workflow exported!');
  };

  const shareWorkflow = async () => {
    try {
      const workflowData = {
        name: workflowName,
        description: workflowDescription,
        steps: workflow.length,
        complexity: workflowStats.complexity,
        estimatedTime: workflowStats.estimatedTime
      };

      await navigator.share({
        title: `${workflowName} - AI Workflow`,
        text: `Check out this ${workflowStats.complexity} AI workflow: ${workflowDescription}`,
        url: window.location.href
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Workflow link copied to clipboard!');
    }
  };

  const loadTemplate = (template: WorkflowTemplate) => {
    setWorkflowName(template.name);
    setWorkflowDescription(template.description);
    // In a real app, you'd load the actual steps and connections
    setWorkflow([]);
    setConnections([]);
    setShowTemplates(false);
    toast.success(`Template "${template.name}" loaded`);
  };

  const getStepStatusColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'running': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'completed': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'error': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'paused': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      default: return 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800';
    }
  };

  const getPortColor = (type: string) => {
    switch (type) {
      case 'text': return 'bg-blue-500';
      case 'image': return 'bg-purple-500';
      case 'audio': return 'bg-green-500';
      case 'video': return 'bg-red-500';
      case 'data': return 'bg-gray-500';
      case 'code': return 'bg-orange-500';
      case 'json': return 'bg-cyan-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredTools = tools.filter(tool => {
    const matchesSearch = !searchQuery || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredTemplates = workflowTemplates.filter(template => {
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-full mx-auto p-4 sm:p-6 lg:p-8 h-screen flex flex-col">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full mb-6"
        >
          <Workflow className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">Advanced Workflow Builder</span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Build Powerful AI Workflows
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Create, execute, and optimize complex AI workflows with our visual builder
        </motion.p>
      </div>

      {/* Enhanced Stats Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Steps</p>
              <p className="text-2xl font-bold">{workflowStats.totalSteps}</p>
            </div>
            <Target className="w-6 h-6 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Time</p>
              <p className="text-2xl font-bold">{workflowStats.estimatedTime.split(' ')[0]}</p>
            </div>
            <Clock className="w-6 h-6 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Complexity</p>
              <p className="text-lg font-bold">{workflowStats.complexity}</p>
            </div>
            <Brain className="w-6 h-6 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Efficiency</p>
              <p className="text-2xl font-bold">{workflowStats.efficiency}%</p>
            </div>
            <Zap className="w-6 h-6 text-orange-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm">Connections</p>
              <p className="text-2xl font-bold">{workflowStats.totalConnections}</p>
            </div>
            <GitBranch className="w-6 h-6 text-cyan-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-violet-100 text-sm">Success</p>
              <p className="text-2xl font-bold">{workflowStats.successRate.toFixed(0)}%</p>
            </div>
            <Award className="w-6 h-6 text-violet-200" />
          </div>
        </motion.div>
      </div>

      {/* Enhanced Control Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-6">
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-medium"
                placeholder="Workflow Name"
              />
              <input
                type="text"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Workflow Description"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTemplates(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 shadow-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Templates
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAnalytics(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 shadow-lg"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCode(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 shadow-lg"
            >
              <Code className="w-4 h-4 mr-2" />
              Export Code
            </motion.button>
          </div>
        </div>

        {/* Tool Selection with Enhanced Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {categories.map(category => (
              <option key={category.name} value={category.name}>{category.name}</option>
            ))}
          </select>
          
          <select
            value={selectedTool}
            onChange={(e) => setSelectedTool(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-[200px]"
          >
            <option value="">Select a tool...</option>
            {filteredTools.map(tool => (
              <option key={tool.name} value={tool.name}>
                {tool.name} ({tool.category})
              </option>
            ))}
          </select>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addStep}
            disabled={!selectedTool}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View:</span>
            {[
              { mode: 'canvas', icon: Grid, label: 'Canvas' },
              { mode: 'list', icon: List, label: 'List' },
              { mode: 'timeline', icon: Activity, label: 'Timeline' }
            ].map(({ mode, icon: Icon, label }) => (
              <motion.button
                key={mode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode(mode as any)}
                className={`flex items-center px-3 py-2 rounded-lg transition-all ${
                  viewMode === mode
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="w-4 h-4 mr-1" />
                {label}
              </motion.button>
            ))}
          </div>

          {/* Zoom Controls for Canvas */}
          {viewMode === 'canvas' && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Canvas/View Area */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {viewMode === 'canvas' && (
          <div 
            ref={canvasRef}
            className="relative h-full overflow-auto bg-gray-50 dark:bg-gray-900"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            
            <AnimatePresence>
              {workflow.map((step, index) => {
                const tool = step.tool;
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      x: step.position.x, 
                      y: step.position.y 
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`absolute w-80 rounded-xl shadow-lg border-2 ${getStepStatusColor(step.status)} cursor-move`}
                    drag
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={(event, info) => {
                      setIsDragging(false);
                      const newPosition = {
                        x: step.position.x + info.offset.x,
                        y: step.position.y + info.offset.y
                      };
                      setWorkflow(prev => prev.map(s => 
                        s.id === step.id ? { ...s, position: newPosition } : s
                      ));
                    }}
                    onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
                  >
                    {/* Enhanced Step Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          {tool && (
                            <img
                              src={tool.image}
                              alt={tool.name}
                              className="w-10 h-10 rounded-lg object-cover mr-3"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {tool?.name || 'Unknown Tool'}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Step {index + 1}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {step.status === 'running' && (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500 mr-2"></div>
                              <span className="text-xs text-yellow-600 dark:text-yellow-400">
                                {step.progress}%
                              </span>
                            </div>
                          )}
                          {step.status === 'completed' && (
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                              <span className="text-xs text-green-600 dark:text-green-400">
                                {step.executionTime}ms
                              </span>
                            </div>
                          )}
                          {step.status === 'error' && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          {step.status === 'paused' && (
                            <Pause className="w-4 h-4 text-orange-500" />
                          )}
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      {step.status === 'running' && step.progress !== undefined && (
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${step.progress}%` }}
                          />
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">
                          {tool?.category || 'Unknown'}
                        </span>
                        {tool?.rating && (
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-full flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            {tool.rating}
                          </span>
                        )}
                        {step.metadata?.tags?.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Step Content */}
                    <div className="p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {step.metadata?.description || tool?.description || 'No description available'}
                      </p>
                      
                      {/* Input/Output Ports */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                          <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400">Inputs</h5>
                          {step.inputs.map((input, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 ${getPortColor(input.type)} rounded-full border-2 border-white dark:border-gray-800 cursor-pointer hover:scale-110 transition-transform`}
                              title={`${input.name} (${input.type})`}
                            />
                          ))}
                        </div>
                        <div className="space-y-2">
                          <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400">Outputs</h5>
                          {step.outputs.map((output, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 ${getPortColor(output.type)} rounded-full border-2 border-white dark:border-gray-800 cursor-pointer hover:scale-110 transition-transform ml-auto`}
                              title={`${output.name} (${output.type})`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Step Actions */}
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateStep(step.id);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStep(step.id);
                            }}
                            className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all"
                            title="Configure"
                          >
                            <Settings className="w-4 h-4" />
                          </motion.button>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeStep(step.id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Enhanced Connection Lines */}
            <svg className="absolute inset-0 pointer-events-none">
              {connections.map((conn, index) => {
                const fromStep = workflow.find(s => s.id === conn.from);
                const toStep = workflow.find(s => s.id === conn.to);
                if (!fromStep || !toStep) return null;

                const fromX = fromStep.position.x + 320;
                const fromY = fromStep.position.y + 80;
                const toX = toStep.position.x;
                const toY = toStep.position.y + 80;

                return (
                  <motion.g key={index}>
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5 }}
                      d={`M ${fromX} ${fromY} C ${fromX + 100} ${fromY}, ${toX - 100} ${toY}, ${toX} ${toY}`}
                      stroke={conn.color || "#4c5cdf"}
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={conn.animated ? "8 8" : "none"}
                      markerEnd="url(#arrowhead)"
                    />
                    {conn.animated && (
                      <motion.circle
                        r="4"
                        fill={conn.color || "#4c5cdf"}
                        animate={{
                          offsetDistance: ["0%", "100%"]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        style={{
                          offsetPath: `path('M ${fromX} ${fromY} C ${fromX + 100} ${fromY}, ${toX - 100} ${toY}, ${toX} ${toY}')`
                        }}
                      />
                    )}
                  </motion.g>
                );
              })}
              
              {/* Enhanced Arrow marker */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="12"
                  markerHeight="8"
                  refX="11"
                  refY="4"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 12 4, 0 8"
                    fill="#4c5cdf"
                  />
                </marker>
              </defs>
            </svg>

            {/* Empty State */}
            {workflow.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Workflow className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
                    Start Building Your Workflow
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                    Select a tool from the dropdown above and click the + button to add your first step, or choose from our pre-built templates.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowTemplates(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg"
                  >
                    <Sparkles className="w-5 h-5 inline mr-2" />
                    Browse Templates
                  </motion.button>
                </motion.div>
              </div>
            )}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Workflow Steps ({workflow.length})
            </h3>
            {workflow.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 ${getStepStatusColor(step.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                      {index + 1}
                    </div>
                    {step.tool && (
                      <img
                        src={step.tool.image}
                        alt={step.tool.name}
                        className="w-10 h-10 rounded-lg object-cover mr-3"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {step.tool?.name || 'Unknown Tool'}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {step.metadata?.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      step.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                      step.status === 'running' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      step.status === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {step.status}
                    </span>
                    <button
                      onClick={() => removeStep(step.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {viewMode === 'timeline' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Execution Timeline
            </h3>
            <div className="space-y-4">
              {workflow.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center"
                >
                  <div className="flex items-center mr-6">
                    <div className={`w-4 h-4 rounded-full ${
                      step.status === 'completed' ? 'bg-green-500' :
                      step.status === 'running' ? 'bg-yellow-500' :
                      step.status === 'error' ? 'bg-red-500' :
                      'bg-gray-300'
                    }`} />
                    {index < workflow.length - 1 && (
                      <div className="w-px h-12 bg-gray-300 dark:bg-gray-600 ml-2" />
                    )}
                  </div>
                  <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {step.tool?.name || 'Unknown Tool'}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {step.executionTime ? `Completed in ${step.executionTime}ms` : 'Not executed'}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Step {index + 1}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Action Buttons */}
      <div className="flex flex-wrap justify-between items-center mt-6 gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveWorkflow}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 shadow-lg"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportWorkflow}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 shadow-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareWorkflow}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 shadow-lg"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetWorkflow}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 shadow-lg"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </motion.button>
        </div>
        
        <div className="flex items-center space-x-2">
          {isRunning && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={pauseWorkflow}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-lg hover:from-orange-700 hover:to-yellow-700 shadow-lg"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </motion.button>
          )}
          
          {(isRunning || isPaused) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopWorkflow}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 shadow-lg"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={runWorkflow}
            disabled={isRunning || workflow.length === 0}
            className={`flex items-center px-6 py-2 rounded-lg text-white font-medium shadow-lg ${
              isRunning || workflow.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running...' : isPaused ? 'Resume' : 'Run Workflow'}
          </motion.button>
        </div>
      </div>

      {/* Enhanced Templates Modal */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowTemplates(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Workflow Templates
                  </h3>
                  <button
                    onClick={() => setShowTemplates(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Template Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search templates..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Featured Templates */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 mr-2" />
                    Featured Templates
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.filter(t => t.featured).map((template, index) => (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white cursor-pointer hover:shadow-xl transition-all duration-300"
                        onClick={() => loadTemplate(template)}
                      >
                        <div className="absolute top-4 right-4">
                          <Star className="w-5 h-5 text-yellow-300" />
                        </div>
                        
                        <h5 className="font-bold text-lg mb-2">{template.name}</h5>
                        <p className="text-blue-100 text-sm mb-4 line-clamp-2">
                          {template.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                            {template.category}
                          </span>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-300 mr-1" />
                            <span className="text-sm">{template.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span>{template.estimatedTime}</span>
                          <span>{template.complexity}</span>
                        </div>
                        
                        <div className="flex items-center mt-4 text-sm">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{template.usageCount.toLocaleString()} uses</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* All Templates */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    All Templates ({filteredTemplates.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template, index) => (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300"
                        onClick={() => loadTemplate(template)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h5 className="font-semibold text-gray-900 dark:text-white">
                            {template.name}
                          </h5>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {template.rating}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {template.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {template.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>{template.estimatedTime} • {template.complexity}</span>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {template.usageCount.toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            by {template.author}
                          </span>
                          <ArrowRight className="w-4 h-4 text-blue-500" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analytics Modal */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAnalytics(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Workflow Analytics
                  </h3>
                  <button
                    onClick={() => setShowAnalytics(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Performance Metrics
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Avg Execution Time:</span>
                        <span className="font-medium">{workflowStats.avgExecutionTime.toFixed(0)}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Success Rate:</span>
                        <span className="font-medium">{workflowStats.successRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Efficiency Score:</span>
                        <span className="font-medium">{workflowStats.efficiency}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Execution Logs
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {executionLogs.slice(-10).map((log) => (
                        <div
                          key={log.id}
                          className={`text-sm p-2 rounded ${
                            log.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                            log.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          }`}
                        >
                          <div className="flex justify-between">
                            <span>{log.message}</span>
                            <span className="text-xs opacity-75">
                              {log.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))}
                      {executionLogs.length === 0 && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          No execution logs yet. Run your workflow to see logs here.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Code Export Modal */}
      <AnimatePresence>
        {showCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCode(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Export Workflow Code
                  </h3>
                  <button
                    onClick={() => setShowCode(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Python Implementation
                    </h4>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`# ${workflowName}
# ${workflowDescription}

import asyncio
from typing import Dict, Any

class WorkflowExecutor:
    def __init__(self):
        self.steps = []
        self.results = {}
    
    async def execute_workflow(self):
        """Execute the complete workflow"""
        print(f"Starting workflow: ${workflowName}")
        
        ${workflow.map((step, index) => `
        # Step ${index + 1}: ${step.tool?.name || 'Unknown Tool'}
        result_${index} = await self.execute_step_${index}()
        self.results['step_${index}'] = result_${index}
        print(f"Completed step ${index + 1}: {step.tool?.name || 'Unknown Tool'}")
        `).join('')}
        
        print("Workflow completed successfully!")
        return self.results
    
    ${workflow.map((step, index) => `
    async def execute_step_${index}(self):
        """${step.metadata?.description || step.tool?.description || 'Process data'}"""
        # TODO: Implement ${step.tool?.name || 'Unknown Tool'} logic
        await asyncio.sleep(1)  # Simulate processing
        return {"status": "completed", "data": "processed_data"}
    `).join('')}

# Usage
async def main():
    executor = WorkflowExecutor()
    results = await executor.execute_workflow()
    print("Final results:", results)

if __name__ == "__main__":
    asyncio.run(main())`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      JavaScript Implementation
                    </h4>
                    <pre className="bg-gray-900 text-blue-400 p-4 rounded-lg overflow-x-auto text-sm">
{`// ${workflowName}
// ${workflowDescription}

class WorkflowExecutor {
    constructor() {
        this.steps = [];
        this.results = {};
    }
    
    async executeWorkflow() {
        console.log('Starting workflow: ${workflowName}');
        
        ${workflow.map((step, index) => `
        // Step ${index + 1}: ${step.tool?.name || 'Unknown Tool'}
        const result${index} = await this.executeStep${index}();
        this.results['step${index}'] = result${index};
        console.log('Completed step ${index + 1}: ${step.tool?.name || 'Unknown Tool'}');
        `).join('')}
        
        console.log('Workflow completed successfully!');
        return this.results;
    }
    
    ${workflow.map((step, index) => `
    async executeStep${index}() {
        // ${step.metadata?.description || step.tool?.description || 'Process data'}
        // TODO: Implement ${step.tool?.name || 'Unknown Tool'} logic
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { status: 'completed', data: 'processed_data' };
    }
    `).join('')}
}

// Usage
async function main() {
    const executor = new WorkflowExecutor();
    const results = await executor.executeWorkflow();
    console.log('Final results:', results);
}

main().catch(console.error);`}
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkflowBuilder;