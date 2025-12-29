import { Sidebar } from "@/components/Sidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePredictHeart } from "@/hooks/use-predictions";
import { heartInputSchema, type HeartInput } from "@shared/routes";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResultCard } from "@/components/ResultCard";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function HeartForm() {
  const { mutate, isPending, data, reset } = usePredictHeart();

  const form = useForm<HeartInput>({
    resolver: zodResolver(heartInputSchema),
    defaultValues: {
      age: 45,
      sex: 1,
      chestPainType: 0,
      restingBP: 120,
      cholesterol: 200,
      fastingBS: 0,
      restingECG: 1,
      maxHR: 150,
      exerciseAngina: 0,
      oldpeak: 1.0,
      stSlope: 1
    }
  });

  const onSubmit = (values: HeartInput) => {
    mutate(values);
  };

  const handleReset = () => {
    reset();
    form.reset();
  };

  return (
    <div className="min-h-screen bg-[#1f2121] text-foreground font-body">
      <Sidebar />
      <main className="lg:ml-72 p-4 md:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-red-500/10 rounded-xl text-red-400 border border-red-500/20">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white">Heart Disease Prediction</h1>
              <p className="text-muted-foreground">Comprehensive cardiovascular risk analysis.</p>
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
                    
                    <FormField
                      control={form.control}
                      name="sex"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Sex</FormLabel>
                          <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={field.value.toString()}>
                            <FormControl>
                              <SelectTrigger className="input-field">
                                <SelectValue placeholder="Select sex" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#1f2121] border-white/10 text-white">
                              <SelectItem value="1">Male</SelectItem>
                              <SelectItem value="0">Female</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="chestPainType"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel className="text-white/80">Chest Pain Type</FormLabel>
                          <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={field.value.toString()}>
                            <FormControl>
                              <SelectTrigger className="input-field">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#1f2121] border-white/10 text-white">
                              <SelectItem value="0">TA: Typical Angina</SelectItem>
                              <SelectItem value="1">ATA: Atypical Angina</SelectItem>
                              <SelectItem value="2">NAP: Non-Anginal Pain</SelectItem>
                              <SelectItem value="3">ASY: Asymptomatic</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="restingBP"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Resting BP</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="input-field" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cholesterol"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Cholesterol</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="input-field" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fastingBS"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Fasting BS {'>'} 120mg/dl</FormLabel>
                          <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={field.value.toString()}>
                            <FormControl>
                              <SelectTrigger className="input-field">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#1f2121] border-white/10 text-white">
                              <SelectItem value="1">True (1)</SelectItem>
                              <SelectItem value="0">False (0)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="restingECG"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Resting ECG</FormLabel>
                          <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={field.value.toString()}>
                            <FormControl>
                              <SelectTrigger className="input-field">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#1f2121] border-white/10 text-white">
                              <SelectItem value="0">Normal</SelectItem>
                              <SelectItem value="1">ST-T Wave Abnormality</SelectItem>
                              <SelectItem value="2">Left Ventricular Hypertrophy</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxHR"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Max Heart Rate</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="input-field" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="exerciseAngina"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Exercise Angina</FormLabel>
                          <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={field.value.toString()}>
                            <FormControl>
                              <SelectTrigger className="input-field">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#1f2121] border-white/10 text-white">
                              <SelectItem value="1">Yes</SelectItem>
                              <SelectItem value="0">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="oldpeak"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Oldpeak</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} className="input-field" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stSlope"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">ST Slope</FormLabel>
                          <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={field.value.toString()}>
                            <FormControl>
                              <SelectTrigger className="input-field">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#1f2121] border-white/10 text-white">
                              <SelectItem value="0">Upsloping</SelectItem>
                              <SelectItem value="1">Flat</SelectItem>
                              <SelectItem value="2">Downsloping</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full py-4 mt-8 rounded-xl font-semibold bg-gradient-to-r from-red-600 to-red-400 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                  <Heart className="w-16 h-16 text-muted-foreground mb-4" />
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
