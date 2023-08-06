import { z } from "https://deno.land/x/zod@v3.19.1/mod.ts";

export const RemBaseSchema = z.object({
  Bookmarked: z.boolean(),
  ID: z.string().uuid(),
  ModifiedClient: z.string(),
  Parent: z.string(),
  Type: z.enum(["CollectionType", "DocumentType"]),
  Version: z.number().optional(),
  VissibleName: z.string(),
  tags: z.array(z.string()),
});

export const RemDocumentSchema = RemBaseSchema.extend({
  Type: z.literal("CollectionType"),
});

export const RemFileSchema = RemBaseSchema.extend({
  CurrentPage: z.number().int().default(0),
  Type: z.literal("DocumentType"),
  fileType: z.enum(["notebook", "pdf", "epub"]),

  pageCount: z.number().int(),
  pages: z.array(z.string()).nullish(),
  sizeInBytes: z.string(),
});

export const RemEntitySchema = z.union([RemFileSchema, RemDocumentSchema]);
export type RemEntity = z.infer<typeof RemEntitySchema>;

export const RemEntityArraySchema = z.array(RemEntitySchema);
export type RemEntityArray = z.infer<typeof RemEntityArraySchema>;