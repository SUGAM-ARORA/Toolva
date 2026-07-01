import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Sparkles, ChevronRight, ChevronLeft, RotateCcw,
  Palette, Code2, FileText, Video, Music2, BarChart2,
  Briefcase, Shield, GraduationCap, Mic2, MessageSquare,
  Zap, Globe, Target, Rocket, Trophy,
  CheckCircle2, Circle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  QuizAnswers, getRecommendations, UseCase, ExperienceLevel, BudgetLevel, Platform,
  useCaseTaxonomy
} from '../data/recommendationData';
import RecommendationCard from './RecommendationCard';
import CategoryChampions from './CategoryChampions';
import UseCaseMatcher from './UseCaseMatcher';

// ─── Types ───────────────────────────────────────────────────
type SubView = 'landing' | 'quiz' | 'results' | 'champions' | 'matcher';

interface StepOption<T extends string> {
  id: T;
  label: string;
  description: string;
  emoji: string;
  color: string;
}

// ─── Quiz Step Definitions ─────────────────────────────────
const useCaseOptions: StepOption<UseCase>[] = [
  { id: 'image-generation', label: 'Image / Art', description: 'Generate or edit images', emoji: '🎨', color: 'from-purple-600 to-pink-600' },
  { id: 'code-generation', label: 'Coding', description: 'Write or review code', emoji: '💻', color: 'from-blue-600 to-cyan-600' },
  { id: 'blog-writing', label: 'Writing', description: 'Articles, blogs, copy', emoji: '✍️', color: 'from-orange-600 to-amber-600' },
  { id: 'video-generation', label: 'Video', description: 'Generate or edit video', emoji: '🎬', color: 'from-red-600 to-rose-600' },
  { id: 'music-generation', label: 'Music', description: 'Create songs & audio', emoji: '🎵', color: 'from-yellow-600 to-orange-600' },
  { id: 'data-analysis', label: 'Data / Analytics', description: 'Analyze data & insights', emoji: '📊', color: 'from-teal-600 to-green-600' },
  { id: 'chatbot', label: 'Chat / Assistant', description: 'General AI assistant', emoji: '🤖', color: 'from-green-600 to-emerald-600' },
  { id: 'research', label: 'Research', description: 'Find & synthesize info', emoji: '🔬', color: 'from-cyan-600 to-blue-600' },
  { id: 'marketing', label: 'Marketing', description: 'Campaigns & SEO', emoji: '📣', color: 'from-pink-600 to-red-600' },
  { id: 'automation', label: 'Automation', description: 'Workflows & pipelines', emoji: '⚡', color: 'from-indigo-600 to-violet-600' },
  { id: 'voice-cloning', label: 'Voice / Audio', description: 'TTS, podcast, voiceover', emoji: '🎙️', color: 'from-violet-600 to-purple-600' },
  { id: 'education', label: 'Education', description: 'Learn or teach with AI', emoji: '🎓', color: 'from-lime-600 to-green-600' },
];

const experienceOptions: StepOption<ExperienceLevel>[] = [
  { id: 'beginner', label: 'Beginner', description: 'New to AI tools, want easy setup', emoji: '🌱', color: 'from-green-600 to-emerald-600' },
  { id: 'intermediate', label: 'Intermediate', description: 'Used some AI tools before', emoji: '⚡', color: 'from-blue-600 to-cyan-600' },
  { id: 'expert', label: 'Expert', description: 'Developer or power user', emoji: '🚀', color: 'from-purple-600 to-indigo-600' },
];

const budgetOptions: StepOption<BudgetLevel>[] = [
  { id: 'free', label: 'Free Only', description: 'Zero cost, no credit card', emoji: '🆓', color: 'from-green-600 to-teal-600' },
  { id: 'freemium', label: 'Free + Paid', description: 'Start free, upgrade later', emoji: '✨', color: 'from-blue-600 to-cyan-600' },
  { id: 'paid', label: 'Willing to Pay', description: '$5–$50/month for best tools', emoji: '💳', color: 'from-orange-600 to-amber-600' },
  { id: 'enterprise', label: 'Enterprise', description: 'Business/team budget available', emoji: '🏢', color: 'from-purple-600 to-violet-600' },
];

