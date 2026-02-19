import { getPageBySlug } from "@/data/loaders";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/BlockRenderer";

async function loader(slug: string) {
  const response = await getPageBySlug(slug);
  const pages = response?.data?.pages;
  if (!pages || pages.length === 0) notFound();
  return { blocks: pages[0]?.blocks };
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function DynamicPageRoute({ params }: PageProps) {
  const slug = (await params).slug;
  const { blocks } = await loader(slug);
  return <BlockRenderer blocks={blocks} />;
}