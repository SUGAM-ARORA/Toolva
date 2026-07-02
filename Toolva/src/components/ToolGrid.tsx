import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { AITool } from '../types';
import ToolCard from './ToolCard';

interface ToolGridProps {
  tools: AITool[];
  favorites: string[];
  onFavorite: (toolName: string) => void;
}

const ToolGrid: React.FC<ToolGridProps> = ({ tools, favorites, onFavorite }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  // Create refs and inView states for each tool
  const inViewStates = tools.map(() => useInView({
    triggerOnce: true,
    threshold: 0.1
  }));

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 sm:p-6"
    >
      {tools.map((tool, index) => {
        const [ref, inView] = inViewStates[index];

        return (
          <motion.div
            key={tool.name}
            ref={ref}
            variants={item}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            custom={index}
            className="h-full"
          >
            <ToolCard
              tool={tool}
              onFavorite={() => onFavorite(tool.name)}
              isFavorited={favorites.includes(tool.name)}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ToolGrid;