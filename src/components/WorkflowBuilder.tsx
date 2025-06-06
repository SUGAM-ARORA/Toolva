import React, { useState, useEffect } from 'react';
import { Plus, ArrowRight, Save, Play, Download, Share2, Code, Settings, Database, Zap, Trash2, Copy, GitBranch, Brain, Target, Workflow, Sparkles, Clock, Users, Star, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AITool } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface WorkflowStep {
  id: string;
  toolId: string;
  config: Record<string, unknown>;
  position: { x: number; y: number };
  inputs: string[];
  outputs: string[];
  status: 'idle' | 'running' | 'completed' | 'error';
}

interface Connection {
  from: string;
  to: string;
  fromOutput: string;
  toInput: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: WorkflowStep[];
  connections: Connection[];
  estimatedTime: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  usageCount: number;
}

interface WorkflowBuilderProps {
  tools: AITool[];
}

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ tools }) => {
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedTool, setSelectedTool] = useState('');
  const [workflowName, setWorkflowName] = useState('My AI Workflow');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [workflowStats, setWorkflowStats] = useState({
    totalSteps: 0,
    estimatedTime: '0 min',
    complexity: 'Beginner',
    efficiency: 0
  });

  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: '1',
      name: 'Content Creation Pipeline',
      description: 'Generate blog posts with AI writing, image creation, and SEO optimization',
      category: 'Content',
      steps: [],
      connections: [],
      estimatedTime: '15 min',
      complexity: 'Intermediate',
      usageCount: 1250
    },
    {
      id: '2',
      name: 'Data Analysis Workflow',
      description: 'Analyze data, generate insights, and create visualizations',
      category: 'Analytics',
      steps: [],
      connections: [],
      estimatedTime: '20 min',
      complexity: 'Advanced',
      usageCount: 890
    },
    {
      id: '3',
      name: 'Social Media Automation',
      description: 'Create posts, generate images, and schedule across platforms',
      category: 'Marketing',
      steps: [],
      connections: [],
      estimatedTime: '10 min',
      complexity: 'Beginner',
      usageCount: 2100
    }
  ];


  const calculateWorkflowStats = React.useCallback(() => {
    const totalSteps = workflow.length;
    const estimatedMinutes = totalSteps * 2; // 2 minutes per step average
    const complexity = totalSteps <= 3 ? 'Beginner' : totalSteps <= 6 ? 'Intermediate' : 'Advanced';
    const efficiency = Math.min(100, Math.max(0, 100 - (connections.length * 5) + (totalSteps * 10)));

    setWorkflowStats({
      totalSteps,
      estimatedTime: `${estimatedMinutes} min`,
      complexity,
      efficiency
    });
  }, [workflow, connections]);

  useEffect(() => {
    calculateWorkflowStats();
  }, [calculateWorkflowStats]);

  const addStep = () => {
    if (!selectedTool) return;
    
    const tool = tools.find(t => t.name === selectedTool);
    if (!tool) return;

    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      toolId: selectedTool,
      config: {},
      position: {
        x: workflow.length * 250 + 100,
        y: 200 + Math.random() * 100
      },
      inputs: ['data'],
      outputs: ['result'],
      status: 'idle'
    };

    setWorkflow([...workflow, newStep]);
    setSelectedTool('');
    toast.success(`${tool.name} added to workflow`);
  };

  const removeStep = (stepId: string) => {
    setWorkflow(workflow.filter(step => step.id !== stepId));
    setConnections(connections.filter(conn => conn.from !== stepId && conn.to !== stepId));
    toast.success('Step removed from workflow');
  };

  const duplicateStep = (stepId: string) => {
    const step = workflow.find(s => s.id === stepId);
    if (!step) return;

    const newStep: WorkflowStep = {
      ...step,
      id: Date.now().toString(),
      position: {
        x: step.position.x + 50,
        y: step.position.y + 50
      }
    };

    setWorkflow([...workflow, newStep]);
    toast.success('Step duplicated');
  };


  const runWorkflow = async () => {
    if (workflow.length === 0) {
      toast.error('Add steps to your workflow first');
      return;
    }

    setIsRunning(true);
    
    // Simulate workflow execution
    for (let i = 0; i < workflow.length; i++) {
      const step = workflow[i];
      
      // Update step status to running
      setWorkflow(prev => prev.map(s => 
        s.id === step.id ? { ...s, status: 'running' } : s
      ));
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Update step status to completed
      setWorkflow(prev => prev.map(s => 
        s.id === step.id ? { ...s, status: 'completed' } : s
      ));
    }

    setIsRunning(false);
    toast.success('Workflow completed successfully!');
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
        steps: workflow,
        connections,
        user_id: user.id,
        metadata: {
          created: new Date().toISOString(),
          version: '1.0',
          stats: workflowStats
        }
      };

      // In a real app, you'd save to Supabase
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
      steps: workflow,
      connections,
      metadata: {
        created: new Date().toISOString(),
        version: '1.0',
        stats: workflowStats
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

  const loadTemplate = (template: WorkflowTemplate) => {
    setWorkflowName(template.name);
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
      default: return 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full mb-6"
        >
          <Workflow className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">Visual Workflow Builder</span>
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
          Connect AI tools visually to create automated workflows that save time and boost productivity
        </motion.p>
      </div>

      {/* Workflow Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Steps</p>
              <p className="text-2xl font-bold">{workflowStats.totalSteps}</p>
            </div>
            <Target className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Est. Time</p>
              <p className="text-2xl font-bold">{workflowStats.estimatedTime}</p>
            </div>
            <Clock className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Complexity</p>
              <p className="text-2xl font-bold">{workflowStats.complexity}</p>
            </div>
            <Brain className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Efficiency</p>
              <p className="text-2xl font-bold">{workflowStats.efficiency}%</p>
            </div>
            <Zap className="w-8 h-8 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Workflow Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-medium"
              placeholder="Workflow Name"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowTemplates(true)}
              className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Templates
            </button>
            
            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Add a tool...</option>
              {tools.map(tool => (
                <option key={tool.name} value={tool.name}>
                  {tool.name}
                </option>
              ))}
            </select>
            
            <button
              onClick={addStep}
              disabled={!selectedTool}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative min-h-[600px] border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          
          <AnimatePresence>
            {workflow.map((step, index) => {
              const tool = tools.find(t => t.name === step.toolId);
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
                  className={`absolute w-72 rounded-xl shadow-lg border-2 ${getStepStatusColor(step.status)} cursor-move`}
                  drag
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={() => setIsDragging(false)}
                  onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
                >
                  {/* Step Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {tool && (
                          <img
                            src={tool.image}
                            alt={tool.name}
                            className="w-8 h-8 rounded-lg object-cover mr-3"
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
                      
                      <div className="flex items-center space-x-1">
                        {step.status === 'running' && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
                        )}
                        {step.status === 'completed' && (
                          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        )}
                        {step.status === 'error' && (
                          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
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
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {tool?.description || 'No description available'}
                    </p>
                    
                    {/* Input/Output Ports */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex flex-col space-y-1">
                        {step.inputs.map((input, i) => (
                          <div
                            key={i}
                            className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800"
                            title={`Input: ${input}`}
                          />
                        ))}
                      </div>
                      <div className="flex flex-col space-y-1">
                        {step.outputs.map((output, i) => (
                          <div
                            key={i}
                            className="w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
                            title={`Output: ${output}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Step Actions */}
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateStep(step.id);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStep(step.id);
                          }}
                          className="p-1 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                          title="Configure"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeStep(step.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Connection Lines */}
          <svg className="absolute inset-0 pointer-events-none">
            {connections.map((conn, index) => {
              const fromStep = workflow.find(s => s.id === conn.from);
              const toStep = workflow.find(s => s.id === conn.to);
              if (!fromStep || !toStep) return null;

              return (
                <motion.path
                  key={index}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                  d={`M ${fromStep.position.x + 288} ${fromStep.position.y + 80} C ${fromStep.position.x + 388} ${fromStep.position.y + 80}, ${toStep.position.x - 100} ${toStep.position.y + 80}, ${toStep.position.x} ${toStep.position.y + 80}`}
                  stroke="#4c5cdf"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={isDragging ? "8 8" : "none"}
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
            
            {/* Arrow marker */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#4c5cdf"
                />
              </marker>
            </defs>
          </svg>

          {/* Empty State */}
          {workflow.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Workflow className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Start Building Your Workflow
                </h3>
                <p className="text-gray-400 dark:text-gray-500">
                  Select a tool from the dropdown above and click the + button to add your first step
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-between items-center mt-6 gap-4">
          <div className="flex space-x-2">
            <button
              onClick={saveWorkflow}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
            <button
              onClick={exportWorkflow}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
          
          <button
            onClick={runWorkflow}
            disabled={isRunning || workflow.length === 0}
            className={`flex items-center px-6 py-2 rounded-lg text-white font-medium ${
              isRunning || workflow.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running...' : 'Run Workflow'}
          </button>
        </div>
      </div>

      {/* Templates Modal */}
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Workflow Templates
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {workflowTemplates.map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => loadTemplate(template)}
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {template.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">
                          {template.category}
                        </span>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Users className="w-4 h-4 mr-1" />
                          {template.usageCount}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {template.estimatedTime} • {template.complexity}
                        </span>
                        <ArrowRight className="w-4 h-4 text-blue-500" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Integration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Available Integrations
          </h3>
          <div className="space-y-4">
            {['OpenAI API', 'Anthropic Claude', 'Google AI', 'Hugging Face', 'Stability AI', 'Replicate'].map((integration, index) => (
              <motion.div
                key={integration}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">{integration}</span>
                </div>
                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                  Configure
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Quick Actions
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Import from JSON', icon: GitBranch },
              { label: 'Share Workflow', icon: Share2 },
              { label: 'View Code', icon: Code },
              { label: 'Performance Analytics', icon: BarChart3 }
            ].map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="w-full flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-left"
              >
                <action.icon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;