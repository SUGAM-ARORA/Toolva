import React, { useState } from 'react';
import { Mail, HelpCircle, Send, MessageSquare, CheckCircle, ArrowLeft, Shield, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ContactHelpProps {
  onBackToHome?: () => void;
}

const faqs = [
  {
    question: "How do I submit an AI tool to Toolva?",
    answer: "Sign in to your account and click the 'Submit Tool' button in the navigation bar. Fill out your tool's name, description, category, and website link. All submissions are reviewed by an Admin before publishing."
  },
  {
    question: "How does the AI Model Suite Guide work?",
    answer: "When searching for models like Claude (3.7 Sonnet, 4.8 Opus, 3.5 Haiku, Mythos, Fable), click 'View Model Breakdown' to see in-depth insights on Why, When, How, Where, and Which model is best suited for your engineering workflow."
  },
  {
    question: "Is Toolva free to use?",
    answer: "Yes! Browsing the directory, comparing tools side-by-side, and reading model breakdown guides are 100% free for all registered users."
  },
  {
    question: "How do I enable 2FA on my account?",
    answer: "Navigate to Account Settings -> Two-Factor Authentication, click 'Setup 2FA with Authenticator App', scan the QR code with Google Authenticator or Authy, and enter your 6-digit passcode."
  }
];

const ContactHelp: React.FC<ContactHelpProps> = ({ onBackToHome }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success('Your message has been sent to Toolva Support!');
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {onBackToHome && (
        <button
          onClick={onBackToHome}
          className="inline-flex items-center text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to AI Directory
        </button>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-purple-600 p-8 rounded-3xl text-white shadow-xl text-center space-y-2">
        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Unified Help & Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          How Can We Help You Today?
        </h1>
        <p className="text-xs sm:text-sm text-white/90 max-w-xl mx-auto">
          Got questions, feedback, or need assistance? Reach out to our official support team at{' '}
          <a href="mailto:support.toolva@gmail.com" className="font-bold underline">
            support.toolva@gmail.com
          </a>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Direct Contact Form */}
        <div className="bg-white dark:bg-[#141721] p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="p-3 bg-orange-500/10 text-orange-500 rounded-2xl">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Send Us a Direct Message</h2>
              <p className="text-xs text-gray-500">Official Support Email: support.toolva@gmail.com</p>
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Message Sent Successfully!</h3>
              <p className="text-xs text-gray-500">
                Thank you for contacting Toolva Support. We will reply to <strong>{email}</strong> within 24 hours.
              </p>
              <button
                onClick={() => { setSubmitted(false); setMessage(''); setSubject(''); }}
                className="px-6 py-2.5 bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1c202f] border border-gray-200 dark:border-gray-700/80 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1c202f] border border-gray-200 dark:border-gray-700/80 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Tool Submission Query, Feature Request, or Feedback"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1c202f] border border-gray-200 dark:border-gray-700/80 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe how we can help you..."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1c202f] border border-gray-200 dark:border-gray-700/80 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending Message...' : 'Submit Message'}</span>
              </button>
            </form>
          )}
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
              <p className="text-xs text-gray-500">Quick solutions to common questions</p>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#141721] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2"
              >
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                  {faq.question}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-5 rounded-2xl border border-blue-500/20 text-center space-y-1">
            <h4 className="font-bold text-gray-900 dark:text-white text-xs">Direct Email Support</h4>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
              support.toolva@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactHelp;
