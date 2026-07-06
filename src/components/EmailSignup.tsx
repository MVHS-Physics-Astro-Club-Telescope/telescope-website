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
 * - Atlas plate visuals: engraved panel, brass CTA, ha/oiii semantics.
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
        "card-atlas tick-corners relative overflow-hidden",
        compact ? "p-6" : "p-8",
      )}
    >
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="mb-2 font-display text-2xl text-starlight">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm leading-relaxed text-chart-bright/65">
              {description}
            </p>
          )}
        </div>
      )}

      {done ? (
        <div
          id={liveMsgId}
          role="status"
          className="flex items-start gap-3 rounded-sm border border-oiii/35 bg-oiii/5 px-4 py-3"
        >
          <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-sm bg-oiii/20 text-oiii">
            <Check className="h-3.5 w-3.5" />
          </span>
          <div className="text-sm leading-relaxed text-starlight/85">
            <strong className="text-oiii">You&apos;re on the list.</strong>{" "}
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
          <div className="flex flex-col gap-3 sm:flex-row">
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
                "h-12 flex-1 rounded-sm border bg-deep px-4 text-[15px] text-starlight/95 placeholder:text-chart-bright/35 outline-none transition-colors",
                "border-chart/15 focus-visible:border-brass/50 focus-visible:ring-2 focus-visible:ring-brass/25",
                errors.email &&
                  "border-halpha/50 focus-visible:border-halpha/70 focus-visible:ring-halpha/20",
              )}
            />
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="btn-brass group inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap px-7 text-sm"
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
              className="pl-1 text-xs text-halpha"
            >
              {errors.email.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
