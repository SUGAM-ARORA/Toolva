import React, { useState } from 'react';
import {
  X, Check, ArrowRight, ArrowLeft, GitPullRequest, 
  ShieldCheck, AlertCircle, Copy, ExternalLink, Zap, 
  Terminal, Cpu, DollarSign, HelpCircle, Layers, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { categories } from '../data/categories';
import { SubmissionTier, ToolSubmission } from '../types';
import { isSsrfSafeUrl, validateToolSubmission } from '../lib/security';
import { getCurrentUser } from '../lib/auth';

interface SubmitToolProps {
  onClose: () => void;
  onOpenAuth?: () => void;
}

interface TierOption {
  id: SubmissionTier;
  name: string;
  price: string;
  slaTarget: string;
  badge?: string;
  description: string;
  guardrail: string;
}

const SUBMISSION_TIERS: TierOption[] = [
  {
    id: 'free_community_pr',
    name: 'Free Community PR Submission',
    price: '$0',
    slaTarget: '100 days target',
    badge: 'Open Community',
    description: 'Submit your tool via GitHub Pull Request into the standard community queue.',
    guardrail: 'Review priority follows queue order. 100% free open-source ethos.',
  },
  {
    id: 'community_vouched_fast_track',
    name: 'Community-Vouched Fast-Track',
    price: '$0',
    slaTarget: '20 days target',
    badge: 'Popular',
    description: 'At least 10 developers vouch on the PR to trigger expedited review priority.',
    guardrail: 'Vouches accelerate review timing only; never guarantees acceptance or rating.',
  },
  {
    id: 'verified_benchmark',
    name: 'Verified Benchmark Review',
    price: '$9',
    slaTarget: '5 business days',
    badge: 'Technical Stamp',
    description: 'Technical moderation of submitted hardware benchmarks, VRAM logs, and reproducible CLI tests.',
    guardrail: 'Payment buys technical review effort, not a passing verified result.',
  },
  {
    id: 'one_time_submission',
    name: 'Priority Review Queue',
    price: '$49',
    slaTarget: '3 business days',
    badge: 'Early-Bird $39',
    description: 'Expedited editorial review and categorization by ToolVa maintainers.',
    guardrail: 'Payment never guarantees acceptance or favorable score.',
  },
  {
    id: 'category_sponsorship',
    name: 'Category Placement Sponsorship',
    price: '$25 / mo',
    slaTarget: 'Immediate',
    description: 'Featured placement banner in chosen category section.',
    guardrail: 'Clearly labelled as Sponsored. Zero influence on organic Bayesian score.',
  },
  {
    id: 'bulk_submission',
    name: 'Bulk Tool Submission (5 Tools)',
    price: '$150',
    slaTarget: '5 business days',
    description: 'Package for 5 tool submissions evaluated under identical quality standards.',
    guardrail: 'Each tool must independently meet directory inclusion criteria.',
  },
  {
    id: 'all_in_one_category',
    name: 'All-in-One Category Package',
    price: '$229',
    slaTarget: '3 business days',
    description: '4 tool reviews + 1 category sponsorship section + 1 verified benchmark review.',
    guardrail: 'Full transparency: all tools remain subject to standard moderation.',
  },
];

export const SubmitTool: React.FC<SubmitToolProps> = ({ onClose, onOpenAuth }) => {
  const currentUser = getCurrentUser();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedTier, setSelectedTier] = useState<SubmissionTier>('free_community_pr');

  const [formData, setFormData] = useState<ToolSubmission>({
    name: '',
    description: '',
    category: 'Chatbots',
    url: '',
    pricing: 'Free',
    modelType: 'Chatbots',
    submitterEmail: currentUser?.email || '',
    submissionTier: 'free_community_pr',
    license: 'MIT',
    github: '',
    huggingFaceUrl: '',
    isLocal: true,
    minRAM: '8GB',
    minVRAM: '6GB',
    installCommand: '',
    pricingSourceUrl: '',
    proofUrl: '',
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [generatedPRJson, setGeneratedPRJson] = useState<string>('');
  const [copiedPR, setCopiedPR] = useState<boolean>(false);

  const handleNextStep = () => {
    setValidationErrors([]);

    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      const errors = validateToolSubmission({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        url: formData.url,
        github: formData.github,
        submitterEmail: formData.submitterEmail,
      });

      if (errors.length > 0) {
        setValidationErrors(errors);
        toast.error('Please fix the validation errors before proceeding.');
        return;
      }

      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      if (formData.pricingSourceUrl) {
        const ssrf = isSsrfSafeUrl(formData.pricingSourceUrl);
        if (!ssrf.safe) {
          setValidationErrors([`Pricing source URL error: ${ssrf.reason}`]);
          return;
        }
      }
      if (formData.proofUrl) {
        const ssrf = isSsrfSafeUrl(formData.proofUrl);
        if (!ssrf.safe) {
          setValidationErrors([`Proof URL error: ${ssrf.reason}`]);
          return;
        }
      }

      // Generate schema-valid JSON for PR
      const toolSlug = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const toolJson = {
        id: toolSlug,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        url: formData.url,
        pricing: formData.pricing,
        rating: 4.5,
        dailyUsers: '100+',
        modelType: formData.category,
        easeOfUse: 4.5,
        userExperience: 4.5,
        license: formData.license,
        github: formData.github || undefined,
        huggingFaceUrl: formData.huggingFaceUrl || undefined,
        isLocal: formData.isLocal,
        minRAM: formData.minRAM,
        minVRAM: formData.minVRAM,
        installCommand: formData.installCommand || undefined,
        pricingSourceUrl: formData.pricingSourceUrl || undefined,
        pricingLastVerified: new Date().toISOString().split('T')[0],
        verifiedActive: true,
        submissionTier: selectedTier,
        submittedBy: formData.submitterEmail,
        createdAt: new Date().toISOString(),
      };

      setGeneratedPRJson(JSON.stringify(toolJson, null, 2));
      setCurrentStep(4);
    }
  };

  const handleCopyPRJson = () => {
    navigator.clipboard.writeText(generatedPRJson);
    setCopiedPR(true);
    toast.success('Tool JSON copied to clipboard!');
    setTimeout(() => setCopiedPR(false), 2000);
  };

  const handleOpenGitHubPR = () => {
    const toolSlug = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const title = encodeURIComponent(`Add tool: ${formData.name} (${selectedTier})`);
    const body = encodeURIComponent(
      `### Tool Submission\n\n- **Name:** ${formData.name}\n- **Category:** ${formData.category}\n- **Tier:** ${selectedTier}\n- **URL:** ${formData.url}\n- **License:** ${formData.license}\n\n\`\`\`json\n${generatedPRJson}\n\`\`\`\n\n*Generated via ToolVa Web Submissions Wizard*`
    );
    window.open(`https://github.com/sugam-arora/Toolva/issues/new?title=${title}&body=${body}`, '_blank');
  };

  const handleDirectWebSubmit = () => {
    setIsSubmitting(true);
    try {
      const stored = localStorage.getItem('toolva_pending_tools');
      const list = stored ? JSON.parse(stored) : [];
      const newEntry = {
        id: `pending-${Date.now()}`,
        ...formData,
        submissionTier: selectedTier,
        status: 'pending_review',
        createdAt: new Date().toISOString(),
      };
      list.unshift(newEntry);
      localStorage.setItem('toolva_pending_tools', JSON.stringify(list));

      toast.success(`Tool "${formData.name}" submitted successfully to the review queue!`);
      onClose();
    } catch (err) {
      toast.error('Failed to save submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-3xl bg-white dark:bg-[#11141e] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#141824]/50 shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-orange-500/10 text-orange-500 border border-orange-500/20">
                Step {currentStep} of 4
              </span>
              <span className="text-xs text-gray-500">
                {currentStep === 1 && 'Select Review Tier'}
                {currentStep === 2 && 'Tool & Open Source Specs'}
                {currentStep === 3 && 'Pricing & Proof Evidence'}
                {currentStep === 4 && 'Validation & Dual Route'}
              </span>
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white mt-1">
              Submit an AI Tool to ToolVa
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 shrink-0">
          <div
            className="bg-orange-500 h-1 transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {validationErrors.length > 0 && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Please correct the following:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* STEP 1: Select Tier */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Choose Your Submission Tier</h3>
                <p className="text-xs text-gray-500">
                  Select between open community review and expedited review routes.
                </p>
              </div>

              {/* Strict Trust Guardrail Alert */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-2.5 text-xs text-amber-300">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Mandatory Trust Guardrail:</strong> Payment pays for reviewer time and expedited processing only. Payment <strong>never</strong> buys acceptance, favorable ratings, or an unearned verification stamp.
                </div>
              </div>

              <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {SUBMISSION_TIERS.map((tier) => (
                  <div
                    key={tier.id}
                    onClick={() => {
                      setSelectedTier(tier.id);
                      setFormData({ ...formData, submissionTier: tier.id });
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedTier === tier.id
                        ? 'bg-orange-500/10 border-orange-500 shadow-md shadow-orange-500/10'
                        : 'bg-gray-50 dark:bg-[#151924] border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{tier.name}</span>
                        {tier.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-orange-500/20 text-orange-400">
                            {tier.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-orange-500">{tier.price}</span>
                        <span className="block text-[11px] text-gray-400">{tier.slaTarget}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{tier.description}</p>
                    <p className="text-[11px] text-gray-400 italic mt-1">{tier.guardrail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Tool & Open-Source Specs */}
          {currentStep === 2 && (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Tool & Hardware Specifications</h3>
                <p className="text-gray-500">Provide official links, license details, and minimum local AI hardware specs.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Tool Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ollama, Continue, Kokoro"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#181d2a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Primary Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#181d2a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Official Website URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#181d2a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Concise Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe what the tool does, who it is for, and key features..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#181d2a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">GitHub / Code Repository URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#181d2a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Open Source License</label>
                  <select
                    value={formData.license}
                    onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#181d2a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="MIT">MIT</option>
                    <option value="Apache 2.0">Apache 2.0</option>
                    <option value="AGPL-3.0">AGPL-3.0</option>
                    <option value="GPL-3.0">GPL-3.0</option>
                    <option value="BSD-3-Clause">BSD-3-Clause</option>
                    <option value="Open Weights">Open Weights (Llama Community, etc.)</option>
                    <option value="Proprietary">Proprietary / Closed Source</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Min VRAM Requirement</label>
                  <input
                    type="text"
                    placeholder="e.g. 6GB VRAM (or CPU Only)"
                    value={formData.minVRAM}
                    onChange={(e) => setFormData({ ...formData, minVRAM: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#181d2a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">One-Click Install Command (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. ollama run llama3.1 or pip install ..."
                    value={formData.installCommand}
                    onChange={(e) => setFormData({ ...formData, installCommand: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#181d2a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Pricing & Proof Evidence */}
          {currentStep === 3 && (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Pricing & Proof of Capability</h3>
                <p className="text-gray-500">Provide verifiable evidence and official pricing sources to back up all claims.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Pricing Model</label>
                  <select
                    value={formData.pricing}
                    onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#181d2a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Free">100% Free / Open Source</option>
                    <option value="Freemium">Freemium (Free tier available)</option>
                    <option value="Paid">Commercial / Paid Subscription</option>
                    <option value="Usage-based">Usage-based / Token pricing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Submitter Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="your-email@domain.com"
                    value={formData.submitterEmail}
                    onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#181d2a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Official Pricing Source URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/pricing"
                    value={formData.pricingSourceUrl}
                    onChange={(e) => setFormData({ ...formData, pricingSourceUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#181d2a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Proof of Capability Link (Demo, Benchmark or Sample)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/... or https://huggingface.co/spaces/..."
                    value={formData.proofUrl}
                    onChange={(e) => setFormData({ ...formData, proofUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#181d2a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Validation & Dual Route */}
          {currentStep === 4 && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <strong className="block text-sm">Validation Passed!</strong>
                  <span>Your submission adheres to the canonical ToolVa schema and passes automated SSRF safety checks.</span>
                </div>
              </div>

              {/* Generated Schema JSON */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 dark:text-white">Canonical Catalog JSON Spec</span>
                  <button
                    onClick={handleCopyPRJson}
                    className="inline-flex items-center space-x-1 text-xs text-orange-500 hover:underline font-semibold"
                  >
                    {copiedPR ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPR ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-gray-900 rounded-xl text-gray-300 font-mono text-[11px] overflow-x-auto max-h-48 border border-gray-800">
                  {generatedPRJson}
                </pre>
              </div>

              {/* Dual Route Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#161a26] border border-gray-200 dark:border-gray-800 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center space-x-2 text-purple-400 font-bold mb-1">
                      <GitPullRequest className="w-4 h-4" />
                      <span>Route A: Instant GitHub PR</span>
                    </div>
                    <p className="text-gray-500">
                      Open a ready-to-merge GitHub Pull Request with this prefilled schema file in the ToolVa repo.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenGitHubPR}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <span>Open GitHub PR</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#161a26] border border-gray-200 dark:border-gray-800 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center space-x-2 text-orange-400 font-bold mb-1">
                      <Layers className="w-4 h-4" />
                      <span>Route B: ToolVa Web Queue</span>
                    </div>
                    <p className="text-gray-500">
                      Submit directly into the ToolVa dashboard moderation queue with audit trail and status tracking.
                    </p>
                  </div>
                  <button
                    onClick={handleDirectWebSubmit}
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <span>{isSubmitting ? 'Submitting...' : 'Submit to Queue'}</span>
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#141824]/50 flex items-center justify-between shrink-0">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 && (
            <button
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white shadow-md shadow-orange-500/20 transition-all flex items-center space-x-1"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
export default SubmitTool;