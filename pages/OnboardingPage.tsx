import React, { useState } from 'react';
import {
  OnboardingStep,
  OnboardingPath,
  OnboardingFormData,
  OnboardingUser,
} from '../types';
import { EmailInputStep } from '../components/onboarding/EmailInputStep';
import { PathSelectionStep } from '../components/onboarding/PathSelectionStep';
import { InvitationCodeStep } from '../components/onboarding/InvitationCodeStep';
import { RequestAccessForm } from '../components/onboarding/RequestAccessForm';
import { SuccessState } from '../components/onboarding/SuccessState';
import { useToast } from '../contexts/ToastContext';

interface OnboardingPageProps {
  onComplete: (user: OnboardingUser) => void;
  onClose?: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  onComplete,
  onClose,
}) => {
  const [step, setStep] = useState<OnboardingStep>('email_input');
  const [path, setPath] = useState<OnboardingPath | null>(null);
  const [formData, setFormData] = useState<OnboardingFormData>({ email: '' });
  const { showToast } = useToast();

  // Step 1: Email input
  const handleEmailSubmit = (email: string) => {
    setFormData((prev) => ({ ...prev, email }));
    setStep('path_selection');
  };

  // Step 2: Path selection
  const handlePathSelect = (selectedPath: OnboardingPath) => {
    setPath(selectedPath);

    if (selectedPath === 'with_code') {
      setStep('invitation_code');
    } else {
      setStep('request_access');
    }
  };

  // Step 3a: Invitation code submission
  const handleInvitationCodeSubmit = () => {
    // Send magic link
    showToast('Check your email for a magic link to log in', 'success');
    setStep('success');
  };

  // Step 3b: Request access submission
  const handleRequestAccessSubmit = () => {
    showToast('Application submitted successfully', 'success');
    setStep('success');
  };

  // Error handler
  const handleError = (error: string) => {
    showToast(error, 'error');
  };

  // Go back to previous step
  const handleBack = () => {
    switch (step) {
      case 'path_selection':
        setStep('email_input');
        break;
      case 'invitation_code':
      case 'request_access':
        setStep('path_selection');
        break;
      case 'success':
        if (path === 'with_code') {
          setStep('invitation_code');
        } else {
          setStep('request_access');
        }
        break;
    }
  };

  // Reset onboarding
  const handleReset = () => {
    setStep('email_input');
    setPath(null);
    setFormData({ email: '' });
  };

  // Render current step
  const renderStep = () => {
    switch (step) {
      case 'email_input':
        return (
          <EmailInputStep
            initialEmail={formData.email}
            onSubmit={handleEmailSubmit}
          />
        );

      case 'path_selection':
        return (
          <PathSelectionStep
            email={formData.email}
            onSelectPath={handlePathSelect}
          />
        );

      case 'invitation_code':
        return (
          <InvitationCodeStep
            email={formData.email}
            onSubmit={handleInvitationCodeSubmit}
            onError={handleError}
          />
        );

      case 'request_access':
        return (
          <RequestAccessForm
            email={formData.email}
            onSubmit={handleRequestAccessSubmit}
            onError={handleError}
          />
        );

      case 'success':
        return (
          <SuccessState
            type={path === 'with_code' ? 'magic_link_sent' : 'application_submitted'}
            email={formData.email}
            onClose={onClose}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Progress Indicator (optional, can be added later) */}
      {step !== 'success' && (
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <div
              className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                step === 'email_input' ? 'bg-[#FDE047]' : 'bg-[#FDE047]'
              }`}
            />
            <div
              className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                step === 'email_input' || step === 'path_selection'
                  ? 'bg-[#E5E5E5]'
                  : 'bg-[#FDE047]'
              }`}
            />
            <div
              className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                step === 'success' ? 'bg-[#FDE047]' : 'bg-[#E5E5E5]'
              }`}
            />
          </div>
        </div>
      )}

      {/* Current Step */}
      {renderStep()}
    </div>
  );
};
