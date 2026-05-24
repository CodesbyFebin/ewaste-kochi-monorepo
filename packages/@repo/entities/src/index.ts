/**
 * @repo/entities - Global Entity Registry
 * Central repository for all e-waste management entities with SEO, FAQ, and geo-association logic
 */

export { GlobalEntityRegistry } from "./registry";

// Types
export type {
  EntityRef,
  BaseEntity,
  ServiceEntity,
  LocationEntity,
  FAQEntity,
  CertificationEntity,
  ArticleEntity,
  Entity,
  TraversalOptions,
  SitemapEntry,
  MarkdownOptions,
} from "./types";

export { ServiceType, CertificationType, LocationType } from "./types";
export type { EntityType } from "./types";

// Schemas and validation
export {
  serviceEntitySchema,
  SERVICE_DESCRIPTIONS,
  SERVICE_KEYWORDS,
  SERVICE_CERTIFICATIONS,
  locationEntitySchema,
  PREDEFINED_LOCATIONS,
} from "./schemas";

export type { ServiceEntityInput, LocationEntityInput } from "./schemas";

// Seed data
export { SEED_SERVICES } from "./seed-data";
