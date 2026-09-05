"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

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
}

/**
 * One email, the night the telescope wakes up. POSTs to /api/interest.
 */
export default function EmailSignup({
  source,
  title = "Notify me at first light",
  description = "One email, the night the telescope captures first light. Nothing else.",
  cta = "Notify me",
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
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (res.ok && data.success) {
        toast.success(data.message || "You're on the list. Clear skies.", { id: t });
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
      toast.error("Couldn't reach the server. Check your connection and retry.", { id: t });
    }
  }

  const inputId = `email-${source}`;
  const errorId = `email-${source}-error`;
  const liveMsgId = `email-${source}-msg`;

  return (
    <div>
      <h2 className="font-display text-[clamp(1.6rem,3.2vw,2.4rem)] text-ink">{title}</h2>
      <p className="prose-tight mt-3">{description}</p>

      {done ? (
        <p id={liveMsgId} role="status" className="mt-6 text-[0.9375rem] text-ok">
          You&apos;re on the list. Clear skies.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 max-w-md">
          <label htmlFor={inputId} className="sr-only">
            Email address
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id={inputId}
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? errorId : undefined}
              disabled={isSubmitting}
              {...register("email")}
              className="field"
            />
            <button type="submit" disabled={!isValid || isSubmitting} className="btn btn-solid shrink-0">
              {isSubmitting ? "Sending…" : cta}
            </button>
          </div>
          {errors.email && (
            <p id={errorId} role="alert" className="mt-2 text-[0.8125rem] text-bad">
              {errors.email.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
