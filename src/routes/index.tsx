import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/winsable/Nav";
import { CornerMeta, ScrollProgress } from "@/components/winsable/Chrome";
import { Boundaries, Coverage } from "@/components/winsable/Extras";
import { IntroCurtain } from "@/components/winsable/Premium";
import { CaseForm } from "@/components/winsable/CaseForm";
import { EditorialWall } from "@/components/winsable/EditorialWall";

import {
  About,
  Faq,
  FinalCta,
  Footer,
  Hero,
  Process,
  TrustBar,
} from "@/components/winsable/Sections";

const title = "WinsAble — Social Media Case & Support Assistance";
const description =
  "Professional assistance for social media account recovery, appeals, impersonation, copyright-related complaints and platform support requests.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "WinsAble",
          description,
          serviceType: [
            "Account Recovery",
            "Disabled Account Assistance",
            "Impersonation Reports",
            "Copyright Assistance",
            "Hacked Account Assistance",
            "Platform Support",
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <IntroCurtain />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <EditorialWall />
        <Process />
        <Coverage />
        <Boundaries />
        <About />
        <Faq />
        <FinalCta />
        <CaseForm />
      </main>
      <Footer />
      <CornerMeta />
    </div>
  );
}
