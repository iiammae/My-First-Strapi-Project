"use client";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  text: string;
  className?: string;
}

const WaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="btn__icon-svg">
    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5s2.5 2 5 2 2.5-2 5-2 2.5 1 2.5 1" />
    <path d="M2 12c.6.5 1.2 1 2.5 1C7 13 7 11 9.5 11s2.5 2 5 2 2.5-2 5-2 2.5 1 2.5 1" />
    <path d="M2 18c.6.5 1.2 1 2.5 1C7 19 7 17 9.5 17s2.5 2 5 2 2.5-2 5-2 2.5 1 2.5 1" />
  </svg>
);

const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn__icon-svg">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export function SubmitButton({ text, className }: Readonly<SubmitButtonProps>) {
  const status = useFormStatus();
  return (
    <button
      type="submit"
      aria-disabled={status.pending}
      disabled={status.pending}
      className={`btn btn--iconic ${className ?? ""}`}
    >
      <span className="btn__icon-circle btn__icon-circle--left" aria-hidden="true"><WaveIcon /></span>
      <span className="btn__label">{status.pending ? "Loading..." : text}</span>
      <span className="btn__icon-circle btn__icon-circle--right" aria-hidden="true"><ChevronIcon /></span>
    </button>
  );
}