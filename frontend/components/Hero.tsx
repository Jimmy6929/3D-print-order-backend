import React, { useState } from 'react';
import Link from 'next/link';
import FileUploader from './FileUploader';
import UploadStatus from './UploadStatus';

interface CalculationDetails {
  volume_mm3: number;
  volume_cm3: number;
  triangle_count: number;
  weight_g: number;
  print_time_h: number;
  material_density: number;
  file_format?: string;
  original_filename?: string;
}

interface PricingOption {
  price: number;
  print_time_h: number;
  material_type: string;
  technology: string;
  details: {
    material_cost: number;
    labor_cost: number;
    setup_fee: number;
    post_processing: number;
  };
}

interface PricingOptions {
  fdm: PricingOption;
  resin: PricingOption;
}

interface QuoteData {
  quoteId: string;
  fileUrl: string;
  pricingOptions: PricingOptions;
  calculationDetails: CalculationDetails;
}

interface HeroProps {
  onScrollToUpload?: () => void;
  onUploadComplete?: (data: QuoteData) => void;
}

const Hero: React.FC<HeroProps> = ({ onScrollToUpload, onUploadComplete }) => {
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleUploadComplete = (data: QuoteData) => {
    setStatus('Quote generated! Choose your printing technology below.');
    setError(null);
    if (onUploadComplete) {
      onUploadComplete(data);
    }
  };

  return (
    <section className="pt-48 pb-48 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-16 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              1D, 2D, 3D
            </span>
            <br />
            <span className="text-gray-800">
              to a Dam Fine Model
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-20 max-w-3xl mx-auto">
            Upload your STL, OBJ, or STEP files and get instant quotes for professional 3D printing. 
            From prototypes to production runs, we make your ideas tangible.
          </p>
          
          {/* Upload Interface - Always Visible */}
          <div className="max-w-2xl mx-auto mb-16">
            <FileUploader onUploadComplete={handleUploadComplete} />
            <UploadStatus status={status} error={error} />
          </div>

          {/* Secondary CTA */}
          <div className="flex justify-center">
            <Link 
              href="/pricing" 
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:transform hover:scale-105"
            >
              View Pricing Details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 