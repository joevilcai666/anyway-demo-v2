import React from 'react';
import { Clock, AlertCircle, RefreshCw } from 'lucide-react';

export type DraftStatus = 'unsaved' | 'saving' | 'saved' | 'error';

interface DraftSaveIndicatorProps {
  status: DraftStatus;
  lastSaved?: Date;
  errorMessage?: string;
  onRetry?: () => void;
  className?: string;
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const DraftSaveIndicator: React.FC<DraftSaveIndicatorProps> = ({
  status,
  lastSaved,
  errorMessage,
  onRetry,
  className = '',
}) => {
  // Unsaved state - don't show anything yet
  if (status === 'unsaved') {
    return null;
  }

  // Saving state
  if (status === 'saving') {
    return (
      <div
        className={`
          flex items-center gap-2 text-xs text-neutral-500
          animate-in fade-in duration-200
          ${className}
        `}
      >
        <RefreshCw className="w-3.5 h-3.5 animate-spin" strokeWidth={2} />
        <span>Saving draft…</span>
      </div>
    );
  }

  // Saved state
  if (status === 'saved' && lastSaved) {
    const timeString = formatTime(lastSaved);
    return (
      <div
        className={`
          flex items-center gap-2 text-xs text-neutral-500
          animate-in fade-in duration-200
          ${className}
        `}
        role="status"
        aria-live="polite"
      >
        <Clock className="w-3.5 h-3.5" strokeWidth={2} />
        <span>Draft saved at {timeString}</span>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div
        className={`
          flex items-center gap-2 text-xs
          ${className}
        `}
        role="alert"
        aria-live="assertive"
      >
        <AlertCircle className="w-3.5 h-3.5 text-red-500" strokeWidth={2} />
        <span className="text-red-500">Failed to save draft</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="font-medium text-red-600 hover:text-red-700 underline underline-offset-2"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return null;
};

// Hook for managing draft auto-save
export const useDraftAutoSave = <T extends Record<string, any>>(
  data: T,
  saveFunction: (data: T) => Promise<boolean>,
  throttleMs: number = 5000
) => {
  const [status, setStatus] = React.useState<DraftStatus>('unsaved');
  const [lastSaved, setLastSaved] = React.useState<Date>();
  const [errorMessage, setErrorMessage] = React.useState<string>();

  const save = React.useCallback(async () => {
    if (status === 'saving') return; // Already saving

    setStatus('saving');
    setErrorMessage(undefined);

    try {
      const success = await saveFunction(data);
      if (success) {
        setStatus('saved');
        setLastSaved(new Date());
      } else {
        setStatus('error');
        setErrorMessage('Save failed');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    }
  }, [data, saveFunction, status]);

  // Throttled auto-save
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (status !== 'saving') {
        save();
      }
    }, throttleMs);

    return () => clearTimeout(timeoutId);
  }, [data, throttleMs, status, save]);

  const retry = React.useCallback(() => {
    save();
  }, [save]);

  return {
    status,
    lastSaved,
    errorMessage,
    retry,
  };
};
