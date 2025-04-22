import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  uploads: defineTable({
    userId: v.string(),
    storageId: v.string(),
    filename: v.string(),
    contentType: v.string(),
    size: v.number(),
    createdAt: v.string(),
  }),
});
