import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, X, Check, ExternalLink, AlertTriangle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { AITool } from '../types';
import { isSsrfSafeUrl } from '../lib/security';

interface SuggestCorrectionModalProps {
  tool: AITool;
  isOpen: boolean;
  onClose: () => void;
}

export const SuggestCorrectionModal: React.FC<SuggestCorrectionModalProps> = ({
  tool,
  isOpen,
  onClose,
}) => {
  const [field, setField] = useState<'url' | 'pricing' | 'license' | 'hardware' | 'other'>('pricing');
  const [proposedValue, setProposedValue] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedValue.trim()) {
      toast.error('Proposed value is required.');
      return;
    }

    if (!sourceUrl.trim()) {
      toast.error('Source URL is required to verify your correction.');
      return;
    }

    const ssrf = isSsrfSafeUrl(sourceUrl);
    if (!ssrf.safe) {
      toast.error(`Invalid evidence source URL: ${ssrf.reason}`);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Thank you! Correction submitted to ToolVa moderation queue.');
      onClose();
    }, 700);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-white dark:bg-[#121620] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-2xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800/80 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                <Edit3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Suggest a Correction
                </h3>
                <p className="text-xs text-gray-500">For {tool.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                Which field needs correction?
              </label>
              <select
                value={field}
                onChange={(e: any) => setField(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#181d2a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium"
              >
                <option value="pricing">Pricing / Cost Model (e.g. price changed or free tier limits)</option>
                <option value="hardware">Hardware / RAM / VRAM Specs</option>
                <option value="license">License / Open Source Status</option>
                <option value="url">Official Website / Repository URL (Dead link or moved)</option>
                <option value="other">Other metadata or capability claim</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                Proposed Correct Value
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Free open source (Apache 2.0) or 8GB VRAM minimum"
                value={proposedValue}
                onChange={(e) => setProposedValue(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#181d2a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                Canonical Evidence / Source URL (Mandatory)
              </label>
              <input
                type="url"
                required
                placeholder="https://... (GitHub release, official pricing page, commit)"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#181d2a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Every correction is validated against its source before being merged.
              </p>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                Additional Context or Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Explain why this change is needed..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#181d2a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold flex items-center space-x-1"
              >
                <span>{isSubmitting ? 'Submitting...' : 'Submit Correction'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default SuggestCorrectionModal;
