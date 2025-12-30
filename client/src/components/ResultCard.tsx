import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PredictionResponse } from "@shared/routes";

interface ResultCardProps {
  result: PredictionResponse | null;
  loading: boolean;
  onReset: () => void;
}

export function ResultCard({ result, loading, onReset }: ResultCardProps) {
  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Analyzing Data...</h3>
        <p className="text-muted-foreground">Running ML prediction model</p>
      </div>
    );
  }

  if (!result) return null;

  const isRisk = result.prediction.toLowerCase().includes("positive") || 
                 result.prediction.toLowerCase().includes("detected") ||
                 result.prediction.toLowerCase().includes("risk") ||
                 result.riskLevel === "High";
  const confidenceVal = parseFloat(result.confidence);
  
  // Dynamic colors based on risk level
  const statusColor = isRisk ? "text-red-400" : "text-emerald-400";
  const statusBg = isRisk ? "bg-red-500/10 border-red-500/20" : "bg-emerald-500/10 border-emerald-500/20";
  const Icon = isRisk ? AlertCircle : CheckCircle2;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl overflow-hidden border border-white/10"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-display font-semibold text-white">Analysis Result</h3>
            <span className={cn("px-4 py-1.5 rounded-full text-sm font-medium border", statusBg, statusColor)}>
              {result.riskLevel} Risk
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-8">
            <div className={cn("relative flex items-center justify-center w-32 h-32 rounded-full border-4", isRisk ? "border-red-500/20 bg-red-500/5" : "border-emerald-500/20 bg-emerald-500/5")}>
              <Icon className={cn("w-16 h-16", statusColor)} />
            </div>
            
            <div className="text-center md:text-left">
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Prediction</div>
              <div className={cn("text-4xl font-display font-bold mb-2", statusColor)}>
                {result.prediction}
              </div>
              <p className="text-muted-foreground max-w-sm">{result.details || "Our advanced analysis has processed your health metrics."}</p>
            </div>
          </div>

          {/* Confidence Bar */}
          <div className="bg-black/20 rounded-xl p-6 mb-8 relative overflow-hidden group">
            <motion.div 
              className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"
              initial={false}
            />
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-muted-foreground">Analysis Confidence</span>
              <span className="text-2xl font-bold text-white">{result.confidence}</span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: result.confidence }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className={cn("h-full rounded-full shadow-[0_0_12px_rgba(0,0,0,0.2)]", isRisk ? "bg-gradient-to-r from-red-600 to-red-400" : "bg-gradient-to-r from-emerald-600 to-emerald-400")}
              />
            </div>
          </div>

          <button
            onClick={onReset}
            className="w-full py-4 rounded-xl font-semibold bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
          >
            Run Another Analysis
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
