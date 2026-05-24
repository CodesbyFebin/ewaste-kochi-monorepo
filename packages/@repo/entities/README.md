
# @repo/entities

Global entity registry for the ewaste-kochi monorepo. This package provides a centralized schema and registry system for managing e-waste services, locations, FAQs, certifications, and articles across all subdomains.

## Features

- **Global Entity Registry**: Centralized repository for all entities with full CRUD operations
- **Predefined Schemas**: TypeScript-first schemas with Zod validation
- **Relationship Graph**: Traverse connections between entities (services → locations → FAQs)
- **Geo-Association**: Location-aware entity queries and sitemap generation
- **FAQ Mapping**: Link FAQs to services and locations automatically
- **SEO-Ready**: Generate sitemaps and markdown exports for each entity
- **Seed Data**: Pre-loaded with 10 core e-waste service types and major Indian locations

## Installation

```bash
npm install @repo/entities
# or
pnpm add @repo/entities
```

## Quick Start

```typescript
import {
  GlobalEntityRegistry,
  SEED_SERVICES,
  PREDEFINED_LOCATIONS,
  ServiceType,
} from "@repo/entities";

// Initialize registry
const registry = new GlobalEntityRegistry();

// Register seed data
SEED_SERVICES.forEach((service) => registry.registerEntity(service));

// Get service by ID
const batteryRecycling = registry.getEntity("service", "service_battery_recycling");

// Get all locations
const allLocations = registry.getEntitiesByType("location");

// Traverse entity graph
const related = registry.traverseGraph(
  { type: "service", id: "service_battery_recycling" },
  undefined,
  { maxDepth: 2 }
);

// Generate sitemap
const sitemap = registry.generateGeoSitemap("https://ewastekochi.com");

// Export to Markdown
const markdown = registry.entityToMarkdown(
  { type: "service", id: "service_battery_recycling" },
  { includeMetadata: true, includeFAQ: true }
);
```

## Architecture

### Entity Types

```
Entity
├── ServiceEntity (battery_recycling, hard_drive_shredding, ITAD, etc.)
├── LocationEntity (cities, states, service centers)
├── FAQEntity (questions & answers)
├── CertificationEntity (NAID, R2, NIST 800-88, etc.)
└── ArticleEntity (blog posts, guides)
```

### Core Services

The registry includes these **10 core e-waste services**:

1. **Battery Recycling** - Lithium-ion and lead-acid recovery
2. **Hard Drive Shredding** - Data destruction + NAID certified
3. **IT Asset Disposition (ITAD)** - Complete lifecycle management
4. **E-Waste Collection** - Door-to-door pickup service
5. **Component Refurbishment** - Remanufacturing for secondary markets
6. **Data Destruction** - NIST 800-88 compliant
7. **Material Recovery** - Precious metal extraction
8. **Certification** - NAID, R2, ISO compliance
9. **Assessment** - E-waste management audits
10. **Logistics** - Hazmat transportation & tracking

### Geographic Coverage

**States:**
- Kerala
- Maharashtra
- Tamil Nadu
- Karnataka

**Cities:**
- Kochi (main hub)
- Mumbai
- Bangalore
- Chennai

**Service Centers:**
- Kochi Main Processing Center
- Mumbai Processing Center

## API Reference

### GlobalEntityRegistry

#### Methods

##### `registerEntity(entity: Entity): void`

Register a new entity in the registry.

```typescript
registry.registerEntity({
  id: "service_custom",
  type: "service",
  name: "Custom Service",
  // ... other properties
});
```

##### `getEntity<T>(type: EntityType, id: string): T | null`

Retrieve a single entity by type and ID.

```typescript
const service = registry.getEntity<ServiceEntity>("service", "service_battery_recycling");
```

##### `getEntitiesByType(type: EntityType): Entity[]`

Get all entities of a specific type.

```typescript
const allServices = registry.getEntitiesByType("service");
```

##### `getFAQForEntity(entityRef: EntityRef): FAQEntity[]`

Get FAQs associated with a service or location.

```typescript
const faqs = registry.getFAQForEntity({
  type: "service",
  id: "service_battery_recycling",
});
```

##### `traverseGraph(startRef: EntityRef, relation?: string, options?: TraversalOptions): Entity[]`

Traverse the entity relationship graph starting from a given entity.

```typescript
const related = registry.traverseGraph(
  { type: "service", id: "service_battery_recycling" },
  undefined,
  { maxDepth: 2, excludeRelations: ["article"] }
);
```

##### `generateGeoSitemap(baseUrl?: string): SitemapEntry[]`

Generate an SEO-optimized sitemap with geo-aware priorities.

