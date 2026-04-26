"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Source = "observe" | "request" | "home";

const schema = z.object({
  email: z
    .string()
    .min(1, "Drop your email so we can let you know.")
    .email("That doesn't look like a valid email."),
});
type FormValues = z.infer<typeof schema>;

interface EmailSignupProps {
  source: Source;
  title?: string;
  description?: string;
  cta?: string;
  compact?: boolean;
}

/**
 * Email capture form. POSTs to /api/interest with { email, source }.
 * - React-hook-form + Zod for typed inline validation.
 * - Sonner toast on success/error (loading state on button).
 * - Pulls in the site's titanium button identity for visual consistency.
 */
export default function EmailSignup({
  source,
  title = "Notify me when it's live",
  description = "We'll send you one email — the night the telescope captures first light.",
  cta = "Notify me",
  compact = false,
}: EmailSignupProps) {
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  async function onSubmit(values: FormValues) {
    const t = toast.loading("Adding you to the list…");
    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email.trim(), source }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
      };

      if (res.ok && data.success) {
        toast.success(data.message || "You're on the list. Clear skies.", {
          id: t,
        });
        setDone(true);
        reset();
      } else {
        const msg =
          data.message ||
          (res.status === 429
            ? "Slow down for a sec — try again in a minute."
            : "Something went wrong. Try again in a moment.");
        toast.error(msg, { id: t });
      }
    } catch {
      toast.error("Couldn't reach the server. Check your connection and retry.", {
        id: t,
      });
    }
  }

  const inputId = `email-${source}`;
  const errorId = `email-${source}-error`;
  const liveMsgId = `email-${source}-msg`;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-[#0D1219] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors",
        compact ? "p-6" : "p-8",
      )}
    >
      {/* Soft top edge highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

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

      {done ? (
        <div
          id={liveMsgId}
          role="status"
          className="flex items-start gap-3 rounded-xl border border-[#30D158]/30 bg-[#30D158]/5 px-4 py-3"
        >
          <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#30D158]/20 text-[#30D158]">
            <Check className="h-3.5 w-3.5" />
          </span>
          <div className="text-sm text-[rgba(240,240,250,0.85)] leading-relaxed">
            <strong className="text-[#30D158]">You&apos;re on the list.</strong>{" "}
            Clear skies — we&apos;ll be in touch.
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-3"
        >
          <Label htmlFor={inputId} className="sr-only">
            Email address
          </Label>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              id={inputId}
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? errorId : undefined}
              disabled={isSubmitting}
              {...register("email")}
              className={cn(
                "flex-1 h-12 px-4 rounded-full bg-[#121A25] border text-[15px] text-[rgba(240,240,250,0.95)] placeholder:text-[rgba(240,240,250,0.35)] outline-none transition-colors",
                "border-white/[0.08] focus-visible:border-[#0A84FF]/50 focus-visible:ring-2 focus-visible:ring-[#0A84FF]/20",
                errors.email && "border-[#FF453A]/50 focus-visible:border-[#FF453A]/70 focus-visible:ring-[#FF453A]/20",
              )}
            />
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="btn-titanium-light group inline-flex items-center justify-center gap-2 px-7 h-12 text-sm font-medium rounded-full whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Sending…</span>
                </>
              ) : (
                <>
                  <span>{cta}</span>
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </>
              )}
            </button>
          </div>

          {errors.email && (
            <p
              id={errorId}
              role="alert"
              className="text-xs text-[#FF6B61] pl-2"
            >
              {errors.email.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
