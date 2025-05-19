import React, { useState } from 'react';
import { Plus, ArrowRight, Save, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiTools } from '../data/aiTools';

interface WorkflowStep {
  id: string;
  toolId: string;
  config: Record<string, any>;
}

const WorkflowBuilder = () => {
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([]);
  const [selectedTool, setSelectedTool] = useState('');

  const addStep = () => {
    if (!selectedTool) return;
    
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      toolId: selectedTool,
      config: {}
    };

    setWorkflow([...workflow, newStep]);
    setSelectedTool('');
  };

  const removeStep = (stepId: string) => {
    setWorkflow(workflow.filter(step => step.id !== stepId));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Stack It - Custom Workflow Builder
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Create powerful AI workflows by combining multiple tools
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <select
            value={selectedTool}
            onChange={(e) => setSelectedTool(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Select a tool...</option>
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

        <div className="space-y-4">
          <AnimatePresence>
            {workflow.map((step, index) => {
              const tool = aiTools.find(t => t.name === step.toolId);
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex items-center space-x-4"
                >
                  {index > 0 && (
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  )}
                  <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
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
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {tool?.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {workflow.length > 0 && (
          <div className="flex justify-end space-x-4 mt-8">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Save className="w-5 h-5" />
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Play className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowBuilder;