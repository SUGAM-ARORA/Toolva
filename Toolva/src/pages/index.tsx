import { useState } from 'react';
import { AITool } from '../types';
import { aiTools } from '../data/aiTools';
import SubmitTool from '../components/SubmitTool';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  const categories = ['all', ...new Set(aiTools.map(tool => tool.category))];
  
  const filteredTools = aiTools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredTools = aiTools.filter(tool => tool.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
              AI Tools Directory
            </h1>
            <button
              onClick={() => setShowSubmitForm(!showSubmitForm)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showSubmitForm ? 'Browse Tools' : 'Submit New Tool'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showSubmitForm ? (
          <SubmitTool />
        ) : (
          <>
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {featuredTools.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Tools</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredTools.map(tool => (
                      <FeaturedToolCard key={tool.name} tool={tool} />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTools.map(tool => (
                  <ToolCard key={tool.name} tool={tool} />
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

const ToolCard: React.FC<{ tool: AITool }> = ({ tool }) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{tool.category}</p>
      </div>
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-900">{tool.rating}</span>
        <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>
    </div>
    
    <p className="mt-3 text-sm text-gray-600 line-clamp-2">{tool.description}</p>
    
    <div className="mt-4 flex flex-wrap gap-2">
      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
        {tool.pricing}
      </span>
      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        {tool.dailyUsers} users
      </span>
    </div>
    
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Visit Website
    </a>
  </div>
);

const FeaturedToolCard: React.FC<{ tool: AITool }> = ({ tool }) => (
  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-xl font-bold">{tool.name}</h3>
        <p className="text-blue-100 mt-1">{tool.category}</p>
      </div>
      <div className="flex items-center bg-white/20 px-2 py-1 rounded-full">
        <span className="font-medium">{tool.rating}</span>
        <svg className="w-4 h-4 text-yellow-300 ml-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>
    </div>
    
    <p className="mt-4 text-blue-50 line-clamp-3">{tool.description}</p>
    
    <div className="mt-6 flex flex-wrap gap-2">
      <span className="px-3 py-1 text-sm font-medium bg-white/20 rounded-full">
        {tool.pricing}
      </span>
      <span className="px-3 py-1 text-sm font-medium bg-white/20 rounded-full">
        {tool.dailyUsers} users
      </span>
    </div>
    
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 block w-full text-center py-3 px-4 border-2 border-white rounded-lg text-sm font-bold text-white hover:bg-white hover:text-blue-600 transition-colors"
    >
      Try Now
    </a>
  </div>
); 