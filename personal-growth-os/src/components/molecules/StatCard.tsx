import React from 'react';
import Progress from '../atoms/Progress';
import Card from '../atoms/Card';

interface StatCardProps {
  name: string;
  value: number;
  maxValue?: number;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'gray';
  description?: string;
  showTargetValue?: boolean;
  targetValue?: number;
}

// Helper function to get attribute level label based on value
const getAttributeLevel = (value: number): string => {
  if (value >= 9) return 'Mastery';
  if (value >= 7.5) return 'Advanced';
  if (value >= 6) return 'Proficient';
  if (value >= 4.5) return 'Intermediate';
  if (value >= 3) return 'Basic';
  if (value >= 1.5) return 'Novice';
  return 'Untrained';
};

// Get appropriate color based on attribute value
const getAttributeColor = (value: number, variant: StatCardProps['variant']): string => {
  // If a specific variant is provided, use that instead of value-based coloring
  if (variant !== 'primary') {
    return '';
  }
  
  // Otherwise use value-based coloring
  if (value >= 9) return 'text-purple-700'; // Mastery level (purple)
  if (value >= 7.5) return 'text-blue-600'; // Advanced level (blue) 
  if (value >= 6) return 'text-green-600'; // Proficient level (green)
  if (value >= 4.5) return 'text-teal-600'; // Intermediate level (teal)
  if (value >= 3) return 'text-yellow-600'; // Basic level (yellow)
  if (value >= 1.5) return 'text-orange-500'; // Novice level (orange)
  return 'text-red-500'; // Untrained level (red)
};

// Helper function to get a description of the attribute level
const getAttributeDescription = (name: string, value: number): string => {
  const attributeName = name.toLowerCase();
  const level = getAttributeLevel(value);
  
  // Default descriptions
  const descriptions: Record<string, Record<string, string>> = {
    strength: {
      'Mastery': 'Exceptional physical prowess and power.',
      'Advanced': 'Significant physical strength and endurance.',
      'Proficient': 'Good physical capabilities.',
      'Intermediate': 'Moderate physical strength.',
      'Basic': 'Some physical capability.',
      'Novice': 'Limited physical development.',
      'Untrained': 'Minimal physical strength.'
    },
    intelligence: {
      'Mastery': 'Exceptional mental acuity and knowledge.',
      'Advanced': 'High intellectual capacity and learning ability.',
      'Proficient': 'Good mental capabilities and knowledge.',
      'Intermediate': 'Moderate intellectual development.',
      'Basic': 'Basic problem-solving and learning ability.',
      'Novice': 'Developing intellectual capabilities.',
      'Untrained': 'Limited intellectual development.'
    },
    creativity: {
      'Mastery': 'Extraordinary creative vision and originality.',
      'Advanced': 'Highly creative with innovative ideas.',
      'Proficient': 'Good creative capabilities.',
      'Intermediate': 'Moderate creative expression.',
      'Basic': 'Basic creative abilities.',
      'Novice': 'Developing creative thinking.',
      'Untrained': 'Limited creative expression.'
    },
    discipline: {
      'Mastery': 'Exceptional self-control and dedication.',
      'Advanced': 'Highly disciplined and focused.',
      'Proficient': 'Good self-discipline and consistency.',
      'Intermediate': 'Moderate self-control and habits.',
      'Basic': 'Basic routine adherence.',
      'Novice': 'Developing self-discipline.',
      'Untrained': 'Limited consistency and focus.'
    },
    vitality: {
      'Mastery': 'Exceptional health, energy and wellbeing.',
      'Advanced': 'Strong vitality and wellness practices.',
      'Proficient': 'Good health and energy levels.',
      'Intermediate': 'Moderate health maintenance.',
      'Basic': 'Basic health awareness.',
      'Novice': 'Developing health practices.',
      'Untrained': 'Limited health management.'
    },
    social: {
      'Mastery': 'Exceptional social intelligence and connections.',
      'Advanced': 'Strong social skills and network.',
      'Proficient': 'Good relationships and communication.',
      'Intermediate': 'Moderate social engagement.',
      'Basic': 'Basic social interactions.',
      'Novice': 'Developing social connections.',
      'Untrained': 'Limited social engagement.'
    }
  };
  
  // Return the appropriate description or a fallback
  return descriptions[attributeName]?.[level] || `${level} level of ${attributeName}`;
};

const StatCard: React.FC<StatCardProps> = ({
  name,
  value,
  maxValue = 10,
  icon,
  className = '',
  variant = 'primary',
  description,
  showTargetValue = false,
  targetValue,
}) => {
  // Format the name with proper capitalization
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  
  // Calculate percentage for display
  const percentage = (value / maxValue) * 100;
  
  // Get the attribute level based on value
  const attributeLevel = getAttributeLevel(value);
  
  // Get color based on value
  const valueColor = getAttributeColor(value, variant);
  
  // Get description based on attribute and value
  const attributeDescription = description || getAttributeDescription(name, value);
  
  return (
    <Card className={`w-full ${className}`} variant="outline">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          {icon && <span className="mr-2 text-gray-500">{icon}</span>}
          <h3 className="text-xs uppercase tracking-wide text-gray-500 font-medium">{formattedName}</h3>
        </div>
        
        {showTargetValue && targetValue !== undefined && (
          <div className="text-xs text-gray-500">
            Target: <span className="font-medium">{targetValue.toFixed(1)}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <div className={`text-2xl font-bold ${valueColor}`}>{value.toFixed(1)}</div>
        <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {attributeLevel}
        </div>
      </div>
      
      <Progress 
        value={percentage} 
        variant={variant} 
        size="sm" 
        className="mt-1" 
      />
      
      <p className="text-xs text-gray-600 mt-2 min-h-[32px]">{attributeDescription}</p>
      
      {showTargetValue && targetValue !== undefined && targetValue > value && (
        <div className="text-xs text-blue-600 mt-1 flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-3 w-3 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            width="12"
            height="12"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          Growth potential: +{(targetValue - value).toFixed(1)}
        </div>
      )}
    </Card>
  );
};

export default StatCard; 