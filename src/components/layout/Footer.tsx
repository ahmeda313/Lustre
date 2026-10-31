import Link from "next/link";
import { brand } from "@/config/brand";
import { contact } from "@/config/contact";
import { footer } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();
  const letters = brand.wordmark.split("");

  return (
    <footer className="grain bg-obsidian text-bone">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-12 border-t border-hairline-dark pt-10 md:grid-cols-3 md:gap-8 lg:pt-12">
          <div>
            <h2 className="label text-stone">{footer.contactHeading}</h2>
            <div className="mt-5 flex flex-col gap-2">
              <a
                href={`tel:${contact.phoneHref}`}
                className="inline-flex min-h-[44px] items-center font-display text-[24px] leading-none text-bone transition-colors duration-ui ease-luxe hover:text-stone"
              >
                {contact.phone}
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex min-h-[44px] items-center font-display text-[24px] leading-none text-bone transition-colors duration-ui ease-luxe hover:text-stone"
              >
                {contact.email}
              </a>
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="link-rule mt-1 w-fit text-sm text-stone"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div>
            <h2 className="label text-stone">{footer.hoursHeading}</h2>
            <dl className="mt-5 space-y-3">
              {contact.hours.map((row) => (
                <div
                  key={row.days}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-hairline-dark pb-3"
                >
                  <dt className="text-sm text-stone">{row.days}</dt>
                  <dd className="font-mono text-[11px] uppercase tracking-[0.1em] text-bone">
                    {row.time}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-stone">
              {contact.responseNote}
            </p>
          </div>

          <div>
            <h2 className="label text-stone">{footer.areasHeading}</h2>
            <p className="mt-5 max-w-[36ch] text-body leading-relaxed text-bone">
              {contact.areas.join(", ")}.
            </p>
            <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-stone">
              {contact.areaNote}
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-hairline-dark py-5 font-mono text-[10px] uppercase tracking-[0.12em] text-stone sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {footer.copyright}
          </p>
          <div className="flex flex-wrap gap-x-6">
            <Link
              href={footer.membershipLink.href}
              className="inline-flex min-h-[44px] items-center transition-colors duration-ui ease-luxe hover:text-bone"
            >
              {footer.membershipLink.label}
            </Link>
            {footer.legal.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex min-h-[44px] items-center transition-colors duration-ui ease-luxe hover:text-bone"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[14.4vw] overflow-hidden" aria-hidden="true">
        <div className="flex translate-y-[0.015em] justify-between px-4 font-display text-[19vw] leading-[0.78] tracking-[-0.02em] text-bone/[0.06] select-none lg:px-8">
          {letters.map((letter, index) => (
            <span key={`${letter}-${index}`}>{letter}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
