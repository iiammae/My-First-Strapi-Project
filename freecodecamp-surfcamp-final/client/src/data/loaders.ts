import { gql } from "graphql-request";
import { gqlClient } from "@/utils/fetch-api";

const BLOG_PAGE_SIZE = 3;

// ─── Helper: normalize aliased image fields back to "image" ──────────────────

function normalizeBlocks(blocks: any[]): any[] {
  return blocks.map((block: any) => {
    switch (block.__typename) {
      case "ComponentBlocksHeroSection":
        return {
          ...block,
          image: block.heroImage,
          logo: block.logo
            ? { ...block.logo, image: block.logo.logoImage }
            : undefined,
        };
      case "ComponentBlocksInfoBlock":
        return { ...block, image: block.infoImage };
      case "ComponentBlocksFeaturedArticle":
        return { ...block, image: block.featuredImage };
      case "ComponentBlocksParagraphWithImage":
        return { ...block, image: block.paragraphImage };
      case "ComponentBlocksFullImage":
        return { ...block, image: block.fullImage };
      default:
        return block;
    }
  });
}

// ─── Home Page ────────────────────────────────────────────────────────────────

export async function getHomePage() {
  const query = gql`
    query GetHomePage {
      homePage {
        documentId
        title
        description
        blocks {
          __typename
          ... on ComponentBlocksHeroSection {
            heading
            theme
            cta {
              id
              text
              href
            }
            heroImage: image {
              url
              alternativeText
            }
            backgroundVideo {
              url
              mime
            }
            logo {
              logoImage: image {
                url
                alternativeText
              }
            }
          }
          ... on ComponentBlocksInfoBlock {
            headline
            content
            cta {
              id
              text
              href
            }
            infoImage: image {
              url
              alternativeText
            }
          }
        }
      }
    }
  `;

  try {
    const data = await gqlClient.request(query);
    const homePage = (data as any).homePage;
    if (homePage?.blocks) {
      homePage.blocks = normalizeBlocks(homePage.blocks);
    }
    return { data: { homePage } };
  } catch (error) {
    console.error("getHomePage Error:", error);
  }
}

// ─── Page By Slug ─────────────────────────────────────────────────────────────

export async function getPageBySlug(slug: string) {
  const query = gql`
    query GetPageBySlug($slug: String!) {
      pages(filters: { slug: { eq: $slug } }) {
        documentId
        title
        slug
        blocks {
          __typename
          ... on ComponentBlocksHeroSection {
            heading
            theme
            cta {
              id
              text
              href
            }
            heroImage: image {
              url
              alternativeText
            }
            backgroundVideo {
              url
              mime
            }
            logo {
              logoImage: image {
                url
                alternativeText
              }
            }
          }
          ... on ComponentBlocksInfoBlock {
            headline
            content
            cta {
              id
              text
              href
            }
            infoImage: image {
              url
              alternativeText
            }
          }
          ... on ComponentBlocksFeaturedArticle {
            headline
            excerpt
            link {
              id
              text
              href
              isExternal
            }
            featuredImage: image {
              url
              alternativeText
            }
          }
          ... on ComponentBlocksSubscribe {
            headline
            content
            placeholder
            buttonText
          }
        }
      }
    }
  `;

  try {
    const data = await gqlClient.request(query, { slug });
    const pages = (data as any).pages;
    if (pages) {
      pages.forEach((page: any) => {
        if (page.blocks) {
          page.blocks = normalizeBlocks(page.blocks);
        }
      });
    }
    return { data: { pages } };
  } catch (error) {
    console.error("getPageBySlug Error:", error);
  }
}

// ─── Global Settings ──────────────────────────────────────────────────────────

export async function getGlobalSettings() {
  const query = gql`
    query GetGlobalSettings {
      global {
        header {
          logo {
            image {
              url
              alternativeText
            }
          }
          navigation {
            id
            text
            href
          }
          cta {
            id
            text
            href
          }
        }
        footer {
          logo {
            image {
              url
              alternativeText
            }
          }
          navigation {
            id
            text
            href
          }
          policies {
            id
            text
            href
          }
        }
      }
    }
  `;

  try {
    const data = await gqlClient.request(query);
    return { data: { global: (data as any).global } };
  } catch (error) {
    console.error("getGlobalSettings Error:", error);
  }
}

