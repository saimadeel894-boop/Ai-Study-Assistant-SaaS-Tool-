import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  Calculator, 
  FlaskConical, 
  BookOpen,
  Code,
  Globe,
  Brain,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RotateCcw,
  BookMarked,
  History,
  Trash2,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { StudentHeader } from "@/components/StudentHeader";
import { StudentFooter } from "@/components/StudentFooter";
import { useStudySession } from "@/hooks/useLocalStorage";
import { QuickStudyTools } from "@/components/QuickStudyTools";
import { SmartSuggestions } from "@/components/SmartSuggestions";
import { AnswerRenderer } from "@/components/AnswerRenderer";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  showSuggestions?: boolean;
}

const subjects = [
  { id: "math", name: "Math Mode", icon: Calculator, description: "Steps & formulas" },
  { id: "science", name: "Science Mode", icon: FlaskConical, description: "Real-world examples" },
  { id: "english", name: "Language Mode", icon: BookOpen, description: "Grammar & usage" },
  { id: "history", name: "History Mode", icon: Globe, description: "Context & causes" },
  { id: "coding", name: "Coding Mode", icon: Code, description: "Code snippets" },
  { id: "general", name: "General", icon: Brain, description: "All subjects" },
];

const suggestedQuestions: Record<string, { icon: typeof Calculator; text: string }[]> = {
  default: [
    { icon: Calculator, text: "Explain quadratic equations step by step" },
    { icon: FlaskConical, text: "What is photosynthesis and how does it work?" },
    { icon: BookOpen, text: "Help me analyze Shakespeare's themes" },
    { icon: Code, text: "How do I create a for loop in Python?" },
  ],
  math: [
    { icon: Calculator, text: "How do I solve quadratic equations?" },
    { icon: Calculator, text: "Explain the Pythagorean theorem" },
    { icon: Calculator, text: "What are derivatives in calculus?" },
    { icon: Calculator, text: "How do fractions work?" },
  ],
  science: [
    { icon: FlaskConical, text: "Explain photosynthesis step by step" },
    { icon: FlaskConical, text: "What is Newton's second law?" },
    { icon: FlaskConical, text: "How does the water cycle work?" },
    { icon: FlaskConical, text: "What are atoms made of?" },
  ],
  english: [
    { icon: BookOpen, text: "How do I write a strong thesis statement?" },
    { icon: BookOpen, text: "Explain the difference between simile and metaphor" },
    { icon: BookOpen, text: "How do I structure an essay?" },
    { icon: BookOpen, text: "What are the main themes in Romeo and Juliet?" },
  ],
  history: [
    { icon: Globe, text: "What caused World War 1?" },
    { icon: Globe, text: "Explain the French Revolution" },
    { icon: Globe, text: "Who was Alexander the Great?" },
    { icon: Globe, text: "What was the Renaissance?" },
  ],
  coding: [
    { icon: Code, text: "How do I create a for loop in Python?" },
    { icon: Code, text: "What is the difference between let and const?" },
    { icon: Code, text: "Explain object-oriented programming" },
    { icon: Code, text: "How do arrays work?" },
  ],
  general: [
    { icon: Brain, text: "How does the internet work?" },
    { icon: Brain, text: "Why is the sky blue?" },
    { icon: Brain, text: "How do planes fly?" },
    { icon: Brain, text: "What is artificial intelligence?" },
  ],
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export default function StudentChatPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const selectedSubject = searchParams.get("subject") || "general";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I am your AI study assistant, here to help you learn.\n\nSelect a subject mode above for tailored explanations, or just ask me anything!\n\nI will give you:\nSimple explanations in plain language\nStep-by-step breakdowns\nClear examples with real values\nKey points to remember\nSuggestions for what to learn next\n\nWhat would you like to learn today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSubject, setActiveSubject] = useState(selectedSubject);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialQuery = useRef(false);
  const { session, addRecentTopic, clearRecentTopics } = useStudySession();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialQuery && !hasInitialQuery.current) {
      hasInitialQuery.current = true;
      setInput("");
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    addRecentTopic(textToSend, activeSubject === "general" ? "General" : activeSubject);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!messageText) setInput("");
    setIsLoading(true);

    const apiMessages = [...messages.slice(1), userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

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
          subjectMode: activeSubject,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Rate limit exceeded. Please try again in a moment.");
          throw new Error("Rate limit exceeded");
        }
        if (response.status === 402) {
          toast.error("Service temporarily unavailable. Please try again later.");
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
          showSuggestions: false,
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

      // Show suggestions after response completes
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? { ...m, showSuggestions: true }
            : m
        )
      );

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
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
          } catch { /* ignore */ }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get AI response. Please try again.");
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

  const handleSend = () => handleSendMessage();

  const handleToolResult = (result: string, toolName: string) => {
    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: `**${toolName} Result:**\n\n${result}`,
      timestamp: new Date(),
      showSuggestions: true,
    };
    setMessages((prev) => [...prev, assistantMessage]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Chat cleared! What would you like to learn about today?",
        timestamp: new Date(),
      },
    ]);
  };

  const currentSuggestions = suggestedQuestions[activeSubject] || suggestedQuestions.default;
  const activeSubjectData = subjects.find(s => s.id === activeSubject) || subjects[5];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <StudentHeader />
      
      <div className="flex-1 flex pt-16">
        {/* Sidebar - Hidden on mobile */}
        <aside className="hidden lg:flex w-72 border-r border-border bg-card/50 flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-display font-semibold text-foreground mb-3">Subject Mode</h3>
            <div className="space-y-1">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => setActiveSubject(subject.id)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-sm transition-colors text-left ${
                    activeSubject === subject.id
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  <subject.icon className="w-4 h-4" />
                  <div>
                    <p className="font-medium">{subject.name}</p>
                    <p className="text-xs opacity-70">{subject.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Study Tools */}
          <div className="p-4 border-b border-border">
            <QuickStudyTools onResult={handleToolResult} />
          </div>

          {/* Recent Topics */}
          {session.recentTopics.length > 0 && (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Recent Topics
                </h3>
                <button 
                  onClick={clearRecentTopics}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <ul className="space-y-1">
                {session.recentTopics.slice(0, 5).map((topic) => (
                  <li key={topic.id}>
                    <button 
                      onClick={() => handleSendMessage(topic.query)}
                      className="w-full text-left p-2.5 rounded-lg hover:bg-secondary transition-colors group"
                    >
                      <p className="text-sm text-foreground truncate group-hover:text-primary transition-colors">
                        {topic.query}
                      </p>
                      <p className="text-xs text-muted-foreground">{topic.subject}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Study Streak */}
          {session.studyStreak > 0 && (
            <div className="p-4 border-t border-border">
              <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl p-4 border border-accent/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">🔥</span>
                  <span className="font-display font-bold text-xl text-foreground">{session.studyStreak}</span>
                </div>
                <p className="text-xs text-muted-foreground">Day study streak! Keep it up!</p>
              </div>
            </div>
          )}

          <div className="p-4 border-t border-border">
            <Button variant="ghost" className="w-full justify-start" size="sm" onClick={clearChat}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear Chat
            </Button>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Sticky Chat Header with Mode Selector */}
          <div className="sticky top-16 z-40 border-b border-border px-4 py-3 bg-card/95 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display font-semibold text-foreground">AI Study Assistant</h1>
                  <p className="text-xs text-muted-foreground">Structured answers • Step-by-step explanations</p>
                </div>
              </div>
              
              {/* Mobile Mode Selector */}
              <div className="lg:hidden relative">
                <button
                  onClick={() => setShowModeSelector(!showModeSelector)}
                  className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg text-sm"
                >
                  <activeSubjectData.icon className="w-4 h-4 text-primary" />
                  <span className="text-foreground">{activeSubjectData.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showModeSelector ? "rotate-180" : ""}`} />
                </button>
                
                <AnimatePresence>
                  {showModeSelector && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
                    >
                      {subjects.map((subject) => (
                        <button
                          key={subject.id}
                          onClick={() => {
                            setActiveSubject(subject.id);
                            setShowModeSelector(false);
                          }}
                          className={`w-full flex items-center gap-3 p-3 text-sm transition-colors text-left ${
                            activeSubject === subject.id
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-secondary text-muted-foreground"
                          }`}
                        >
                          <subject.icon className="w-4 h-4" />
                          <div>
                            <p className="font-medium">{subject.name}</p>
                            <p className="text-xs opacity-70">{subject.description}</p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Badge variant="secondary" className="hidden sm:flex">
                <span className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
                Free
              </Badge>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 sm:space-y-6">
            <AnimatePresence>
              {messages.map((message, idx) => (
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
                  <div className={`max-w-[85%] lg:max-w-[75%] ${message.role === "user" ? "text-right" : ""}`}>
                    <Card className={`p-4 ${
                      message.role === "user" 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-card border-border/50"
                    }`}>
                      {message.role === "assistant" ? (
                        <AnswerRenderer content={message.content} />
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      )}
                    </Card>
                    {message.role === "assistant" && message.content && (
                      <>
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
                          <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                            <BookMarked className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Smart Suggestions after AI response */}
                        {message.showSuggestions && idx === messages.length - 1 && !isLoading && (
                          <SmartSuggestions 
                            topic={messages[messages.length - 2]?.content || ""} 
                            subject={activeSubject}
                            onSelect={handleSendMessage}
                          />
                        )}
                      </>
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
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="px-3 sm:px-4 pb-4">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-accent" />
                Try asking:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentSuggestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q.text)}
                    className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-secondary/50 hover:bg-secondary text-left transition-colors group"
                  >
                    <q.icon className="w-4 sm:w-5 h-4 sm:h-5 text-primary shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2 sm:line-clamp-1">
                      {q.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sticky Input Area */}
          <div className="sticky bottom-0 border-t border-border p-3 sm:p-4 bg-card/95 backdrop-blur-sm safe-area-inset-bottom">
            <div className="flex gap-2 sm:gap-3">
              <div className="relative flex-1 min-w-0">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Ask any study question..."
                  className="pr-10 sm:pr-12 h-11 sm:h-12 text-base"
                />
                <Badge variant="secondary" className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-xs hidden sm:flex">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI
                </Badge>
              </div>
              <Button 
                variant="hero" 
                size="icon" 
                className="h-11 sm:h-12 w-11 sm:w-12 flex-shrink-0" 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
              >
                <Send className="w-4 sm:w-5 h-4 sm:h-5" />
              </Button>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 text-center">
              Free to use • No signup required • AI can make mistakes
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
