import { z } from "zod";
import stages from "@/data/stages.json";

// data/stages.json is the source of truth for valid stage values (includes
// "Unknown" for digimon not yet classified in the encyclopedia, and "Xros
// Wars" as its own entry alongside power-level stages, matching how the
// encyclopedia itself classifies them).
export const StageSchema = z.enum(stages as [string, ...string[]]);

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  stage: z.array(StageSchema),
});

export const ProductArraySchema = z.array(ProductSchema);

export const RelationshipEdgeSchema = z.object({
  from: z.number(),
  to: z.number(),
});

export const RelationshipEdgeArraySchema = z.array(RelationshipEdgeSchema);
