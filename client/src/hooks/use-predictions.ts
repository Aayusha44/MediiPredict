import { useMutation, useQuery } from "@tanstack/react-query";
import { 
  api, 
  type PredictionResponse, 
  type DiabetesInput, 
  type HeartInput, 
  type ParkinsonsInput 
} from "@shared/routes";

// === POST: Diabetes Prediction ===
export function usePredictDiabetes() {
  return useMutation({
    mutationFn: async (data: DiabetesInput) => {
      // Coerce inputs to numbers (handled by zod schema but safe to ensure here if raw form)
      const res = await fetch(api.predict.diabetes.path, {
        method: api.predict.diabetes.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Prediction failed');
      }

      return api.predict.diabetes.responses[200].parse(await res.json());
    },
  });
}

// === POST: Heart Prediction ===
export function usePredictHeart() {
  return useMutation({
    mutationFn: async (data: HeartInput) => {
      const res = await fetch(api.predict.heart.path, {
        method: api.predict.heart.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Prediction failed');
      }

      return api.predict.heart.responses[200].parse(await res.json());
    },
  });
}

// === POST: Parkinsons Prediction ===
export function usePredictParkinsons() {
  return useMutation({
    mutationFn: async (data: ParkinsonsInput) => {
      const res = await fetch(api.predict.parkinsons.path, {
        method: api.predict.parkinsons.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Prediction failed');
      }

      return api.predict.parkinsons.responses[200].parse(await res.json());
    },
  });
}

// === GET: History List (Optional for dashboard stats) ===
export function useHistory() {
  return useQuery({
    queryKey: [api.history.list.path],
    queryFn: async () => {
      const res = await fetch(api.history.list.path);
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.history.list.responses[200].parse(await res.json());
    },
  });
}