const platformOptions: StepOption<Platform>[] = [
  { id: 'web', label: 'Web Browser', description: 'Works in any browser', emoji: '🌐', color: 'from-blue-600 to-cyan-600' },
  { id: 'api', label: 'API / Developer', description: 'Integrate into my apps', emoji: '⚙️', color: 'from-gray-600 to-slate-600' },
  { id: 'desktop', label: 'Desktop App', description: 'Windows/Mac application', emoji: '🖥️', color: 'from-indigo-600 to-blue-600' },
  { id: 'mobile', label: 'Mobile', description: 'iOS or Android app', emoji: '📱', color: 'from-green-600 to-emerald-600' },
  { id: 'plugin', label: 'IDE / Plugin', description: 'VS Code, Figma, etc.', emoji: '🔌', color: 'from-purple-600 to-pink-600' },
];

const priorityOptions: StepOption<'quality' | 'speed' | 'ease' | 'features' | 'value'>[] = [
  { id: 'quality', label: 'Output Quality', description: 'Best results, regardless of complexity', emoji: '🏆', color: 'from-yellow-600 to-orange-600' },
  { id: 'speed', label: 'Speed', description: 'Fast results, low latency', emoji: '⚡', color: 'from-cyan-600 to-blue-600' },
  { id: 'ease', label: 'Ease of Use', description: 'Minimal learning curve', emoji: '😊', color: 'from-green-600 to-teal-600' },
  { id: 'features', label: 'Features', description: 'Most comprehensive feature set', emoji: '🔧', color: 'from-indigo-600 to-violet-600' },
  { id: 'value', label: 'Value for Money', description: 'Best bang for the buck', emoji: '💰', color: 'from-emerald-600 to-green-600' },
];

const STEPS = [
  { title: 'What do you want to do?', subtitle: 'Select your primary use case' },
  { title: 'Your experience level?', subtitle: 'This helps us match tool complexity' },
  { title: "What's your budget?", subtitle: 'We have great options at every budget' },
  { title: 'Which platform?', subtitle: 'Where do you want to use the tool?' },
  { title: 'What matters most?', subtitle: 'Your top priority for the tool' },
];

// ─── Confetti ────────────────────────────────────────────────
function fireConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#6366f1', '#a855f7', '#06b6d4', '#10b981', '#f59e0b'],
  });
}

