import React, { useState, useEffect } from 'react';
import Button from '../Button';
import { FormInput } from '../form/FormInput';
import { validateEmail } from '../../utils';

interface EmailInputStepProps {
  initialEmail?: string;
  onSubmit: (email: string) => void;
}

export const EmailInputStep: React.FC<EmailInputStepProps> = ({
  initialEmail = '',
  onSubmit,
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState(false);

  // Validate email on blur or when touched
  useEffect(() => {
    if (touched && email) {
      const validation = validateEmail(email);
      setError(validation.error || '');
    }
  }, [email, touched]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const validation = validateEmail(email);
    if (!validation.isValid) {
      setError(validation.error || '');
      return;
    }

    onSubmit(email);
  };

  return (
    <div className="w-full">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold leading-tight text-[#1A1A1A]">
          Get Started with Anyway
        </h1>
        <p className="text-[15px] font-normal leading-relaxed text-[#666666] mt-4">
          Manage API costs, billing, and payments in one place
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <FormInput
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="Enter your email"
          error={error}
          required
          onBlur={() => setTouched(true)}
          autoFocus
        />

        {/* Continue Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
        >
          Continue
        </Button>

        {/* Terms & Privacy */}
        <p className="text-[12px] text-[#A0A0A0] text-center pt-4">
          By continuing, you agree to our{' '}
          <a
            href="/terms"
            className="text-[#2563EB] hover:underline transition-all"
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href="/privacy"
            className="text-[#2563EB] hover:underline transition-all"
          >
            Privacy Policy
          </a>
        </p>
      </form>
    </div>
  );
};
