import { prisma } from "./prisma";

/**
 * Single source of truth for resolving the current business (tenant).
 * In a real SaaS this would resolve from the subdomain or authed user.
 * For now we resolve by env-configured slug — but the codebase is
 * already multi-tenant, so swapping this is a one-line change.
 */
export async function getCurrentBusiness() {
  const slug = process.env.DEFAULT_BUSINESS_SLUG || "demo";
  const business = await prisma.business.findUnique({ where: { slug } });
  if (!business) {
    throw new Error(
      `Business with slug "${slug}" not found. Run \`npm run db:seed\` to create demo data.`
    );
  }
  return business;
}

export async function getBusinessBySlug(slug: string) {
  return prisma.business.findUnique({ where: { slug } });
}
