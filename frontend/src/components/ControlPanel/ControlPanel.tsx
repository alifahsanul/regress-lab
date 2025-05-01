'use client';

import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';

const ControlPanel = () => {
  const {
    selectedModel,
    polynomialDegree,
    treeMaxDepth,
    setSelectedModel,
    setPolynomialDegree,
    setTreeMaxDepth,
    clearPoints
  } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 space-y-6"
    >
      {/* Control panel is now empty */}
    </motion.div>
  );
};

export default ControlPanel;