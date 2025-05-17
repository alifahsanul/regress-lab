'use client';

import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">
              Regression Lab
            </h1>
          </div>
        </div>
      </div>
    </nav>
  );
} 