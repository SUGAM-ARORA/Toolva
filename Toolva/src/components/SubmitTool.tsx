import React, { useState } from 'react';
import { X, Upload, Plus, Trash2, Code, Globe, Book, Shield, Database, GitBranch, Zap } from 'lucide-react';
import { categories } from '../data/categories';
import { ToolSubmission } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface SubmitToolProps {
  onClose: () => void;
}

const SubmitTool: React.FC<SubmitToolProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<ToolSubmission>({
    name: '',
    description: '',
    category: '',
    url: '',
    pricing: '',
    modelType: '',
    submitterEmail: '',
    additionalNotes: '',
    github: '',
    documentation: '',
    apiEndpoint: '',
    techStack: [],
    integrations: [],
    pricingDetails: {
      free: {
        features: [],
        limits: []
      },
      paid: {
        plans: []
      }
    },
    useCases: [],
    requirements: [],
    setupInstructions: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [integrationsInput, setIntegrationsInput] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [useCaseInput, setUseCaseInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [freePlanFeature, setFreePlanFeature] = useState('');
  const [paidPlanName, setPaidPlanName] = useState('');
  const [paidPlanPrice, setPaidPlanPrice] = useState('');
  const [paidPlanFeature, setPaidPlanFeature] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Here you would typically make an API call to submit the tool
      console.log('Submitting tool:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Tool submitted successfully!');
      onClose();
    } catch (err) {
      setError('Failed to submit tool. Please try again.');
      toast.error('Failed to submit tool');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newScreenshots = [...screenshots, ...files].slice(0, 5);
    setScreenshots(newScreenshots);

    // Create preview URLs
    const newPreviewUrls = newScreenshots.map(file => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
  };

  const removeScreenshot = (index: number) => {
    const newScreenshots = screenshots.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setScreenshots(newScreenshots);
    setPreviewUrls(newPreviewUrls);
  };

  const addUseCase = () => {
    if (useCaseInput.trim()) {
      setFormData({
        ...formData,
        useCases: [...(formData.useCases || []), useCaseInput.trim()]
      });
      setUseCaseInput('');
    }
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData({
        ...formData,
        requirements: [...(formData.requirements || []), requirementInput.trim()]
      });
      setRequirementInput('');
    }
  };

  const addFreePlanFeature = () => {
    if (freePlanFeature.trim()) {
      setFormData({
        ...formData,
        pricingDetails: {
          ...formData.pricingDetails,
          free: {
            ...formData.pricingDetails.free,
            features: [...formData.pricingDetails.free.features, freePlanFeature.trim()]
          }
        }
      });
      setFreePlanFeature('');
    }
  };

  const addPaidPlan = () => {
    if (paidPlanName.trim() && paidPlanPrice.trim()) {
      setFormData({
        ...formData,
        pricingDetails: {
          ...formData.pricingDetails,
          paid: {
            plans: [
              ...formData.pricingDetails.paid.plans,
              {
                name: paidPlanName.trim(),
                price: paidPlanPrice.trim(),
                features: []
              }
            ]
          }
        }
      });
      setPaidPlanName('');
      setPaidPlanPrice('');
    }
  };

  const steps = [
    { title: 'Basic Information', icon: Globe },
    { title: 'Technical Details', icon: Code },
    { title: 'Features & Pricing', icon: Zap },
    { title: 'Media & Documentation', icon: Book }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full mx-4 relative max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Submit a New AI Tool
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex justify-between items-center mt-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  index < steps.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep > index
                      ? 'bg-green-500 text-white'
                      : currentStep === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <step.icon className="w-4 h-4" />
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium ${
                      currentStep === index + 1
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      currentStep > index + 1
                        ? 'bg-green-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tool Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.filter(cat => cat.name !== 'All').map(category => (
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Website URL *
                    </label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      GitHub Repository
                    </label>
                    <div className="flex items-center space-x-2">
                      <GitBranch className="w-5 h-5 text-gray-400" />
                      <input
                        type="url"
                        value={formData.github || ''}
                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://github.com/username/repository"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      API Endpoint
                    </label>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <input
                        type="url"
                        value={formData.apiEndpoint || ''}
                        onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://api.example.com/v1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Documentation URL
                    </label>
                    <div className="flex items-center space-x-2">
                      <Book className="w-5 h-5 text-gray-400" />
                      <input
                        type="url"
                        value={formData.documentation || ''}
                        onChange={(e) => setFormData({ ...formData, documentation: e.target.value })}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://docs.example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tech Stack
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={techStackInput}
                        onChange={(e) => setTechStackInput(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Add technology"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (techStackInput.trim()) {
                            setFormData({
                              ...formData,
                              techStack: [...(formData.techStack || []), techStackInput.trim()]
                            });
                            setTechStackInput('');
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.techStack?.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm flex items-center"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                techStack: formData.techStack?.filter((_, i) => i !== index)
                              });
                            }}
                            className="ml-2 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Integrations
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={integrationsInput}
                        onChange={(e) => setIntegrationsInput(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Add integration"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (integrationsInput.trim()) {
                            setFormData({
                              ...formData,
                              integrations: [...(formData.integrations || []), integrationsInput.trim()]
                            });
                            setIntegrationsInput('');
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.integrations?.map((integration, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-sm flex items-center"
                        >
                          {integration}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                integrations: formData.integrations?.filter((_, i) => i !== index)
                              });
                            }}
                            className="ml-2 text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Free Plan Features
                    </h3>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={freePlanFeature}
                        onChange={(e) => setFreePlanFeature(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Add feature"
                      />
                      <button
                        type="button"
                        onClick={addFreePlanFeature}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.pricingDetails.free.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                pricingDetails: {
                                  ...formData.pricingDetails,
                                  free: {
                                    ...formData.pricingDetails.free,
                                    features: formData.pricingDetails.free.features.filter(
                                      (_, i) => i !== index
                                    )
                                  }
                                }
                              });
                            }}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Paid Plans
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        value={paidPlanName}
                        onChange={(e) => setPaidPlanName(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Plan name"
                      />
                      <input
                        type="text"
                        value={paidPlanPrice}
                        onChange={(e) => setPaidPlanPrice(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Price"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addPaidPlan}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4"
                    >
                      Add Paid Plan
                    </button>
                    <div className="space-y-4">
                      {formData.pricingDetails.paid.plans.map((plan, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {plan.name}
                            </h4>
                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                              {plan.price}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                pricingDetails: {
                                  ...formData.pricingDetails,
                                  paid: {
                                    plans: formData.pricingDetails.paid.plans.filter(
                                      (_, i) => i !== index
                                    )
                                  }
                                }
                              });
                            }}
                            className="text-red-500 hover:text-red-600"
                          >
                            Remove Plan
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Use Cases
                    </h3>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={useCaseInput}
                        onChange={(e) => setUseCaseInput(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Add use case"
                      />
                      <button
                        type="button"
                        onClick={addUseCase}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.useCases?.map((useCase, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <span className="text-gray-700 dark:text-gray-300">{useCase}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                useCases: formData.useCases?.filter((_, i) => i !== index)
                              });
                            }}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Screenshots (Max 5)
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleScreenshotUpload}
                          disabled={screenshots.length >= 5}
                        />
                      </label>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Screenshot ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeScreenshot(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Setup Instructions
                    </label>
                    <textarea
                      value={formData.setupInstructions}
                      onChange={(e) =>
                        setFormData({ ...formData, setupInstructions: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={4}
                      placeholder="Provide step-by-step setup instructions..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Requirements
                    </label>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={requirementInput}
                        onChange={(e) => setRequirementInput(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Add requirement"
                      />
                      <button
                        type="button"
                        onClick={addRequirement}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.requirements?.map((requirement, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <span className="text-gray-700 dark:text-gray-300">
                            {requirement}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                requirements: formData.requirements?.filter(
                                  (_, i) => i !== index
                                )
                              });
                            }}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      value={formData.additionalNotes}
                      onChange={(e) =>
                        setFormData({ ...formData, additionalNotes: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={4}
                      placeholder="Any additional information..."
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={currentStep === 1}
                className={`px-6 py-2 rounded-lg ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Previous
              </button>
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded-lg text-white ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Tool'}
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SubmitTool;