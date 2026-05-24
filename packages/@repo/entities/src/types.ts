/**
 * Core type definitions for the Global Entity Registry
 */

export enum ServiceType {
  BATTERY_RECYCLING = "battery_recycling",
  HARD_DRIVE_SHREDDING = "hard_drive_shredding",
  ITAD = "itad",
  EWASTE_COLLECTION = "ewaste_collection",
  COMPONENT_REFURBISHMENT = "component_refurbishment",
  DATA_DESTRUCTION = "data_destruction",
  MATERIAL_RECOVERY = "material_recovery",
  CERTIFICATION = "certification",
  ASSESSMENT = "assessment",
  LOGISTICS = "logistics",
}

export enum CertificationType {
  NAID = "naid",
  R2 = "r2",
  NIST_800_88 = "nist_800_88",
  ISO_14001 = "iso_14001",
  ISO_45001 = "iso_45001",
}

export enum LocationType {
  CITY = "city",
  STATE = "state",
  COUNTRY = "country",
  SERVICE_CENTER = "service_center",
  COLLECTION_POINT = "collection_point",
}

export type EntityType = "service" | "location" | "faq" | "certification" | "article";

export interface EntityRef {
  type: EntityType;
  id: string;
}

export interface BaseEntity {
  id: string;
  type: EntityType;
  name: string;
  description: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}

export interface ServiceEntity extends BaseEntity {
  type: "service";
  serviceType: ServiceType;
  keywords: string[];
  relatedServices: EntityRef[];
  certifications: EntityRef[];
  serviceCenters: EntityRef[];
  faqs: EntityRef[];
  processSteps?: string[];
  benefits?: string[];
  environmentalImpact?: string;
}

export interface LocationEntity extends BaseEntity {
  type: "location";
  locationType: LocationType;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  address?: string;
  pincode?: string;
  state?: string;
  country: string;
  servicesOffered: EntityRef[];
  parentLocation?: EntityRef;
  childLocations?: EntityRef[];
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

export interface FAQEntity extends BaseEntity {
  type: "faq";
  question: string;
  answer: string;
  category: string;
  relatedEntities: EntityRef[];
  order?: number;
}

export interface CertificationEntity extends BaseEntity {
  type: "certification";
  certificationType: CertificationType;
  issuingBody: string;
  validFrom?: Date;
  validUntil?: Date;
  documentUrl?: string;
  servicesCovered: EntityRef[];
}

export interface ArticleEntity extends BaseEntity {
  type: "article";
  content: string;
  author?: string;
  publishedAt?: Date;
  tags: string[];
  relatedEntities: EntityRef[];
}

export type Entity = ServiceEntity | LocationEntity | FAQEntity | CertificationEntity | ArticleEntity;

/**
 * Graph traversal configuration
 */
export interface TraversalOptions {
  maxDepth?: number;
  includeRelations?: EntityType[];
  excludeRelations?: EntityType[];
}

/**
 * Sitemap entry structure
 */
export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

/**
 * Markdown export options
 */
export interface MarkdownOptions {
  includeMetadata?: boolean;
  includeFAQ?: boolean;
  includeRelated?: boolean;
  depth?: number;
}
