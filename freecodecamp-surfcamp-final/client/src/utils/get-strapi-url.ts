export function getStrapiURL() {
  return process.env.STRAPI_API_URL ?? "http://localhost:1337";
}

export function getGraphQLURL() {
  return `${getStrapiURL()}/graphql`;
}