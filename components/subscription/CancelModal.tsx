import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Plan } from '../../types';
import Modal from '../Modal';
import Button from '../Button';

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  currentPlan: Plan;
  serviceEndDate: string; // ISO Date
}

const CancelModal: React.FC<CancelModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentPlan,
  serviceEndDate,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [reason, setReason] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');

  const handleConfirm = () => {
    onConfirm(step === 2 ? feedback : undefined);
  };

  const resetForm = () => {
    setStep(1);
    setReason('');
    setFeedback('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const endDateFormatted = new Date(serviceEndDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="">
      <div className="p-6">
        {step === 1 ? (
          <>
            {/* Retention step */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                Wait! Don't miss out on these benefits:
              </h2>

              <div className="space-y-3 mt-4">
                {currentPlan.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow mt-1.5 flex-shrink-0" />
                    <span className="text-sm text-neutral-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Special offer (optional) */}
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm font-medium text-amber-900">
                Special offer: Get 20% off for 3 months
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Keep your subscription and save {currentPlan.price * 0.2 * 3}/year
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="primary" className="flex-1" onClick={() => setStep(2)}>
                Keep Current Plan
              </Button>
              <Button variant="ghost" onClick={() => setStep(2)}>
                Still Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Confirmation step */}
            <div className="mb-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle size={24} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">
                    Are you sure you want to cancel?
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                <p className="text-sm text-amber-900">
                  Your service will end on{' '}
                  <span className="font-semibold">{endDateFormatted}</span>
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  After this date, you'll lose access to all {currentPlan.name} features
                </p>
              </div>

              {/* Cancellation reason form */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-1">
                    Help us improve: Why are you leaving? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:border-brand-yellow"
                  >
                    <option value="">Select a reason</option>
                    <option value="too_expensive">Too expensive</option>
                    <option value="missing_features">Missing features</option>
                    <option value="switching_service">Switching to another service</option>
                    <option value="technical_issues">Technical issues</option>
                    <option value="not_using_enough">Not using enough</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-1">
                    Additional feedback (optional)
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                    placeholder="Tell us more about your experience..."
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:border-brand-yellow resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleConfirm}
                disabled={!reason}
              >
                Confirm Cancellation
              </Button>
              <Button
                variant="secondary"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default CancelModal;
