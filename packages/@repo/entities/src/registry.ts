import {
  Entity,
  EntityRef,
  EntityType,
  FAQEntity,
  LocationEntity,
  ServiceEntity,
  TraversalOptions,
  SitemapEntry,
  MarkdownOptions,
  CertificationEntity,
  ArticleEntity,
} from "./types";

/**
 * Global Entity Registry
 * Central repository for all entities with methods for querying, traversing, and exporting data
 */
export class GlobalEntityRegistry {
  private entities: Map<string, Entity> = new Map();
  private entityIndex: Map<EntityType, Set<string>> = new Map();
  private relationshipGraph: Map<string, EntityRef[]> = new Map();

  constructor() {
    // Initialize entity type indices
    const types: EntityType[] = ["service", "location", "faq", "certification", "article"];
    types.forEach((type) => {
      this.entityIndex.set(type, new Set());
    });
  }

  /**
   * Register a new entity in the registry
   */
  registerEntity(entity: Entity): void {
    const key = this.getEntityKey(entity);

    if (this.entities.has(key)) {
      throw new Error(`Entity already registered: ${key}`);
    }

    this.entities.set(key, entity);
    this.entityIndex.get(entity.type)?.add(entity.id);

    // Index relationships
    this.indexRelationships(entity);
  }

  /**
   * Get entity by type and ID
   */
  getEntity<T extends Entity = Entity>(type: EntityType, id: string): T | null {
    const key = `${type}:${id}`;
    const entity = this.entities.get(key) as T | undefined;
    return entity || null;
  }

  /**
   * Get all entities of a specific type
   */
  getEntitiesByType(type: EntityType): Entity[] {
    const ids = this.entityIndex.get(type) || new Set();
    return Array.from(ids)
      .map((id) => this.entities.get(`${type}:${id}`))
      .filter((e): e is Entity => e !== undefined);
  }

  /**
   * Get FAQs for a specific entity (service, location, etc.)
   */
  getFAQForEntity(entityRef: EntityRef): FAQEntity[] {
    const entity = this.getEntity(entityRef.type, entityRef.id);
    if (!entity) return [];

    const faqRefs: EntityRef[] = [];

    if (entity.type === "service" && "faqs" in entity) {
      faqRefs.push(...(entity as ServiceEntity).faqs);
    } else if (entity.type === "location" && "faqs" in entity) {
      faqRefs.push(...((entity as unknown as LocationEntity & { faqs?: EntityRef[] }).faqs || []));
    }

    return faqRefs
      .map((ref) => this.getEntity<FAQEntity>("faq", ref.id))
      .filter((faq): faq is FAQEntity => faq !== null);
  }

  /**
   * Traverse entity relationship graph
   */
  traverseGraph(
    startRef: EntityRef,
    relation?: string,
    options: TraversalOptions = {}
  ): Entity[] {
    const visited = new Set<string>();
    const queue: { ref: EntityRef; depth: number }[] = [{ ref: startRef, depth: 0 }];
    const result: Entity[] = [];
    const maxDepth = options.maxDepth ?? 3;

    while (queue.length > 0) {
      const { ref, depth } = queue.shift()!;
      const key = this.getEntityKey(ref);

      if (visited.has(key) || depth > maxDepth) continue;
      visited.add(key);

      const entity = this.getEntity(ref.type, ref.id);
      if (!entity) continue;

      result.push(entity);

      // Add related entities to queue
      const related = this.getRelatedEntities(entity, options);
      related.forEach((entityRef) => {
        queue.push({ ref: entityRef, depth: depth + 1 });
      });
    }

    return result;
  }

