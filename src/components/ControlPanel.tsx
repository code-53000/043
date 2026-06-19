import React from 'react';
import { motion } from 'framer-motion';
import { Undo2, RotateCcw, ArrowLeft } from 'lucide-react';

interface ControlPanelProps {
  canUndo: boolean;
  canReset: boolean;
  onUndo: () => void;
  onReset: () => void;
  onBack: () => void;
  isStuck: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  canUndo,
  canReset,
  onUndo,
  onReset,
  onBack,
  isStuck,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex items-center justify-center gap-4 mt-6"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="flex items-center gap-2 px-5 py-3 rounded-full bg-white text-gray-600 
                   border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50
                   transition-all duration-200 font-medium shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        返回
      </motion.button>

      <motion.button
        whileHover={canUndo ? { scale: 1.05 } : {}}
        whileTap={canUndo ? { scale: 0.95 } : {}}
        onClick={onUndo}
        disabled={!canUndo}
        className={`
          flex items-center gap-2 px-5 py-3 rounded-full font-medium shadow-sm
          transition-all duration-200
          ${canUndo
            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-md'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
          ${isStuck && canUndo ? 'animate-pulse' : ''}
        `}
      >
        <Undo2 className="w-4 h-4" />
        撤销
      </motion.button>

      <motion.button
        whileHover={canReset ? { scale: 1.05 } : {}}
        whileTap={canReset ? { scale: 0.95 } : {}}
        onClick={onReset}
        disabled={!canReset}
        className={`
          flex items-center gap-2 px-5 py-3 rounded-full font-medium shadow-sm
          transition-all duration-200
          ${canReset
            ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:shadow-md'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        <RotateCcw className="w-4 h-4" />
        重置
      </motion.button>
    </motion.div>
  );
};
