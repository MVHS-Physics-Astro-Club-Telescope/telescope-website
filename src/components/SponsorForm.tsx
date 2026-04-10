"use client";

import { useState, useEffect, useRef } from "react";

interface SponsorFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SponsorForm({ isOpen, onClose }: SponsorFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState(
    "Hi,\n\nI'm interested in sponsoring the MVHS Physics & Astronomy Club telescope project. I'd love to learn more about how I can support your team.\n\nLooking forward to hearing from you!"
  );
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const subject = encodeURIComponent("Telescope Sponsorship Inquiry");
    const bodyParts = [];
    if (name) bodyParts.push(`From: ${name}`);
    if (email) bodyParts.push(`Email: ${email}`);
    if (organization) bodyParts.push(`Organization: ${organization}`);
    bodyParts.push("");
    bodyParts.push(message);

    const body = encodeURIComponent(bodyParts.join("\n"));
    window.open(
      `mailto:mvhsphysicsastroclub@gmail.com?subject=${subject}&body=${body}`,
      "_self"
    );
    onClose();
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
    >
      <div className="w-full max-w-lg rounded-2xl bg-[#0D1219] border border-white/[0.08] shadow-2xl shadow-black/50 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading text-xl font-semibold text-[rgba(240,240,250,1)]">
              Sponsor Inquiry
            </h2>
            <p className="text-sm text-[rgba(240,240,250,0.6)] mt-1">
              We&apos;d love to hear from you
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[rgba(240,240,250,0.4)] hover:text-[rgba(240,240,250,0.8)] transition-colors"
            aria-label="Close"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="sponsor-name"
              className="block text-sm font-medium text-[rgba(240,240,250,0.7)] mb-1.5"
            >
              Name <span className="text-[rgba(240,240,250,0.4)]">*</span>
            </label>
            <input
              id="sponsor-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-[#121A25] border border-white/[0.08] rounded-xl px-4 py-3 text-[rgba(240,240,250,1)] placeholder:text-[rgba(240,240,250,0.3)] text-sm focus:border-white/[0.2] focus:outline-none focus:ring-1 focus:ring-white/[0.06] transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="sponsor-email"
              className="block text-sm font-medium text-[rgba(240,240,250,0.7)] mb-1.5"
            >
              Email <span className="text-[rgba(240,240,250,0.4)]">*</span>
            </label>
            <input
              id="sponsor-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[#121A25] border border-white/[0.08] rounded-xl px-4 py-3 text-[rgba(240,240,250,1)] placeholder:text-[rgba(240,240,250,0.3)] text-sm focus:border-white/[0.2] focus:outline-none focus:ring-1 focus:ring-white/[0.06] transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="sponsor-org"
              className="block text-sm font-medium text-[rgba(240,240,250,0.7)] mb-1.5"
            >
              Organization{" "}
              <span className="text-[rgba(240,240,250,0.4)] font-normal">(optional)</span>
            </label>
            <input
              id="sponsor-org"
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Company or organization"
              className="w-full bg-[#121A25] border border-white/[0.08] rounded-xl px-4 py-3 text-[rgba(240,240,250,1)] placeholder:text-[rgba(240,240,250,0.3)] text-sm focus:border-white/[0.2] focus:outline-none focus:ring-1 focus:ring-white/[0.06] transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="sponsor-message"
              className="block text-sm font-medium text-[rgba(240,240,250,0.7)] mb-1.5"
            >
              Message
            </label>
            <textarea
              id="sponsor-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#121A25] border border-white/[0.08] rounded-xl px-4 py-3 text-[rgba(240,240,250,1)] placeholder:text-[rgba(240,240,250,0.3)] text-sm focus:border-white/[0.2] focus:outline-none focus:ring-1 focus:ring-white/[0.06] transition-colors resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            {/* Cancel — dark titanium */}
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'linear-gradient(180deg, #A3A29C 0%, #878684 40%, #6b6b6b 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.15)',
                textShadow: '0 1px 2px rgba(0,0,0,0.4)',
              }}
              className="flex-1 px-4 py-3 text-sm font-medium text-[rgba(240,240,250,0.9)] rounded-full hover:brightness-110 transition-all"
            >
              Cancel
            </button>
            {/* Submit — light titanium */}
            <button
              type="submit"
              style={{
                background: 'linear-gradient(180deg, #e8e8ed 0%, #d1d1d6 50%, #BAB9B3 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
              className="flex-1 px-4 py-3 text-sm font-medium text-[#1a1a1f] rounded-full hover:brightness-105 transition-all"
            >
              Open in Email
            </button>
          </div>

          <p className="text-xs text-[rgba(240,240,250,0.4)] text-center pt-1">
            This will open your default email client with the message pre-filled.
          </p>
        </form>
      </div>
    </div>
  );
}
