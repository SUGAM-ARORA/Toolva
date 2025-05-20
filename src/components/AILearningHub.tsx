import React, { useState } from 'react';
import { Book, Video, Code, Brain, Search, BookOpen, Play, Star, Clock, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
}

const courses: Course[] = [
  {
    id: '1',
    title: 'Introduction to AI and Machine Learning',
    description: 'Learn the fundamentals of AI and ML with practical examples',
    category: 'Fundamentals',
    level: 'Beginner',
    duration: '6 hours',
    instructor: 'Dr. Sarah Chen',
    rating: 4.8,
    students: 12500,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    topics: ['AI Basics', 'Machine Learning', 'Neural Networks', 'Deep Learning'],
    prerequisites: ['Basic Python', 'Mathematics']
  },
  // Add more courses...
];

const AILearningHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const categories = ['All', 'Fundamentals', 'Applications', 'Tools', 'Ethics'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          AI Learning Hub
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Master AI concepts with comprehensive courses and resources
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-20">
            <div className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Difficulty Level
                </h3>
                <div className="space-y-2">
                  {levels.map(level => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedLevel === level
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course List */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => setSelectedCourse(course)}
              >
                <div className="relative h-48">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-semibold text-white">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-200">
                      {course.instructor}
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                      {course.category}
                    </span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {course.rating}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {course.students.toLocaleString()} students
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {selectedCourse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                onClick={() => setSelectedCourse(null)}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
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
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {selectedCourse.title}
                      </h2>
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-200">
                          By {selectedCourse.instructor}
                        </span>
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-400 mr-1" />
                          <span className="text-white">
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
                          Topics Covered
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedCourse.topics.map((topic, index) => (
                            <div
                              key={index}
                              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                            >
                              <Brain className="w-4 h-4 text-blue-500 mr-2" />
                              <span className="text-gray-700 dark:text-gray-300">
                                {topic}
                              </span>
                            </div>
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
                              <Code className="w-4 h-4 text-gray-500 mr-2" />
                              {prereq}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-4">
                      <button
                        onClick={() => setSelectedCourse(null)}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Close
                      </button>
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                        <Play className="w-5 h-5 mr-2" />
                        Start Learning
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AILearningHub;