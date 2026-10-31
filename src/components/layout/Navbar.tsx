"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { brand } from "@/config/brand";
import { contact } from "@/config/contact";
import { booking, nav } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { useBooking } from "@/components/providers/BookingProvider";
import { useWashSelection } from "@/components/providers/WashSelectionProvider";
import { useActiveSection, useScrolled } from "./hooks";

export function Navbar() {
  const scrolled = useScrolled(80);
  const active = useActiveSection();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openBooking } = useBooking();
  const { vehicle, pricingMode } = useWashSelection();
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const homeHref = (hash: string) => (pathname === "/" ? hash : `/${hash}`);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - last;
        setHidden(y > 160 && delta > 6);
        if (delta < -6 || y < 160) setHidden(false);
        last = y;
        frame = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      inert={hidden && !menuOpen}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-luxe",
        scrolled
          ? "border-b border-hairline-dark bg-obsidian/[0.92]"
          : "border-b border-transparent bg-transparent",
        hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div className="container-x grid h-[72px] grid-cols-[1fr_auto] items-center lg:h-[88px] lg:grid-cols-[1fr_auto_1fr]">
        <a
          href={homeHref("#top")}
          className="justify-self-start font-sans text-[15px] font-medium leading-none tracking-[0.3em] text-bone"
          aria-label={`${brand.name} home`}
        >
          {brand.wordmark}
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
          {nav.links.map((link) => (
            <a
              key={link.id}
              href={homeHref(link.href)}
              data-active={active === link.id}
              data-bare="true"
              className={cn(
                "link-rule label py-2 transition-colors duration-ui ease-luxe",
                active === link.id ? "text-bone" : "text-stone hover:text-bone",
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden justify-self-end lg:block">
          <Button
            size="nav"
            withArrow={false}
            onClick={() =>
              openBooking({ vehicle, service: "complete", pricingMode })
            }
          >
            {nav.cta}
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex h-11 w-11 items-center justify-center justify-self-end text-bone lg:hidden"
          aria-label="Open menu"
        >
          <MenuIcon size={22} />
        </button>
      </div>

      <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <AnimatePresence>
          {menuOpen ? (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  className="menu-overlay fixed inset-0 z-[70] bg-obsidian"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild forceMount>
                <motion.div
                  className="menu-content grain fixed inset-0 z-[80] flex flex-col bg-obsidian text-bone"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0.2 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="container-x flex h-[72px] shrink-0 items-center justify-between">
                    <span className="font-sans text-[15px] font-medium tracking-[0.3em]">
                      {brand.wordmark}
                    </span>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="-mr-3 flex h-11 w-11 items-center justify-center text-bone"
                        aria-label="Close menu"
                      >
                        <CloseIcon size={20} />
                      </button>
                    </Dialog.Close>
                  </div>

                  <Dialog.Title className="sr-only">Menu</Dialog.Title>
                  <Dialog.Description className="sr-only">
                    Site navigation and booking
                  </Dialog.Description>

                  <nav
                    aria-label="Mobile"
                    className="container-x flex flex-1 flex-col justify-center py-8"
                  >
                    <motion.ul
                      initial="hidden"
                      animate="open"
                      variants={{
                        open: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
                      }}
                      className="border-t border-hairline-dark"
                    >
                      {nav.links.map((link) => (
                        <motion.li
                          key={link.id}
                          variants={{
                            hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 22 },
                            open: { opacity: 1, y: 0 },
                          }}
                          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                          className="border-b border-hairline-dark"
                        >
                          <a
                            href={homeHref(link.href)}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-baseline justify-between py-5"
                          >
                            <span className="font-display text-[clamp(40px,11vw,64px)] leading-none tracking-[-0.02em]">
                              {link.label}
                            </span>
                            {link.number ? (
                              <span className="label text-stone" aria-hidden="true">
                                {link.number}
                              </span>
                            ) : (
                              <span
                                aria-hidden="true"
                                className="h-1.5 w-1.5 self-center bg-brass"
                              />
                            )}
                          </a>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </nav>

                  <div className="container-x shrink-0 border-t border-hairline-dark py-6">
                    <Button
                      className="w-full"
                      onClick={() => {
                        setMenuOpen(false);
                        openBooking({
                          vehicle,
                          service: "complete",
                          pricingMode,
                        });
                      }}
                    >
                      {booking.title}
                    </Button>
                    <div className="mt-5 flex flex-wrap justify-between gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-stone">
                      <a href={`tel:${contact.phoneHref}`} className="hover:text-bone">
                        {contact.phone}
                      </a>
                      <a href={`mailto:${contact.email}`} className="hover:text-bone">
                        {contact.email}
                      </a>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          ) : null}
        </AnimatePresence>
      </Dialog.Root>
    </header>
  );
}
