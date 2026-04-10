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
        style={{
          background: 'linear-gradient(180deg, #e8e8ed 0%, #d1d1d6 50%, #BAB9B3 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,255,255,0.3)',
        }}
        className={className || "rounded-full px-8 py-3 font-medium text-sm text-[#1a1a1f] hover:brightness-105 transition-all"}
      >
        {children || "Become a Sponsor"}
      </button>
      <SponsorForm isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
