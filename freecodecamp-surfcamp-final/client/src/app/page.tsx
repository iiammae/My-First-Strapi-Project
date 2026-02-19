import { BlockRenderer } from "@/components/BlockRenderer";
import { ContentList } from "@/components/ContentList";
import { BlogCard } from "@/components/BlogCard";
import { getHomePage } from "@/data/loaders";
import { notFound } from "next/navigation";

async function loader() {
  const response = await getHomePage();
  if (!response) notFound();
  const homePage = response?.data?.homePage;
  if (!homePage) notFound();
  return { blocks: homePage.blocks || [] };
}

export default async function HomeRoute() {
  const { blocks } = await loader();
  return (
    <div>
      <BlockRenderer blocks={blocks} />
      <div className="container">
        <ContentList
          headline="Featured Articles"
          path="articles"
          component={BlogCard}
          featured
        />
      </div>
    </div>
  );
}