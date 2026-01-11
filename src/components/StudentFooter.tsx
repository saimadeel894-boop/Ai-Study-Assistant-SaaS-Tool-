import { Link } from "react-router-dom";
import { GraduationCap, Heart, Coffee } from "lucide-react";

const footerLinks = {
  learn: [
    { label: "AI Assistant", href: "/chat" },
    { label: "Study Hub", href: "/library" },
    { label: "Homework Solver", href: "/solver" },
  ],
  resources: [
    { label: "Math Help", href: "/math-help" },
    { label: "Homework Helper", href: "/homework-helper" },
    { label: "Explain Simply", href: "/explain-simply" },
    { label: "About", href: "/about" },
  ],
};

export function StudentFooter() {
  return (
    <footer className="border-t border-border bg-card/50 py-8 sm:py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                Study<span className="text-gradient">AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Free AI-powered study assistant. No signup, no fees, just learning.
            </p>
          </div>

          {/* Learn Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Learn</h4>
            <ul className="space-y-2">
              {footerLinks.learn.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Support Us</h4>
            <p className="text-sm text-muted-foreground mb-4">
              StudyAI is free for everyone. Your support helps keep it running!
            </p>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors text-sm font-medium">
              <Coffee className="w-4 h-4" />
              Buy us a coffee
            </button>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <p className="text-xs sm:text-sm text-muted-foreground">
              © {new Date().getFullYear()} StudyAI. Free for all students.
            </p>
            <p className="text-xs text-muted-foreground/80">
              Created by <span className="font-medium text-foreground/70">SAIM ADEEL</span>
            </p>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 sm:w-4 h-3 sm:h-4 text-destructive fill-destructive" /> for students everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
