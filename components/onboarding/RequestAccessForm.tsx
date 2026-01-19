import React, { useState, useEffect } from 'react';
import Button from '../Button';
import { FormInput } from '../form/FormInput';
import { FormTextarea } from '../form/FormTextarea';
import { FormSelect } from '../form/FormSelect';
import { Spinner } from '../Spinner';
import {
  validateFullName,
  validateCompanyName,
  validateOnboardingUseCase,
} from '../../utils';
import { submitAccessRequest } from '../../services/mockOnboardingApi';
import { OnboardingFormData as OnboardingFormDataInterface } from '../../types';

interface RequestAccessFormProps {
  email: string;
  onSubmit: () => void;
  onError: (error: string) => void;
}

const SOURCE_OPTIONS = [
  { value: 'direct', label: 'Direct' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'friend', label: 'Friend' },
  { value: 'other', label: 'Other' },
];

export const RequestAccessForm: React.FC<RequestAccessFormProps> = ({
  email,
  onSubmit,
  onError,
}) => {
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

  // Update email when it changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, email }));
  }, [email]);

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
        onSubmit();
      } else {
        onError(result.error || 'Failed to submit request');
      }
    } catch (err) {
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
          Request Access to Anyway
        </h2>
        <p className="text-[15px] text-[#666666] mt-2">
          Fill out the form below and we'll get back to you soon
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
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

        {/* Email (pre-filled, read-only) */}
        <FormInput
          id="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={() => {}}
          disabled
          required
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
          rows={5}
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

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner size={16} />
              Submitting...
            </span>
          ) : (
            'Submit Request'
          )}
        </Button>
      </form>
    </div>
  );
};
