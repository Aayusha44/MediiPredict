import { Sidebar } from "@/components/Sidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePredictParkinsons } from "@/hooks/use-predictions";
import { parkinsonsInputSchema, type ParkinsonsInput } from "@shared/routes";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResultCard } from "@/components/ResultCard";
import { Brain } from "lucide-react";
import { motion } from "framer-motion";

export default function ParkinsonsForm() {
  const { mutate, isPending, data, reset } = usePredictParkinsons();

  const form = useForm<ParkinsonsInput>({
    resolver: zodResolver(parkinsonsInputSchema),
    defaultValues: {
      mdvpFo: 119.992,
      mdvpFhi: 157.302,
      mdvpFlo: 74.997,
      mdvpJitterPct: 0.00784,
      mdvpJitterAbs: 0.00007,
      mdvpRap: 0.0037,
      mdvpPpq: 0.00554,
      jitterDdp: 0.01109,
      mdvpShimmer: 0.04374,
      mdvpShimmerDb: 0.426,
      shimmerApq3: 0.02182,
      shimmerApq5: 0.0313,
      mdvpApq: 0.02971,
      shimmerDda: 0.06545,
      nhr: 0.02211,
      hnr: 21.033,
      rpde: 0.414783,
      dfa: 0.815285,
      spread1: -4.813031,
      spread2: 0.266482,
      d2: 2.301442,
      ppe: 0.284654
    }
  });

  const onSubmit = (values: ParkinsonsInput) => {
    mutate(values);
  };

  const handleReset = () => {
    reset();
    form.reset();
  };

  // Helper to render groups of inputs
  const renderField = (name: keyof ParkinsonsInput, label: string) => (
    <FormField
      key={name}
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white/70 text-xs uppercase tracking-wide">{label}</FormLabel>
          <FormControl>
            <Input type="number" step="0.000001" {...field} className="input-field text-sm py-2" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className="min-h-screen bg-[#1f2121] text-foreground font-body">
      <Sidebar />
      <main className="lg:ml-72 p-4 md:p-8 lg:p-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white">Parkinson's Prediction</h1>
              <p className="text-muted-foreground">Voice measurement analysis for early detection.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Form - Spans 2 cols */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 glass-card p-6 md:p-8 rounded-2xl h-fit"
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  
                  {/* Section 1: Frequency */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                      Frequency Measures (Hz)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {renderField("mdvpFo", "Average (Fo)")}
                      {renderField("mdvpFhi", "Maximum (Fhi)")}
                      {renderField("mdvpFlo", "Minimum (Flo)")}
                    </div>
                  </div>

                  <div className="border-t border-white/10 my-6"></div>

                  {/* Section 2: Jitter */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                      Jitter Measures
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {renderField("mdvpJitterPct", "Jitter (%)")}
                      {renderField("mdvpJitterAbs", "Jitter (Abs)")}
                      {renderField("mdvpRap", "RAP")}
                      {renderField("mdvpPpq", "PPQ")}
                      {renderField("jitterDdp", "DDP")}
                    </div>
                  </div>

                  <div className="border-t border-white/10 my-6"></div>

                  {/* Section 3: Shimmer */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                      Shimmer Measures
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {renderField("mdvpShimmer", "Shimmer")}
                      {renderField("mdvpShimmerDb", "Shimmer (dB)")}
                      {renderField("shimmerApq3", "APQ3")}
                      {renderField("shimmerApq5", "APQ5")}
                      {renderField("mdvpApq", "APQ")}
                      {renderField("shimmerDda", "DDA")}
                    </div>
                  </div>

                  <div className="border-t border-white/10 my-6"></div>

                  {/* Section 4: Complexity */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                      Complexity & Spread
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {renderField("nhr", "NHR")}
                      {renderField("hnr", "HNR")}
                      {renderField("rpde", "RPDE")}
                      {renderField("dfa", "DFA")}
                      {renderField("spread1", "Spread 1")}
                      {renderField("spread2", "Spread 2")}
                      {renderField("d2", "D2")}
                      {renderField("ppe", "PPE")}
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full py-4 mt-8 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isPending ? "Analyzing..." : "Analyze Risk"}
                  </button>
                </form>
              </Form>
            </motion.div>

            {/* Result Section - Spans 1 col */}
            <div className="lg:col-span-1 lg:sticky lg:top-8 h-fit space-y-6">
              <ResultCard 
                result={data || null} 
                loading={isPending} 
                onReset={handleReset} 
              />
              
              {!data && !isPending && (
                <div className="glass-card p-8 rounded-2xl border-dashed border-2 border-white/10 flex flex-col items-center justify-center text-center opacity-50 min-h-[300px]">
                  <Brain className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-white">Ready to Analyze</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mt-2">Fill out the patient form on the left to generate a risk assessment report.</p>
                </div>
              )}

              {/* Info Card */}
              <div className="glass-card p-6 rounded-2xl text-sm text-muted-foreground">
                <h4 className="text-white font-medium mb-2">About Parkinson's Metrics</h4>
                <p>
                  These metrics analyze vocal fundamental frequency variation. Significant deviations in jitter, shimmer, and spread can indicate neurological conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
