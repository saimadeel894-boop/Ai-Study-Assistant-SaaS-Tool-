import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StudentHeader } from "@/components/StudentHeader";
import { StudentFooter } from "@/components/StudentFooter";
import { 
  Brain, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  BookOpen,
  Lightbulb,
  Target
} from "lucide-react";

const examples = [
  { 
    complex: "Quantum Entanglement", 
    simple: "When two particles become connected so that what happens to one instantly affects the other, no matter how far apart they are - like magic twins!" 
  },
  { 
    complex: "Photosynthesis", 
    simple: "Plants use sunlight like a kitchen to cook their own food from water and air" 
  },
  { 
    complex: "Compound Interest", 
    simple: "Money that makes more money, and then that money makes even more money - like a snowball rolling downhill" 
  },
];

const benefits = [
  "Complex topics explained simply",
  "Uses everyday analogies",
  "No confusing jargon",
  "Perfect for any age",
  "Works with any subject",
  "Free and instant",
];

export default function ExplainSimplyPage() {
  return (
    <>
      <Helmet>
        <title>Explain Any Topic Simply | Free AI Explainer | StudyAI</title>
        <meta name="description" content="Get any complex topic explained in simple terms a 12-year-old could understand. Free AI tool that makes learning easy. No signup required!" />
        <meta name="keywords" content="explain simply, simple explanations, easy learning, explain like I'm 5, concept explainer, simple terms" />
        <link rel="canonical" href="/explain-simply" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <StudentHeader />
        
        <main className="flex-1 pt-16">
          {/* Hero */}
          <section className="py-20 bg-gradient-hero relative overflow-hidden">
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-10 h-10 text-primary" />
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                  <span className="text-gradient">Explain Any Topic</span> Simply
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Confused by complex concepts? Our AI breaks down any topic into simple, 
                  easy-to-understand explanations - like having a patient friend explain it to you.
                </p>
                <Link to="/chat">
                  <Button variant="hero" size="lg" className="px-8">
                    Try It Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>

          {/* Examples */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
                See How We Simplify Things
              </h2>
              <div className="space-y-6 max-w-3xl mx-auto">
                {examples.map((example, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-4 bg-muted/50 border-b border-border">
                          <p className="font-medium text-foreground flex items-center gap-2">
                            <Target className="w-4 h-4 text-primary" />
                            Complex: {example.complex}
                          </p>
                        </div>
                        <div className="p-4">
                          <p className="text-muted-foreground flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                            <span><strong className="text-foreground">Simple:</strong> {example.simple}</span>
                          </p>
                        </div>
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
                  Learning Should Be Easy
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
                What do you want to understand?
              </h2>
              <p className="text-muted-foreground mb-6">
                Type any topic and we'll explain it simply
              </p>
              <Link to="/chat">
                <Button variant="hero" size="lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Learning
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
