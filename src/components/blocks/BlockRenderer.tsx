/**
 * BlockRenderer — dispatches CMS blocks to their React components.
 *
 * Each block type maps to a styled component that uses the Roomchang
 * design system (CSS variables, Cormorant Garamond display font, Manrope body).
 */

import { CmsBlock } from "@/lib/cms";
import { TextBlock } from "./TextBlock";
import { ImageBlock } from "./ImageBlock";
import { HeroBlock } from "./HeroBlock";
import { CtaBlock } from "./CtaBlock";
import { HtmlBlock } from "./HtmlBlock";
import { CarouselBlock } from "./CarouselBlock";
import { TestimonialsBlock } from "./TestimonialsBlock";
import { PricingBlock } from "./PricingBlock";
import { TwoColumnBlock } from "./TwoColumnBlock";
import { FaqBlock } from "./FaqBlock";
import { StatsBlock } from "./StatsBlock";
import { VideoBlock } from "./VideoBlock";
import { TeamGridBlock } from "./TeamGridBlock";
import { ServicesGridBlock } from "./ServicesGridBlock";
import { IconCardGridBlock } from "./IconCardGridBlock";
import { ImageGalleryBlock } from "./ImageGalleryBlock";
import { VideoGridBlock } from "./VideoGridBlock";
import { PartnerLogoGridBlock } from "./PartnerLogoGridBlock";
import { ArticleCardGridBlock } from "./ArticleCardGridBlock";
import { ProfileMessageBlock } from "./ProfileMessageBlock";
import { TimelineBlock } from "./TimelineBlock";

export function BlockRenderer({ blocks }: { blocks: CmsBlock[] }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((block) => (
          <BlockSwitch key={block.id} block={block} />
        ))}
    </>
  );
}

