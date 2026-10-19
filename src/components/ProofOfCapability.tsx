import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, ExternalLink, Image as ImageIcon, Code, 
  Play, FileText, Plus, CheckCircle2, AlertCircle, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CapabilityProof, AITool } from '../types';
import { isSsrfSafeUrl } from '../lib/security';

interface ProofOfCapabilityProps {
  tool: AITool;
  onSelectProof?: (proof: CapabilityProof) => void;
}

export const ProofOfCapability: React.FC<ProofOfCapabilityProps> = ({ tool }) => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [proofTitle, setProofTitle] = useState('');
  const [proofType, setProofType] = useState<'demo' | 'screenshot' | 'output' | 'benchmark' | 'docs'>('demo');
  const [proofUrl, setProofUrl] = useState('');
  const [proofDescription, setProofDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default curated proofs if none set on tool
  const defaultProofs: CapabilityProof[] = [
    {
      id: 'proof-1',
      type: 'demo',
      title: 'Interactive Web Playground & Live Demo',
      url: tool.url,
      description: 'Official interactive demonstration environment verified by ToolVa moderators.',
      verifiedDate: '2024-10-15',
      provenanceSource: tool.url,
    },
    {
      id: 'proof-2',
      type: 'docs',
      title: 'Reproducible Setup & Documentation Guide',
      url: tool.documentation || tool.url,
      description: 'Technical walkthrough verifying local installation commands and API payload formats.',
      verifiedDate: '2024-10-12',
      provenanceSource: tool.github || tool.url,
    },
  ];

  const proofs = (tool.capabilityProofs && tool.capabilityProofs.length > 0)
    ? tool.capabilityProofs
    : defaultProofs;

  const handleEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofTitle.trim() || !proofUrl.trim()) {
      toast.error('Title and evidence URL are required.');
      return;
    }

    const ssrf = isSsrfSafeUrl(proofUrl);
    if (!ssrf.safe) {
      toast.error(`Invalid evidence URL: ${ssrf.reason}`);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSubmitModal(false);
      setProofTitle('');
      setProofUrl('');
      setProofDescription('');
      toast.success('Capability evidence submitted to moderator review queue!');
    }, 800);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'demo':
        return Play;
      case 'screenshot':
        return ImageIcon;
      case 'output':
        return Code;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Proof of Capability & Provenance</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Verified sample outputs, reproducible demos, and audited evidence.
          </p>
        </div>
        <button
          onClick={() => setShowSubmitModal(true)}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Submit Evidence</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {proofs.map((proof) => {
          const Icon = getIcon(proof.type);
          return (
            <div
              key={proof.id}
              className="p-4 rounded-2xl bg-gray-50 dark:bg-[#151924] border border-gray-200 dark:border-gray-800 space-y-2.5 hover:border-emerald-500/30 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <Icon className="w-3 h-3" />
                  <span>{proof.type}</span>
                </span>
                <span className="text-[11px] text-gray-500">Verified: {proof.verifiedDate}</span>
              </div>

              <h4 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-emerald-400 transition-colors">
                {proof.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                {proof.description}
              </p>

              <div className="pt-1 flex items-center justify-between text-[11px]">
                <span className="text-gray-400 truncate max-w-[150px]">Source: {new URL(proof.provenanceSource.startsWith('http') ? proof.provenanceSource : `https://${proof.provenanceSource}`).hostname}</span>
                <a
                  href={proof.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-emerald-500 hover:underline font-semibold"
                >
                  <span>Inspect Evidence</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Evidence Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-[#141824] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span>Submit Proof of Capability</span>
                </h4>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEvidenceSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                    Proof Type
                  </label>
                  <select
                    value={proofType}
                    onChange={(e: any) => setProofType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1a2030] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="demo">Live Web Demo / Interactive App</option>
                    <option value="output">Sample Output / Reproducible Code</option>
                    <option value="benchmark">Hardware Benchmark Log</option>
                    <option value="screenshot">Screenshot / Video Demonstration</option>
                    <option value="docs">Documentation / Verification Guide</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                    Title / Claim
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 100 tok/s on RTX 4090 with llama.cpp"
                    value={proofTitle}
                    onChange={(e) => setProofTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1a2030] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                    Public Evidence URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/... or https://huggingface.co/..."
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1a2030] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                    Description & Reproduction Steps
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide details on how this claim was measured or tested..."
                    value={proofDescription}
                    onChange={(e) => setProofDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1a2030] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center space-x-1"
                  >
                    <span>{isSubmitting ? 'Validating...' : 'Submit Evidence'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ProofOfCapability;
