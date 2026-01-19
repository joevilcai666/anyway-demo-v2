import React, { useState } from 'react';
import Button from '../components/Button';
import { FormInput } from '../components/form/FormInput';
import { FormTextarea } from '../components/form/FormTextarea';
import { FormSelect } from '../components/form/FormSelect';
import { Spinner } from '../components/Spinner';
import {
  validateFullName,
  validateCompanyName,
  validateOnboardingUseCase,
  validateEmail,
} from '../utils';
import { submitAccessRequest } from '../services/mockOnboardingApi';
import { OnboardingFormData as OnboardingFormDataInterface } from '../types';

const SOURCE_OPTIONS = [
  { value: 'direct', label: 'Direct' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'friend', label: 'Friend' },
  { value: 'other', label: 'Other' },
];

interface SurveyPageProps {
  onNavigateBack: () => void;
  email?: string; // Pre-filled email from previous step
}

const SurveyPage: React.FC<SurveyPageProps> = ({ onNavigateBack, email = '' }) => {
  const [formData, setFormData] = useState<OnboardingFormDataInterface>({
    email,
    fullName: '',
    companyName: '',
    useCase: '',
    source: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFieldChange = (field: keyof OnboardingFormDataInterface, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate this field
    let error = '';
    switch (field) {
      case 'email':
        error = validateEmail(formData.email || '').error || '';
        break;
      case 'fullName':
        error = validateFullName(formData.fullName || '').error || '';
        break;
      case 'companyName':
        error = validateCompanyName(formData.companyName || '').error || '';
        break;
      case 'useCase':
        error = validateOnboardingUseCase(formData.useCase || '').error || '';
        break;
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};

    const emailValidation = validateEmail(formData.email || '');
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error || '';
    }

    const fullNameValidation = validateFullName(formData.fullName || '');
    if (!fullNameValidation.isValid) {
      newErrors.fullName = fullNameValidation.error || '';
    }

    const companyNameValidation = validateCompanyName(formData.companyName || '');
    if (!companyNameValidation.isValid) {
      newErrors.companyName = companyNameValidation.error || '';
    }

    const useCaseValidation = validateOnboardingUseCase(formData.useCase || '');
    if (!useCaseValidation.isValid) {
      newErrors.useCase = useCaseValidation.error || '';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        email: true,
        fullName: true,
        companyName: true,
        useCase: true,
      });
      return;
    }

    // Submit
    setIsSubmitting(true);
    try {
      const result = await submitAccessRequest(formData);
      if (result.success) {
        setIsSuccess(true);
        // Navigate back after 3 seconds
        setTimeout(() => {
          onNavigateBack();
        }, 3000);
      } else {
        setErrors({ submit: result.error || 'Failed to submit request' });
      }
    } catch (err) {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-[#F0FDF4] flex items-center justify-center">
              <span className="text-5xl">✓</span>
            </div>
          </div>
          <h2 className="text-[28px] font-bold text-[#1A1A1A] mb-3">
            Thank you for your interest!
          </h2>
          <p className="text-[16px] text-[#666666] mb-6">
            We've received your application and will review it shortly.
          </p>
          <p className="text-[14px] text-[#A0A0A0]">
            Redirecting you back...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-bold text-[#1A1A1A] mb-3">
            Request Access
          </h1>
          <p className="text-[16px] text-[#666666] leading-relaxed">
            Tell us about yourself and how you plan to use Anyway
          </p>
        </div>

        {/* Back Button */}
        <button
          onClick={onNavigateBack}
          className="mb-6 text-[14px] text-[#2563EB] hover:underline transition-all flex items-center gap-1"
        >
          ← Back to invitation code
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
          {/* Full Name */}
          <FormInput
            id="full-name"
            label="Full Name"
            type="text"
            value={formData.fullName || ''}
            onChange={(value) => handleFieldChange('fullName', value)}
            placeholder="Enter your full name"
            error={touched.fullName ? errors.fullName : undefined}
            required
            onBlur={() => handleBlur('fullName')}
          />

          {/* Email */}
          <FormInput
            id="email"
            label="Email Address"
            type="email"
            value={formData.email || ''}
            onChange={(value) => handleFieldChange('email', value)}
            placeholder="Enter your email"
            error={touched.email ? errors.email : undefined}
            required
            onBlur={() => handleBlur('email')}
          />

          {/* Company Name */}
          <FormInput
            id="company-name"
            label="Company Name"
            type="text"
            value={formData.companyName || ''}
            onChange={(value) => handleFieldChange('companyName', value)}
            placeholder="Enter your company name"
            error={touched.companyName ? errors.companyName : undefined}
            required
            onBlur={() => handleBlur('companyName')}
          />

          {/* Use Case */}
          <FormTextarea
            id="use-case"
            label="Use Case"
            value={formData.useCase || ''}
            onChange={(value) => handleFieldChange('useCase', value)}
            placeholder="Tell us about your use case and how you plan to use Anyway"
            error={touched.useCase ? errors.useCase : undefined}
            minLength={20}
            maxLength={500}
            showCharCounter
            rows={6}
            required
            onBlur={() => handleBlur('useCase')}
          />

          {/* How did you hear about us? (optional) */}
          <FormSelect
            id="source"
            label="How did you hear about us?"
            value={formData.source || ''}
            onChange={(value) => handleFieldChange('source', value)}
            options={SOURCE_OPTIONS}
            placeholder="Select an option"
          />

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-lg p-4">
              <p className="text-[14px] text-[#DC2626]">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner size={20} />
                Submitting...
              </span>
            ) : (
              'Submit Request'
            )}
          </Button>
        </form>

        {/* Terms & Privacy */}
        <p className="text-[12px] text-[#A0A0A0] text-center mt-6">
          By submitting this form, you agree to our{' '}
          <a href="/terms" className="text-[#2563EB] hover:underline transition-all">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-[#2563EB] hover:underline transition-all">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default SurveyPage;
