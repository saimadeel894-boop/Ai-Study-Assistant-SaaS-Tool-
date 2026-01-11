import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Heart, 
  Sparkles, 
  Target, 
  Users, 
  Zap,
  BookOpen,
  Code,
  Mail,
  Globe,
  Send,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StudentHeader } from "@/components/StudentHeader";
import { StudentFooter } from "@/components/StudentFooter";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const values = [
  {
    icon: Zap,
    title: "Free Forever",
    description: "Education should be accessible to everyone. StudyAI is completely free with no hidden costs."
  },
  {
    icon: Target,
    title: "Student-First",
    description: "Every feature is designed with students in mind, making learning easier and more effective."
  },
  {
    icon: Heart,
    title: "Quality Education",
    description: "We believe in teaching concepts, not just providing answers. Understanding is our goal."
  },
  {
    icon: Users,
    title: "For Everyone",
    description: "Whether you're in middle school or college, StudyAI adapts to help you learn at your level."
  },
];

export default function AboutPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Please fill all fields",
        description: "All fields are required to send a message.",
        variant: "destructive"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. Saim will get back to you soon!"
    });
    
    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>About StudyAI - Created by Saim Adeel</title>
        <meta name="description" content="Learn about StudyAI, a free AI-powered study assistant created by Saim Adeel to help students learn better." />
        <meta name="author" content="Saim Adeel" />
      </Helmet>

      <StudentHeader />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <Badge variant="secondary" className="mb-6 px-4 py-1.5">
                <Sparkles className="w-3 h-3 mr-2" />
                About Us
              </Badge>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Making Education <span className="text-gradient">Accessible</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                StudyAI is a free AI-powered study assistant built to help students 
                understand complex topics, solve problems, and excel in their studies.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Our Mission
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
                  We believe every student deserves access to quality educational support, 
                  regardless of their background or resources. StudyAI bridges the gap between 
                  questions and understanding.
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 gap-6">
                {values.map((value, i) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="h-full bg-card/50 border-border/50 hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                          <value.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-display font-semibold text-foreground mb-2">
                          {value.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {value.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Creator Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Meet the Creator
                </h2>
              </div>

              <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border-primary/20 overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow flex-shrink-0">
                      <span className="text-5xl font-display font-bold text-primary-foreground">SA</span>
                    </div>

                    <div className="text-center md:text-left flex-1">
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                        Saim Adeel
                      </h3>
                      <p className="text-primary font-medium mb-4">Creator & Developer</p>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        Saim Adeel is a passionate developer and student advocate who created StudyAI 
                        with a simple goal: to make quality education accessible to everyone. 
                        Combining expertise in AI and web development, Saim built StudyAI to be the 
                        study companion every student deserves—intelligent, helpful, and completely free.
                      </p>

                      <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        <Badge variant="secondary" className="gap-1.5">
                          <Code className="w-3 h-3" />
                          Developer
                        </Badge>
                        <Badge variant="secondary" className="gap-1.5">
                          <BookOpen className="w-3 h-3" />
                          Education Advocate
                        </Badge>
                        <Badge variant="secondary" className="gap-1.5">
                          <Sparkles className="w-3 h-3" />
                          AI Enthusiast
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                What StudyAI Offers
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Everything you need to succeed in your studies, all in one place.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { title: "AI Chat Assistant", desc: "Get instant answers to any study question", icon: Sparkles },
                { title: "Subject Modes", desc: "Tailored explanations for Math, Science, Coding & more", icon: BookOpen },
                { title: "Step-by-Step Solutions", desc: "Learn the process, not just the answer", icon: Target },
                { title: "Quick Study Tools", desc: "Formula explainer, definitions, and more", icon: Zap },
                { title: "24/7 Availability", desc: "Study anytime, anywhere", icon: Globe },
                { title: "No Signup Required", desc: "Start learning immediately", icon: Users },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="h-full bg-card/50 border-border/50">
                    <CardContent className="pt-6 text-center">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <Mail className="w-7 h-7 text-primary-foreground" />
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Get in Touch
                </h2>
                <p className="text-muted-foreground">
                  Have questions, feedback, or ideas? Reach out to Saim Adeel directly.
                </p>
              </div>

              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-6 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          maxLength={100}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          maxLength={255}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Your Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us what's on your mind..."
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        maxLength={1000}
                        disabled={isSubmitting}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="lg" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border-primary/20">
              <CardContent className="p-8 md:p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <GraduationCap className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Ready to Start Learning?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                  Join thousands of students who are already using StudyAI to understand 
                  their subjects better. It's free, instant, and always available.
                </p>
                <Button variant="hero" size="lg" onClick={() => navigate("/chat")}>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Learning Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <StudentFooter />
    </div>
  );
}