// ─── Get Content (Blog / Events list) ────────────────────────────────────────

export async function getContent(
  contentType: "articles" | "events",
  featured?: boolean,
  query?: string,
  page?: string
) {
  const currentPage = parseInt(page || "1");
  const connectionType = `${contentType}_connection`;

  const gqlQuery = featured
    ? gql`
        query GetContentFeatured(
          $query: String
          $featured: Boolean
          $page: Int
          $pageSize: Int
        ) {
          ${connectionType}(
            sort: "createdAt:desc"
            filters: {
              or: [
                { title: { containsi: $query } }
                { description: { containsi: $query } }
              ]
              featured: { eq: $featured }
            }
            pagination: { page: $page, pageSize: $pageSize }
          ) {
            nodes {
              documentId
              title
              slug
              description
              featured
              image {
                url
                alternativeText
              }
            }
            pageInfo {
              pageCount
            }
          }
        }
      `
    : gql`
        query GetContent(
          $query: String
          $page: Int
          $pageSize: Int
        ) {
          ${connectionType}(
            sort: "createdAt:desc"
            filters: {
              or: [
                { title: { containsi: $query } }
                { description: { containsi: $query } }
              ]
            }
            pagination: { page: $page, pageSize: $pageSize }
          ) {
            nodes {
              documentId
              title
              slug
              description
              featured
              image {
                url
                alternativeText
              }
            }
            pageInfo {
              pageCount
            }
          }
        }
      `;

  // Cast to any to avoid TypeScript union type conflict between the two variable shapes
  const variables: any = featured
    ? { query: query || "", featured, page: currentPage, pageSize: BLOG_PAGE_SIZE }
    : { query: query || "", page: currentPage, pageSize: BLOG_PAGE_SIZE };

  try {
    const result = await gqlClient.request(gqlQuery, variables);
    const connection = (result as any)[connectionType];

    return {
      data: connection?.nodes || [],
      meta: {
        pagination: {
          pageCount: connection?.pageInfo?.pageCount || 1,
        },
      },
    };
  } catch (error) {
    console.error("getContent Error:", error);
    return { data: [], meta: { pagination: { pageCount: 1 } } };
  }
}

// ─── Get Content By Slug (Blog / Events detail) ───────────────────────────────

export async function getContentBySlug(
  slug: string,
  contentType: "articles" | "events"
) {
  const query = gql`
    query GetContentBySlug($slug: String!) {
      ${contentType}(filters: { slug: { eq: $slug } }) {
        documentId
        title
        slug
        description
        image {
          url
          alternativeText
        }
        blocks {
          __typename
          ... on ComponentBlocksHeroSection {
            heading
            theme
            cta {
              id
              text
              href
            }
            heroImage: image {
              url
              alternativeText
            }
            backgroundVideo {
              url
              mime
            }
            logo {
              logoImage: image {
                url
                alternativeText
              }
            }
          }
          ... on ComponentBlocksInfoBlock {
            headline
            content
            cta {
              id
              text
              href
            }
            infoImage: image {
              url
              alternativeText
            }
          }
          ... on ComponentBlocksHeading {
            heading
          }
          ... on ComponentBlocksParagraph {
            content
          }
          ... on ComponentBlocksParagraphWithImage {
            headline
            content
            paragraphImage: image {
              url
              alternativeText
            }
          }
          ... on ComponentBlocksFullImage {
            fullImage: image {
              url
              alternativeText
            }
          }
        }
      }
    }
  `;

  try {
    const result = await gqlClient.request(query, { slug });
    const items = (result as any)[contentType];

    if (items) {
      items.forEach((item: any) => {
        if (item.blocks) {
          item.blocks = normalizeBlocks(item.blocks);
        }
      });
    }

    return { data: items };
  } catch (error) {
    console.error("getContentBySlug Error:", error);
    return { data: [] };
  }
}