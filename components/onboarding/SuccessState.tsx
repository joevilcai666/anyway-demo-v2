import React from 'react';
import Button from '../Button';
import { Check, Mail } from 'lucide-react';
import { resendMagicLink } from '../../services/mockOnboardingApi';

interface SuccessStateProps {
  type: 'magic_link_sent' | 'application_submitted';
  email: string;
  onResend?: () => void;
  onClose?: () => void;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  type,
  email,
  onResend,
  onClose,
}) => {
  const [isResending, setIsResending] = React.useState(false);
  const [resent, setResent] = React.useState(false);

  const handleResend = async () => {
    if (!onResend) return;

    setIsResending(true);
    try {
      await resendMagicLink(email);
      setResent(true);
      if (onResend) onResend();

      // Reset "resent" state after 5 seconds
      setTimeout(() => setResent(false), 5000);
    } catch (err) {
      console.error('Failed to resend magic link:', err);
    } finally {
      setIsResending(false);
    }
  };

  if (type === 'magic_link_sent') {
    return (
      <div className="w-full animate-in fade-in duration-300">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center">
            <Check size={32} className="text-[#16A34A]" />
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-6">
          <h2 className="text-[24px] font-bold text-[#1A1A1A] mb-2">
            Check your email!
          </h2>
          <p className="text-[15px] text-[#666666]">
            We've sent a magic link to{' '}
            <span className="font-semibold text-[#1A1A1A]">{email}</span>
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-[#FAFAFA] rounded-lg p-4 mb-6">
          <p className="text-[14px] text-[#666666] mb-3">
            The link will expire in 15 minutes.
          </p>
          <p className="text-[14px] text-[#666666]">
            Didn't receive it? Check your spam folder or{' '}
            <button
              onClick={handleResend}
              disabled={isResending || resent}
              className="text-[#2563EB] hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isResending ? 'Sending...' : resent ? 'Sent!' : 'Resend email'}
            </button>
          </p>
        </div>

        {/* Close Button */}
        <Button
          variant="primary"
          size="md"
          className="w-full"
          onClick={onClose}
        >
          Done
        </Button>
      </div>
    );
  }

  // application_submitted
  return (
    <div className="w-full animate-in fade-in duration-300">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center">
          <Check size={32} className="text-[#16A34A]" />
        </div>
      </div>

      {/* Headline */}
      <div className="text-center mb-6">
        <h2 className="text-[24px] font-bold text-[#1A1A1A] mb-2">
          Thank you for your interest!
        </h2>
        <p className="text-[15px] text-[#666666]">
          We've received your application and will review it shortly.
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-[#FAFAFA] rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Mail size={20} className="text-[#666666] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[14px] text-[#666666] mb-1">
              We'll get back to you within 1-2 business days.
            </p>
            <p className="text-[14px] text-[#666666]">
              In the meantime, feel free to explore our documentation.
            </p>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <Button
        variant="primary"
        size="md"
        className="w-full"
        onClick={onClose}
      >
        Done
      </Button>
    </div>
  );
};
