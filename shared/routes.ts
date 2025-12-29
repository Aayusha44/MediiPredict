import { z } from 'zod';
import { 
  diabetesInputSchema, 
  heartInputSchema, 
  parkinsonsInputSchema,
  predictions 
} from './schema';

export { diabetesInputSchema, heartInputSchema, parkinsonsInputSchema };

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const predictionResponseSchema = z.object({
  prediction: z.string(), // "Positive" or "Negative" (or "Detected" / "Healthy")
  confidence: z.string(), // Percentage string e.g. "92.5%"
  riskLevel: z.enum(['Low', 'Medium', 'High']),
  details: z.string().optional(),
});

export const api = {
  predict: {
    diabetes: {
      method: 'POST' as const,
      path: '/api/predict/diabetes',
      input: diabetesInputSchema,
      responses: {
        200: predictionResponseSchema,
        400: errorSchemas.validation,
      },
    },
    heart: {
      method: 'POST' as const,
      path: '/api/predict/heart',
      input: heartInputSchema,
      responses: {
        200: predictionResponseSchema,
        400: errorSchemas.validation,
      },
    },
    parkinsons: {
      method: 'POST' as const,
      path: '/api/predict/parkinsons',
      input: parkinsonsInputSchema,
      responses: {
        200: predictionResponseSchema,
        400: errorSchemas.validation,
      },
    },
  },
  history: {
    list: {
      method: 'GET' as const,
      path: '/api/history',
      responses: {
        200: z.array(z.custom<typeof predictions.$inferSelect>()),
      },
    },
  }
};

export type PredictionResponse = z.infer<typeof predictionResponseSchema>;
