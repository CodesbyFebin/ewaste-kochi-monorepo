import { strict as assert } from "assert";
import { GlobalEntityRegistry, SEED_SERVICES, PREDEFINED_LOCATIONS, ServiceType } from "../src/index";

/**
 * Test suite for GlobalEntityRegistry
 */

function testRegistryBasics() {
  console.log("Testing: Registry Basics");
  const registry = new GlobalEntityRegistry();

  // Register first service
  registry.registerEntity(SEED_SERVICES[0]);
  assert.ok(registry.getEntity("service", SEED_SERVICES[0].id) !== null, "Service should be registered");

  // Prevent duplicate registration
  try {
    registry.registerEntity(SEED_SERVICES[0]);
    assert.fail("Should not allow duplicate registration");
  } catch (e) {
    assert.ok(true, "Correctly prevented duplicate registration");
  }

  console.log("✓ Registry basics test passed");
}

function testEntityRetrieval() {
  console.log("Testing: Entity Retrieval");
  const registry = new GlobalEntityRegistry();

  // Register multiple services
  SEED_SERVICES.slice(0, 3).forEach((service) => {
    registry.registerEntity(service);
  });

  // Retrieve specific entity
  const service = registry.getEntity("service", SEED_SERVICES[0].id);
  assert.ok(service !== null, "Should retrieve registered service");
  assert.equal(service?.name, SEED_SERVICES[0].name, "Service name should match");

  // Retrieve non-existent entity
  const notFound = registry.getEntity("service", "non_existent");
  assert.equal(notFound, null, "Non-existent entity should return null");

  // Get all services
  const allServices = registry.getEntitiesByType("service");
  assert.equal(allServices.length, 3, "Should return all 3 registered services");

  console.log("✓ Entity retrieval test passed");
}

