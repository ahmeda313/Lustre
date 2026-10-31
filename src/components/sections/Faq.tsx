"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { faq } from "@/config/faq";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PlusIcon } from "@/components/ui/icons";

export function Faq() {
  return (
    <section id="faq" className="grain section-pad bg-obsidian">
      <div className="container-x">
        <SectionHeader
          number={faq.eyebrowNumber}
          label={faq.eyebrowLabel}
          lines={[
            "Questions,",
            <em key="italic" className="italic">
              {faq.headingItalic}
            </em>,
          ]}
          intro="The practical details, before you book."
        />

        <Accordion.Root
          type="single"
          collapsible
          className="mt-14 border-t border-hairline-dark lg:mt-20"
        >
          {faq.items.map((item) => (
            <Accordion.Item
              key={item.id}
              value={item.id}
              className="border-b border-hairline-dark"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-start justify-between gap-8 py-6 text-left md:py-7">
                  <span className="max-w-[30ch] font-display text-[clamp(24px,2.4vw,28px)] leading-[1.15] tracking-[-0.01em] text-bone transition-colors duration-ui ease-luxe group-hover:text-stone md:max-w-[46ch]">
                    {item.question}
                  </span>
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center text-stone">
                    <PlusIcon
                      size={18}
                      className="transition-transform duration-500 ease-luxe group-data-[state=open]:rotate-45"
                    />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="accordion-content">
                <div className="max-w-[62ch] pb-8 pr-10 text-body text-stone md:pb-9">
                  {item.answer}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
