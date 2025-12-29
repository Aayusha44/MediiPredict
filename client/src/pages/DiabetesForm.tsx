import { Sidebar } from "@/components/Sidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePredictDiabetes } from "@/hooks/use-predictions";
import { diabetesInputSchema, type DiabetesInput } from "@shared/routes";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResultCard } from "@/components/ResultCard";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function DiabetesForm() {
  const { mutate, isPending, data, reset } = usePredictDiabetes();

  const form = useForm<DiabetesInput>({
    resolver: zodResolver(diabetesInputSchema),
    defaultValues: {
      pregnancies: 0,
      glucose: 120,
      bloodPressure: 70,
      skinThickness: 20,
      insulin: 79,
      bmi: 25,
      diabetesPedigreeFunction: 0.5,
      age: 30
    }
  });

  const onSubmit = (values: DiabetesInput) => {
    mutate(values);
  };

  const handleReset = () => {
    reset(); // Reset mutation state
    form.reset(); // Reset form values
  };

  return (
    <div className="min-h-screen bg-[#1f2121] text-foreground font-body">
      <Sidebar />
      <main className="lg:ml-72 p-4 md:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white">Diabetes Prediction</h1>
              <p className="text-muted-foreground">Enter patient metrics to analyze diabetes risk.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 md:p-8 rounded-2xl h-fit"
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="pregnancies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Pregnancies</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="input-field" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="glucose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Glucose Level</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="input-field" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bloodPressure"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Blood Pressure</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="input-field" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="skinThickness"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Skin Thickness</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="input-field" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="insulin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Insulin</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="input-field" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bmi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">BMI</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} className="input-field" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="diabetesPedigreeFunction"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Pedigree Function</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.001" {...field} className="input-field" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Age</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="input-field" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full py-4 mt-8 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isPending ? "Analyzing..." : "Analyze Risk"}
                  </button>
                </form>
              </Form>
            </motion.div>

            {/* Result Section */}
            <div className="lg:sticky lg:top-8 h-fit space-y-6">
              <ResultCard 
                result={data || null} 
                loading={isPending} 
                onReset={handleReset} 
              />
              
              {!data && !isPending && (
                <div className="glass-card p-8 rounded-2xl border-dashed border-2 border-white/10 flex flex-col items-center justify-center text-center opacity-50 min-h-[300px]">
                  <Activity className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-white">Ready to Analyze</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mt-2">Fill out the patient form on the left to generate a risk assessment report.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