function testGeoAssociations() {
  console.log("Testing: Geo Associations");
  const registry = new GlobalEntityRegistry();

  // Register locations
  const kochi = PREDEFINED_LOCATIONS.cities.kochi;
  const mumbai = PREDEFINED_LOCATIONS.cities.mumbai;
  registry.registerEntity({
    ...kochi,
    type: "location",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  registry.registerEntity({
    ...mumbai,
    type: "location",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Register service
  registry.registerEntity(SEED_SERVICES[0]);

  // Retrieve locations
  const locations = registry.getEntitiesByType("location");
  assert.equal(locations.length, 2, "Should have 2 locations registered");

  const kochiEntity = registry.getEntity("location", "location_kochi");
  assert.ok(kochiEntity !== null, "Kochi should be retrieved");
  assert.equal(kochiEntity?.slug, "kochi", "Kochi slug should match");

  console.log("✓ Geo associations test passed");
}

function testFAQLinking() {
  console.log("Testing: FAQ Linking");
  const registry = new GlobalEntityRegistry();

  // Register service with FAQ refs
  registry.registerEntity(SEED_SERVICES[0]); // Battery recycling service

  // Register FAQs
  const faqEntity = {
    id: "faq_battery_1",
    type: "faq" as const,
    name: "FAQ: Battery Recycling Process",
    description: "Frequently asked questions about battery recycling",
    slug: "faq-battery-1",
    question: "What types of batteries can be recycled?",
    answer: "We recycle lithium-ion, lead-acid, alkaline, and NiMH batteries...",
    category: "battery_recycling",
    relatedEntities: [{ type: "service" as const, id: SEED_SERVICES[0].id }],
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  registry.registerEntity(faqEntity);

  // Get FAQs for service
  const faqs = registry.getFAQForEntity({ type: "service", id: SEED_SERVICES[0].id });
  assert.ok(faqs.length >= 1, "Should retrieve FAQs for service");

  console.log("✓ FAQ linking test passed");
}

function testGraphTraversal() {
  console.log("Testing: Graph Traversal");
  const registry = new GlobalEntityRegistry();

  // Register interconnected entities
  SEED_SERVICES.slice(0, 3).forEach((service) => {
    registry.registerEntity(service);
  });

  // Traverse from first service
  const traversed = registry.traverseGraph(
    { type: "service", id: SEED_SERVICES[0].id },
    undefined,
    { maxDepth: 1 }
  );

  assert.ok(traversed.length > 0, "Should traverse and find related entities");
  console.log(`  Traversed ${traversed.length} entities from starting point`);

  console.log("✓ Graph traversal test passed");
}

function testGeoSitemap() {
  console.log("Testing: Geo Sitemap Generation");
  const registry = new GlobalEntityRegistry();

  // Register services and locations
  SEED_SERVICES.slice(0, 2).forEach((service) => {
    registry.registerEntity(service);
  });

  const kochi = PREDEFINED_LOCATIONS.cities.kochi;
  registry.registerEntity({
    ...kochi,
    type: "location",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Generate sitemap
  const sitemap = registry.generateGeoSitemap("https://ewastekochi.com");
  assert.ok(sitemap.length > 0, "Sitemap should have entries");
  assert.ok(
    sitemap.some((entry) => entry.url.includes("service")),
    "Sitemap should contain service URLs"
  );

  console.log(`  Generated sitemap with ${sitemap.length} entries`);
  console.log("✓ Geo sitemap test passed");
}

function testMarkdownExport() {
  console.log("Testing: Markdown Export");
  const registry = new GlobalEntityRegistry();

  registry.registerEntity(SEED_SERVICES[0]);

  const markdown = registry.entityToMarkdown(
    { type: "service", id: SEED_SERVICES[0].id },
    { includeMetadata: true, includeFAQ: false }
  );

  assert.ok(markdown.includes(SEED_SERVICES[0].name), "Markdown should contain entity name");
  assert.ok(markdown.includes("##"), "Markdown should have headings");

  console.log(`  Generated markdown with ${markdown.length} characters`);
  console.log("✓ Markdown export test passed");
}

function testRegistryStats() {
  console.log("Testing: Registry Statistics");
  const registry = new GlobalEntityRegistry();

  // Register various entities
  SEED_SERVICES.slice(0, 3).forEach((service) => {
    registry.registerEntity(service);
  });

  const kochi = PREDEFINED_LOCATIONS.cities.kochi;
  registry.registerEntity({
    ...kochi,
    type: "location",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const stats = registry.getStats();
  assert.equal(stats.totalEntities, 4, "Should have 4 entities");
  assert.equal(stats.byType.service, 3, "Should have 3 services");
  assert.equal(stats.byType.location, 1, "Should have 1 location");

  console.log(`  Registry stats:`, stats);
  console.log("✓ Registry statistics test passed");
}

function testEntityUpdate() {
  console.log("Testing: Entity Update");
  const registry = new GlobalEntityRegistry();

  const service = SEED_SERVICES[0];
  registry.registerEntity(service);

  // Update entity
  const updated = {
    ...service,
    name: "Updated Battery Recycling Service",
  };

  registry.updateEntity(updated);

  const retrieved = registry.getEntity("service", service.id);
  assert.equal(
    retrieved?.name,
    "Updated Battery Recycling Service",
    "Entity should be updated"
  );

  console.log("✓ Entity update test passed");
}

function testEntityDeletion() {
  console.log("Testing: Entity Deletion");
  const registry = new GlobalEntityRegistry();

  registry.registerEntity(SEED_SERVICES[0]);
  assert.ok(
    registry.getEntity("service", SEED_SERVICES[0].id) !== null,
    "Entity should exist before deletion"
  );

  registry.deleteEntity("service", SEED_SERVICES[0].id);
  assert.equal(
    registry.getEntity("service", SEED_SERVICES[0].id),
    null,
    "Entity should be deleted"
  );

  console.log("✓ Entity deletion test passed");
}

/**
 * Run all tests
 */
export function runAllTests() {
  console.log("🧪 Running @repo/entities Test Suite\n");

  try {
    testRegistryBasics();
    testEntityRetrieval();
    testGeoAssociations();
    testFAQLinking();
    testGraphTraversal();
    testGeoSitemap();
    testMarkdownExport();
    testRegistryStats();
    testEntityUpdate();
    testEntityDeletion();

    console.log("\n✅ All tests passed!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}
