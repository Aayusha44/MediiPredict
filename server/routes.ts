import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api, predictionResponseSchema, type PredictionResponse } from "@shared/routes";
import { z } from "zod";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

// Helper to run python prediction
async function runPythonPrediction(modelName: string, features: number[]): Promise<PredictionResponse> {
  return new Promise((resolve, reject) => {
    const modelPath = path.join(process.cwd(), "models", `${modelName}_model.pkl`);
    
    // Check if model exists, fallback to simulation if not
    if (!fs.existsSync(modelPath)) {
      console.warn(`Model ${modelName} not found at ${modelPath}, falling back to simulation.`);
      if (modelName === 'diabetes') return resolve(simulateDiabetesPrediction(features as any));
      if (modelName === 'heart') return resolve(simulateHeartPrediction(features as any));
      if (modelName === 'parkinson') return resolve(simulateParkinsonsPrediction(features as any));
    }

    const pythonScript = `
import joblib
import numpy as np
import sys
import json

try:
    model = joblib.load("${modelPath}")
    features = np.array(${JSON.stringify(features)}).reshape(1, -1)
    pred = int(model.predict(features)[0])
    prob = float(model.predict_proba(features)[0].max())
    
    result = {
        "prediction": pred,
        "probability": prob
    }
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({"error": str(e)}))
`;

    const py = spawn("python3", ["-c", pythonScript]);
    let output = "";

    py.stdout.on("data", (data) => {
      output += data.toString();
    });

    py.on("close", (code) => {
      try {
        const result = JSON.parse(output);
        if (result.error) throw new Error(result.error);
        
        const isPositive = result.prediction === 1;
        let predictionText = "";
        if (modelName === 'diabetes') predictionText = isPositive ? "Positive (Diabetic)" : "Negative (Healthy)";
        if (modelName === 'heart') predictionText = isPositive ? "Heart Disease Detected" : "Normal";
        if (modelName === 'parkinson') predictionText = isPositive ? "Parkinson's Detected" : "Healthy";

        resolve({
          prediction: predictionText,
          confidence: (result.probability * 100).toFixed(1) + "%",
          riskLevel: result.probability > 0.7 ? "High" : result.probability > 0.4 ? "Medium" : "Low",
          details: `Model analysis completed with ${ (result.probability * 100).toFixed(1) }% confidence.`
        });
      } catch (e) {
        reject(e);
      }
    });
  });
}

function simulateDiabetesPrediction(input: any): PredictionResponse {
  const values = Array.isArray(input) ? input : [input.glucose, input.bmi, input.age];
  const glucose = Array.isArray(input) ? input[1] : input.glucose;
  let score = 0;
  if (glucose > 140) score += 3;
  const probability = Math.min(0.98, Math.max(0.02, (score / 8) * 0.9 + 0.1));
  return {
    prediction: probability > 0.5 ? "Positive (Diabetic)" : "Negative (Healthy)",
    confidence: (probability * 100).toFixed(1) + "%",
    riskLevel: probability > 0.7 ? "High" : probability > 0.4 ? "Medium" : "Low",
    details: "Simulated result (Model not trained yet)"
  };
}

function simulateHeartPrediction(input: any): PredictionResponse {
  const probability = 0.5;
  return {
    prediction: "Normal",
    confidence: "50.0%",
    riskLevel: "Low",
    details: "Simulated result (Model not trained yet)"
  };
}

function simulateParkinsonsPrediction(input: any): PredictionResponse {
  const probability = 0.5;
  return {
    prediction: "Healthy",
    confidence: "50.0%",
    riskLevel: "Low",
    details: "Simulated result (Model not trained yet)"
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.predict.diabetes.path, async (req, res) => {
    try {
      const input = api.predict.diabetes.input.parse(req.body);
      const features = [
        input.pregnancies, input.glucose, input.bloodPressure, 
        input.skinThickness, input.insulin, input.bmi, 
        input.diabetesPedigreeFunction, input.age
      ];
      const result = await runPythonPrediction('diabetes', features);
      
      await storage.createPrediction({
        disease: 'diabetes',
        inputData: input,
        result: result.prediction,
        confidence: result.confidence.replace('%', '')
      });

      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Prediction Error" });
    }
  });

  app.post(api.predict.heart.path, async (req, res) => {
    try {
      const input = api.predict.heart.input.parse(req.body);
      const features = [
        input.age, input.sex, input.chestPainType, input.restingBP,
        input.cholesterol, input.fastingBS, input.restingECG,
        input.maxHR, input.exerciseAngina, input.oldpeak, input.stSlope
      ];
      const result = await runPythonPrediction('heart', features);

      await storage.createPrediction({
        disease: 'heart',
        inputData: input,
        result: result.prediction,
        confidence: result.confidence.replace('%', '')
      });

      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Prediction Error" });
    }
  });

  app.post(api.predict.parkinsons.path, async (req, res) => {
    try {
      const input = api.predict.parkinsons.input.parse(req.body);
      const features = [
        input.mdvpFo, input.mdvpFhi, input.mdvpFlo, input.mdvpJitterPct,
        input.mdvpJitterAbs, input.mdvpRap, input.mdvpPpq, input.jitterDdp,
        input.mdvpShimmer, input.mdvpShimmerDb, input.shimmerApq3,
        input.shimmerApq5, input.mdvpApq, input.shimmerDda, input.nhr,
        input.hnr, input.rpde, input.dfa, input.spread1, input.spread2,
        input.d2, input.ppe
      ];
      const result = await runPythonPrediction('parkinson', features);

      await storage.createPrediction({
        disease: 'parkinsons',
        inputData: input,
        result: result.prediction,
        confidence: result.confidence.replace('%', '')
      });

      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Prediction Error" });
    }
  });

  app.get(api.history.list.path, async (req, res) => {
    const history = await storage.getPredictions();
    res.json(history);
  });

  return httpServer;
}

