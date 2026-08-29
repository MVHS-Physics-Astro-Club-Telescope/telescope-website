"use client";

import { useState, useEffect, useRef } from "react";

interface SponsorFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const inputClasses =
  "w-full rounded-[3px] border border-chart/20 bg-deep px-4 py-3 text-sm text-starlight placeholder:text-chart-bright/35 transition-colors focus:border-brass/60 focus:outline-none focus:ring-1 focus:ring-brass/40";

const labelClasses =
  "mb-1.5 block font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-chart-bright/70";

export default function SponsorForm({ isOpen, onClose }: SponsorFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState(
    "Hi,\n\nI'm interested in sponsoring the MV Physics & Astronomy Club telescope project. I'd love to learn more about how I can support your team.\n\nLooking forward to hearing from you!"
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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-void/80 p-4 backdrop-blur-sm"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sponsor-form-title"
        className="card-atlas tick-corners tick-corners-brass max-h-[90vh] w-full max-w-lg overflow-y-auto p-8 shadow-2xl shadow-black/60"
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="eyebrow !text-[0.625rem]">Sponsor inquiry</p>
            <h2
              id="sponsor-form-title"
              className="mt-2 font-display text-2xl text-starlight"
            >
              Get in touch
            </h2>
            <p className="mt-1 text-sm text-chart-bright/65">
              We&apos;d love to hear from you
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-[3px] p-2 text-chart-bright/50 transition-colors hover:text-starlight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-bright/90"
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
            <label htmlFor="sponsor-name" className={labelClasses}>
              Name <span className="text-brass">*</span>
            </label>
            <input
              id="sponsor-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="sponsor-email" className={labelClasses}>
              Email <span className="text-brass">*</span>
            </label>
            <input
              id="sponsor-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="sponsor-org" className={labelClasses}>
              Organization{" "}
              <span className="normal-case tracking-normal text-chart-bright/45">
                (optional)
              </span>
            </label>
            <input
              id="sponsor-org"
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Company or organization"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="sponsor-message" className={labelClasses}>
              Message
            </label>
            <textarea
              id="sponsor-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${inputClasses} resize-none`}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-line flex-1 px-4 py-3 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-brass flex-1 px-4 py-3 text-sm"
            >
              Open in email
            </button>
          </div>

          <p className="pt-1 text-center text-xs text-chart-bright/50">
            This will open your default email client with the message
            pre-filled.
          </p>
        </form>
      </div>
    </div>
  );
}
