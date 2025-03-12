import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { AITool } from '../types';

interface CompareToolsProps {
  tools: AITool[];
}

const CompareTools: React.FC<CompareToolsProps> = ({ tools }) => {
  const [selectedTools, setSelectedTools] = useState<AITool[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddTool = (tool: AITool) => {
    if (selectedTools.length < 3 && !selectedTools.find(t => t.name === tool.name)) {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  const handleRemoveTool = (toolName: string) => {
    setSelectedTools(selectedTools.filter(tool => tool.name !== toolName));
  };

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderComparisonTable = () => {
    if (selectedTools.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Select up to 3 tools to compare
          </p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Feature
              </th>
              {selectedTools.map(tool => (
                <th key={tool.name} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {tool.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                Category
              </td>
              {selectedTools.map(tool => (
                <td key={tool.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {tool.category}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                Pricing
              </td>
              {selectedTools.map(tool => (
                <td key={tool.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {tool.pricing}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                Rating
              </td>
              {selectedTools.map(tool => (
                <td key={tool.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {tool.rating || 'N/A'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                Daily Users
              </td>
              {selectedTools.map(tool => (
                <td key={tool.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {tool.dailyUsers || 'N/A'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                Model Type
              </td>
              {selectedTools.map(tool => (
                <td key={tool.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {tool.modelType || 'N/A'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                Ease of Use
              </td>
              {selectedTools.map(tool => (
                <td key={tool.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {tool.easeOfUse || 'N/A'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                Code Quality
              </td>
              {selectedTools.map(tool => (
                <td key={tool.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {tool.codeQuality || 'N/A'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                User Experience
              </td>
              {selectedTools.map(tool => (
                <td key={tool.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {tool.userExperience || 'N/A'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Compare AI Tools
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select up to 3 tools to compare their features and capabilities
        </p>
      </div>

      {/* Selected Tools */}
      <div className="flex flex-wrap gap-4 mb-8">
        {selectedTools.map(tool => (
          <div
            key={tool.name}
            className="flex items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg"
          >
            <span className="text-blue-700 dark:text-blue-300 font-medium">
              {tool.name}
            </span>
            <button
              onClick={() => handleRemoveTool(tool.name)}
              className="ml-2 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Search and Tool Selection */}
      <div className="mb-8">
        <div className="relative max-w-xl">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for tools to compare..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {searchQuery && (
          <div className="mt-4 max-h-64 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            {filteredTools.map(tool => (
              <button
                key={tool.name}
                onClick={() => handleAddTool(tool)}
                disabled={selectedTools.find(t => t.name === tool.name)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  selectedTools.find(t => t.name === tool.name)
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {tool.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {tool.category}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Comparison Table */}
      {renderComparisonTable()}
    </div>
  );
};

export default CompareTools;