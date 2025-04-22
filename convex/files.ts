import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("You must be logged in to upload files");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const saveUpload = mutation({
  args: {
    storageId: v.string(),
    filename: v.string(),
    contentType: v.string(),
    size: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("You must be logged in to upload files");
    }

    const userId = identity.subject;

    const uploadId = await ctx.db.insert("uploads", {
      storageId: args.storageId,
      userId,
      filename: args.filename,
      contentType: args.contentType,
      size: args.size,
      createdAt: new Date().toISOString(),
    });

    return uploadId;
  },
});

export const listUploads = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("You must be logged in to view uploads");
    }

    const userId = identity.subject;

    const uploads = await ctx.db
      .query("uploads")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .collect();

    return uploads;
  },
});

export const getFileDetails = query({
  args: { fileId: v.id("uploads") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("You must be logged in to view file details");
    }

    const upload = await ctx.db.get(args.fileId);

    if (!upload) {
      throw new ConvexError("File not found");
    }

    if (upload.userId !== identity.subject) {
      throw new ConvexError("You don't have access to this file");
    }

    return upload;
  },
});

export const getFileUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("You must be logged in to access files");
    }

    const uploads = await ctx.db
      .query("uploads")
      .filter((q) =>
        q.and(
          q.eq(q.field("storageId"), args.storageId),
          q.eq(q.field("userId"), identity.subject)
        )
      )
      .collect();

    if (uploads.length === 0) {
      throw new ConvexError("You don't have access to this file");
    }

    return await ctx.storage.getUrl(args.storageId);
  },
});

export const deleteFile = mutation({
  args: { fileId: v.id("uploads") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("You must be logged in to delete files");
    }

    const upload = await ctx.db.get(args.fileId);

    if (!upload) {
      throw new ConvexError("File not found");
    }

    if (upload.userId !== identity.subject) {
      throw new ConvexError("You don't have access to this file");
    }

    await ctx.storage.delete(upload.storageId);

    await ctx.db.delete(args.fileId);
  },
});
