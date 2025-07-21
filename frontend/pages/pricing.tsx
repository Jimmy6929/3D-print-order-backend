import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Navigation Header */}
      <div className="bg-white shadow-sm pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pricing</h1>
          <p className="text-xl text-gray-600">Transparent pricing with instant quotes</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* FDM Pricing */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">FDM Printing</h2>
              <p className="text-gray-600">Perfect for prototypes and functional parts</p>
            </div>
            
            <div className="mb-6">
              <div className="text-center">
                <span className="text-4xl font-bold text-blue-600">£0.15</span>
                <span className="text-gray-600">/cm³</span>
              </div>
              <p className="text-sm text-gray-500 text-center mt-2">+ setup fee and labor</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-gray-700">PLA, ABS, PETG materials</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-gray-700">Layer height: 0.2-0.3mm</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-gray-700">Large build volume</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-gray-700">Cost-effective for larger parts</span>
              </li>
            </ul>

            <div className="text-center">
              <Link 
                href="/upload"
                className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Get FDM Quote
              </Link>
            </div>
          </div>

          {/* Resin Pricing */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 relative">
            <div className="absolute top-4 right-4">
              <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full">
                High Detail
              </span>
            </div>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Resin Printing</h2>
              <p className="text-gray-600">Ultra-high detail and smooth surface finish</p>
            </div>
            
            <div className="mb-6">
              <div className="text-center">
                <span className="text-4xl font-bold text-purple-600">£0.45</span>
                <span className="text-gray-600">/cm³</span>
              </div>
              <p className="text-sm text-gray-500 text-center mt-2">+ setup fee and labor</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-gray-700">Premium resin materials</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-gray-700">Layer height: 0.05mm</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-gray-700">Incredible detail resolution</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-gray-700">Smooth surface finish</span>
              </li>
            </ul>

            <div className="text-center">
              <Link 
                href="/upload"
                className="block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Get Resin Quote
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Costs */}
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Additional Costs</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Setup Fee</h4>
              <p className="text-2xl font-bold text-blue-600 mb-2">£5.00</p>
              <p className="text-sm text-gray-600">Per print job</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Labor Cost</h4>
              <p className="text-2xl font-bold text-green-600 mb-2">£0.50</p>
              <p className="text-sm text-gray-600">Per hour of print time</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Post-Processing</h4>
              <p className="text-2xl font-bold text-purple-600 mb-2">£2.00</p>
              <p className="text-sm text-gray-600">Cleaning & finishing</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to get an instant quote?</h3>
          <p className="text-gray-600 mb-8">Upload your file and see exactly what your print will cost</p>
          <Link 
            href="/upload"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            Upload & Get Quote
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 