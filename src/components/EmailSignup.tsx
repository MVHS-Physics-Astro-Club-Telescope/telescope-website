"use client";

import { FormEvent, useState } from "react";

type Source = "observe" | "request" | "home";
type Status = "idle" | "submitting" | "success" | "error";

interface EmailSignupProps {
  source: Source;
  /** Heading shown above the form */
  title?: string;
  /** Supporting copy under the heading */
  description?: string;
  /** Submit button label */
  cta?: string;
  /** Compact variant for embedding in cards */
  compact?: boolean;
}

/**
 * Email capture form. POSTs to /api/interest with { email, source }.
 * Handles client-side validation, submitting state, success and error.
 * Visually matches the site's titanium/dark surface treatment.
 */
export default function EmailSignup({
  source,
  title = "Notify me when it's live",
  description = "We'll send you one email — the night the telescope captures first light.",
  cta = "Notify me",
  compact = false,
}: EmailSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValid || status === "submitting") return;
    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
      };
      if (res.ok && data.success) {
        setStatus("success");
        setMessage(data.message || "You're on the list. Clear skies.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(
          data.message ||
            (res.status === 429
              ? "Slow down for a sec — try again in a minute."
              : "Something went wrong. Try again in a moment."),
        );
      }
    } catch {
      setStatus("error");
      setMessage("Couldn't reach the server. Check your connection and retry.");
    }
  }

  return (
    <div
      className={`rounded-2xl bg-[#0D1219] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${
        compact ? "p-6" : "p-8"
      }`}
    >
      {(title || description) && (
        <div className="mb-5">
          {title && (
            <h3 className="font-heading text-xl font-semibold text-[rgba(240,240,250,0.95)] mb-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-[rgba(240,240,250,0.6)] leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col sm:flex-row gap-3"
      >
        <label htmlFor={`email-${source}`} className="sr-only">
          Email address
        </label>
        <input
          id={`email-${source}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "submitting"}
          aria-invalid={status === "error" ? true : undefined}
          aria-describedby={message ? `email-${source}-msg` : undefined}
          className="flex-1 px-4 py-3 rounded-full bg-[#121A25] border border-white/[0.08] text-[rgba(240,240,250,0.95)] placeholder:text-[rgba(240,240,250,0.35)] text-sm focus:outline-none focus:border-[#0A84FF]/50 focus:ring-2 focus:ring-[#0A84FF]/20 transition-colors"
        />
        <button
          type="submit"
          disabled={!isValid || status === "submitting"}
          className="btn-titanium-light px-7 py-3 text-sm font-medium rounded-full whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Sending…" : cta}
        </button>
      </form>

      {message && (
        <p
          id={`email-${source}-msg`}
          role={status === "error" ? "alert" : "status"}
          className={`mt-4 text-sm ${
            status === "success"
              ? "text-[#30D158]"
              : status === "error"
                ? "text-[#FF453A]"
                : "text-[rgba(240,240,250,0.6)]"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