```typescript
const sitemap = registry.generateGeoSitemap("https://ewastekochi.com");
// Output:
// [
//   { url: "https://ewastekochi.com/services/battery-recycling", priority: 0.8 },
//   { url: "https://ewastekochi.com/kochi/battery-recycling", priority: 0.95 },
//   { ... }
// ]
```

##### `entityToMarkdown(entityRef: EntityRef, options?: MarkdownOptions): string`

Export an entity to Markdown format.

```typescript
const markdown = registry.entityToMarkdown(
  { type: "service", id: "service_battery_recycling" },
  { includeMetadata: true, includeFAQ: true, depth: 2 }
);
```

##### `updateEntity(entity: Entity): void`

Update an existing entity.

```typescript
const updated = { ...entity, name: "Updated Name" };
registry.updateEntity(updated);
```

##### `deleteEntity(type: EntityType, id: string): void`

Delete an entity from the registry.

```typescript
registry.deleteEntity("service", "service_battery_recycling");
```

##### `getStats(): RegistryStats`

Get statistics about the registry.

```typescript
const stats = registry.getStats();
// { totalEntities: 50, byType: { service: 10, location: 15, ... }, relationships: 40 }
```

## Type System

### ServiceEntity

```typescript
interface ServiceEntity extends BaseEntity {
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
```

### LocationEntity

```typescript
interface LocationEntity extends BaseEntity {
  locationType: LocationType;
  coordinates?: { latitude: number; longitude: number };
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
```

### FAQEntity

```typescript
interface FAQEntity extends BaseEntity {
  question: string;
  answer: string;
  category: string;
  relatedEntities: EntityRef[];
  order?: number;
}
```

## Validation

All entities are validated using Zod schemas:

```typescript
import { serviceEntitySchema, locationEntitySchema } from "@repo/entities/schemas";

const validService = serviceEntitySchema.parse(serviceData);
const validLocation = locationEntitySchema.parse(locationData);
```

## Testing

Run the test suite:

```bash
npm run test
# or
pnpm run test
```

The test suite includes:

- ✅ Registry basics (registration, duplicates)
- ✅ Entity retrieval (single, by type)
- ✅ Geo-associations (locations, service centers)
- ✅ FAQ linking
- ✅ Graph traversal
- ✅ Sitemap generation
- ✅ Markdown export
- ✅ Registry statistics
- ✅ Entity updates
- ✅ Entity deletion

## SEO Integration

The registry is designed to work seamlessly with `@repo/seo`:

```typescript
import { GlobalEntityRegistry } from "@repo/entities";
import { SEOGenerator } from "@repo/seo";

const registry = new GlobalEntityRegistry();
const seoGen = new SEOGenerator();

// Generate SEO metadata for each service
registry.getEntitiesByType("service").forEach((service) => {
  const metadata = seoGen.generateMetadata(service);
  // Use in page headers, schema.org, etc.
});
```

## Use Cases

### 1. Service Discovery Page

```typescript
// Get all services for a city
const kochiServices = registry.getEntity("location", "location_kochi");
const services = kochiServices?.servicesOffered.map((ref) =>
  registry.getEntity("service", ref.id)
);
```

### 2. FAQ Injection

```typescript
// Fetch FAQs for service page
const faqs = registry.getFAQForEntity({
  type: "service",
  id: "service_battery_recycling",
});
// Use for FAQ schema.org markup
```

### 3. Dynamic Sitemap Generation

```typescript
const sitemap = registry.generateGeoSitemap();
// Convert to XML and serve at /sitemap.xml
```

### 4. Content Export

```typescript
// Generate content for MDX or CMS
const markdown = registry.entityToMarkdown(
  { type: "service", id: "service_itad" },
  { includeMetadata: false }
);
```

## Seed Data

Pre-loaded seed data includes:

- **10 Service Types** with keywords, benefits, and process steps
- **4 States** across India
- **4 Major Cities** with coordinates
- **2 Service Centers** fully configured
- **Certification Mappings** (NAID, R2, NIST 800-88, ISO)

Load seed data:

```typescript
import { SEED_SERVICES, PREDEFINED_LOCATIONS } from "@repo/entities";

// All services are pre-configured with:
// - Service type and keywords
// - Related services and certifications
// - Service centers and FAQ references
// - Process steps and environmental impact
```

## Performance

- **O(1)** entity lookup by ID
- **O(n)** entity type filtering
- **O(d)** graph traversal where d = depth
- **In-memory storage** (can integrate with databases)

## Future Enhancements

- [ ] Persistent storage backend (MongoDB, PostgreSQL)
- [ ] Full-text search indexing
- [ ] Real-time relationship updates
- [ ] Batch import/export
- [ ] GraphQL API layer
- [ ] Multi-language support
- [ ] Analytics and usage tracking

## Contributing

See main repository [CONTRIBUTING.md](../../CONTRIBUTING.md)

## License

This package is part of the ewaste-kochi-monorepo and follows the same license.
