import { forwardRef } from "react";
import { ArrowRight, BookOpen, HelpCircle, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

interface SmartSuggestionsProps {
  topic: string;
  subject: string;
  onSelect: (query: string) => void;
}

const subjectSuggestions: Record<string, { related: string[]; exam: string[]; practice: string[] }> = {
  math: {
    related: ["Algebraic expressions", "Linear equations", "Graphs and coordinates"],
    exam: ["Solve for x in equations", "Word problems with algebra", "Calculate area and perimeter"],
    practice: ["Try solving 3x + 5 = 20", "Find the slope of y = 2x + 3", "Calculate the area of a triangle with base 6 and height 4"],
  },
  science: {
    related: ["Cell structure", "Chemical reactions", "Energy and forces"],
    exam: ["Explain the process of photosynthesis", "Describe Newton's laws", "What is the difference between elements and compounds?"],
    practice: ["Draw and label a plant cell", "Balance this equation: H2 + O2 → H2O", "Calculate the force needed to accelerate 5kg at 2m/s²"],
  },
  coding: {
    related: ["Variables and data types", "Functions and methods", "Loops and conditionals"],
    exam: ["Write a function to reverse a string", "Explain the difference between for and while loops", "What is object-oriented programming?"],
    practice: ["Write a program to print numbers 1-10", "Create a function that adds two numbers", "Build a simple calculator"],
  },
  english: {
    related: ["Essay structure", "Literary devices", "Grammar rules"],
    exam: ["Analyze the theme of the text", "Write a persuasive paragraph", "Identify the literary devices used"],
    practice: ["Write a thesis statement on climate change", "Identify the metaphor in this sentence", "Correct the grammar errors"],
  },
  history: {
    related: ["Causes of major wars", "Social movements", "Political systems"],
    exam: ["Explain the causes of WWI", "Describe the impact of the Industrial Revolution", "What led to the French Revolution?"],
    practice: ["Create a timeline of WWII events", "Compare democracy and monarchy", "Explain one long-term effect of colonialism"],
  },
  general: {
    related: ["Critical thinking", "Research methods", "Study techniques"],
    exam: ["How to analyze sources", "Compare and contrast essay tips", "Effective note-taking"],
    practice: ["Summarize the main idea", "Create a mind map", "Practice active recall"],
  },
};

export const SmartSuggestions = forwardRef<HTMLDivElement, SmartSuggestionsProps>(
  function SmartSuggestions({ topic, subject, onSelect }, ref) {
    const suggestions = subjectSuggestions[subject] || subjectSuggestions.general;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 bg-secondary/30 rounded-xl border border-border/50"
      >
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-accent" />
          Keep Learning
        </h4>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Related Topics
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.related.slice(0, 3).map((item, i) => (
                <button
                  key={i}
                  onClick={() => onSelect(`Explain ${item}`)}
                  className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" /> Common Exam Questions
            </p>
            <div className="space-y-1">
              {suggestions.exam.slice(0, 2).map((item, i) => (
                <button
                  key={i}
                  onClick={() => onSelect(item)}
                  className="w-full text-left text-xs px-3 py-2 bg-card rounded-lg hover:bg-secondary transition-colors flex items-center justify-between group"
                >
                  <span className="text-foreground">{item}</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Practice Prompt</p>
            <button
              onClick={() => onSelect(suggestions.practice[0])}
              className="w-full text-left text-xs px-3 py-2 bg-accent/10 text-accent-foreground rounded-lg hover:bg-accent/20 transition-colors border border-accent/20"
            >
              {suggestions.practice[0]}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }
);
