import { pgTable, text, serial, integer, numeric, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We'll use a generic 'predictions' table to log history if needed
export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  disease: text("disease").notNull(), // 'diabetes', 'heart', 'parkinsons'
  inputData: jsonb("input_data").notNull(),
  result: text("result").notNull(),
  confidence: numeric("confidence").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({ 
  id: true, 
  createdAt: true 
});

// === Input Schemas for Disease Forms ===

// 1. Diabetes (8 fields)
export const diabetesInputSchema = z.object({
  pregnancies: z.coerce.number().min(0).max(20),
  glucose: z.coerce.number().min(0).max(500),
  bloodPressure: z.coerce.number().min(0).max(200),
  skinThickness: z.coerce.number().min(0).max(100),
  insulin: z.coerce.number().min(0).max(1000),
  bmi: z.coerce.number().min(0).max(100),
  diabetesPedigreeFunction: z.coerce.number().min(0).max(3),
  age: z.coerce.number().min(0).max(120),
});

// 2. Heart Disease (11 fields)
export const heartInputSchema = z.object({
  age: z.coerce.number().min(0).max(120),
  sex: z.coerce.number().int().min(0).max(1), // 0 or 1
  chestPainType: z.coerce.number().min(0).max(4),
  restingBP: z.coerce.number().min(0).max(250),
  cholesterol: z.coerce.number().min(0).max(600),
  fastingBS: z.coerce.number().min(0).max(1),
  restingECG: z.coerce.number().min(0).max(2),
  maxHR: z.coerce.number().min(0).max(250),
  exerciseAngina: z.coerce.number().min(0).max(1),
  oldpeak: z.coerce.number().min(0).max(10),
  stSlope: z.coerce.number().min(0).max(3),
});

// 3. Parkinson's (22 fields)
export const parkinsonsInputSchema = z.object({
  mdvpFo: z.coerce.number(),      // MDVP:Fo(Hz)
  mdvpFhi: z.coerce.number(),     // MDVP:Fhi(Hz)
  mdvpFlo: z.coerce.number(),     // MDVP:Flo(Hz)
  mdvpJitterPct: z.coerce.number(), // MDVP:Jitter(%)
  mdvpJitterAbs: z.coerce.number(), // MDVP:Jitter(Abs)
  mdvpRap: z.coerce.number(),     // MDVP:RAP
  mdvpPpq: z.coerce.number(),     // MDVP:PPQ
  jitterDdp: z.coerce.number(),   // Jitter:DDP
  mdvpShimmer: z.coerce.number(), // MDVP:Shimmer
  mdvpShimmerDb: z.coerce.number(), // MDVP:Shimmer(dB)
  shimmerApq3: z.coerce.number(), // Shimmer:APQ3
  shimmerApq5: z.coerce.number(), // Shimmer:APQ5
  mdvpApq: z.coerce.number(),     // MDVP:APQ
  shimmerDda: z.coerce.number(),  // Shimmer:DDA
  nhr: z.coerce.number(),         // NHR
  hnr: z.coerce.number(),         // HNR
  rpde: z.coerce.number(),        // RPDE
  dfa: z.coerce.number(),         // DFA
  spread1: z.coerce.number(),     // spread1
  spread2: z.coerce.number(),     // spread2
  d2: z.coerce.number(),          // D2
  ppe: z.coerce.number(),         // PPE
});

export type DiabetesInput = z.infer<typeof diabetesInputSchema>;
export type HeartInput = z.infer<typeof heartInputSchema>;
export type ParkinsonsInput = z.infer<typeof parkinsonsInputSchema>;
export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
