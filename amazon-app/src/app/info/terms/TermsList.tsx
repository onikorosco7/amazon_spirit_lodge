'use client';

import { ShieldCheck } from 'lucide-react';

export default function TermsList({ content }: { content: string }) {
  const termsArray = content.split('. ').filter(item => item.trim().length > 0);

  return (
    <div className="space-y-5">
      {termsArray.map((term, index) => (
        <div key={index} className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-700 mt-1" />
          <p className="text-base leading-relaxed text-gray-700">
            {term.trim().endsWith('.') ? term.trim() : term.trim() + '.'}
          </p>
        </div>
      ))}
    </div>
  );
}
