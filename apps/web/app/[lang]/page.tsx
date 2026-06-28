import { setRequestLocale } from "next-intl/server"
import { AuthorIntro } from "@/components/home/author-intro"
import { ExamplesBento } from "@/components/home/examples-bento"
import { FinalCta } from "@/components/home/final-cta"
import { Hero } from "@/components/home/hero"
import { PartsOverview } from "@/components/home/parts-overview"
import { WhyVite } from "@/components/home/why-vite"
import type { Locale } from "@/i18n/config"

interface HomePageProps {
  params: Promise<{ lang: Locale }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params
  setRequestLocale(lang)
  return (
    <>
      <Hero locale={lang} />
      <WhyVite locale={lang} />
      <PartsOverview locale={lang} />
      <ExamplesBento locale={lang} />
      <AuthorIntro locale={lang} />
      <FinalCta locale={lang} />
    </>
  )
}