  /**
   * Generate geo-aware sitemap with priority and change frequency
   */
  generateGeoSitemap(baseUrl: string = "https://ewastekochi.com"): SitemapEntry[] {
    const entries: SitemapEntry[] = [];
    const locations = this.getEntitiesByType("location") as LocationEntity[];
    const services = this.getEntitiesByType("service") as ServiceEntity[];

    // Add location pages
    locations.forEach((location) => {
      const priority = location.locationType === "service_center" ? 0.9 : 0.8;
      entries.push({
        url: `${baseUrl}/${location.locationType}/${location.slug}`,
        changefreq: "weekly",
        priority,
        lastmod: location.updatedAt.toISOString(),
      });
    });

    // Add service pages
    services.forEach((service) => {
      entries.push({
        url: `${baseUrl}/services/${service.slug}`,
        changefreq: "monthly",
        priority: 0.8,
        lastmod: service.updatedAt.toISOString(),
      });
    });

    // Add location + service combination pages (highest value)
    locations.forEach((location) => {
      services.forEach((service) => {
        if (location.servicesOffered.some((s) => s.id === service.id)) {
          entries.push({
            url: `${baseUrl}/${location.slug}/${service.slug}`,
            changefreq: "weekly",
            priority: 0.95,
            lastmod: new Date().toISOString(),
          });
        }
      });
    });

    return entries;
  }

  /**
   * Export entity to Markdown format
   */
  entityToMarkdown(entityRef: EntityRef, options: MarkdownOptions = {}): string {
    const entity = this.getEntity(entityRef.type, entityRef.id);
    if (!entity) return "";

    const {
      includeMetadata = true,
      includeFAQ = true,
      includeRelated = true,
      depth = 1,
    } = options;

    let markdown = `# ${entity.name}\n\n`;

    // Description
    if (entity.description) {
      markdown += `${entity.description}\n\n`;
    }

    // Type-specific content
    if (entity.type === "service") {
      const service = entity as ServiceEntity;
      markdown += this.serviceToMarkdown(service, options);
    } else if (entity.type === "location") {
      const location = entity as LocationEntity;
      markdown += this.locationToMarkdown(location, options);
    } else if (entity.type === "faq") {
      const faq = entity as FAQEntity;
      markdown += `## Question\n${faq.question}\n\n## Answer\n${faq.answer}\n\n`;
    }

    // Metadata
    if (includeMetadata) {
      markdown += `---\n`;
      markdown += `- **ID**: ${entity.id}\n`;
      markdown += `- **Slug**: ${entity.slug}\n`;
      markdown += `- **Created**: ${entity.createdAt.toISOString()}\n`;
      markdown += `- **Updated**: ${entity.updatedAt.toISOString()}\n`;
      if (entity.metadata && Object.keys(entity.metadata).length > 0) {
        markdown += `- **Metadata**: ${JSON.stringify(entity.metadata, null, 2)}\n`;
      }
      markdown += `\n`;
    }

    // FAQs
    if (includeFAQ && entity.type === "service") {
      const faqs = this.getFAQForEntity(entityRef);
      if (faqs.length > 0) {
        markdown += `## Frequently Asked Questions\n\n`;
        faqs.forEach((faq) => {
          markdown += `### ${faq.question}\n${faq.answer}\n\n`;
        });
      }
    }

    // Related entities
    if (includeRelated) {
      const related = this.getRelatedEntities(entity, {
        maxDepth: depth,
      });
      if (related.length > 0) {
        markdown += `## Related Entities\n\n`;
        related.forEach((ref) => {
          const relatedEntity = this.getEntity(ref.type, ref.id);
          if (relatedEntity) {
            markdown += `- [${relatedEntity.name}](/${ref.type}/${relatedEntity.slug})\n`;
          }
        });
        markdown += `\n`;
      }
    }

    return markdown;
  }

  /**
   * Update an existing entity
   */
  updateEntity(entity: Entity): void {
    const key = this.getEntityKey(entity);

    if (!this.entities.has(key)) {
      throw new Error(`Entity not found: ${key}`);
    }

    entity.updatedAt = new Date();
    this.entities.set(key, entity);
  }

  /**
   * Delete an entity from the registry
   */
  deleteEntity(type: EntityType, id: string): void {
    const key = `${type}:${id}`;
    this.entities.delete(key);
    this.entityIndex.get(type)?.delete(id);
    this.relationshipGraph.delete(key);
  }

