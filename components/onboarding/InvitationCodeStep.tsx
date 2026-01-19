import React, { useState, useEffect } from 'react';
import Button from '../Button';
import { FormInput } from '../form/FormInput';
import { Spinner } from '../Spinner';
import { validateInvitationCode } from '../../utils';
import { validateInvitationCode as apiValidateInvitationCode } from '../../services/mockOnboardingApi';

interface InvitationCodeStepProps {
  email: string;
  onSubmit: () => void;
  onError: (error: string) => void;
}

export const InvitationCodeStep: React.FC<InvitationCodeStepProps> = ({
  email,
  onSubmit,
  onError,
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-format: only allow digits, max 5
  const handleCodeChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 5);
    setCode(digitsOnly);
    setError(''); // Clear error on new input
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const validation = validateInvitationCode(code);
    if (!validation.isValid) {
      setError(validation.error || '');
      return;
    }

    // Call API
    setIsSubmitting(true);
    try {
      const result = await apiValidateInvitationCode(code, email);
      if (result.success) {
        onSubmit();
      } else {
        setError(result.error || 'Invalid invitation code. Please contact support.');
        onError(result.error || 'Invalid invitation code');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      onError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[20px] font-semibold text-[#1A1A1A]">
          Enter your invitation code
        </h2>
        <p className="text-[15px] text-[#666666] mt-2">
          Enter the 5-digit code you received to get started
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Invitation Code Input */}
        <div>
          <FormInput
            id="invitation-code"
            label="Invitation code"
            type="text"
            value={code}
            onChange={handleCodeChange}
            placeholder="Enter 5-digit code"
            error={error}
            maxLength={5}
            required
            autoFocus
            className="font-mono text-center tracking-widest text-2xl"
          />
          <p className="text-[13px] text-[#A0A0A0] mt-2 text-center">
            Valid codes: 12345, 67890, 54321
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          disabled={isSubmitting || code.length !== 5}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner size={16} />
              Verifying...
            </span>
          ) : (
            'Submit'
          )}
        </Button>
      </form>
    </div>
  );
};
