import React from 'react';
import { motion } from 'framer-motion';
import { Position, isSamePosition } from '../types/game';
import { Play } from 'lucide-react';

interface GameCellProps {
  position: Position;
  isStart: boolean;
  isInPath: boolean;
  isCurrent: boolean;
  pathIndex: number;
  gridSize: number;
  onMouseDown: (pos: Position) => void;
  onMouseEnter: (pos: Position) => void;
  isCompleted: boolean;
}

export const GameCell: React.FC<GameCellProps> = ({
  position,
  isStart,
  isInPath,
  isCurrent,
  pathIndex,
  gridSize,
  onMouseDown,
  onMouseEnter,
  isCompleted,
}) => {
  const cellSize = gridSize <= 4 ? 80 : gridSize <= 5 ? 68 : gridSize <= 6 ? 56 : 48;

  const getCellStyles = () => {
    if (isCompleted) {
      return 'bg-gradient-to-br from-primary-400 to-accent-500 text-white';
    }
    if (isCurrent) {
      return 'bg-gradient-to-br from-primary-500 to-primary-600 text-white scale-105 shadow-lg';
    }
    if (isInPath) {
      return 'bg-gradient-to-br from-primary-300 to-accent-400 text-white';
    }
    return 'bg-white hover:bg-gray-50 text-gray-600';
  };

  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.2,
        delay: (position.row * gridSize + position.col) * 0.02,
      }}
      className={`
        relative flex items-center justify-center rounded-xl cursor-pointer
        select-none transition-all duration-150 ease-out
        border-2 border-gray-100 shadow-sm
        ${getCellStyles()}
        ${!isInPath && !isCompleted ? 'hover:border-primary-200' : ''}
      `}
      style={{
        width: `${cellSize}px`,
        height: `${cellSize}px`,
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown(position);
      }}
      onMouseEnter={() => onMouseEnter(position)}
    >
      {isStart && !isInPath && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Play className="w-6 h-6 text-primary-500 fill-primary-500" />
        </motion.div>
      )}

      {isInPath && !isCurrent && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-sm font-semibold opacity-60"
        >
          {pathIndex + 1}
        </motion.span>
      )}

      {isCurrent && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-4 h-4 bg-white rounded-full shadow-inner" />
        </motion.div>
      )}

      {isCompleted && isStart && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Play className="w-5 h-5 text-white fill-white" />
        </motion.div>
      )}
    </motion.div>
  );
};
