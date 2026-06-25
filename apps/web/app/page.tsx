import { AuthorIntro } from "@/components/home/author-intro";
import { ExamplesBento } from "@/components/home/examples-bento";
import { FinalCta } from "@/components/home/final-cta";
import { Hero } from "@/components/home/hero";
import { PartsOverview } from "@/components/home/parts-overview";
import { WhyVite } from "@/components/home/why-vite";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyVite />
      <PartsOverview />
      <ExamplesBento />
      <AuthorIntro />
      <FinalCta />
    </>
  );
}
