import React from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface UploadSectionProps {
  onScrollToHero?: () => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onScrollToHero }) => {
  const handleUploadClick = () => {
    if (onScrollToHero) {
      onScrollToHero();
    } else {
      // Fallback: scroll to top where the hero section is
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section id="upload-section" className="py-48 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">Ready to Get Started?</h2>
        <p className="text-xl text-gray-600 mb-20">
          Upload your file now and get an instant quote
        </p>
        <button 
          onClick={handleUploadClick}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <CloudArrowUpIcon className="inline h-6 w-6 mr-2" />
          Upload Your File
        </button>
      </div>
    </section>
  );
};

export default UploadSection; 