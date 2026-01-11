import { motion } from "framer-motion";

interface AnswerRendererProps {
  content: string;
}

export function AnswerRenderer({ content }: AnswerRendererProps) {
  // Render plain text content with proper styling
  // The AI now returns plain text without markdown, so we render it cleanly
  const renderContent = () => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];

    lines.forEach((line, i) => {
      const trimmedLine = line.trim();

      // Empty lines become spacing
      if (!trimmedLine) {
        elements.push(<div key={`space-${i}`} className="h-3" />);
        return;
      }

      // Detect step patterns like "Step 1:", "Step 2:", etc.
      const stepMatch = trimmedLine.match(/^Step\s*(\d+):?\s*(.*)/i);
      if (stepMatch) {
        const stepNum = stepMatch[1];
        const stepContent = stepMatch[2];
        elements.push(
          <div key={`step-${i}`} className="flex items-start gap-3 my-2">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
              {stepNum}
            </span>
            <p className="text-sm text-foreground/90 pt-1 leading-relaxed">{stepContent}</p>
          </div>
        );
        return;
      }

      // Detect section headers like "Key takeaways:", "What to learn next:", etc.
      const sectionMatch = trimmedLine.match(/^(Key takeaways|What to learn next|Practice suggestion|Example|Summary|Related topics):?\s*(.*)/i);
      if (sectionMatch) {
        const sectionTitle = sectionMatch[1];
        const sectionContent = sectionMatch[2];
        elements.push(
          <div key={`section-${i}`} className="mt-4 mb-2">
            <h4 className="font-display font-semibold text-foreground text-sm mb-1">
              {sectionTitle}
            </h4>
            {sectionContent && (
              <p className="text-sm text-foreground/90 leading-relaxed">{sectionContent}</p>
            )}
          </div>
        );
        return;
      }

      // Detect numbered items like "1.", "2.", etc.
      const numberedMatch = trimmedLine.match(/^(\d+)\.\s*(.*)/);
      if (numberedMatch) {
        const num = numberedMatch[1];
        const itemContent = numberedMatch[2];
        elements.push(
          <div key={`num-${i}`} className="flex items-start gap-2 my-1.5 ml-2">
            <span className="text-primary font-medium text-sm">{num}.</span>
            <p className="text-sm text-foreground/90 leading-relaxed">{itemContent}</p>
          </div>
        );
        return;
      }

      // Regular paragraphs
      elements.push(
        <p key={`p-${i}`} className="text-sm text-foreground/90 my-2 leading-relaxed">
          {trimmedLine}
        </p>
      );
    });

    return elements;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-none"
    >
      {renderContent()}
    </motion.div>
  );
}
