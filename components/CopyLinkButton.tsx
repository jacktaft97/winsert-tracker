'use client';

import { useState } from 'react';

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 text-sm border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
    >
      {copied ? '✓ Copied!' : 'Copy Customer Link'}
    </button>
  );
}
