import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <h3 className="text-2xl font-bold mb-6">3D Print Pro</h3>
            <p className="text-gray-400 mb-6 text-lg leading-relaxed">
              Professional 3D printing services with instant quotes and fast delivery. 
              Turn your digital designs into physical reality.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <div className="space-y-3">
              <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">About</Link>
              <Link href="/pricing" className="block text-gray-400 hover:text-white transition-colors">Pricing</Link>
              <Link href="/upload" className="block text-gray-400 hover:text-white transition-colors">Upload</Link>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6">Support</h4>
            <div className="space-y-3">
              <Link href="/help" className="block text-gray-400 hover:text-white transition-colors">Help Center</Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">Contact</Link>
              <Link href="/terms" className="block text-gray-400 hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-12 text-center text-gray-400">
          <p>&copy; 2024 3D Print Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 