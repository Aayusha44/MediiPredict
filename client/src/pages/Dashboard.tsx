import { Sidebar } from "@/components/Sidebar";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Activity, Heart, Brain, ArrowRight, TrendingUp, Users, Database } from "lucide-react";

export default function Dashboard() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#1f2121] text-foreground font-body">
      <Sidebar />
      <main className="lg:ml-72 p-4 md:p-8 lg:p-12">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-7xl mx-auto space-y-12"
        >
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
              Welcome Back, <span className="text-gradient">Doctor</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              MediPredict utilizes advanced machine learning algorithms to assist in early disease detection with high accuracy.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={item} className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Database className="w-24 h-24 text-primary" />
              </div>
              <div className="relative z-10">
                <div className="p-3 bg-primary/10 w-fit rounded-xl mb-4">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">3 Models</h3>
                <p className="text-sm text-muted-foreground">Active Prediction Engines</p>
              </div>
            </motion.div>

            <motion.div variants={item} className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp className="w-24 h-24 text-emerald-500" />
              </div>
              <div className="relative z-10">
                <div className="p-3 bg-emerald-500/10 w-fit rounded-xl mb-4">
                  <TrendingUp className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">95%</h3>
                <p className="text-sm text-muted-foreground">Average Accuracy Rate</p>
              </div>
            </motion.div>

            <motion.div variants={item} className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users className="w-24 h-24 text-blue-500" />
              </div>
              <div className="relative z-10">
                <div className="p-3 bg-blue-500/10 w-fit rounded-xl mb-4">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">1,266</h3>
                <p className="text-sm text-muted-foreground">Patient Records Analyzed</p>
              </div>
            </motion.div>
          </div>

          {/* Disease Selection Cards */}
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-semibold text-white">Diagnostic Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Diabetes Card */}
              <Link href="/diabetes">
                <motion.div variants={item} className="glass-card p-1 rounded-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300 group h-full">
                  <div className="bg-[#1f2121]/50 p-6 rounded-xl h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                        <Activity className="w-8 h-8" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Diabetes</h3>
                    <p className="text-sm text-muted-foreground mb-6 flex-1">
                      Predict the likelihood of diabetes based on diagnostic measurements like glucose, BMI, and insulin levels.
                    </p>
                    <div className="text-xs font-medium text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full w-fit">
                      8 Input Parameters
                    </div>
                  </div>
                </motion.div>
              </Link>

              {/* Heart Card */}
              <Link href="/heart">
                <motion.div variants={item} className="glass-card p-1 rounded-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300 group h-full">
                  <div className="bg-[#1f2121]/50 p-6 rounded-xl h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-red-500/20 rounded-xl text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                        <Heart className="w-8 h-8" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">Heart Disease</h3>
                    <p className="text-sm text-muted-foreground mb-6 flex-1">
                      Analyze cardiovascular health indicators including cholesterol, resting BP, and chest pain types.
                    </p>
                    <div className="text-xs font-medium text-red-400 bg-red-500/10 px-3 py-1 rounded-full w-fit">
                      11 Input Parameters
                    </div>
                  </div>
                </motion.div>
              </Link>

              {/* Parkinsons Card */}
              <Link href="/parkinsons">
                <motion.div variants={item} className="glass-card p-1 rounded-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-300 group h-full">
                  <div className="bg-[#1f2121]/50 p-6 rounded-xl h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                        <Brain className="w-8 h-8" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Parkinson's</h3>
                    <p className="text-sm text-muted-foreground mb-6 flex-1">
                      Advanced detection using biomedical voice measurements and variation analysis.
                    </p>
                    <div className="text-xs font-medium text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full w-fit">
                      22 Input Parameters
                    </div>
                  </div>
                </motion.div>
              </Link>

            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
