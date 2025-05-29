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
      setSearchQuery(''); // Clear search after selection
    }
  };

  const handleRemoveTool = (toolName: string) => {
    setSelectedTools(selectedTools.filter(tool => tool.name !== toolName));
  };

  const filteredTools = tools.filter(tool =>
    (tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    !selectedTools.find(t => t.name === tool.name)
  );

  const getComparisonValue = (value: any) => {
    if (value === undefined || value === null || value === '') {
      return 'N/A';
    }
    return value;
  };

  const comparisonFeatures = [
    { label: 'Category', key: 'category' },
    { label: 'Pricing', key: 'pricing' },
    { label: 'Rating', key: 'rating' },
    { label: 'Daily Users', key: 'dailyUsers' },
    { label: 'Model Type', key: 'modelType' },
    { label: 'Ease of Use', key: 'easeOfUse' },
    { label: 'Code Quality', key: 'codeQuality' },
    { label: 'User Experience', key: 'userExperience' }
  ];

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
      {selectedTools.length < 3 && (
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
              {filteredTools.length > 0 ? (
                filteredTools.map(tool => (
                  <button
                    key={tool.name}
                    onClick={() => handleAddTool(tool)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {tool.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {tool.category}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  No matching tools found
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Comparison Table */}
      {selectedTools.length > 0 ? (
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
              {comparisonFeatures.map(feature => (
                <tr key={feature.key}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {feature.label}
                  </td>
                  {selectedTools.map(tool => (
                    <td key={`${tool.name}-${feature.key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {getComparisonValue(tool[feature.key as keyof AITool])}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Additional Features */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  GitHub Repository
                </td>
                {selectedTools.map(tool => (
                  <td key={`${tool.name}-github`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {tool.github ? (
                      <a
                        href={tool.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View Repository
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Select tools to compare their features
          </p>
        </div>
      )}
    </div>
  );
};

export default CompareTools;