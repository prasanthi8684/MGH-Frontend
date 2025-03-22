import React from 'react';
import { Gift, Package, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
}

function FeatureCard({ title, description, icon, to }: FeatureCardProps) {
  return (
    <Link to={to} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full mb-4">
            {React.cloneElement(icon as React.ReactElement, {
              className: 'h-6 w-6 text-red-600 dark:text-red-400',
            })}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
          <span className="text-red-600 dark:text-red-400 font-medium hover:text-red-700 dark:hover:text-red-300">
            Start now
          </span>
        </div>
      </div>
    </Link>
  );
}

export function HomePage() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          AI - powered procurement platform for
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          corporate gifting & merchandise
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          title="Smart Gifting"
          description="AI - powered gift curator"
          icon={<Gift />}
          to="/smart-gifting"
        />
        <FeatureCard
          title="Smart Catalog"
          description="Customized catalog with instant mockups"
          icon={<Package />}
          to="/smart-catalog"
        />
        <FeatureCard
          title="Digital Gifting"
          description="Explore digital gifting options"
          icon={<QrCode />}
          to="/digital-gifting"
        />
      </div>
    </div>
  );
}