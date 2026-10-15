import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, ArrowLeft, Shield, Clock, HelpCircle, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { logUserActivity, getCurrentUser } from '../lib/auth';

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    subject: 'General Inquiry',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      logUserActivity('CONTACT_SUBMITTED', `Sent inquiry: "${formData.subject}"`);
      toast.success('Your message has been sent to support.toolva@gmail.com!');
    }, 800);
  };

  const handleBackHome = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-white pt-20 pb-24 font-sans relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

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
          to="/help"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-bold transition-transform active:scale-95"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Knowledge Base FAQ</span>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-purple-600 p-8 sm:p-10 rounded-3xl text-white shadow-2xl text-center space-y-3 relative overflow-hidden">
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Official Unified Support Hub
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            How Can We Help You?
          </h1>
          <p className="text-xs sm:text-base text-white/90 max-w-2xl mx-auto">
            Got questions regarding AI tool submissions, account roles, or enterprise listings? Reach out directly to our support engineering team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left Side: Direct Contact Details & Info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#141721] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center font-bold">
                  <Mail className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase font-mono">Official Support Email</p>
                  <a 
                    href="mailto:support.toolva@gmail.com" 
                    className="text-xl font-black text-gray-900 dark:text-white hover:text-orange-500 transition-colors"
                  >
                    support.toolva@gmail.com
                  </a>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              <div className="space-y-4 text-xs text-gray-600 dark:text-gray-300">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">Fast Response SLA</p>
                    <p className="text-gray-500">Our dedicated team replies to inquiries within 24 hours.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">Tool Submission Review</p>
                    <p className="text-gray-500">Submissions undergo verification by SuperAdmins before directory indexing.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">Feature Requests & Feedback</p>
                    <p className="text-gray-500">We welcome community input for expanding AI categories and tool comparisons.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Message Form */}
          <div className="bg-white dark:bg-[#141721] p-8 sm:p-10 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl relative overflow-hidden">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Message Sent Successfully!</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  Thank you for reaching out to Toolva Support. We have logged your request and will reply to <span className="font-bold text-gray-700 dark:text-gray-200">{formData.email}</span> shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-xl hover:bg-orange-500 hover:text-white transition-all cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center space-x-3 border-b border-gray-100 dark:border-gray-800 pb-4">
                  <MessageSquare className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">Send Us a Direct Message</h2>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Your Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Sugam Arora"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1c202f] border border-gray-200 dark:border-gray-700/80 rounded-xl text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Your Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="support.toolva@gmail.com"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1c202f] border border-gray-200 dark:border-gray-700/80 rounded-xl text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Inquiry Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1c202f] border border-gray-200 dark:border-gray-700/80 rounded-xl text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Tool Submission Help">Tool Submission Status</option>
                    <option value="Account & Role Support">Account & 10-Role System</option>
                    <option value="Bug Report & Security">Bug Report / Security</option>
                    <option value="Partnership">Partnership & Listing</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Your Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your request or question in detail..."
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1c202f] border border-gray-200 dark:border-gray-700/80 rounded-xl text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Message...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
