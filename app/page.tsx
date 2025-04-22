"use client";

import BlurText from "@/components/animations/BlurText";
import ShinyText from "@/components/animations/ShinyText";
import Squares from "@/components/animations/Squares";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  UploadCloud,
  Clock,
  BarChart3,
  FileText,
  Info,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAnimationComplete = () => {
    if (!animationComplete) {
      setAnimationComplete(true);
    }
  };

  const borderColor = mounted && theme === "light" ? "#99999980" : "#666666";
  const squaresHoverColor = mounted && theme === "light" ? "#f0f0f0" : "#222";

  return (
    <div className="w-screen min-h-screen relative overflow-hidden">
      <div className="relative pt-28 pb-24">
        <div className="absolute w-full h-[650px] top-0 -z-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/90 z-10 pointer-events-none dark:from-background/80 dark:to-background/80" />

          <Squares
            speed={0.3}
            squareSize={35}
            direction="diagonal"
            borderColor={borderColor}
            hoverFillColor={squaresHoverColor}
          />
        </div>

        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-green-500/10 blur-3xl dark:bg-green-500/10"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              className="mb-4 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full bg-green-500/20 dark:bg-green-500/10 backdrop-blur-sm border border-gray-600/35 dark:border-border/30">
                <UploadCloud 
                  className="text-gray-700 dark:text-[#b5b5b5a4]"
                  size={18}
                />
                <ShinyText text="Track Your File Upload Activity" speed={3} />
              </span>
            </motion.div>

            <div className="mb-6 w-[90%] sm:w-2xl mx-auto">
              <BlurText
                text="Visualize your uploads. Track your consistency."
                delay={100}
                animateBy="words"
                direction="top"
                onAnimationComplete={handleAnimationComplete}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight sm:leading-[1.2] break-words"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: animationComplete ? 1 : 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-base sm:text-lg text-slate-700 dark:text-muted-foreground mb-10 max-w-xl mx-auto"
            >
              Track and visualize your file upload activities with a beautiful GitHub-style contribution calendar.
              Upload any type of file, monitor your consistency, and see your upload patterns over time.
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: animationComplete ? 1 : 0,
                y: animationComplete ? 0 : 20,
              }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button
              className="cursor-pointer"
                size="lg"
                onClick={() => {
                  router.push("/dashboard");
                }}
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="cursor-pointer"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <section id="features" className="py-24 px-4 relative">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Track Your File Uploads
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Monitor your upload activity with our visual tracking system.
            </p>
          </div>

          <div className="grid grid-cols-12 auto-rows-[minmax(160px,auto)] gap-3">
            <motion.div
              className="col-span-12 md:col-span-6 row-span-2 relative group overflow-hidden rounded-3xl bg-card/30 dark:bg-black/40 shadow-sm"
              whileHover={{
                scale: 0.995,
                transition: { duration: 0.6, ease: "easeOut" },
              }}
              transition={{ duration: 0.4 }}
              onMouseEnter={() => setHoveredFeature(0)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="absolute inset-0 border border-border/40 dark:border-border/20 rounded-3xl" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-green-500/30 to-emerald-500/15 dark:from-green-500/15 dark:to-emerald-500/10 transition-opacity duration-500" />

              <motion.div
                className="absolute -bottom-16 -right-16 w-36 h-36 rounded-full bg-green-500/30 dark:bg-green-500/20 z-0"
                initial={{ opacity: 0.1, scale: 0.8, y: 20 }}
                animate={
                  hoveredFeature === 0
                    ? { opacity: 0.5, scale: 1.1, y: 0 }
                    : { opacity: 0.1, scale: 0.8, y: 20 }
                }
                transition={{ duration: 0.8 }}
              />

              <motion.div
                className="absolute top-20 right-0 w-28 h-28 rounded-sm rotate-45 bg-emerald-500/30 dark:bg-emerald-500/20 z-0"
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={
                  hoveredFeature === 0
                    ? { opacity: 0.5, scale: 1, rotate: 60, x: 0 }
                    : { opacity: 0, scale: 0.8, x: 20, rotate: 45 }
                }
                transition={{ duration: 0.9 }}
              />

              <div className="h-full p-8 flex flex-col relative z-10">
                <motion.div
                  className="p-3 bg-white/15 dark:bg-white/5 rounded-xl w-fit mb-4 shadow-sm"
                  animate={
                    hoveredFeature === 0
                      ? {
                          scale: 1.05,
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                        }
                      : {
                          scale: 1,
                          backgroundColor: "rgba(255, 255, 255, 0.15)",
                        }
                  }
                  transition={{ duration: 0.4 }}
                >
                  <Calendar className="h-6 w-6 text-green-600 dark:text-green-500/90" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-3">
                  GitHub-Style Upload Calendar
                </h3>
                <p className="text-foreground/90 dark:text-foreground/70 mb-6 text-base">
                  Visualize your upload patterns with our color-coded calendar system. 
                  See your activity at a glance and identify trends in your file upload consistency.
                </p>
                <div className="mt-auto">
                  <Button variant="ghost" className="group cursor-pointer">
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="col-span-6 md:col-span-3 row-span-1 relative group overflow-hidden rounded-3xl bg-card/30 dark:bg-black/40 shadow-sm"
              whileHover={{
                scale: 0.98,
                transition: { duration: 0.6, ease: "easeOut" },
              }}
              transition={{ duration: 0.4 }}
              onMouseEnter={() => setHoveredFeature(1)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="absolute inset-0 border border-border/40 dark:border-border/20 rounded-3xl" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-blue-500/30 to-transparent dark:from-blue-500/15 transition-opacity duration-500" />

              <motion.div
                className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-blue-500/30 dark:bg-blue-500/20 z-0"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={
                  hoveredFeature === 1
                    ? { opacity: 0.5, scale: 1.2, x: -5, y: -5 }
                    : { opacity: 0, scale: 0.7 }
                }
                transition={{ duration: 1 }}
              />

              <div className="p-6 h-full flex flex-col relative z-10">
                <motion.div
                  className="p-2 bg-white/15 dark:bg-white/5 rounded-lg w-fit mb-3 shadow-sm"
                  animate={
                    hoveredFeature === 1
                      ? { scale: 1.1, rotate: 5 }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.5 }}
                >
                  <UploadCloud className="h-5 w-5 text-blue-500 dark:text-blue-500/90" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-1">
                  Any File Type
                </h3>
                <p className="text-sm text-foreground/90 dark:text-foreground/70">
                  Upload any file type to mark your daily activity
                </p>
              </div>
            </motion.div>

            <motion.div
              className="col-span-6 md:col-span-3 row-span-1 relative group overflow-hidden rounded-3xl bg-card/30 dark:bg-black/40 shadow-sm"
              whileHover={{
                scale: 0.98,
                transition: { duration: 0.6, ease: "easeOut" },
              }}
              transition={{ duration: 0.4 }}
              onMouseEnter={() => setHoveredFeature(2)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="absolute inset-0 border border-border/40 dark:border-border/20 rounded-3xl" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-purple-500/30 to-transparent dark:from-purple-500/15 transition-opacity duration-500" />

              <motion.div
                className="absolute -bottom-8 -right-8 w-24 h-24 rounded-md rotate-45 bg-purple-500/30 dark:bg-purple-500/20 z-0"
                initial={{ opacity: 0, rotate: 45, y: 10 }}
                animate={
                  hoveredFeature === 2
                    ? { opacity: 0.6, rotate: 70, scale: 1.3, y: -5 }
                    : { opacity: 0, rotate: 45, y: 10, scale: 1 }
                }
                transition={{ duration: 1.2 }}
              />

              <div className="p-6 h-full flex flex-col relative z-10">
                <motion.div
                  className="p-2 bg-white/15 dark:bg-white/5 rounded-lg w-fit mb-3 shadow-sm"
                  animate={
                    hoveredFeature === 2
                      ? { scale: [1, 1.2, 1.1] }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.7, times: [0, 0.5, 1] }}
                >
                  <Info className="h-5 w-5 text-purple-500 dark:text-purple-500/90" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-1">Hover Tooltips</h3>
                <p className="text-sm text-foreground/90 dark:text-foreground/70">
                  View upload details by hovering over calendar days
                </p>
              </div>
            </motion.div>

            <motion.div
              className="col-span-12 md:col-span-6 row-span-1 relative group overflow-hidden rounded-3xl bg-card/30 dark:bg-black/40 shadow-sm"
              whileHover={{
                scale: 0.98,
                transition: { duration: 0.6, ease: "easeOut" },
              }}
              transition={{ duration: 0.4 }}
              onMouseEnter={() => setHoveredFeature(3)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="absolute inset-0 border border-border/40 dark:border-border/20 rounded-3xl" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-amber-500/30 via-orange-500/20 to-transparent dark:from-amber-500/15 dark:via-orange-500/10 transition-opacity duration-500" />

              <motion.div
                className="absolute top-4 right-4 w-32 h-32 rounded-full bg-amber-500/30 dark:bg-amber-500/20 z-0"
                initial={{ opacity: 0, y: 10 }}
                animate={
                  hoveredFeature === 3
                    ? { opacity: 0.6, y: 0, scale: 1.1 }
                    : { opacity: 0, y: 10, scale: 1 }
                }
                transition={{ duration: 1 }}
              />

              <motion.div
                className="absolute -bottom-6 left-1/3 w-20 h-20 rounded-sm rotate-12 bg-orange-500/30 dark:bg-orange-500/20 z-0"
                initial={{ opacity: 0, rotate: 12, scale: 0.6 }}
                animate={
                  hoveredFeature === 3
                    ? { opacity: 0.6, rotate: 45, scale: 1.2 }
                    : { opacity: 0, rotate: 12, scale: 0.6 }
                }
                transition={{ duration: 1.1, delay: 0.1 }}
              />

              <div className="p-6 h-full flex flex-col md:flex-row md:items-center gap-4 relative z-10">
                <motion.div
                  className="p-3 bg-white/15 dark:bg-white/5 rounded-xl w-fit shadow-sm"
                  animate={
                    hoveredFeature === 3
                      ? {
                          scale: 1.1,
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                        }
                      : {
                          scale: 1,
                          backgroundColor: "rgba(255, 255, 255, 0.15)",
                        }
                  }
                  transition={{ duration: 0.5 }}
                >
                  <Clock className="h-5 w-5 text-amber-500 dark:text-amber-500/90" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Date Tracking</h3>
                  <p className="text-sm text-foreground/90 dark:text-foreground/70">
                    Every uploaded file is automatically tied to the specific upload date
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="col-span-6 md:col-span-6 lg:col-span-4 row-span-1 relative group overflow-hidden rounded-3xl bg-card/30 dark:bg-black/40 shadow-sm"
              whileHover={{
                scale: 0.98,
                transition: { duration: 0.6, ease: "easeOut" },
              }}
              transition={{ duration: 0.4 }}
              onMouseEnter={() => setHoveredFeature(4)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="absolute inset-0 border border-border/40 dark:border-border/20 rounded-3xl" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-teal-500/30 to-transparent dark:from-teal-500/15 transition-opacity duration-500" />

              <motion.div
                className="absolute -top-10 right-10 w-32 h-32 rotate-45 rounded-sm bg-teal-500/30 dark:bg-teal-500/20 z-0"
                initial={{ opacity: 0, rotate: 45 }}
                animate={
                  hoveredFeature === 4
                    ? { opacity: 0.6, rotate: 60, scale: 1.1, y: 10, x: -10 }
                    : { opacity: 0, rotate: 45, scale: 1 }
                }
                transition={{ duration: 1.2 }}
              />

              <div className="p-6 h-full flex flex-col relative z-10">
                <motion.div
                  className="p-2 bg-white/15 dark:bg-white/5 rounded-lg w-fit mb-3 shadow-sm"
                  animate={
                    hoveredFeature === 4
                      ? { scale: 1.1, rotate: -5 }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.5 }}
                >
                  <FileText className="h-5 w-5 text-teal-500 dark:text-teal-500/90" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-1">
                  File Management
                </h3>
                <p className="text-sm text-foreground/90 dark:text-foreground/70">
                  Access and manage all your uploaded files in one place
                </p>
              </div>
            </motion.div>

            <motion.div
              className="col-span-6 md:col-span-6 lg:col-span-8 row-span-1 relative group overflow-hidden rounded-3xl bg-card/30 dark:bg-black/40 shadow-sm"
              whileHover={{
                scale: 0.98,
                transition: { duration: 0.6, ease: "easeOut" },
              }}
              transition={{ duration: 0.4 }}
              onMouseEnter={() => setHoveredFeature(5)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="absolute inset-0 border border-border/40 dark:border-border/20 rounded-3xl" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-green-500/30 via-teal-500/20 to-transparent dark:from-green-500/15 dark:via-teal-500/10 transition-opacity duration-500" />

              <motion.div
                className="absolute -bottom-12 right-10 w-36 h-36 rounded-full bg-green-500/30 dark:bg-green-500/20 z-0"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  hoveredFeature === 5
                    ? { opacity: 0.6, y: 0, scale: 1.1 }
                    : { opacity: 0, y: 20, scale: 1 }
                }
                transition={{ duration: 1.2 }}
              />

              <motion.div
                className="absolute top-8 left-1/3 w-24 h-24 rounded-md rotate-12 bg-teal-500/30 dark:bg-teal-500/20 z-0"
                initial={{ opacity: 0, scale: 0.6, rotate: 12 }}
                animate={
                  hoveredFeature === 5
                    ? { opacity: 0.6, scale: 1.1, rotate: 25 }
                    : { opacity: 0, scale: 0.6, rotate: 12 }
                }
                transition={{ duration: 1, delay: 0.1 }}
              />

              <div className="p-6 h-full flex flex-col md:flex-row md:items-center gap-4 relative z-10">
                <motion.div
                  className="p-3 bg-white/15 dark:bg-white/5 rounded-xl w-fit shadow-sm"
                  animate={
                    hoveredFeature === 5
                      ? {
                          scale: 1.1,
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                        }
                      : {
                          scale: 1,
                          backgroundColor: "rgba(255, 255, 255, 0.15)",
                        }
                  }
                  transition={{ duration: 0.5 }}
                >
                  <BarChart3 className="h-5 w-5 text-green-500 dark:text-green-500/90" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    Upload Analytics
                  </h3>
                  <p className="text-sm text-foreground/90 dark:text-foreground/70">
                    Track upload patterns and analyze your file consistency habits over time
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 relative">
        <div className="absolute top-0 left-2/4 w-80 h-80 rounded-full bg-green-500/15 dark:bg-green-500/10 blur-3xl -z-10" />
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tracking your file uploads is simple with our intuitive workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Files",
                description:
                  "Upload any file type to mark your activity for that day",
                color: "rgb(34, 197, 94)",
              },
              {
                step: "02",
                title: "Fill Your Calendar",
                description:
                  "Watch your calendar fill with colored squares representing your uploads",
                color: "rgb(16, 185, 129)",
              },
              {
                step: "03",
                title: "Track Consistency",
                description:
                  "Hover over days to see upload details and monitor your patterns",
                color: "rgb(6, 182, 212)",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative p-8 rounded-xl bg-card/30 dark:bg-black/30 border border-border/40 dark:border-border/30 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className="absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shadow-md"
                  style={{ backgroundColor: item.color, color: "#fff" }}
                >
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-foreground/80 dark:text-foreground/70">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-emerald-500/15 dark:bg-emerald-500/10 blur-3xl -z-10" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-teal-500/15 dark:bg-teal-500/10 blur-3xl -z-10" />

        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What People Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join others who are tracking their file uploads with ActTracker
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "ActTracker helps me keep track of all my project documentation. The calendar view makes it satisfying to maintain consistency.",
                author: "Alex Chen",
                role: "Project Manager",
                color: "rgb(34, 197, 94)",
              },
              {
                quote:
                  "I use ActTracker to document my code submissions. Seeing the contribution grid fill up motivates me to upload regularly.",
                author: "Jamie Smith",
                role: "Software Developer",
                color: "rgb(16, 185, 129)",
              },
              {
                quote:
                  "Perfect for tracking my work submissions. The ability to see all my uploads in calendar format helps me maintain a steady workflow.",
                author: "Taylor Rodriguez",
                role: "Remote Professional",
                color: "rgb(6, 182, 212)",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl relative overflow-hidden bg-card/30 dark:bg-black/30 border border-border/40 dark:border-border/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div className="mb-4 text-3xl" style={{ color: item.color }}>
                  &quot;
                </div>
                <p className="mb-6 italic text-foreground dark:text-foreground/90">
                  {item.quote}
                </p>
                <div className="mt-auto">
                  <p className="font-medium">{item.author}</p>
                  <p className="text-sm text-muted-foreground">{item.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <section className="py-24 px-4 relative overflow-hidden">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              className="bg-card/40 dark:bg-black/40 p-12 rounded-3xl border border-border/40 dark:border-border/30 relative overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-teal-500/15 blur-xl dark:bg-teal-500/20" />

              <div className="text-center relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  Ready to track your file uploads?
                </h2>

                <p className="text-lg text-foreground/80 dark:text-foreground/70 mb-8 max-w-2xl mx-auto">
                  Join users who are tracking their file upload consistency and building better habits with ActTracker.
                </p>

                <Button
                  size="lg"
                  onClick={() => {
                    router.push("/dashboard");
                  }}
                  className="mx-auto bg-green-600 hover:bg-green-700 cursor-pointer"
                >
                  Get started now
                </Button>

                <p className="mt-4 text-sm text-muted-foreground">
                  No credit card required. Free to use.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </section>

      <footer className="py-8 px-4 bg-muted/20 dark:bg-muted/5">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 ActTracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
