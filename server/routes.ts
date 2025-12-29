import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api, predictionResponseSchema, type PredictionResponse } from "@shared/routes";
import { z } from "zod";

// Simulated ML Models (Random Forest Logic Stubs)
// In a real scenario, we would load the .pkl files using a Python shell or TensorFlow.js
// For MVP, we simulate the logic based on known risk factors to provide realistic feedback.

function simulateDiabetesPrediction(input: z.infer<typeof api.predict.diabetes.input>): PredictionResponse {
  let score = 0;
  // Simple heuristic based on common diabetic indicators
  if (input.glucose > 140) score += 3;
  if (input.bmi > 30) score += 2;
  if (input.age > 45) score += 1;
  if (input.diabetesPedigreeFunction > 0.5) score += 1;
  if (input.pregnancies > 8) score += 1;
  
  const probability = Math.min(0.98, Math.max(0.02, (score / 8) * 0.9 + 0.1));
  const isPositive = probability > 0.5;

  return {
    prediction: isPositive ? "Positive (Diabetic)" : "Negative (Healthy)",
    confidence: (probability * 100).toFixed(1) + "%",
    riskLevel: probability > 0.7 ? "High" : probability > 0.4 ? "Medium" : "Low",
    details: isPositive 
      ? "High glucose levels and BMI indicate significant risk." 
      : "Values are within normal ranges."
  };
}

function simulateHeartPrediction(input: z.infer<typeof api.predict.heart.input>): PredictionResponse {
  let score = 0;
  if (input.chestPainType > 0) score += 2;
  if (input.maxHR < 140 && input.age < 60) score += 1;
  if (input.oldpeak > 1.5) score += 2;
  if (input.sex === 1 && input.age > 45) score += 1;
  if (input.exerciseAngina === 1) score += 1;

  const probability = Math.min(0.99, Math.max(0.05, (score / 7) * 0.9 + 0.05));
  const isPositive = probability > 0.5;

  return {
    prediction: isPositive ? "Heart Disease Detected" : "Normal",
    confidence: (probability * 100).toFixed(1) + "%",
    riskLevel: probability > 0.7 ? "High" : probability > 0.4 ? "Medium" : "Low",
    details: isPositive
      ? "Symptoms including chest pain and exercise angina suggest cardiovascular issues."
      : "Cardiovascular markers appear stable."
  };
}

function simulateParkinsonsPrediction(input: z.infer<typeof api.predict.parkinsons.input>): PredictionResponse {
  // Parkinson's is complex, but higher jitter/shimmer often indicates issues
  let score = 0;
  if (input.mdvpJitterPct > 0.006) score += 1;
  if (input.mdvpShimmer > 0.03) score += 1;
  if (input.nhr > 0.02) score += 1;
  if (input.ppe > 0.2) score += 2;
  if (input.spread1 < -4) score -= 1; // Lower spread1 is usually healthier in some datasets

  const probability = Math.min(0.99, Math.max(0.01, (score / 5) * 0.8 + 0.2));
  const isPositive = probability > 0.5;

  return {
    prediction: isPositive ? "Parkinson's Detected" : "Healthy",
    confidence: (probability * 100).toFixed(1) + "%",
    riskLevel: probability > 0.7 ? "High" : probability > 0.4 ? "Medium" : "Low",
    details: isPositive
      ? "Vocal signal analysis shows high jitter and shimmer values consistent with Parkinson's."
      : "Vocal features are within healthy parameters."
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Diabetes Prediction
  app.post(api.predict.diabetes.path, async (req, res) => {
    try {
      const input = api.predict.diabetes.input.parse(req.body);
      const result = simulateDiabetesPrediction(input);
      
      // Log to DB
      await storage.createPrediction({
        disease: 'diabetes',
        inputData: input,
        result: result.prediction,
        confidence: result.confidence.replace('%', '')
      });

      res.json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid Input", details: err.errors });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // Heart Prediction
  app.post(api.predict.heart.path, async (req, res) => {
    try {
      const input = api.predict.heart.input.parse(req.body);
      const result = simulateHeartPrediction(input);

      await storage.createPrediction({
        disease: 'heart',
        inputData: input,
        result: result.prediction,
        confidence: result.confidence.replace('%', '')
      });

      res.json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid Input", details: err.errors });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // Parkinson's Prediction
  app.post(api.predict.parkinsons.path, async (req, res) => {
    try {
      const input = api.predict.parkinsons.input.parse(req.body);
      const result = simulateParkinsonsPrediction(input);

      await storage.createPrediction({
        disease: 'parkinsons',
        inputData: input,
        result: result.prediction,
        confidence: result.confidence.replace('%', '')
      });

      res.json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid Input", details: err.errors });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // History Endpoint
  app.get(api.history.list.path, async (req, res) => {
    const history = await storage.getPredictions();
    res.json(history);
  });

  return httpServer;
}
