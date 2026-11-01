import React from 'react';

interface PricingSectionProps {
  packageName?: string;
  duration?: string;
  price?: string;
  description?: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ 
  packageName = "Custom Trip Package", 
  duration = "Flexible", 
  price = "Calculated on Request", 
  description = "Get a personalized quote for your dream Himalayan adventure." 
}) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{packageName}</h3>
          <p className="text-gray-500 text-sm mt-1">{duration}</p>
          <p className="text-gray-600 mt-2 max-w-xl">{description}</p>
        </div>
        {price && (
          <div className="text-left md:text-right shrink-0">
            {price !== "Calculated on Request" && (
              <div className="text-sm text-gray-500 mb-1">Starting from</div>
            )}
            <div className="text-3xl font-bold text-[#0066FF]">{price}</div>
          </div>
        )}
      </div>
    </div>
  );
};
