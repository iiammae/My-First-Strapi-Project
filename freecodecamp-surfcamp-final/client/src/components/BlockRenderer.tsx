import type { Block, HeroSectionProps, InfoBlockProps, FeaturedArticleProps, SubscribeProps, HeadingProps, ParagraphWithImageProps, ParagraphProps, FullImageProps } from "@/types";

import { HeroSection } from "@/components/blocks/HeroSection";
import { InfoBlock } from "@/components/blocks/InfoBlock";
import { FeaturedArticle } from "./blocks/FeaturedArticle";
import { Subscribe } from "./blocks/Subscribe";
import { Heading } from "@/components/blocks/Heading";
import { ParagraphWithImage } from "@/components/blocks/ParagraphWithImage";
import { Paragraph } from "@/components/blocks/Paragraph";
import { FullImage } from "@/components/blocks/FullImage";

function getBlockType(block: Block): string {
  if (block.__typename) {
    const map: Record<string, string> = {
      ComponentBlocksHeroSection: "blocks.hero-section",
      ComponentBlocksInfoBlock: "blocks.info-block",
      ComponentBlocksFeaturedArticle: "blocks.featured-article",
      ComponentBlocksSubscribe: "blocks.subscribe",
      ComponentBlocksHeading: "blocks.heading",
      ComponentBlocksParagraphWithImage: "blocks.paragraph-with-image",
      ComponentBlocksParagraph: "blocks.paragraph",
      ComponentBlocksFullImage: "blocks.full-image",
    };
    return map[block.__typename] || "";
  }
  return block.__component || "";
}

function blockRenderer(block: Block, index: number) {
  switch (getBlockType(block)) {
    case "blocks.hero-section":
      return <HeroSection {...(block as HeroSectionProps)} key={index} />;
    case "blocks.info-block":
      return <InfoBlock {...(block as InfoBlockProps)} key={index} />;
    case "blocks.featured-article":
      return <FeaturedArticle {...(block as FeaturedArticleProps)} key={index} />;
    case "blocks.subscribe":
      return <Subscribe {...(block as SubscribeProps)} key={index} />;
    case "blocks.heading":
      return <Heading {...(block as HeadingProps)} key={index} />;
    case "blocks.paragraph-with-image":
      return <ParagraphWithImage {...(block as ParagraphWithImageProps)} key={index} />;
    case "blocks.paragraph":
      return <Paragraph {...(block as ParagraphProps)} key={index} />;
    case "blocks.full-image":
      return <FullImage {...(block as FullImageProps)} key={index} />;
    default:
      return null;
  }
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return blocks.map((block, index) => blockRenderer(block, index));
}