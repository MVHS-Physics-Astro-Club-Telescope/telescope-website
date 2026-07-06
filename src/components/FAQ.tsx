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
      className="card-atlas divide-y divide-chart/10"
    >
      {items.map((item, i) => {
        const id = `${idPrefix}-${i}`;
        return (
          <AccordionItem
            key={id}
            value={id}
            className="px-6 [&_[data-slot=accordion-trigger]]:py-5 [&_[data-slot=accordion-trigger]]:focus-visible:rounded-sm"
          >
            <AccordionTrigger
              id={`${idPrefix}-q-${i}`}
              className="font-display text-base text-starlight/90 hover:no-underline hover:text-brass-bright data-[panel-open]:text-starlight"
            >
              {item.question}
            </AccordionTrigger>
            <AccordionContent
              id={`${idPrefix}-a-${i}`}
              className="pr-6 text-sm leading-relaxed text-chart-bright/70"
            >
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
