import { createClient } from '@sanity/client';

export const serverSanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: process.env.SANITY_API_VERSION!,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

// Helper function to validate Sanity configuration
export function validateSanityConfig() {
  const requiredEnvVars = [
    'SANITY_PROJECT_ID',
    'SANITY_DATASET',
    'SANITY_API_VERSION',
    'SANITY_API_TOKEN'
  ];

  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missing.length > 0) {
    throw new Error(`Missing required Sanity environment variables: ${missing.join(', ')}`);
  }

  return true;
}
