import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for is not here.",
};

export default function NotFound() {
  return (
    <section className="grain flex min-h-[100svh] items-center bg-obsidian py-32">
      <div className="container-x">
        <Eyebrow number="404" label="Not found" />
        <div className="mt-10 grid grid-cols-1 gap-10 border-t border-hairline-dark pt-10 lg:grid-cols-12 lg:gap-6">
          <h1 className="text-h2 text-bone lg:col-span-8">
            This page has
            <br />
            <em className="italic">washed away.</em>
          </h1>
          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="max-w-[34ch] text-body text-stone">
              The address may be old, or the link may be incomplete. The work is
              still where you left it.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/">Back to the start</Button>
              <Button variant="secondary" href="/#pricing">
                See prices
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