function BlockSwitch({ block }: { block: CmsBlock }) {
  const d = block.blockData as Record<string, unknown>;

  switch (block.blockType) {
    case "text":
      return <TextBlock content={d.content as string} />;

    case "image":
      return <ImageBlock url={d.url as string} alt={d.alt as string} />;

    case "hero":
      return (
        <HeroBlock
          heroTitle={d.heroTitle as string}
          heroSubtitle={d.heroSubtitle as string}
          heroEyebrow={d.heroEyebrow as string}
          heroImage={d.heroImage as string}
          heroImageAlt={d.heroImageAlt as string}
          heroImagePosition={d.heroImagePosition as string}
          heroImageSize={d.heroImageSize as string}
          heroPreserveFullImage={d.heroPreserveFullImage as boolean}
          ctaText={d.ctaText as string}
          ctaUrl={d.ctaUrl as string}
        />
      );

    case "hero_slideshow":
      // The hero slideshow is managed separately — this block just signals its placement.
      // The live site has a dedicated HeroSlideshow component wired to the DB.
      // For CMS-rendered pages we show a placeholder with a note.
      return (
        <div className="flex min-h-[200px] items-center justify-center bg-[color:var(--brand-soft)] text-center px-8 py-8 sm:py-16">
          <p className="text-sm text-[color:var(--brand-deep)] font-medium">
            Hero slideshow — managed in the Hero Images section
          </p>
        </div>
      );

    case "cta":
      return (
        <CtaBlock
          buttonText={d.buttonText as string}
          buttonUrl={d.buttonUrl as string}
        />
      );

    case "html":
      return <HtmlBlock html={d.html as string} />;

    case "carousel":
      return (
        <CarouselBlock
          slides={
            d.slides as {
              image: string;
              title: string;
              subtitle: string;
              ctaText: string;
              ctaUrl: string;
            }[]
          }
        />
      );

    case "testimonials_block":
      return (
        <TestimonialsBlock
          title={d.testimonialsTitle as string}
          limit={d.testimonialsLimit as number}
        />
      );

    case "pricing_block":
      return (
        <PricingBlock
          title={d.pricingTitle as string}
          category={d.pricingCategory as string}
        />
      );

    case "two_column":
      return (
        <TwoColumnBlock
          leftContent={d.leftContent as string}
          rightContent={d.rightContent as string}
          leftImage={d.leftImage as string}
          rightImage={d.rightImage as string}
          columnLayout={d.columnLayout as "50-50" | "60-40" | "40-60"}
        />
      );

    case "faq":
      return (
        <FaqBlock
          title={d.faqTitle as string}
          items={d.faqItems as { question: string; answer: string }[]}
        />
      );

    case "stats":
      return (
        <StatsBlock
          title={d.statsTitle as string}
          items={
            d.statsItems as {
              value: string;
              label: string;
              description?: string;
            }[]
          }
        />
      );

    case "video":
      return (
        <VideoBlock
          url={d.videoUrl as string}
          title={d.videoTitle as string}
          caption={d.videoCaption as string}
          thumbnail={d.videoThumbnail as string}
        />
      );

    case "team_grid":
      return (
        <TeamGridBlock
          title={d.teamTitle as string}
          filter={d.teamFilter as string}
          limit={d.teamLimit as number}
        />
      );

    case "services_grid":
      return (
        <ServicesGridBlock
          title={d.servicesTitle as string}
          filter={d.servicesFilter as string}
          limit={d.servicesLimit as number}
        />
      );

    case "icon_card_grid":
      return (
        <IconCardGridBlock
          iconCardTitle={d.iconCardTitle as string}
          iconCardColumns={d.iconCardColumns as 2 | 3 | 4}
          iconCardItems={
            d.iconCardItems as {
              icon?: string;
              title: string;
              description: string;
              href?: string;
            }[]
          }
        />
      );

    case "image_gallery":
      return (
        <ImageGalleryBlock
          galleryTitle={d.galleryTitle as string}
          galleryColumns={d.galleryColumns as 2 | 3 | 4}
          galleryItems={
            d.galleryItems as {
              src: string;
              alt: string;
              caption?: string;
            }[]
          }
        />
      );

    case "video_grid":
      return (
        <VideoGridBlock
          videoGridTitle={d.videoGridTitle as string}
          videoGridSubtitle={d.videoGridSubtitle as string}
          videoGridColumns={d.videoGridColumns as 2 | 3}
          videoGridItems={
            d.videoGridItems as {
              url: string;
              title: string;
              description?: string;
              thumbnail?: string;
            }[]
          }
        />
      );

    case "partner_logo_grid":
      return (
        <PartnerLogoGridBlock
          partnerTitle={d.partnerTitle as string}
          partnerSubtitle={d.partnerSubtitle as string}
          partnerCategories={
            d.partnerCategories as {
              name: string;
              logos: { name: string; logo: string }[];
            }[]
          }
        />
      );

    case "article_card_grid":
      return (
        <ArticleCardGridBlock
          articleTitle={d.articleTitle as string}
          articleItems={
            d.articleItems as {
              title: string;
              description: string;
              image?: string;
              imageAlt?: string;
              href?: string;
            }[]
          }
        />
      );

    case "profile_message":
      return (
        <ProfileMessageBlock
          profileName={d.profileName as string}
          profileTitle={d.profileTitle as string}
          profileImage={d.profileImage as string}
          profileMessage={d.profileMessage as string}
        />
      );

    case "timeline":
      return (
        <TimelineBlock
          timelineTitle={d.timelineTitle as string}
          timelineItems={
            d.timelineItems as {
              year: string;
              caption: string;
              heading: string;
              body: string;
              src: string;
              alt: string;
            }[]
          }
        />
      );

    default:
      // Unknown block type — fail visibly in development, hide in production.
      if (process.env.NODE_ENV !== "production") {
        return (
          <div className="mx-auto my-4 max-w-4xl rounded-lg border border-dashed border-red-300 bg-red-50 px-6 py-4 text-sm text-red-600">
            Unknown block type: <code className="font-mono">{block.blockType}</code>
          </div>
        );
      }
      return null;
  }
}
