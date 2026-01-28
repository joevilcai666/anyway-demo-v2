import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { FormInput } from '../components/form/FormInput';
import { Spinner } from '../components/Spinner';
import { validateInvitationCode } from '../utils';
import { validateInvitationCode as apiValidateInvitationCode } from '../services/mockOnboardingApi';

const InvitationCodePage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load email from sessionStorage
  useEffect(() => {
    const savedEmail = sessionStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      // No email, go back
      navigate('/email-input');
    }
  }, [navigate]);

  // Auto-format: only allow digits, max 5
  const handleCodeChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 5);
    setCode(digitsOnly);
    setError('');
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
        // Navigate to dashboard on success
        navigate('/dashboard');
      } else {
        setError(result.error || 'Invalid invitation code. Please contact support.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FDE047] to-[#FACC15] flex items-center justify-center shadow-lg">
            <span className="text-4xl">✨</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-bold text-[#1A1A1A] mb-3">
            Enter your invitation code
          </h1>
          <p className="text-[16px] text-[#666666] leading-relaxed">
            Welcome to the private beta! Enter your code to get started.
          </p>
        </div>

        {/* Email Confirmation Badge */}
        <div className="bg-white rounded-lg border border-[#E0E0E0] p-4 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#F0FDF4] flex items-center justify-center flex-shrink-0">
            <span className="text-[#16A34A] text-sm">✓</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-[#A0A0A0]">Email confirmed</p>
            <p className="text-[15px] font-medium text-[#1A1A1A] truncate">{email}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Invitation Code Input */}
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

          {/* Get Started Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isSubmitting || code.length !== 5}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner size={20} />
                Activating...
              </span>
            ) : (
              'Get Started'
            )}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E0E0E0]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#FAFAFA] text-[#A0A0A0]">
                Don't have code?
              </span>
            </div>
          </div>

          {/* Apply for Access Button */}
          <button
            type="button"
            onClick={() => navigate('/survey')}
            className="w-full h-[48px] bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white text-[15px] font-medium rounded-full transition-all duration-150 shadow-sm hover:shadow-md"
          >
            Apply for access
          </button>

          {/* Sign In Link */}
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => {/* TODO: Implement login page */}}
              className="text-[14px] text-[#666666] hover:text-[#1A1A1A] underline transition-all"
            >
              Sign in now
            </button>
          </div>
        </form>

        {/* Helper Text */}
        <p className="text-[13px] text-[#A0A0A0] text-center mt-8">
          Valid codes: 12345, 67890, 54321
        </p>
      </div>
    </div>
  );
};

export default InvitationCodePage;
