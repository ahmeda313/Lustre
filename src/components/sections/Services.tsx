import Image from "next/image";
import { images } from "@/config/images";
import { getService, pricingCopy } from "@/config/services";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { TextLink } from "@/components/ui/TextLink";

const panels = [
  { service: getService("exterior"), image: images.exterior, label: "Exterior" },
  { service: getService("interior"), image: images.interior, label: "Interior" },
] as const;

export function Services() {
  return (
    <section id="services" className="grain section-pad bg-obsidian">
      <div className="container-x">
        <SectionHeader
          number="01"
          label="Services"
            lines={[
            "Two surfaces.",
            <span key="standard">
              One <em className="italic">standard.</em>
            </span>,
          ]}
          intro="Two washes, done by hand. no shortcuts, no add-ons."
        />

        <div className="mt-16 grid grid-cols-1 gap-16 md:mt-24 md:grid-cols-2 md:gap-10 lg:gap-14 xl:gap-20">
          {panels.map(({ service, image, label }, index) => (
            <article key={service.id} className="flex flex-col">
              <Reveal delay={index * 0.08}>
                <div className="group relative aspect-[4/5] overflow-hidden bg-graphite">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 768px) 46vw, 100vw"
                    placeholder="blur"
                    blurDataURL={image.blurDataURL}
                    quality={80}
                    className="photo-grade object-cover transition-transform duration-[900ms] ease-luxe group-hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,11,0.82)_0%,rgba(10,10,11,0.38)_12%,rgba(10,10,11,0.08)_28%,rgba(10,10,11,0)_48%,rgba(10,10,11,0.35)_100%)]"
                  />
                  <span className="label absolute left-5 top-5 text-bone">
                    {String(index + 1).padStart(2, "0")} / {label}
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.12 + index * 0.08} className="mt-6 border-t border-hairline-dark pt-6">
                <h3 className="text-[clamp(36px,3.4vw,48px)] font-display leading-[1.02] tracking-[-0.02em] text-bone">
                  {service.name}
                </h3>
                <p className="mt-4 max-w-[44ch] text-stone">{service.promise}</p>

                <ol className="mt-10" aria-label={`${service.name} process`}>
                  {service.process?.map((step, stepIndex) => (
                    <li
                      key={step}
                      className="grid grid-cols-[32px_1fr] gap-4 border-t border-hairline-dark py-4 last:border-b"
                    >
                      <span className="label pt-[3px] text-stone">
                        {String(stepIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[15px] leading-relaxed text-bone/90">{step}</span>
                    </li>
                  ))}
                </ol>

                {service.note ? (
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-stone">
                    {service.note}
                  </p>
                ) : null}
              </Reveal>
            </article>
          ))}
        </div>

        <Reveal className="mt-20 lg:mt-24">
          <div className="flex flex-col gap-5 border-y border-hairline-dark py-6 md:flex-row md:items-center md:justify-between">
            <p className="text-body text-bone">
              {pricingCopy.completeLead}{" "}
              <span className="text-stone">{pricingCopy.completeNote}</span>
            </p>
            <TextLink href="#pricing" className="shrink-0 text-bone">
              {pricingCopy.completeLink}
            </TextLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
