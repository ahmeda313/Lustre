"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { brand } from "@/config/brand";
import { images } from "@/config/images";
import { MaskedHeading } from "@/components/ui/MaskedHeading";
import { Button } from "@/components/ui/Button";
import { useBooking } from "@/components/providers/BookingProvider";
import { useWashSelection } from "@/components/providers/WashSelectionProvider";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { openBooking } = useBooking();
  const { vehicle, pricingMode } = useWashSelection();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40]);

  return (
    <section
      id="top"
      ref={ref}
      className="grain relative min-h-[100svh] overflow-hidden bg-obsidian"
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: reduce ? 0.001 : 2.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={images.hero.src}
            alt={images.hero.alt}
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={images.hero.blurDataURL}
            quality={82}
            className="photo-grade object-cover object-[54%_52%] max-md:object-[62%_52%]"
          />
        </motion.div>
      </motion.div>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,11,0.72)_0%,rgba(10,10,11,0.18)_24%,rgba(10,10,11,0.06)_52%,rgba(10,10,11,0.88)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,11,0.48)_0%,rgba(10,10,11,0)_58%)]"
      />

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-between">
        <div className="container-x pt-[calc(var(--nav-height)+28px)]">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.001 : 0.8, delay: reduce ? 0 : 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="label text-stone"
          >
            Car wash / exterior and interior
          </motion.p>
        </div>

        <div className="container-x pb-8 pt-24 sm:pb-10 lg:pb-12">
          <MaskedHeading
            as="h1"
            animateOnMount
            delay={0.25}
            lines={[
              "Exterior. Interior.",
              <span key="right">
                Done <em className="italic">right.</em>
              </span>,
            ]}
            className="text-hero text-bone"
          />

          <div className="mt-9 flex flex-col gap-9 lg:mt-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div className="max-w-[680px]">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0.001 : 0.8, delay: reduce ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-[52ch] text-body text-bone/80"
              >
                {brand.shortDescription}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0.001 : 0.8, delay: reduce ? 0 : 0.84, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Button
                  onClick={() =>
                    openBooking({ vehicle, service: "complete", pricingMode })
                  }
                >
                  Book a wash
                </Button>
                <Button variant="secondary" href="#membership">
                  Become a member
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
              className="hidden shrink-0 flex-col items-center gap-4 pb-1 lg:flex"
              aria-hidden="true"
            >
              <span className="label text-stone">Scroll</span>
              <motion.span
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: reduce ? 0.001 : 1.4, delay: reduce ? 0 : 1.15, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "top" }}
                className="h-16 w-px bg-bone/35"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
