import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { FormInput } from '../components/form/FormInput';
import { validateEmail } from '../utils';

const EmailInputPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const validation = validateEmail(email);
    if (!validation.isValid) {
      setError(validation.error || '');
      return;
    }

    // Store email in sessionStorage for next page
    sessionStorage.setItem('userEmail', email);
    navigate('/invitation-code');
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
          <h1 className="text-[28px] font-bold text-[#1A1A1A] mb-3">
            Get Started with Anyway
          </h1>
          <p className="text-[16px] text-[#666666] leading-relaxed">
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
            error={touched ? error : undefined}
            required
            onBlur={() => setTouched(true)}
            autoFocus
          />

          {/* Continue Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
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
    </div>
  );
};

export default EmailInputPage;
