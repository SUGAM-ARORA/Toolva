import React, { useState } from 'react';
import { BarChart3, DollarSign, Users, Zap, Star } from 'lucide-react';

interface CompareToolsProps {
  tools: any[];
}

export default function CompareTools({ tools }: CompareToolsProps) {
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  const handleToolSelect = (toolName: string) => {
    if (selectedTools.includes(toolName)) {
      setSelectedTools(selectedTools.filter(t => t !== toolName));
    } else if (selectedTools.length < 3) {
      setSelectedTools([...selectedTools, toolName]);
    }
  };

  const getComparisonData = () => {
    return selectedTools.map(toolName => tools.find(t => t.name === toolName));
  };

  const renderMetricBar = (value: number, maxValue: number = 5) => {
    const percentage = (value / maxValue) * 100;
    return (
      <div className="w-full bg-gray-200 dark:bg-dark-400 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white dark:bg-dark-200 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Compare AI Tools</h2>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Select up to 3 tools to compare:</h3>
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => (
              <button
                key={tool.name}
                onClick={() => handleToolSelect(tool.name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTools.includes(tool.name)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-400'
                }`}
              >
                {tool.name}
              </button>
            ))}
          </div>
        </div>

        {selectedTools.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-dark-400">
                  <th className="text-left py-4 px-6">Features</th>
                  {getComparisonData().map((tool) => (
                    <th key={tool.name} className="text-left py-4 px-6">
                      <div className="flex items-center gap-2">
                        <img
                          src={tool.image}
                          alt={tool.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <span className="font-semibold text-gray-900 dark:text-white">{tool.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b dark:border-dark-400">
                  <td className="py-4 px-6 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-gray-500" />
                    <span>Pricing</span>
                  </td>
                  {getComparisonData().map((tool) => (
                    <td key={tool.name} className="py-4 px-6 text-gray-700 dark:text-gray-300">
                      {tool.pricing}
                    </td>
                  ))}
                </tr>
                <tr className="border-b dark:border-dark-400">
                  <td className="py-4 px-6 flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span>Daily Active Users</span>
                  </td>
                  {getComparisonData().map((tool) => (
                    <td key={tool.name} className="py-4 px-6 text-gray-700 dark:text-gray-300">
                      {tool.dailyUsers}
                    </td>
                  ))}
                </tr>
                <tr className="border-b dark:border-dark-400">
                  <td className="py-4 px-6 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-gray-500" />
                    <span>Model Type</span>
                  </td>
                  {getComparisonData().map((tool) => (
                    <td key={tool.name} className="py-4 px-6 text-gray-700 dark:text-gray-300">
                      {tool.modelType}
                    </td>
                  ))}
                </tr>
                <tr className="border-b dark:border-dark-400">
                  <td className="py-4 px-6 flex items-center gap-2">
                    <Star className="h-5 w-5 text-gray-500" />
                    <span>Ease of Use</span>
                  </td>
                  {getComparisonData().map((tool) => (
                    <td key={tool.name} className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 dark:text-gray-300">{tool.easeOfUse}</span>
                        {renderMetricBar(tool.easeOfUse)}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-b dark:border-dark-400">
                  <td className="py-4 px-6 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-gray-500" />
                    <span>Code Quality</span>
                  </td>
                  {getComparisonData().map((tool) => (
                    <td key={tool.name} className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 dark:text-gray-300">
                          {tool.codeQuality === 'N/A' ? 'N/A' : tool.codeQuality}
                        </span>
                        {tool.codeQuality !== 'N/A' && renderMetricBar(tool.codeQuality)}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span>User Experience</span>
                  </td>
                  {getComparisonData().map((tool) => (
                    <td key={tool.name} className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 dark:text-gray-300">{tool.userExperience}</span>
                        {renderMetricBar(tool.userExperience)}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}