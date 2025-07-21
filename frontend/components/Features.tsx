import React from 'react';
import { CheckIcon, Cog6ToothIcon, TruckIcon } from '@heroicons/react/24/outline';

const Features: React.FC = () => {
  const features = [
    {
      icon: CheckIcon,
      title: "Instant Quotes",
      description: "Get accurate pricing in seconds with our advanced calculation engine.",
      iconColor: "text-green-600"
    },
    {
      icon: Cog6ToothIcon,
      title: "Multiple Technologies",
      description: "Choose between FDM and Resin printing based on your needs.",
      iconColor: "text-blue-600"
    },
    {
      icon: TruckIcon,
      title: "Fast Delivery",
      description: "Quick turnaround times with tracking from print to delivery.",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <section className="py-48 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-32">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Why Choose Us?</h2>
          <p className="text-xl text-gray-600">Professional 3D printing made simple</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-12 rounded-lg shadow-sm border border-gray-100">
              <feature.icon className={`h-8 w-8 ${feature.iconColor} mb-8`} />
              <h3 className="text-xl font-semibold text-gray-900 mb-6">{feature.title}</h3>
              <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 