import { db } from "./db";
import { predictions, type InsertPrediction } from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  createPrediction(prediction: InsertPrediction): Promise<void>;
  getPredictions(): Promise<typeof predictions.$inferSelect[]>;
}

export class DatabaseStorage implements IStorage {
  async createPrediction(prediction: InsertPrediction): Promise<void> {
    await db.insert(predictions).values(prediction);
  }

  async getPredictions(): Promise<typeof predictions.$inferSelect[]> {
    return await db.select().from(predictions).orderBy(desc(predictions.createdAt)).limit(50);
  }
}

export const storage = new DatabaseStorage();
