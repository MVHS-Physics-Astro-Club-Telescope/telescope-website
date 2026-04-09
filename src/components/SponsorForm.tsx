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
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg rounded-2xl bg-[#0a0f1a] border border-white/10 shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Sponsor Inquiry
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              We&apos;d love to hear from you
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
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
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <div>
            <label
              htmlFor="sponsor-name"
              className="block text-sm font-medium text-slate-300 mb-1.5"
            >
              Name <span className="text-red-400">*</span>
            </label>
            <input
              id="sponsor-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="sponsor-email"
              className="block text-sm font-medium text-slate-300 mb-1.5"
            >
              Email <span className="text-red-400">*</span>
            </label>
            <input
              id="sponsor-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="sponsor-org"
              className="block text-sm font-medium text-slate-300 mb-1.5"
            >
              Organization{" "}
              <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <input
              id="sponsor-org"
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Company or organization"
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="sponsor-message"
              className="block text-sm font-medium text-slate-300 mb-1.5"
            >
              Message
            </label>
            <textarea
              id="sponsor-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-colors resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-300 border border-white/10 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg hover:from-blue-500 hover:to-violet-500 transition-all duration-200 shadow-lg shadow-blue-500/20"
            >
              Open in Email
            </button>
          </div>

          <p className="text-xs text-slate-500 text-center pt-1">
            This will open your default email client with the message pre-filled.
          </p>
        </form>
      </div>
    </div>
  );
}
