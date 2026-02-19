February 16, 2026 Modifications:

1. Navigation Hover Effects (_header.scss)

Links lift up 2px on hover
Animated underline grows from left to right
Text color changes to orange
Logo scales up 1.05x on hover

2. Button Improvements (_button.scss)

Gradient backgrounds instead of flat colors
Ripple effect animation on click
3D lift with shadows on hover
Shimmer animation option for CTAs

3. Hero Image Carousel (HeroSection.tsx + loaders.ts)

Multiple images fade between each other every 5 seconds
Clickable dots at bottom to jump between images
Updated Strapi query to fetch image array

4. Logo Bounce Animation (_hero-section.scss + HeroSection.tsx)

Logo bounces up/down to indicate "scroll down"
Bounces while in hero section (0-70%)
Stops bouncing when leaving hero (70%+)
Restarts when scrolling back to top

5. Scroll Effects (HeroSection.tsx)

Blur: Image blurs when leaving hero (70%+)
Fade: Logo fades out when leaving hero (70%+)
All synchronized: Bounce stop, blur, and fade happen together

6. Logo Visibility Fix (_hero-section.scss)

Reduced hero height to 70rem
Logo positioned at 8rem from bottom
Dots at 2rem from bottom (below logo)
Fully visible at 100% zoom without scrolling




February 19, 2026 Modifications 

Converting Strapi REST to GraphQL
Step 1 — Install GraphQL plugin in Strapi (server)
npm install @strapi/plugin-graphql

Restart Strapi with npm run develop. This enables the GraphQL playground at http://localhost:1337/graphql.

Step 2 — Install GraphQL client in Next.js (client)
npm install graphql-request graphql

Step 3 — Update src/utils/get-strapi-url.ts
Add a GraphQL URL helper alongside the existing function:
export function getStrapiURL() {
  return process.env.STRAPI_API_URL ?? "http://localhost:1337";
}

export function getGraphQLURL() {
  return `${getStrapiURL()}/graphql`;
}


Step 4 — Update src/utils/fetch-api.ts
Keep the existing fetchAPI function and add the GraphQL client below it:
import { GraphQLClient } from "graphql-request";
import { getGraphQLURL } from "./get-strapi-url";

// ...existing fetchAPI function stays unchanged...

export const gqlClient = new GraphQLClient(getGraphQLURL(), {
  headers: {
    ...(process.env.STRAPI_API_TOKEN && {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    }),
  },
});


Step 5 — Rewrite src/data/loaders.ts
Full rewrite replacing all fetchAPI REST calls with gqlClient.request() using gql tagged template queries.
Key challenges and fixes:
Dynamic zone blocks require inline fragments since GraphQL needs explicit type selection for polymorphic fields:
blocks {
  __typename
  ... on ComponentBlocksHeroSection { heading theme }
  ... on ComponentBlocksInfoBlock { headline content }
}

Image type conflict — HeroSection's image returns [UploadFile]! (array) while other blocks return a single UploadFile. Fixed by aliasing:
... on ComponentBlocksHeroSection {
  images: image { url alternativeText }  # aliased to avoid conflict
}
... on ComponentBlocksInfoBlock {
  image { url alternativeText }
}

Pagination — switched from flat collection queries to articles_connection with nodes and pageInfo for Strapi v5 pagination:
articles_connection(pagination: { page: $page, pageSize: $pageSize }) {
  nodes { documentId title slug }
  pageInfo { pageCount }
}

Exact field names — discovered via the GraphQL playground that Strapi uses text/href (not label/url) for links, and headline (not heading) on InfoBlock.


Separate queries per function — shared fragment approach failed because different content types support different block sets. Each function (getHomePage, getPageBySlug, getContentBySlug) got its own inline fragments.


$featured variable error — when featured is not passed, the variable was declared but unused. Fixed by building two separate query strings conditionally.



Step 6 — Rewrite src/data/services.ts
Replaced REST fetch POST calls with GraphQL mutations:
import { gql } from "graphql-request";
import { gqlClient } from "../utils/fetch-api";

export async function subscribeService(email: string) {
  const mutation = gql`
    mutation CreateNewsletterSignup($email: String!) {
      createNewsletterSignup(data: { email: $email }) {
        documentId
        email
      }
    }
  `;
  try {
    return await gqlClient.request(mutation, { email });
  } catch (error: any) {
    return { error: error?.response?.errors?.[0] ?? "Unknown error" };
  }
}

Same pattern for eventsSubscribeService. actions.ts required no changes since the error handling structure stayed the same.

Step 7 — Update src/types.ts
Made id optional everywhere (id?) since GraphQL doesn't return it by default
Added __typename?: string to the Base interface for BlockRenderer to use
Added images?: ImageProps[] to HeroSectionProps for the aliased array field
Made many required fields optional since GraphQL responses may omit fields REST always returned

Step 8 — Update src/components/BlockRenderer.tsx
Added a getBlockType() helper to map GraphQL __typename values to the existing block.__component string format:
function getBlockType(block: Block): string {
  if (block.__typename) {
    const map: Record<string, string> = {
      ComponentBlocksHeroSection: "blocks.hero-section",
      ComponentBlocksInfoBlock: "blocks.info-block",
      // ...etc
    };
    return map[block.__typename] || "";
  }
  return block.__component || "";
}

Also added explicit type casts (block as HeroSectionProps) in each switch case to resolve TypeScript union type spread errors.

Step 9 — Update src/components/ContentList.tsx
Changed path type from string to a union type to match getContent's expected parameter:
type ContentType = "articles" | "events";

interface ContentListProps {
  path: ContentType;  // was: string
  // ...
}


Step 10 — Update page files
Removed /api/ prefixes and fixed data access patterns to match the new GraphQL response shape
