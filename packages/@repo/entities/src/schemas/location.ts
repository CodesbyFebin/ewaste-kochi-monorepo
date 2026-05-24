import { z } from "zod";
import { LocationType } from "../types";

/**
 * Zod schema for validating LocationEntity data
 */
export const locationEntitySchema = z.object({
  id: z.string().min(1, "Location ID is required"),
  type: z.literal("location"),
  name: z.string().min(1, "Location name is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  metadata: z.record(z.unknown()).optional(),
  locationType: z.nativeEnum(LocationType),
  coordinates: z
    .object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    })
    .optional(),
  address: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode format").optional(),
  state: z.string().optional(),
  country: z.string().default("India"),
  servicesOffered: z
    .array(
      z.object({
        type: z.literal("service"),
        id: z.string(),
      })
    )
    .default([]),
  parentLocation: z
    .object({
      type: z.literal("location"),
      id: z.string(),
    })
    .optional(),
  childLocations: z
    .array(
      z.object({
        type: z.literal("location"),
        id: z.string(),
      })
    )
    .default([]),
  contactInfo: z
    .object({
      phone: z.string().optional(),
      email: z.string().email().optional(),
      website: z.string().url().optional(),
    })
    .optional(),
});

export type LocationEntityInput = z.infer<typeof locationEntitySchema>;

/**
 * Predefined locations in India
 */
export const PREDEFINED_LOCATIONS = {
  states: {
    kerala: {
      id: "location_kerala",
      name: "Kerala",
      state: "Kerala",
      locationType: LocationType.STATE,
      slug: "kerala",
      description: "E-waste management services across Kerala",
    },
    maharashtra: {
      id: "location_maharashtra",
      name: "Maharashtra",
      state: "Maharashtra",
      locationType: LocationType.STATE,
      slug: "maharashtra",
      description: "E-waste management services across Maharashtra",
    },
    tamil_nadu: {
      id: "location_tamil_nadu",
      name: "Tamil Nadu",
      state: "Tamil Nadu",
      locationType: LocationType.STATE,
      slug: "tamil-nadu",
      description: "E-waste management services across Tamil Nadu",
    },
    karnataka: {
      id: "location_karnataka",
      name: "Karnataka",
      state: "Karnataka",
      locationType: LocationType.STATE,
      slug: "karnataka",
      description: "E-waste management services across Karnataka",
    },
  },
  cities: {
    kochi: {
      id: "location_kochi",
      name: "Kochi",
      state: "Kerala",
      locationType: LocationType.CITY,
      slug: "kochi",
      pincode: "682001",
      coordinates: {
        latitude: 9.9312,
        longitude: 76.2673,
      },
      description: "E-waste management hub in Kochi, Kerala",
      parentLocation: { type: "location" as const, id: "location_kerala" },
    },
    mumbai: {
      id: "location_mumbai",
      name: "Mumbai",
      state: "Maharashtra",
      locationType: LocationType.CITY,
      slug: "mumbai",
      pincode: "400001",
      coordinates: {
        latitude: 19.076,
        longitude: 72.8777,
      },
      description: "E-waste management services in Mumbai, Maharashtra",
      parentLocation: { type: "location" as const, id: "location_maharashtra" },
    },
    bangalore: {
      id: "location_bangalore",
      name: "Bangalore",
      state: "Karnataka",
      locationType: LocationType.CITY,
      slug: "bangalore",
      pincode: "560001",
      coordinates: {
        latitude: 12.9716,
        longitude: 77.5946,
      },
      description: "E-waste management services in Bangalore, Karnataka",
      parentLocation: { type: "location" as const, id: "location_karnataka" },
    },
    chennai: {
      id: "location_chennai",
      name: "Chennai",
      state: "Tamil Nadu",
      locationType: LocationType.CITY,
      slug: "chennai",
      pincode: "600001",
      coordinates: {
        latitude: 13.0827,
        longitude: 80.2707,
      },
      description: "E-waste management services in Chennai, Tamil Nadu",
      parentLocation: { type: "location" as const, id: "location_tamil_nadu" },
    },
  },
  serviceCenters: {
    kochi_main: {
      id: "service_center_kochi_main",
      name: "Kochi Main Service Center",
      state: "Kerala",
      locationType: LocationType.SERVICE_CENTER,
      slug: "kochi-main",
      address: "High Tech Park, Kakkanad, Kochi",
      pincode: "682030",
      coordinates: {
        latitude: 9.9856,
        longitude: 76.3118,
      },
      contactInfo: {
        phone: "+91-484-XXXX-XXXX",
        email: "kochi@ewastekochi.com",
      },
      description: "Main e-waste processing facility in Kochi",
      parentLocation: { type: "location" as const, id: "location_kochi" },
    },
    mumbai_processing: {
      id: "service_center_mumbai_processing",
      name: "Mumbai Processing Center",
      state: "Maharashtra",
      locationType: LocationType.SERVICE_CENTER,
      slug: "mumbai-processing",
      address: "MIDC, Mahape, Navi Mumbai",
      pincode: "400710",
      coordinates: {
        latitude: 19.0298,
        longitude: 73.1345,
      },
      contactInfo: {
        phone: "+91-22-XXXX-XXXX",
        email: "mumbai@ewastekochi.com",
      },
      description: "E-waste processing facility in Mumbai",
      parentLocation: { type: "location" as const, id: "location_mumbai" },
    },
  },
};
