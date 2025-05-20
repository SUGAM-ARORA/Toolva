import React, { useState } from 'react';
import { Plus, ArrowRight, Save, Play, Download, Share2, Code, Settings, Database, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiTools } from '../data/aiTools';

interface WorkflowStep {
  id: string;
  toolId: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

interface Connection {
  from: string;
  to: string;
}

const WorkflowBuilder = () => {
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedTool, setSelectedTool] = useState('');
  const [workflowName, setWorkflowName] = useState('My Workflow');
  const [isDragging, setIsDragging] = useState(false);

  const addStep = () => {
    if (!selectedTool) return;
    
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      toolId: selectedTool,
      config: {},
      position: {
        x: workflow.length * 200 + 100,
        y: 200
      }
    };

    setWorkflow([...workflow, newStep]);
    setSelectedTool('');
  };

  const removeStep = (stepId: string) => {
    setWorkflow(workflow.filter(step => step.id !== stepId));
    setConnections(connections.filter(conn => conn.from !== stepId && conn.to !== stepId));
  };

  const handleDragStart = (e: React.DragEvent, stepId: string) => {
    e.dataTransfer.setData('stepId', stepId);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    const sourceId = e.dataTransfer.getData('stepId');
    if (sourceId !== targetId) {
      setConnections([...connections, { from: sourceId, to: targetId }]);
    }
  };

  const exportWorkflow = () => {
    const workflowData = {
      name: workflowName,
      steps: workflow,
      connections,
      metadata: {
        created: new Date().toISOString(),
        version: '1.0'
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
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Workflow Builder
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Create powerful AI workflows by connecting multiple tools
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Workflow Name"
          />
          <div className="flex gap-2">
            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Add a tool...</option>
              {aiTools.map(tool => (
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

        <div className="relative min-h-[600px] border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-auto">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          
          <AnimatePresence>
            {workflow.map((step, index) => {
              const tool = aiTools.find(t => t.name === step.toolId);
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1, x: step.position.x, y: step.position.y }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute w-64 bg-white dark:bg-gray-700 rounded-lg shadow-lg"
                  draggable
                  onDragStart={(e) => handleDragStart(e, step.id)}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDrop(e, step.id)}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {tool?.name}
                      </h3>
                      <button
                        onClick={() => removeStep(step.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">
                        {tool?.category}
                      </span>
                      {index > 0 && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full">
                          Input: Step {index}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2">
                      <button className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </button>
                      <button className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                        <Code className="w-4 h-4 mr-2" />
                        View Code
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
                <path
                  key={index}
                  d={`M ${fromStep.position.x + 256} ${fromStep.position.y + 50} C ${fromStep.position.x + 356} ${fromStep.position.y + 50}, ${toStep.position.x - 100} ${toStep.position.y + 50}, ${toStep.position.x} ${toStep.position.y + 50}`}
                  stroke="#4c5cdf"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={isDragging ? "4 4" : "none"}
                />
              );
            })}
          </svg>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={exportWorkflow}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-5 h-5 mr-2" />
            Export
          </button>
          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Play className="w-5 h-5 mr-2" />
            Run Workflow
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Available Integrations
          </h3>
          <div className="space-y-4">
            {['OpenAI', 'Anthropic', 'Google AI', 'Hugging Face'].map((integration) => (
              <div key={integration} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">{integration}</span>
                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Templates
          </h3>
          <div className="space-y-4">
            {['Content Generation', 'Image Processing', 'Data Analysis', 'Text Translation'].map((template) => (
              <div key={template} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">{template}</span>
                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;