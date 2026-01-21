import React from 'react';
import { ViewState } from '../types';

const NAVIGATION_HINT = 'Please navigate to Dashboard, Developers, or Finance to see the core requirements.';

interface NotFoundPageProps {
  viewName: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ viewName }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#FAFAFA] text-neutral-400 p-8">
      <div className="w-16 h-16 border-2 border-dashed border-neutral-300 rounded-2xl flex items-center justify-center mb-4">
        <span className="font-mono text-xl">404</span>
      </div>
      <h2 className="text-xl font-semibold text-neutral-900">Prototype Placeholder</h2>
      <p className="mt-2 text-center max-w-md">
        The <strong>{viewName}</strong> page is not implemented in this prototype.
        {NAVIGATION_HINT}
      </p>
    </div>
  );
};
