"use client";

import { useState } from "react";
import SponsorForm from "./SponsorForm";

interface SponsorButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function SponsorButton({ className, children }: SponsorButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={className || "btn-brass px-8 py-3 text-sm"}
      >
        {children || "Become a Sponsor"}
      </button>
      <SponsorForm isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
