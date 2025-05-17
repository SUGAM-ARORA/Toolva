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

const ToolGridItem: React.FC<{
  tool: AITool;
  isFavorited: boolean;
  onFavorite: () => void;
  custom: number;
}> = ({ tool, isFavorited, onFavorite, custom }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      key={tool.name}
      ref={ref}
      variants={item}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      custom={custom}
      className="h-full"
    >
      <ToolCard
        tool={tool}
        onFavorite={onFavorite}
        isFavorited={isFavorited}
      />
    </motion.div>
  );
};

const ToolGrid: React.FC<ToolGridProps> = ({ tools, favorites, onFavorite }) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6"
    >
      {tools.map((tool, index) => (
        <ToolGridItem
          key={tool.name}
          tool={tool}
          isFavorited={favorites.includes(tool.name)}
          onFavorite={() => onFavorite(tool.name)}
          custom={index}
        />
      ))}
    </motion.div>
  );
};

export default ToolGrid;