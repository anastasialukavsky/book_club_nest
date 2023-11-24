import React from 'react';
interface LabelProps {
  htmlFor: string;
  label: string;
}

export default function Label({ htmlFor, label }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="mb-1">
      {label}
    </label>
  );
}
