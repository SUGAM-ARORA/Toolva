import React, { useState } from 'react';
import { HelpCircle, Search, ChevronDown, Mail, MessageCircle, FileText, ArrowLeft, Shield, Crown, Sparkles, BookOpen, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

interface FAQCategory {
  id: string;
  name: string;
  icon: any;
  items: {
    question: string;
    answer: string;
  }[];
}

const faqCategories: FAQCategory[] = [
  {
    id: 'general',
    name: 'General & Navigation',
    icon: HelpCircle,
    items: [
      {
        question: 'What is Toolva.ai?',
        answer: 'Toolva.ai is a next-generation AI tools directory and workflow discovery engine. It indexes over 600+ curated AI tools across dozens of specialized engineering and creative categories, helping professionals discover, compare, and integrate AI models into their everyday workflows.'
      },
      {
        question: 'Is Toolva free to use?',
        answer: 'Yes! Browsing the directory, testing model recommendations, comparing tools side-by-side, and reading in-depth model breakdowns are 100% free for all users.'
      },
      {
        question: 'How do layout views work (Grid, List, Table)?',
        answer: 'Toolva supports three dynamic directory views: Grid View for visual card exploration, List View for compact reading, and Table View for structured data comparisons. You can switch views anytime using the top navigation bar toggle.'
      }
    ]
  },
  {
    id: 'roles',
    name: '10-Role Security & Levels',
    icon: Shield,
    items: [
      {
        question: 'What are the 10 platform roles and expertise levels?',
        answer: 'Toolva features a structured 10-role hierarchy: Novice (0–20 tools used), Practitioner (21–60 tools), Proficient (61–120 tools), Expert (121–500 tools), Master (501+ tools), Admin (Reviewer & Curator), Lead (Ecosystem Lead), Platform Reader (Analytics & Read-only), Platform Owner (Directory Owner), and SuperAdmin (Root Control).'
      },
      {
        question: 'How do I level up my account role?',
        answer: 'Your account automatically progresses through the expertise tiers (Novice → Practitioner → Proficient → Expert → Master) based on your real activity and tools opened in the platform.'
      },
      {
        question: 'Can users change their own account roles from Edit Profile?',
        answer: 'No. Self-elevation is locked for platform security. Roles can ONLY be edited and assigned by the SuperAdmin via the User Management Dashboard (/users) or directly in the database.'
      }
    ]
  },
  {
    id: 'submissions',
    name: 'Tool Submissions & Approvals',
    icon: Crown,
    items: [
      {
        question: 'How do I submit a new AI tool to the directory?',
        answer: 'Click the "Submit Tool" (+) button in the navigation bar. Provide your tool\'s name, description, category, website URL, and optional tech stack. Once submitted, your tool enters the SuperAdmin verification queue.'
      },
      {
        question: 'How long does tool verification take?',
        answer: 'Real tool submissions are reviewed by SuperAdmins in the Toolva Control Centre (/admin). Once approved, your tool immediately goes live across the directory grid.'
      },
      {
        question: 'Can I submit tools via GitHub PR?',
        answer: 'Yes! Developers can submit pull requests adding tool definitions directly to src/data/unifiedTools.ts following our standard JSON schema.'
      }
    ]
  },
  {
    id: 'claude',
    name: 'Claude & AI Model Breakdowns',
    icon: Sparkles,
    items: [
      {
        question: 'What is the Claude Model Suite Breakdown Guide?',
        answer: 'When searching for Claude models (3.7 Sonnet, 4.8 Opus, 3.5 Haiku, Mythos, Fable), Toolva presents a dedicated engineering guide breaking down the Why, When, How, Where, and Which model is optimal for your project requirements.'
      },
      {
        question: 'How do I save favorite tools?',
        answer: 'Click the heart icon on any AI tool card to add it to your Favorites list. You can view all saved tools anytime by visiting the Favorites page.'
      }
    ]
  }
];

const HelpFAQ: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openItem, setOpenItem] = useState<string | null>(null);

  const handleBackHome = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-white pt-20 pb-24 font-sans">
      {/* Sub-header Navigation Bar offset to avoid TOOLVA.AI collision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3 ml-36 sm:ml-40">
          <button
            onClick={handleBackHome}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white dark:bg-[#141721] hover:bg-gray-100 dark:hover:bg-[#1c202f] border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-orange-500" />
            <span>Back to AI Directory</span>
          </button>
        </div>

        <Link
          to="/contact"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30 text-xs font-bold transition-transform active:scale-95"
        >
          <Mail className="w-4 h-4" />
          <span>Contact Support</span>
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
            Knowledge Base & FAQ
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Everything you need to know about navigating Toolva, account roles, tool submissions, and AI model breakdowns.
          </p>

          {/* Search Input */}
          <div className="max-w-xl mx-auto relative pt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions, roles, or submission guides..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-[#141721] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-lg text-xs sm:text-sm font-medium"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white dark:bg-[#141721] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-orange-500'
            }`}
          >
            All Questions
          </button>
          {faqCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white dark:bg-[#141721] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-orange-500'
              }`}
            >
              <cat.icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqCategories
            .filter(cat => activeCategory === 'all' || activeCategory === cat.id)
            .map(cat => {
              const matchingItems = cat.items.filter(item =>
                !searchQuery ||
                item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.answer.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (matchingItems.length === 0) return null;

              return (
                <div key={cat.id} className="space-y-3">
                  <h3 className="text-xs font-extrabold uppercase font-mono tracking-widest text-orange-500 pt-2 flex items-center gap-2">
                    <cat.icon className="w-4 h-4" />
                    <span>{cat.name}</span>
                  </h3>

                  <div className="space-y-2">
                    {matchingItems.map((item, idx) => {
                      const itemKey = `${cat.id}-${idx}`;
                      const isOpen = openItem === itemKey;

                      return (
                        <div
                          key={itemKey}
                          className="bg-white dark:bg-[#141721] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all shadow-sm"
                        >
                          <button
                            onClick={() => toggleItem(itemKey)}
                            className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-gray-900 dark:text-white hover:text-orange-500 transition-colors"
                          >
                            <span>{item.question}</span>
                            <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-orange-500' : 'text-gray-400'}`} />
                          </button>

                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-4 sm:px-5 pb-5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800/80 pt-3"
                              >
                                {item.answer}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Still Have Questions Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-black">Still Have Questions?</h3>
            <p className="text-xs text-white/80 mt-1">Our support engineering team is here to assist you.</p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 bg-white text-purple-600 hover:bg-orange-500 hover:text-white font-bold text-xs rounded-xl shadow-md transition-all whitespace-nowrap"
          >
            Contact Support Team
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HelpFAQ;