  /**
   * Get statistics about the registry
   */
  getStats(): {
    totalEntities: number;
    byType: Record<EntityType, number>;
    relationships: number;
  } {
    const byType: Record<EntityType, number> = {
      service: 0,
      location: 0,
      faq: 0,
      certification: 0,
      article: 0,
    };

    this.entityIndex.forEach((ids, type) => {
      byType[type] = ids.size;
    });

    return {
      totalEntities: this.entities.size,
      byType,
      relationships: this.relationshipGraph.size,
    };
  }

  // Private helper methods

  private getEntityKey(entity: EntityRef | Entity): string {
    if ("type" in entity && "id" in entity) {
      return `${entity.type}:${entity.id}`;
    }
    return "";
  }

  private indexRelationships(entity: Entity): void {
    const refs: EntityRef[] = [];

    if (entity.type === "service") {
      const service = entity as ServiceEntity;
      refs.push(...service.relatedServices);
      refs.push(...service.certifications);
      refs.push(...service.serviceCenters);
      refs.push(...service.faqs);
    } else if (entity.type === "location") {
      const location = entity as LocationEntity;
      refs.push(...location.servicesOffered);
      if (location.parentLocation) refs.push(location.parentLocation);
      if (location.childLocations) refs.push(...location.childLocations);
    } else if (entity.type === "faq") {
      const faq = entity as FAQEntity;
      refs.push(...faq.relatedEntities);
    } else if (entity.type === "certification") {
      const cert = entity as CertificationEntity;
      refs.push(...cert.servicesCovered);
    } else if (entity.type === "article") {
      const article = entity as ArticleEntity;
      refs.push(...article.relatedEntities);
    }

    if (refs.length > 0) {
      this.relationshipGraph.set(this.getEntityKey(entity), refs);
    }
  }

  private getRelatedEntities(
    entity: Entity,
    options: TraversalOptions = {}
  ): EntityRef[] {
    const { includeRelations, excludeRelations } = options;
    const refs = this.relationshipGraph.get(this.getEntityKey(entity)) || [];

    return refs.filter((ref) => {
      if (includeRelations && !includeRelations.includes(ref.type)) return false;
      if (excludeRelations && excludeRelations.includes(ref.type)) return false;
      return true;
    });
  }

  private serviceToMarkdown(service: ServiceEntity, options: MarkdownOptions): string {
    let markdown = `## Service Type\n${service.serviceType}\n\n`;

    if (service.keywords && service.keywords.length > 0) {
      markdown += `## Keywords\n${service.keywords.join(", ")}\n\n`;
    }

    if (service.benefits && service.benefits.length > 0) {
      markdown += `## Benefits\n`;
      service.benefits.forEach((benefit) => {
        markdown += `- ${benefit}\n`;
      });
      markdown += `\n`;
    }

    if (service.processSteps && service.processSteps.length > 0) {
      markdown += `## Process Steps\n`;
      service.processSteps.forEach((step, index) => {
        markdown += `${index + 1}. ${step}\n`;
      });
      markdown += `\n`;
    }

    if (service.environmentalImpact) {
      markdown += `## Environmental Impact\n${service.environmentalImpact}\n\n`;
    }

    return markdown;
  }

  private locationToMarkdown(location: LocationEntity, options: MarkdownOptions): string {
    let markdown = `## Location Type\n${location.locationType}\n\n`;

    if (location.coordinates) {
      markdown += `## Coordinates\n- Latitude: ${location.coordinates.latitude}\n- Longitude: ${location.coordinates.longitude}\n\n`;
    }

    if (location.address) {
      markdown += `## Address\n${location.address}\n\n`;
    }

    if (location.pincode) {
      markdown += `- **Pincode**: ${location.pincode}\n`;
    }

    if (location.state) {
      markdown += `- **State**: ${location.state}\n`;
    }

    markdown += `- **Country**: ${location.country}\n\n`;

    if (location.contactInfo) {
      markdown += `## Contact Information\n`;
      if (location.contactInfo.phone) markdown += `- **Phone**: ${location.contactInfo.phone}\n`;
      if (location.contactInfo.email) markdown += `- **Email**: ${location.contactInfo.email}\n`;
      if (location.contactInfo.website) markdown += `- **Website**: ${location.contactInfo.website}\n`;
      markdown += `\n`;
    }

    return markdown;
  }
}
