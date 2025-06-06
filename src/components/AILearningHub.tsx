import React, { useState, useEffect } from 'react';
import { Book, Video, Code, Brain, Search, BookOpen, Play, Star, Clock, Users, Award, Target, Lightbulb, Cpu, Database, Globe, Shield, Zap, TrendingUp, Filter, Download, Share2, Eye, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  instructor: string;
  rating: number;
  students: number;
  image: string;
  topics: string[];
  prerequisites: string[];
  price: number;
  featured: boolean;
  completionRate: number;
  lastUpdated: string;
  skills: string[];
  certificate: boolean;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  courses: string[];
  estimatedTime: string;
  difficulty: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface LearningStats {
  totalCourses: number;
  totalStudents: number;
  avgRating: number;
  completionRate: number;
}

const AILearningHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [learningStats, setLearningStats] = useState<LearningStats>({
    totalCourses: 0,
    totalStudents: 0,
    avgRating: 0,
    completionRate: 0
  });
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});

  const categories = ['All', 'Fundamentals', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Ethics', 'Applications', 'Tools'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const sampleCourses: Course[] = [
    {
      id: '1',
      title: 'Introduction to Artificial Intelligence',
      description: 'Comprehensive introduction to AI concepts, history, and applications with hands-on projects',
      category: 'Fundamentals',
      level: 'Beginner',
      duration: '8 weeks',
      instructor: 'Dr. Sarah Chen',
      rating: 4.8,
      students: 15420,
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
      topics: ['AI History', 'Machine Learning Basics', 'Neural Networks', 'Ethics in AI'],
      prerequisites: ['Basic Programming', 'High School Mathematics'],
      price: 0,
      featured: true,
      completionRate: 87,
      lastUpdated: '2025-01-15',
      skills: ['Python', 'TensorFlow', 'Data Analysis'],
      certificate: true
    },
    {
      id: '2',
      title: 'Deep Learning Specialization',
      description: 'Master deep learning with practical implementations and real-world projects',
      category: 'Deep Learning',
      level: 'Advanced',
      duration: '12 weeks',
      instructor: 'Prof. Michael Rodriguez',
      rating: 4.9,
      students: 8750,
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c',
      topics: ['CNNs', 'RNNs', 'GANs', 'Transformers', 'Computer Vision'],
      prerequisites: ['Linear Algebra', 'Python Programming', 'Basic ML'],
      price: 199,
      featured: true,
      completionRate: 78,
      lastUpdated: '2025-01-10',
      skills: ['PyTorch', 'Computer Vision', 'NLP'],
      certificate: true
    },
    {
      id: '3',
      title: 'Natural Language Processing Fundamentals',
      description: 'Learn to build NLP applications from text preprocessing to advanced language models',
      category: 'NLP',
      level: 'Intermediate',
      duration: '10 weeks',
      instructor: 'Dr. Emily Watson',
      rating: 4.7,
      students: 12300,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
      topics: ['Text Processing', 'Sentiment Analysis', 'Language Models', 'Transformers'],
      prerequisites: ['Python', 'Basic Statistics', 'Linear Algebra'],
      price: 149,
      featured: false,
      completionRate: 82,
      lastUpdated: '2025-01-08',
      skills: ['NLTK', 'spaCy', 'Transformers', 'Hugging Face'],
      certificate: true
    },
    {
      id: '4',
      title: 'AI Ethics and Responsible AI',
      description: 'Understand the ethical implications of AI and learn to build responsible AI systems',
      category: 'Ethics',
      level: 'Intermediate',
      duration: '6 weeks',
      instructor: 'Dr. James Thompson',
      rating: 4.6,
      students: 6890,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      topics: ['AI Bias', 'Fairness', 'Transparency', 'Privacy', 'Governance'],
      prerequisites: ['Basic AI Knowledge'],
      price: 99,
      featured: false,
      completionRate: 91,
      lastUpdated: '2025-01-12',
      skills: ['Ethical AI', 'Bias Detection', 'AI Governance'],
      certificate: true
    },
    {
      id: '5',
      title: 'Computer Vision with Deep Learning',
      description: 'Build advanced computer vision applications using state-of-the-art deep learning techniques',
      category: 'Computer Vision',
      level: 'Advanced',
      duration: '14 weeks',
      instructor: 'Dr. Lisa Park',
      rating: 4.8,
      students: 4560,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
      topics: ['Image Classification', 'Object Detection', 'Segmentation', 'GANs'],
      prerequisites: ['Deep Learning', 'Python', 'Linear Algebra'],
      price: 249,
      featured: true,
      completionRate: 75,
      lastUpdated: '2025-01-05',
      skills: ['OpenCV', 'PyTorch', 'YOLO', 'Detectron2'],
      certificate: true
    }
  ];

  const sampleLearningPaths: LearningPath[] = [
    {
      id: '1',
      name: 'AI Fundamentals Track',
      description: 'Start your AI journey with essential concepts and practical skills',
      courses: ['1', '4'],
      estimatedTime: '14 weeks',
      difficulty: 'Beginner',
      icon: Brain,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: '2',
      name: 'Machine Learning Engineer',
      description: 'Become a skilled ML engineer with hands-on experience',
      courses: ['1', '2', '3'],
      estimatedTime: '30 weeks',
      difficulty: 'Intermediate',
      icon: Cpu,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: '3',
      name: 'Computer Vision Specialist',
      description: 'Master computer vision and image processing techniques',
      courses: ['1', '2', '5'],
      estimatedTime: '34 weeks',
      difficulty: 'Advanced',
      icon: Eye,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: '4',
      name: 'NLP Expert',
      description: 'Specialize in natural language processing and understanding',
      courses: ['1', '3'],
      estimatedTime: '18 weeks',
      difficulty: 'Intermediate',
      icon: Globe,
      color: 'from-orange-500 to-red-600'
    }
  ];

  useEffect(() => {
    loadCourses();
    loadLearningPaths();
    calculateStats();
  }, []);

  const loadCourses = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCourses(sampleCourses);
    setIsLoading(false);
  };

  const loadLearningPaths = () => {
    setLearningPaths(sampleLearningPaths);
  };

  const calculateStats = () => {
    const stats = {
      totalCourses: sampleCourses.length,
      totalStudents: sampleCourses.reduce((sum, course) => sum + course.students, 0),
      avgRating: sampleCourses.reduce((sum, course) => sum + course.rating, 0) / sampleCourses.length,
      completionRate: sampleCourses.reduce((sum, course) => sum + course.completionRate, 0) / sampleCourses.length
    };
    setLearningStats(stats);
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'students':
        return b.students - a.students;
      case 'newest':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      case 'price':
        return a.price - b.price;
      default:
        return b.students - a.students; // popular
    }
  });

  const enrollInCourse = async (courseId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to enroll in courses');
        return;
      }

      // Simulate enrollment
      setUserProgress(prev => ({ ...prev, [courseId]: 0 }));
      toast.success('Successfully enrolled in course!');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in course');
    }
  };

  const shareCourse = async (course: Course) => {
    try {
      await navigator.share({
        title: course.title,
        text: course.description,
        url: window.location.href
      });
    } catch {
      navigator.clipboard.writeText(`${course.title} - ${window.location.href}`);
      toast.success('Course link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-full mb-6"
        >
          <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
          <span className="text-green-600 dark:text-green-400 font-medium">AI Learning Platform</span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Master AI with Expert-Led Courses
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Learn from industry experts with hands-on projects, real-world applications, and career-focused curriculum
        </motion.p>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Courses</p>
              <p className="text-3xl font-bold">{learningStats.totalCourses}</p>
            </div>
            <Book className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Students</p>
              <p className="text-3xl font-bold">{(learningStats.totalStudents / 1000).toFixed(1)}K</p>
            </div>
            <Users className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Avg Rating</p>
              <p className="text-3xl font-bold">{learningStats.avgRating.toFixed(1)}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Completion</p>
              <p className="text-3xl font-bold">{learningStats.completionRate.toFixed(0)}%</p>
            </div>
            <Award className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>
      </div>

      {/* Learning Paths */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <Target className="w-6 h-6 text-blue-500 mr-2" />
          Learning Paths
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {learningPaths.map((path, index) => {
            const Icon = path.icon;
            return (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`relative overflow-hidden rounded-2xl cursor-pointer group`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${path.color} opacity-90`} />
                <div className="relative p-6 text-white">
                  <Icon className="w-12 h-12 mb-4" />
                  <h4 className="text-lg font-bold mb-2">{path.name}</h4>
                  <p className="text-white/80 text-sm mb-4">{path.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span>{path.estimatedTime}</span>
                    <span className="px-2 py-1 bg-white/20 rounded-full">
                      {path.difficulty}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, instructors, or topics..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
              <option value="price">Price: Low to High</option>
            </select>

            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'grid' | 'list')}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="grid">Grid View</option>
              <option value="list">List View</option>
            </select>
          </div>
        </div>
      </div>

      {/* Featured Courses */}
      {filteredCourses.filter(course => course.featured).length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Star className="w-6 h-6 text-yellow-500 mr-2" />
            Featured Courses
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredCourses.filter(course => course.featured).map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300"
                onClick={() => setSelectedCourse(course)}
              >
                <div className="relative h-48">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-yellow-500 text-yellow-900 rounded-full text-sm font-bold">
                      Featured
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-lg font-bold text-white mb-1">
                      {course.title}
                    </h4>
                    <p className="text-white/80 text-sm">
                      by {course.instructor}
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      course.level === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                      course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {course.level}
                    </span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {course.rating}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {course.students.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {course.price === 0 ? 'Free' : `$${course.price}`}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        enrollInCourse(course.id);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Courses */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            All Courses ({filteredCourses.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                  viewMode === 'list' ? 'flex items-center p-4' : 'overflow-hidden'
                }`}
                onClick={() => setSelectedCourse(course)}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="relative h-48">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            shareCourse(course);
                          }}
                          className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.level === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                          course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {course.level}
                        </span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {course.rating}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {course.title}
                      </h4>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        by {course.instructor}
                      </p>

                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {course.duration}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {course.students.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {course.price === 0 ? 'Free' : `$${course.price}`}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            enrollInCourse(course.id);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Enroll
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-20 h-20 rounded-lg object-cover mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {course.title}
                        </h4>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        by {course.instructor} • {course.duration}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {course.price === 0 ? 'Free' : `$${course.price}`}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                          course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {course.level}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        enrollInCourse(course.id);
                      }}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Enroll
                    </button>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Course Detail Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCourse(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative h-64">
                <img
                  src={selectedCourse.image}
                  alt={selectedCourse.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {selectedCourse.title}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-200">
                      by {selectedCourse.instructor}
                    </span>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 mr-1" />
                      <span className="text-white font-medium">
                        {selectedCourse.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedCourse.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <BookOpen className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedCourse.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Users className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedCourse.students.toLocaleString()} enrolled
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Course Description
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {selectedCourse.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      What You'll Learn
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedCourse.topics.map((topic, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <Lightbulb className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {topic}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Skills You'll Gain
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCourse.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Prerequisites
                    </h3>
                    <ul className="space-y-2">
                      {selectedCourse.prerequisites.map((prereq, index) => (
                        <li
                          key={index}
                          className="flex items-center text-gray-700 dark:text-gray-300"
                        >
                          <Target className="w-4 h-4 text-gray-500 mr-2" />
                          {prereq}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedCourse.price === 0 ? 'Free' : `$${selectedCourse.price}`}
                    </span>
                    {selectedCourse.certificate && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                        Certificate Included
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setSelectedCourse(null)}
                      className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => enrollInCourse(selectedCourse.id)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredCourses.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No courses found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default AILearningHub;