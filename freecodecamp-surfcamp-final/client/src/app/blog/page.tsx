import { getPageBySlug } from "@/data/loaders";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/BlockRenderer";
import { ContentList } from "@/components/ContentList";
import { BlogCard } from "@/components/BlogCard";

async function loader(slug: string) {
  const response = await getPageBySlug(slug);
  const pages = (response?.data as any)?.pages;
  if (!pages || pages.length === 0) notFound();
  return { blocks: pages[0]?.blocks ?? [] };
}

interface PageProps {
  searchParams: Promise<{ page?: string; query?: string }>;
}

export default async function BlogRoute({ searchParams }: PageProps) {
  const { page, query } = await searchParams;
  const { blocks } = await loader("blog");
  return (
    <div className="blog-page">
      <BlockRenderer blocks={blocks} />
      <ContentList
        headline="Check out our latest articles"
        path="articles"
        component={BlogCard}
        showSearch
        query={query}
        showPagination
        page={page}
      />
    </div>
  );
}