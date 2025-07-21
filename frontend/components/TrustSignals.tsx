import React from 'react';

interface TrustSignalsProps {
  modelsThisWeek?: number;
}

const TrustSignals: React.FC<TrustSignalsProps> = ({ modelsThisWeek = 247 }) => {
  return (
    <section className="py-40 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-20">Trusted by makers worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-16 mb-20">
            {/* File Format Support */}
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">STL</span>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">OBJ</span>
              </div>
              <div className="w-10 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold text-xs">STEP</span>
              </div>
            </div>
            
            {/* Stats */}
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{modelsThisWeek.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Models printed this week</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignals; 