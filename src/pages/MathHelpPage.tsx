import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StudentHeader } from "@/components/StudentHeader";
import { StudentFooter } from "@/components/StudentFooter";
import { 
  Calculator, 
  ArrowRight, 
  CheckCircle2,
  BookOpen,
  Target,
  Sparkles
} from "lucide-react";

const mathTopics = [
  { title: "Algebra", description: "Equations, expressions, and polynomials" },
  { title: "Geometry", description: "Shapes, angles, and proofs" },
  { title: "Calculus", description: "Derivatives, integrals, and limits" },
  { title: "Statistics", description: "Probability and data analysis" },
  { title: "Trigonometry", description: "Sin, cos, tan and more" },
  { title: "Pre-Algebra", description: "Fractions, decimals, percentages" },
];

const benefits = [
  "Step-by-step solutions with explanations",
  "Formulas explained in simple terms",
  "Practice problems to test understanding",
  "Works with all grade levels",
  "Available 24/7, no signup needed",
];

export default function MathHelpPage() {
  return (
    <>
      <Helmet>
        <title>Free AI Math Help for Students | StudyAI - Algebra, Calculus & More</title>
        <meta name="description" content="Get free instant math help from AI. Step-by-step solutions for algebra, calculus, geometry, and more. No signup required - start learning now!" />
        <meta name="keywords" content="math help, algebra help, calculus tutor, free math tutor, AI math helper, homework help math" />
        <link rel="canonical" href="/math-help" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <StudentHeader />
        
        <main className="flex-1 pt-16">
          {/* Hero */}
          <section className="py-20 bg-gradient-hero relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
                  <Calculator className="w-10 h-10 text-blue-600" />
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Free AI <span className="text-gradient">Math Help</span> for Students
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Struggling with math homework? Get instant step-by-step explanations for any math problem. 
                  From basic algebra to advanced calculus - our AI tutor explains it all.
                </p>
                <Link to="/chat?subject=math">
                  <Button variant="hero" size="lg" className="px-8">
                    Get Math Help Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>

          {/* Topics */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
                Math Topics We Cover
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {mathTopics.map((topic, i) => (
                  <motion.div
                    key={topic.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link to={`/chat?subject=math&q=Explain ${topic.title}`}>
                      <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                        <CardContent className="p-5">
                          <h3 className="font-semibold text-foreground mb-1">{topic.title}</h3>
                          <p className="text-sm text-muted-foreground">{topic.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
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
                  Why Use Our AI Math Tutor?
                </h2>
                <div className="space-y-4">
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
                Ready to ace your math class?
              </h2>
              <p className="text-muted-foreground mb-6">
                Start asking questions now - it's completely free!
              </p>
              <Link to="/chat?subject=math">
                <Button variant="hero" size="lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Learning Math
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
