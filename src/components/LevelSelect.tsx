import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Check, Grid3X3 } from 'lucide-react';
import { Level, PlayerProgress } from '../types/game';
import { levels } from '../data/levels';

interface LevelSelectProps {
  progress: PlayerProgress;
  onSelectLevel: (level: Level) => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({ progress, onSelectLevel }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 mb-4 shadow-lg"
        >
          <Grid3X3 className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">一笔画填格子</h1>
        <p className="text-gray-500">选择关卡开始挑战</p>
        <p className="text-sm text-gray-400 mt-2">
          已完成 {progress.completedLevels.length} / {levels.length} 关
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-4 gap-4"
      >
        {levels.map((level) => {
          const isUnlocked = level.id <= progress.unlockedLevel;
          const isCompleted = progress.completedLevels.includes(level.id);

          return (
            <motion.button
              key={level.id}
              variants={item}
              whileHover={isUnlocked ? { scale: 1.05, y: -4 } : {}}
              whileTap={isUnlocked ? { scale: 0.95 } : {}}
              onClick={() => isUnlocked && onSelectLevel(level)}
              disabled={!isUnlocked}
              className={`
                relative aspect-square rounded-2xl flex flex-col items-center justify-center
                transition-all duration-200 font-bold
                ${isUnlocked
                  ? isCompleted
                    ? 'bg-gradient-to-br from-primary-400 to-accent-500 text-white shadow-lg cursor-pointer hover:shadow-xl'
                    : 'bg-white text-gray-700 shadow-md hover:shadow-lg cursor-pointer border-2 border-gray-100 hover:border-primary-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <span className="text-2xl">{level.id}</span>
              <span className="text-xs mt-1 font-medium opacity-70">{level.name}</span>
              <span className="text-xs opacity-50 mt-0.5">{level.gridSize}×{level.gridSize}</span>

              {isCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md"
                >
                  <Check className="w-4 h-4 text-primary-500" strokeWidth={3} />
                </motion.div>
              )}

              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 rounded-2xl">
                  <Lock className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      <div className="mt-10 text-center">
        <div className="inline-flex items-center gap-6 text-sm text-gray-500 bg-white/60 px-6 py-3 rounded-full">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-primary-400 to-accent-500" />
            <span>已完成</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white border-2 border-gray-200" />
            <span>可挑战</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100" />
            <span>未解锁</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
