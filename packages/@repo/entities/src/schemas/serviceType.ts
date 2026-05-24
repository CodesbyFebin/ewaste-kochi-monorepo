import { z } from "zod";
import { ServiceType, CertificationType } from "../types";

/**
 * Zod schema for validating ServiceEntity data
 */
export const serviceEntitySchema = z.object({
  id: z.string().min(1, "Service ID is required"),
  type: z.literal("service"),
  name: z.string().min(1, "Service name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  metadata: z.record(z.unknown()).optional(),
  serviceType: z.nativeEnum(ServiceType),
  keywords: z.array(z.string()).min(1, "At least one keyword required"),
  relatedServices: z
    .array(
      z.object({
        type: z.literal("service"),
        id: z.string(),
      })
    )
    .default([]),
  certifications: z
    .array(
      z.object({
        type: z.literal("certification"),
        id: z.string(),
      })
    )
    .default([]),
  serviceCenters: z
    .array(
      z.object({
        type: z.literal("location"),
        id: z.string(),
      })
    )
    .default([]),
  faqs: z
    .array(
      z.object({
        type: z.literal("faq"),
        id: z.string(),
      })
    )
    .default([]),
  processSteps: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  environmentalImpact: z.string().optional(),
});

export type ServiceEntityInput = z.infer<typeof serviceEntitySchema>;

/**
 * Predefined service descriptions database
 */
export const SERVICE_DESCRIPTIONS: Record<ServiceType, { name: string; description: string }> =
  {
    [ServiceType.BATTERY_RECYCLING]: {
      name: "Battery Recycling",
      description:
        "Professional battery recycling services for lithium-ion, lead-acid, and alkaline batteries with certified recovery processes",
    },
    [ServiceType.HARD_DRIVE_SHREDDING]: {
      name: "Hard Drive Shredding",
      description:
        "Secure hard drive destruction and e-waste shredding services with data destruction certification",
    },
    [ServiceType.ITAD]: {
      name: "IT Asset Disposition",
      description:
        "Complete IT asset management and disposition services including refurbishment and secure data wiping",
    },
    [ServiceType.EWASTE_COLLECTION]: {
      name: "E-Waste Collection",
      description:
        "Door-to-door e-waste collection and aggregation services for businesses and households",
    },
    [ServiceType.COMPONENT_REFURBISHMENT]: {
      name: "Component Refurbishment",
      description:
        "Refurbishment and quality testing of computer components and peripherals for secondary markets",
    },
    [ServiceType.DATA_DESTRUCTION]: {
      name: "Data Destruction",
      description:
        "Certified data destruction services meeting NIST 800-88 and international data privacy standards",
    },
    [ServiceType.MATERIAL_RECOVERY]: {
      name: "Material Recovery",
      description:
        "Extraction and recovery of precious metals and materials from electronic waste",
    },
    [ServiceType.CERTIFICATION]: {
      name: "Certification & Compliance",
      description:
        "NAID, R2, and environmental compliance certification services for e-waste handlers",
    },
    [ServiceType.ASSESSMENT]: {
      name: "E-Waste Assessment",
      description:
        "Professional assessment and audit of e-waste handling processes and compliance status",
    },
    [ServiceType.LOGISTICS]: {
      name: "E-Waste Logistics",
      description:
        "Transportation and logistics solutions for safe and compliant e-waste movement",
    },
  };

/**
 * Keywords for each service type (for SEO)
 */
export const SERVICE_KEYWORDS: Record<ServiceType, string[]> = {
  [ServiceType.BATTERY_RECYCLING]: [
    "battery recycling",
    "lithium-ion recycling",
    "battery disposal",
    "lead-acid battery recycling",
    "battery waste management",
  ],
  [ServiceType.HARD_DRIVE_SHREDDING]: [
    "hard drive shredding",
    "data destruction",
    "hard drive destruction",
    "secure data wiping",
    "e-waste shredding",
  ],
  [ServiceType.ITAD]: [
    "IT asset disposition",
    "ITAD services",
    "asset management",
    "computer recycling",
    "IT equipment disposal",
  ],
  [ServiceType.EWASTE_COLLECTION]: [
    "e-waste collection",
    "electronic waste collection",
    "e-waste pickup",
    "ewaste disposal",
    "hazardous waste collection",
  ],
  [ServiceType.COMPONENT_REFURBISHMENT]: [
    "component refurbishment",
    "computer parts refurbishment",
    "electronics refurbishment",
    "hardware refurbishment",
    "component remanufacturing",
  ],
  [ServiceType.DATA_DESTRUCTION]: [
    "data destruction",
    "secure data destruction",
    "NIST 800-88 compliant",
    "certified data wiping",
    "information security",
  ],
  [ServiceType.MATERIAL_RECOVERY]: [
    "material recovery",
    "precious metal recovery",
    "e-waste recycling",
    "resource recovery",
    "urban mining",
  ],
  [ServiceType.CERTIFICATION]: [
    "e-waste certification",
    "NAID certification",
    "R2 certification",
    "environmental compliance",
    "ISO certification",
  ],
  [ServiceType.ASSESSMENT]: [
    "e-waste assessment",
    "waste audit",
    "compliance assessment",
    "environmental audit",
    "process audit",
  ],
  [ServiceType.LOGISTICS]: [
    "e-waste logistics",
    "hazmat transportation",
    "waste logistics",
    "supply chain management",
    "transportation services",
  ],
};

/**
 * Certification associations for each service
 */
export const SERVICE_CERTIFICATIONS: Record<ServiceType, CertificationType[]> = {
  [ServiceType.BATTERY_RECYCLING]: [CertificationType.R2, CertificationType.ISO_14001],
  [ServiceType.HARD_DRIVE_SHREDDING]: [
    CertificationType.NAID,
    CertificationType.NIST_800_88,
    CertificationType.ISO_14001,
  ],
  [ServiceType.ITAD]: [CertificationType.R2, CertificationType.NAID, CertificationType.ISO_14001],
  [ServiceType.EWASTE_COLLECTION]: [CertificationType.ISO_14001, CertificationType.ISO_45001],
  [ServiceType.COMPONENT_REFURBISHMENT]: [CertificationType.R2, CertificationType.ISO_14001],
  [ServiceType.DATA_DESTRUCTION]: [CertificationType.NIST_800_88, CertificationType.NAID],
  [ServiceType.MATERIAL_RECOVERY]: [CertificationType.R2, CertificationType.ISO_14001],
  [ServiceType.CERTIFICATION]: [],
  [ServiceType.ASSESSMENT]: [CertificationType.ISO_14001, CertificationType.ISO_45001],
  [ServiceType.LOGISTICS]: [CertificationType.ISO_45001],
};
