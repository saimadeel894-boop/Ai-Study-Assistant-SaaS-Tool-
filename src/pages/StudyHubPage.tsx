import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Search, 
  Calculator, 
  FlaskConical, 
  BookOpen, 
  Globe, 
  Code, 
  Brain,
  ChevronRight,
  Clock,
  Users,
  Star,
  Filter,
  BookMarked,
  FileText,
  HelpCircle,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudentHeader } from "@/components/StudentHeader";
import { StudentFooter } from "@/components/StudentFooter";

const categories = [
  { id: "all", name: "All", icon: Layers },
  { id: "math", name: "Mathematics", icon: Calculator },
  { id: "science", name: "Science", icon: FlaskConical },
  { id: "english", name: "English", icon: BookOpen },
  { id: "history", name: "History", icon: Globe },
  { id: "coding", name: "Computer Science", icon: Code },
];

const studyMaterials = [
  {
    id: "1",
    title: "Algebra Fundamentals",
    description: "Master the basics of algebra including variables, equations, and expressions",
    subject: "Mathematics",
    level: "Beginner",
    type: "notes",
    topics: ["Variables", "Equations", "Expressions", "Order of Operations"],
    icon: Calculator,
    color: "bg-blue-500/10 text-blue-600",
    category: "math",
  },
  {
    id: "2",
    title: "Quadratic Equations",
    description: "Learn to solve quadratic equations using multiple methods",
    subject: "Mathematics",
    level: "Intermediate",
    type: "notes",
    topics: ["Factoring", "Quadratic Formula", "Completing the Square"],
    icon: Calculator,
    color: "bg-blue-500/10 text-blue-600",
    category: "math",
  },
  {
    id: "3",
    title: "Cell Biology",
    description: "Explore the structure and function of cells",
    subject: "Science",
    level: "Beginner",
    type: "notes",
    topics: ["Cell Structure", "Organelles", "Cell Division", "Membrane Transport"],
    icon: FlaskConical,
    color: "bg-green-500/10 text-green-600",
    category: "science",
  },
  {
    id: "4",
    title: "Photosynthesis & Respiration",
    description: "Understand how plants make food and how cells produce energy",
    subject: "Science",
    level: "Intermediate",
    type: "notes",
    topics: ["Light Reactions", "Calvin Cycle", "Glycolysis", "Krebs Cycle"],
    icon: FlaskConical,
    color: "bg-green-500/10 text-green-600",
    category: "science",
  },
  {
    id: "5",
    title: "Essay Writing Guide",
    description: "Learn to write compelling essays with strong arguments",
    subject: "English",
    level: "All Levels",
    type: "notes",
    topics: ["Thesis Statements", "Essay Structure", "Citations", "Conclusions"],
    icon: BookOpen,
    color: "bg-purple-500/10 text-purple-600",
    category: "english",
  },
  {
    id: "6",
    title: "Shakespeare's Themes",
    description: "Analyze major themes across Shakespeare's famous works",
    subject: "English",
    level: "Advanced",
    type: "notes",
    topics: ["Love & Jealousy", "Power & Ambition", "Fate vs Free Will"],
    icon: BookOpen,
    color: "bg-purple-500/10 text-purple-600",
    category: "english",
  },
  {
    id: "7",
    title: "World War I & II",
    description: "Comprehensive overview of the two world wars",
    subject: "History",
    level: "Intermediate",
    type: "notes",
    topics: ["Causes", "Major Events", "Key Figures", "Aftermath"],
    icon: Globe,
    color: "bg-amber-500/10 text-amber-600",
    category: "history",
  },
  {
    id: "8",
    title: "Python Programming Basics",
    description: "Start coding with Python from zero to hero",
    subject: "Computer Science",
    level: "Beginner",
    type: "notes",
    topics: ["Variables", "Loops", "Functions", "Data Structures"],
    icon: Code,
    color: "bg-pink-500/10 text-pink-600",
    category: "coding",
  },
];

const quickRevision = [
  { subject: "Math", topic: "Pythagorean Theorem: a² + b² = c²" },
  { subject: "Science", topic: "Photosynthesis: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂" },
  { subject: "English", topic: "Simile uses 'like' or 'as', Metaphor makes direct comparison" },
  { subject: "History", topic: "WW1: 1914-1918, WW2: 1939-1945" },
];

export default function StudyHubPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  const filteredMaterials = studyMaterials.filter((material) => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAskAI = (topic: string) => {
    navigate(`/chat?q=${encodeURIComponent(`Explain ${topic} in detail`)}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <StudentHeader />
      
      <main className="flex-1 pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <Badge variant="secondary" className="mb-4">
              <BookMarked className="w-3 h-3 mr-1" />
              Free Study Materials
            </Badge>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Study Hub
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Browse notes, summaries, and practice materials organized by subject
            </p>
          </motion.div>

          {/* Quick Revision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Quick Revision
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {quickRevision.map((item, i) => (
                <Card 
                  key={i} 
                  className="bg-card/50 hover:bg-card transition-colors cursor-pointer"
                  onClick={() => handleAskAI(item.topic)}
                >
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2 text-xs">{item.subject}</Badge>
                    <p className="text-sm text-foreground font-mono">{item.topic}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search topics, subjects, or keywords..."
                  className="pl-11"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Study Materials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material, i) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-all hover:border-primary/30 group cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-xl ${material.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <material.icon className="w-6 h-6" />
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">{material.level}</Badge>
                        <Badge variant="secondary" className="text-xs capitalize">{material.type}</Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-4 group-hover:text-primary transition-colors">
                      {material.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{material.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {material.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-1 bg-secondary/50 rounded text-xs text-muted-foreground"
                        >
                          {topic}
                        </span>
                      ))}
                      {material.topics.length > 3 && (
                        <span className="px-2 py-1 bg-secondary/50 rounded text-xs text-muted-foreground">
                          +{material.topics.length - 3} more
                        </span>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      className="w-full group-hover:bg-primary/10 group-hover:text-primary"
                      onClick={() => handleAskAI(material.title)}
                    >
                      Learn with AI
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredMaterials.length === 0 && (
            <div className="text-center py-16">
              <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">No materials found</h3>
              <p className="text-muted-foreground mb-4">Try a different search or ask our AI assistant</p>
              <Button variant="hero" onClick={() => navigate("/chat")}>
                Ask AI Instead
              </Button>
            </div>
          )}
        </div>
      </main>

      <StudentFooter />
    </div>
  );
}
