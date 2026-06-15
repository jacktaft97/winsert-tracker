'use client';

import { useState } from 'react';

const MAX_EMAILS = 10;

const inputClass =
  'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm';

interface Props {
  primaryEmail: string;
  extraEmails: string[];
}

export function CustomerEmailInput({ primaryEmail, extraEmails }: Props) {
  const [extras, setExtras] = useState<string[]>(extraEmails);

  const addEmail = () => {
    if (extras.length < MAX_EMAILS - 1) {
      setExtras([...extras, '']);
    }
  };

  const removeEmail = (index: number) => {
    setExtras(extras.filter((_, i) => i !== index));
  };

  const updateEmail = (index: number, value: string) => {
    const updated = [...extras];
    updated[index] = value;
    setExtras(updated);
  };

  const canAdd = extras.length < MAX_EMAILS - 1;

  return (
    <div className="space-y-2">
      {/* Primary email — always shown, required */}
      <input
        name="customer_email"
        type="email"
        required
        defaultValue={primaryEmail}
        className={inputClass}
        placeholder="customer@email.com"
      />

      {/* Additional emails */}
      {extras.map((email, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            name="customer_email_extra"
            type="email"
            value={email}
            onChange={(e) => updateEmail(i, e.target.value)}
            className={inputClass}
            placeholder={`Additional email ${i + 2}`}
          />
          <button
            type="button"
            onClick={() => removeEmail(i)}
            className="text-gray-500 hover:text-red-400 transition-colors shrink-0 text-lg leading-none"
            aria-label="Remove email"
          >
            ×
          </button>
        </div>
      ))}

      {/* Add button */}
      {canAdd && (
        <button
          type="button"
          onClick={addEmail}
          className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
        >
          + Add another email {extras.length > 0 && `(${extras.length + 1}/${MAX_EMAILS})`}
        </button>
      )}

      {!canAdd && (
        <p className="text-gray-500 text-xs">Maximum of {MAX_EMAILS} emails reached.</p>
      )}
    </div>
  );
}
