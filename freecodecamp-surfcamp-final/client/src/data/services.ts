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
    console.error("Subscribe Service Error:", error);
    return { error: error?.response?.errors?.[0] ?? "Unknown error" };
  }
}

export interface EventsSubscribeProps {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  event: {
    connect: [string];
  };
}

export async function eventsSubscribeService(data: EventsSubscribeProps) {
  const mutation = gql`
    mutation CreateEventSignup(
      $firstName: String!
      $lastName: String!
      $email: String!
      $telephone: String!
      $eventId: ID!
    ) {
      createEventSignup(
        data: {
          firstName: $firstName
          lastName: $lastName
          email: $email
          telephone: $telephone
          event: $eventId
        }
      ) {
        documentId
        firstName
        lastName
        email
        telephone
      }
    }
  `;

  try {
    const { firstName, lastName, email, telephone } = data;
    const eventId = data.event.connect[0];
    return await gqlClient.request(mutation, {
      firstName,
      lastName,
      email,
      telephone,
      eventId,
    });
  } catch (error: any) {
    console.error("Events Subscribe Service Error:", error);
    return { error: error?.response?.errors?.[0] ?? "Unknown error" };
  }
}