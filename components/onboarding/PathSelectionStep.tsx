import React from 'react';
import { OptionCard } from '../OptionCard';
import { Key, FileText } from 'lucide-react';
import { OnboardingPath } from '../../types';

interface PathSelectionStepProps {
  email: string;
  onSelectPath: (path: OnboardingPath) => void;
}

export const PathSelectionStep: React.FC<PathSelectionStepProps> = ({
  email,
  onSelectPath,
}) => {
  const [selectedPath, setSelectedPath] = React.useState<OnboardingPath | null>(null);

  const handleSelect = (path: OnboardingPath) => {
    setSelectedPath(path);
    // Small delay for visual feedback
    setTimeout(() => {
      onSelectPath(path);
    }, 150);
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[15px] text-[#666666] mb-2">
          Continue with{' '}
          <span className="font-semibold text-[#1A1A1A]">{email}</span>
        </p>
        <p className="text-[13px] text-[#A0A0A0]">
          Choose how you'd like to get started
        </p>
      </div>

      {/* Option Cards */}
      <div className="space-y-4">
        {/* Invitation Code Option */}
        <OptionCard
          title="I have an invitation code"
          description="Enter your 5-digit code to get started"
          selected={selectedPath === 'with_code'}
          onClick={() => handleSelect('with_code')}
          icon={
            <div className="w-8 h-8 rounded-lg bg-[#FEFCE8] flex items-center justify-center">
              <Key size={18} className="text-[#FDE047]" />
            </div>
          }
        />

        {/* Request Access Option */}
        <OptionCard
          title="Request Access"
          description="Apply for early access to Anyway"
          selected={selectedPath === 'request_access'}
          onClick={() => handleSelect('request_access')}
          icon={
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
              <FileText size={18} className="text-[#2563EB]" />
            </div>
          }
        />
      </div>
    </div>
  );
};
