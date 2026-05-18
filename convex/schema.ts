import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tripExpenses: defineTable({
    tripKey: v.string(),
    expensesJson: v.string(),
    updatedAt: v.string(),
  }).index("by_tripKey", ["tripKey"]),
});
