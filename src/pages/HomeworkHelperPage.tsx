import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StudentHeader } from "@/components/StudentHeader";
import { StudentFooter } from "@/components/StudentFooter";
import { 
  Lightbulb, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  BookOpen,
  Calculator,
  Code,
  FlaskConical
} from "lucide-react";

const features = [
  { 
    icon: BookOpen, 
    title: "Any Subject", 
    description: "Math, Science, English, History, Coding, and more" 
  },
  { 
    icon: Calculator, 
    title: "Step-by-Step Solutions", 
    description: "Every answer broken down into clear, understandable steps" 
  },
  { 
    icon: Lightbulb, 
    title: "Learn, Don't Copy", 
    description: "Understand concepts deeply, not just get answers" 
  },
  { 
    icon: Sparkles, 
    title: "Instant Responses", 
    description: "Get help in seconds, available 24/7" 
  },
];

const benefits = [
  "Works with all subjects and grade levels",
  "Explains solutions step-by-step",
  "Provides examples for better understanding",
  "Suggests practice problems",
  "100% free, no signup needed",
  "Available anytime, anywhere",
];

export default function HomeworkHelperPage() {
  return (
    <>
      <Helmet>
        <title>Free AI Homework Helper | Get Instant Help with Any Subject | StudyAI</title>
        <meta name="description" content="Free AI homework helper for students. Get step-by-step explanations for math, science, English and more. No signup required - instant homework help 24/7!" />
        <meta name="keywords" content="homework helper, homework help, AI homework solver, free homework help, study help, assignment helper" />
        <link rel="canonical" href="/homework-helper" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <StudentHeader />
        
        <main className="flex-1 pt-16">
          {/* Hero */}
          <section className="py-20 bg-gradient-hero relative overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="w-10 h-10 text-accent" />
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Free AI <span className="text-gradient">Homework Helper</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Stuck on homework? Our AI explains any topic clearly and helps you understand - not just copy answers. 
                  Works with all subjects, all grade levels.
                </p>
                <Link to="/solver">
                  <Button variant="hero" size="lg" className="px-8">
                    Get Homework Help
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>

          {/* Features */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
                How Our AI Homework Helper Works
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="h-full text-center">
                      <CardContent className="pt-6">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <feature.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="py-16 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
                  Why Students Love Our Homework Helper
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border"
                    >
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-foreground">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16">
            <div className="container mx-auto px-4 text-center">
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                Stop struggling with homework
              </h2>
              <p className="text-muted-foreground mb-6">
                Get instant help and actually understand the material
              </p>
              <Link to="/solver">
                <Button variant="hero" size="lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Try the Homework Helper
                </Button>
              </Link>
            </div>
          </section>
        </main>

        <StudentFooter />
      </div>
    </>
  );
}
