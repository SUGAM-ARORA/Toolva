import React, { useState } from 'react';
import { HelpCircle, Search, ChevronDown, ChevronUp, Mail, MessageCircle, FileText, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: 'What is ToolVa?',
    answer: 'ToolVa is the ultimate directory for AI tools and resources. We curate the best AI applications across various categories to help you find the perfect solution for your workflow.',
  },
  {
    question: 'How do I submit an AI tool?',
    answer: 'You can submit a tool by navigating to the "Samarp" (Submit) section using the bottom navigation or sidebar. Fill out the required details, and our team will review it before publishing.',
  },
  {
    question: 'Is it free to use ToolVa?',
    answer: 'Yes! Browsing and finding tools on ToolVa is completely free for all users.',
  },
  {
    question: 'How are tools verified?',
    answer: 'Our team manually reviews each submission to ensure it meets our quality standards, is genuinely powered by AI, and provides value to our users.',
  },
  {
    question: 'Can I save my favorite tools?',
    answer: 'Yes! You can create an account and click the heart icon on any tool card to save it to your Favorites for quick access later.',
  }
];

const HelpFAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-12">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
        
        {/* Header Section */}
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center mx-auto"
          >
            <HelpCircle className="w-10 h-10" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            How can we help?
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Search our knowledge base or browse frequently asked questions to find the answers you need.
          </p>

          <div className="max-w-xl mx-auto relative mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all shadow-sm text-lg"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/contact" className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all group flex flex-col items-center text-center">
            <Mail className="w-8 h-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Contact Support</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Reach out directly to our team.</p>
          </Link>
          <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all group flex flex-col items-center text-center cursor-pointer">
            <MessageCircle className="w-8 h-8 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Community Forum</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Join the discussion with others.</p>
          </div>
          <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all group flex flex-col items-center text-center cursor-pointer">
            <FileText className="w-8 h-8 text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Documentation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Read our detailed API guides.</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-gray-800/50 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div key={index} className="p-2">
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white text-lg pr-8">
                      {faq.question}
                    </span>
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                No questions found matching "{searchQuery}".
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HelpFAQ;
