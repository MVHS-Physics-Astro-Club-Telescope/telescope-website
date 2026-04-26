"use client";

import { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FAQItem {
  question: string;
  answer: ReactNode;
}

interface FAQProps {
  items: FAQItem[];
  /** Stable id prefix so multiple FAQs on a page don't collide */
  idPrefix?: string;
}

/**
 * FAQ section built on shadcn Accordion (base-ui under the hood).
 * - Multiple items may be open at once.
 * - Smooth height-based open/close (data-state animations).
 * - The buttons retain their <button> role and accessible name so the
 *   existing Playwright accessibility tests keep passing.
 */
export default function FAQ({ items, idPrefix = "faq" }: FAQProps) {
  return (
    <Accordion
      data-slot="accordion"
      // multiple = users can leave several panels open at once.
      multiple
      className="rounded-2xl bg-[#0D1219] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] divide-y divide-white/[0.06]"
    >
      {items.map((item, i) => {
        const id = `${idPrefix}-${i}`;
        return (
          <AccordionItem
            key={id}
            value={id}
            className="px-6 [&_[data-slot=accordion-trigger]]:py-5 [&_[data-slot=accordion-trigger]]:focus-visible:rounded-lg"
          >
            <AccordionTrigger
              id={`${idPrefix}-q-${i}`}
              className="font-heading text-base font-medium text-[rgba(240,240,250,0.95)] hover:no-underline data-[panel-open]:text-white"
            >
              {item.question}
            </AccordionTrigger>
            <AccordionContent
              id={`${idPrefix}-a-${i}`}
              className="text-sm text-[rgba(240,240,250,0.7)] leading-relaxed pr-6"
            >
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
