import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  BookOpen,
  Lightbulb,
  FileText,
  X,
  Send,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { streamChatCompletion, getSystemPrompt } from "@/lib/openai";

interface QuickStudyToolsProps {
  onResult: (result: string, toolName: string) => void;
}

const tools = [
  {
    id: "formula",
    name: "Formula Explainer",
    icon: Calculator,
    placeholder: "Enter a formula (e.g., E=mc², a²+b²=c²)",
    description: "Understand any formula",
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
  },
  {
    id: "definition",
    name: "Definition Finder",
    icon: BookOpen,
    placeholder: "Enter a term (e.g., Mitosis, Democracy)",
    description: "Get clear definitions",
    color: "bg-green-500/10 text-green-600 border-green-200",
  },
  {
    id: "simplify",
    name: "Explain Like I'm 12",
    icon: Lightbulb,
    placeholder: "Enter any concept (e.g., Quantum physics)",
    description: "Simplify complex topics",
    color: "bg-amber-500/10 text-amber-600 border-amber-200",
  },
  {
    id: "notes",
    name: "Quick Notes",
    icon: FileText,
    placeholder: "Enter a topic (e.g., French Revolution)",
    description: "Generate revision notes",
    color: "bg-purple-500/10 text-purple-600 border-purple-200",
  },
];

export function QuickStudyTools({ onResult }: QuickStudyToolsProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeTool || isLoading) return;

    setIsLoading(true);
    const tool = tools.find((t) => t.id === activeTool);

    try {
      const systemPrompt = getSystemPrompt(undefined, activeTool);
      let result = "";
      
      await streamChatCompletion([{ role: "user", content: input }], systemPrompt, (chunk) => {
        result += chunk;
      });

      onResult(result, tool?.name || "Quick Tool");
      setInput("");
      setActiveTool(null);
    } catch (error) {
      console.error("Tool error:", error);
      toast.error("Failed to get result. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="font-medium">Quick Study Tools</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeTool === tool.id
                ? `${tool.color} border-current`
                : "bg-card border-border hover:border-primary/30"
            }`}
          >
            <tool.icon className={`w-5 h-5 mb-1 ${activeTool === tool.id ? "" : "text-muted-foreground"}`} />
            <p className="text-xs font-medium text-foreground">{tool.name}</p>
            <p className="text-[10px] text-muted-foreground">{tool.description}</p>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {activeTool && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-4 bg-card/50 border-border/50">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={tools.find((t) => t.id === activeTool)?.placeholder}
                  className="flex-1"
                  disabled={isLoading}
                  autoFocus
                />
                <Button type="submit" variant="hero" size="icon" disabled={isLoading || !input.trim()}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveTool(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
