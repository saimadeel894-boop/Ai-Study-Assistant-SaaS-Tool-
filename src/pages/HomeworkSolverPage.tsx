import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lightbulb, 
  Send, 
  Sparkles, 
  AlertTriangle,
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Calculator,
  FlaskConical,
  Code,
  FileText,
  Clipboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudentHeader } from "@/components/StudentHeader";
import { StudentFooter } from "@/components/StudentFooter";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const exampleProblems = [
  { 
    icon: Calculator, 
    text: "Solve: 2x² + 5x - 3 = 0",
    subject: "Math"
  },
  { 
    icon: FlaskConical, 
    text: "Balance: Fe + O₂ → Fe₂O₃",
    subject: "Chemistry"
  },
  { 
    icon: Code, 
    text: "Write a function to find the factorial of a number",
    subject: "Coding"
  },
  { 
    icon: BookOpen, 
    text: "Analyze the symbolism in 'The Great Gatsby'",
    subject: "English"
  },
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export default function HomeworkSolverPage() {
  const [problem, setProblem] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!problem.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: problem.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setProblem("");
    setIsLoading(true);

    // Build conversation context with homework-solving system prompt
    const systemMessage = {
      role: "system",
      content: `You are a patient homework tutor. When solving problems:
1. First, understand what the problem is asking
2. Explain the concept briefly if needed
3. Show the solution step-by-step
4. Explain WHY each step is done
5. If it's math, show all work clearly
6. Offer alternative methods if applicable
7. End with a tip for similar problems

IMPORTANT: Encourage understanding over copying. Remind students to learn the concept, not just get the answer.`
    };

    const apiMessages = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: userMessage.role, content: userMessage.content }
    ];

    let assistantContent = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          messages: apiMessages,
          systemPrompt: systemMessage.content
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Rate limit exceeded. Please try again in a moment.");
          throw new Error("Rate limit exceeded");
        }
        if (response.status === 402) {
          toast.error("Service temporarily unavailable.");
          throw new Error("Payment required");
        }
        throw new Error("Failed to get response");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      const assistantMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, content: assistantContent }
                    : m
                )
              );
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Solver error:", error);
      toast.error("Failed to solve. Please try again.");
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && !last.content) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (text: string) => {
    setProblem(text);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setProblem(text);
      toast.success("Pasted from clipboard");
    } catch {
      toast.error("Failed to paste from clipboard");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <StudentHeader />
      
      <main className="flex-1 pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Badge variant="secondary" className="mb-4">
              <Lightbulb className="w-3 h-3 mr-1" />
              Step-by-Step Solutions
            </Badge>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Homework Solver
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Paste your homework question and get a detailed, step-by-step explanation
            </p>
          </motion.div>

          {/* Warning Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-amber-500/10 border-amber-500/20 mb-8">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Learn, don't just copy!</p>
                  <p className="text-sm text-muted-foreground">
                    Use this tool to understand concepts. Read each step carefully and make sure you understand WHY it works.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Input Area */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-foreground">
                      Paste your problem
                    </label>
                    <Button variant="ghost" size="sm" onClick={handlePaste}>
                      <Clipboard className="w-4 h-4 mr-2" />
                      Paste
                    </Button>
                  </div>
                  <Textarea
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="Type or paste your homework question here...

Example: Solve the equation 2x² + 5x - 3 = 0"
                    className="min-h-[150px] resize-none mb-4"
                  />
                  <Button 
                    variant="hero" 
                    className="w-full" 
                    size="lg"
                    onClick={handleSubmit}
                    disabled={!problem.trim() || isLoading}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Solve Step by Step
                  </Button>
                </CardContent>
              </Card>

              {/* Example Problems */}
              <div>
                <p className="text-sm text-muted-foreground mb-3">Try an example:</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {exampleProblems.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => handleExampleClick(ex.text)}
                      className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md text-left transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <ex.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs mb-1">{ex.subject}</Badge>
                        <p className="text-sm text-foreground">{ex.text}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Conversation Area */}
          {messages.length > 0 && (
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      message.role === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-gradient-primary text-primary-foreground shadow-glow"
                    }`}>
                      {message.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className={`max-w-[85%] ${message.role === "user" ? "text-right" : ""}`}>
                      <Card className={`p-4 ${
                        message.role === "user" 
                          ? "bg-primary text-primary-foreground border-primary" 
                          : "bg-card border-border/50"
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </Card>
                      {message.role === "assistant" && message.content && (
                        <div className="flex gap-2 mt-2">
                          <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => copyToClipboard(message.content)}
                            className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <Card className="p-4 bg-card border-border/50">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </Card>
                </motion.div>
              )}

              <div ref={messagesEndRef} />

              {/* Follow-up input */}
              <Card className="mt-6">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Textarea
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      placeholder="Ask a follow-up question or paste another problem..."
                      className="min-h-[60px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }}
                    />
                    <Button 
                      variant="hero" 
                      size="icon" 
                      className="h-[60px] w-[60px] shrink-0"
                      onClick={handleSubmit}
                      disabled={!problem.trim() || isLoading}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <StudentFooter />
    </div>
  );
}
