import { GraphQLClient } from "graphql-request";
import { getGraphQLURL } from "./get-strapi-url";

type NextFetchRequestConfig = {
  revalidate?: number | false;
  tags?: string[];
};

interface FetchAPIOptions {
  method: "GET" | "POST" | "PUT" | "DELETE";
  authToken?: string;
  body?: Record<string, unknown>;
  next?: NextFetchRequestConfig;
}

export async function fetchAPI(url: string, options: FetchAPIOptions) {
  const { method, authToken, body, next } = options;

  const headers: RequestInit & { next?: NextFetchRequestConfig } = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
    ...(next && { next }),
  };

  try {
    const response = await fetch(url, headers);
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json") && response.ok) {
      return await response.json();
    } else {
      return { status: response.status, statusText: response.statusText };
    }
  } catch (error) {
    console.error(`Error ${method} data:`, error);
    throw error;
  }
}

// GraphQL client
export const gqlClient = new GraphQLClient(getGraphQLURL(), {
  headers: {
    ...(process.env.STRAPI_API_TOKEN && {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    }),
  },
});