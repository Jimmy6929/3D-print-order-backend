import React from 'react';
import { CloudArrowUpIcon, CurrencyDollarIcon, TruckIcon } from '@heroicons/react/24/outline';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: "Upload",
      description: "Upload your 3D model file (STL, OBJ, or STEP). Our system analyzes your design and calculates volume, complexity, and printing requirements.",
      icon: CloudArrowUpIcon,
      iconBg: "bg-blue-600",
      numberBg: "bg-blue-100",
      numberText: "text-blue-600"
    },
    {
      number: 2,
      title: "Preview & Price",
      description: "Get instant quotes for both FDM and Resin printing with detailed cost breakdowns. Compare materials, quality, and delivery times.",
      icon: CurrencyDollarIcon,
      iconBg: "bg-purple-600",
      numberBg: "bg-purple-100",
      numberText: "text-purple-600"
    },
    {
      number: 3,
      title: "Order & Track",
      description: "Place your order and track progress in real-time. From printing to post-processing to shipping, you'll know exactly where your print stands.",
      icon: TruckIcon,
      iconBg: "bg-green-600",
      numberBg: "bg-green-100",
      numberText: "text-green-600"
    }
  ];

  return (
    <section className="py-48 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-32">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">How It Works</h2>
          <p className="text-xl text-gray-600">Get your 3D prints in three simple steps</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-16">
          {steps.map((step) => (
            <div key={step.number} className="text-center group">
              <div className="relative mb-12">
                <div className={`w-20 h-20 ${step.iconBg} rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="h-10 w-10 text-white" />
                </div>
                <div className={`absolute -top-2 -right-2 w-8 h-8 ${step.numberBg} rounded-full flex items-center justify-center`}>
                  <span className={`${step.numberText} font-bold`}>{step.number}</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-8">{step.title}</h3>
              <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 