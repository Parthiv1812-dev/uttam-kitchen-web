import { ImageWithFallback } from './figma/ImageWithFallback';
import { CheckCircle } from 'lucide-react';

interface MachineCardProps {
  machine: {
    name: string;
    image: string;
    description: string;
    advantages: string[];
  };
}

export function MachineCard({ machine }: MachineCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Machine Image */}
      <div className="aspect-video overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={machine.image}
          alt={machine.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Machine Info */}
      <div className="p-6">
        <h3 className="text-gray-900 mb-3">{machine.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{machine.description}</p>

        {/* Advantages */}
        <div className="space-y-2">
          <p className="text-sm text-gray-900">Key Advantages:</p>
          <ul className="space-y-1.5">
            {machine.advantages.map((advantage, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{advantage}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