// ─── Option Card ─────────────────────────────────────────────
function OptionCard<T extends string>({
  option,
  selected,
  onClick,
  delay = 0,
}: {
  option: StepOption<T>;
  selected: boolean;
  onClick: () => void;
  delay?: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative rounded-2xl p-4 sm:p-5 border text-left transition-all duration-200 group overflow-hidden
        ${selected
          ? 'border-indigo-500/70 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
          : 'border-white/8 bg-white/4 hover:border-white/16 hover:bg-white/8'
        }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-8 ${selected ? '!opacity-10' : ''} transition-opacity duration-300 rounded-2xl`} />
      <div className="relative flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{option.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className={`font-bold text-sm sm:text-base ${selected ? 'text-indigo-300' : 'text-white'}`}>
            {option.label}
          </div>
          <div className="text-gray-500 text-xs mt-0.5">{option.description}</div>
        </div>
        <div className="flex-shrink-0 mt-0.5">
          {selected
            ? <CheckCircle2 className="w-5 h-5 text-indigo-400" />
            : <Circle className="w-5 h-5 text-gray-700" />
          }
        </div>
      </div>
    </motion.button>
  );
}

// ─── Main Component ───────────────────────────────────────────
const SmartRecommender: React.FC = () => {
  const [subView, setSubView] = useState<SubView>('landing');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [results, setResults] = useState<ReturnType<typeof getRecommendations>>([]);

  const totalSteps = STEPS.length;

  const handleSelect = useCallback(<K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleNext = useCallback(() => {
    if (step < totalSteps - 1) {
      setStep(s => s + 1);
    } else {
      // Final step — compute results
      const finalAnswers = answers as QuizAnswers;
      const recs = getRecommendations(finalAnswers);
      setResults(recs);
      setSubView('results');
      setTimeout(fireConfetti, 300);
    }
  }, [step, answers, totalSteps]);

  const handleBack = useCallback(() => {
    if (step > 0) setStep(s => s - 1);
    else setSubView('landing');
  }, [step]);

  const resetQuiz = useCallback(() => {
    setStep(0);
    setAnswers({});
    setResults([]);
    setSubView('landing');
  }, []);

  const canProceed = () => {
    if (step === 0) return !!answers.useCase;
    if (step === 1) return !!answers.experience;
    if (step === 2) return !!answers.budget;
    if (step === 3) return !!answers.platform;
    if (step === 4) return !!answers.priority;
    return false;
  };

  const progress = ((step + (canProceed() ? 1 : 0)) / totalSteps) * 100;

  // ─ Landing ─────────────────────────────────────────────────
  if (subView === 'landing') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-12 sm:py-16">
          {/* Hero */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-sm font-semibold mb-6"
            >
              <Brain className="w-4 h-4" />
              AI-Powered Recommendation Engine
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight"
            >
              Find Your{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Perfect AI Tool
                </span>
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-pink-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto mb-10"
            >
              Our AI engine analyzes your use case, experience, budget & platform
              to recommend the{' '}
              <span className="text-white font-semibold">exact tools you need</span>{' '}
              — from 200+ options in the market.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-6 mb-12"
            >
              {[
                { value: '200+', label: 'AI Tools Analyzed' },
                { value: '38+', label: 'Use Cases Covered' },
                { value: '5', label: 'Smart Quiz Steps' },
                { value: '14', label: 'Category Champions' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-black text-white">{stat.value}</div>
                  <div className="text-gray-500 text-xs sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Entry Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              {
                id: 'quiz' as SubView,
                icon: Brain,
                emoji: '🧠',
                title: 'Smart Quiz',
                description: 'Answer 5 quick questions and get personalized AI tool recommendations with match scores.',
                cta: 'Start Quiz',
                gradient: 'from-indigo-600 to-purple-600',
                glow: 'shadow-indigo-500/20',
                badge: 'Most Popular',
                badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
              },
              {
                id: 'matcher' as SubView,
                icon: Target,
                emoji: '⚡',
                title: 'Task Matcher',
                description: 'Pick your task — logo design, blog writing, video editing — and instantly see the best tools.',
                cta: 'Match My Task',
                gradient: 'from-cyan-600 to-blue-600',
                glow: 'shadow-cyan-500/20',
                badge: 'Fastest',
                badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
              },
              {
                id: 'champions' as SubView,
                icon: Trophy,
                emoji: '🏆',
                title: 'Hall of Champions',
                description: 'See the #1 best AI tool in each category — Design, Code, Video, Writing & more.',
                cta: 'See Champions',
                gradient: 'from-yellow-600 to-orange-600',
                glow: 'shadow-yellow-500/20',
                badge: 'Expert Picks',
                badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
              },
            ].map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + index * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className={`relative rounded-3xl border border-white/10 bg-gray-900/60 backdrop-blur-md p-6 shadow-xl ${card.glow} hover:shadow-2xl transition-all duration-300 cursor-pointer group`}
                  onClick={() => setSubView(card.id)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`} />

                  <div className="relative">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border mb-4 ${card.badgeColor}`}>
                      {card.badge}
                    </span>

                    <div className="text-3xl mb-3">{card.emoji}</div>
                    <h3 className="text-xl font-black text-white mb-2">{card.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-5">{card.description}</p>

                    <button
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r ${card.gradient} text-white text-sm font-bold shadow-md group-hover:shadow-lg transition-all duration-200`}
                    >
                      {card.cta}
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─ Champions ────────────────────────────────────────────────
  if (subView === 'champions') {
    return (
      <div>
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <button
            onClick={() => setSubView('landing')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Recommender
          </button>
        </div>
        <CategoryChampions />
      </div>
    );
  }

  // ─ Matcher ──────────────────────────────────────────────────
  if (subView === 'matcher') {
    return (
      <div>
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <button
            onClick={() => setSubView('landing')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Recommender
          </button>
        </div>
        <UseCaseMatcher />
      </div>
    );
  }

  // ─ Results ──────────────────────────────────────────────────
  if (subView === 'results') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="text-5xl mb-4"
          >
            🎯
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-black text-white mb-3"
          >
            Your Personalized AI Stack
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg"
          >
            {results.length} tools matched — ranked by how well they fit your needs
          </motion.p>

          {/* Answer Summary Chips */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 mt-4"
          >
            {[
              { label: useCaseTaxonomy.find(u => u.id === answers.useCase)?.label || answers.useCase, emoji: useCaseTaxonomy.find(u => u.id === answers.useCase)?.emoji || '🎯' },
              { label: answers.experience, emoji: '⚡' },
              { label: answers.budget, emoji: '💳' },
              { label: answers.platform, emoji: '🖥️' },
              { label: answers.priority, emoji: '🏆' },
            ].map((chip, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-white/8 border border-white/12 text-gray-300 text-sm">
                {chip.emoji} {chip.label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
          {results.map((tool, index) => (
            <RecommendationCard
              key={tool.id}
              tool={tool}
              rank={index + 1}
              showScore={true}
              delay={index * 0.07}
            />
          ))}
        </div>

        {results.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No perfect matches found</h3>
            <p className="text-gray-400 mb-6">Try different budget or platform options</p>
            <button onClick={resetQuiz} className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-colors">
              Try Again
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={resetQuiz}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 font-semibold transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Quiz
          </button>
          <button
            onClick={() => setSubView('champions')}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold shadow-md hover:shadow-yellow-500/20 hover:scale-105 transition-all duration-200"
          >
            <Trophy className="w-4 h-4" />
            View Category Champions
          </button>
          <button
            onClick={() => setSubView('matcher')}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-md hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-200"
          >
            <Zap className="w-4 h-4" />
            Try Task Matcher
          </button>
        </div>
      </div>
    );
  }

  // ─ Quiz ─────────────────────────────────────────────────────
  const currentStep = STEPS[step];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {step === 0 ? 'Back' : 'Previous'}
          </button>
          <span className="text-gray-500 text-sm">Step {step + 1} of {totalSteps}</span>
        </div>
        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2">
              {currentStep.title}
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">{currentStep.subtitle}</p>
          </div>

          {/* Step 0: Use Case */}
          {step === 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {useCaseOptions.map((opt, i) => (
                <OptionCard
                  key={opt.id}
                  option={opt}
                  selected={answers.useCase === opt.id}
                  onClick={() => handleSelect('useCase', opt.id)}
                  delay={i * 0.04}
                />
              ))}
            </div>
          )}

          {/* Step 1: Experience */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {experienceOptions.map((opt, i) => (
                <OptionCard
                  key={opt.id}
                  option={opt}
                  selected={answers.experience === opt.id}
                  onClick={() => handleSelect('experience', opt.id)}
                  delay={i * 0.1}
                />
              ))}
            </div>
          )}

          {/* Step 2: Budget */}
          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {budgetOptions.map((opt, i) => (
                <OptionCard
                  key={opt.id}
                  option={opt}
                  selected={answers.budget === opt.id}
                  onClick={() => handleSelect('budget', opt.id)}
                  delay={i * 0.08}
                />
              ))}
            </div>
          )}

          {/* Step 3: Platform */}
          {step === 3 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-3xl mx-auto">
              {platformOptions.map((opt, i) => (
                <OptionCard
                  key={opt.id}
                  option={opt}
                  selected={answers.platform === opt.id}
                  onClick={() => handleSelect('platform', opt.id)}
                  delay={i * 0.08}
                />
              ))}
            </div>
          )}

          {/* Step 4: Priority */}
          {step === 4 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {priorityOptions.map((opt, i) => (
                <OptionCard
                  key={opt.id}
                  option={opt as any}
                  selected={answers.priority === opt.id}
                  onClick={() => handleSelect('priority', opt.id)}
                  delay={i * 0.08}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Next Button */}
      <div className="mt-10 flex justify-center">
        <motion.button
          whileHover={{ scale: canProceed() ? 1.03 : 1 }}
          whileTap={{ scale: canProceed() ? 0.97 : 1 }}
          onClick={handleNext}
          disabled={!canProceed()}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-200 shadow-xl
            ${canProceed()
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/30 cursor-pointer'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
        >
          {step === totalSteps - 1 ? (
            <>
              <Sparkles className="w-5 h-5" />
              Get My Recommendations
              <Sparkles className="w-5 h-5" />
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default SmartRecommender;
