
import React from "react";
import { Download, Copy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ScriptDisplayProps {
  title: string;
  content: string;
  isLoading: boolean;
}

const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ title, content, isLoading }) => {
  const { toast } = useToast();
  
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Script copied to clipboard",
      description: "You can now paste it anywhere you need.",
    });
  };
  
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s+/g, "-").toLowerCase()}-script.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  if (isLoading) {
    return (
      <div className="w-full p-6 glass-morphism rounded-xl h-56 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-podcast-peach to-podcast-lilac opacity-20 animate-pulse-slow"></div>
            <Sparkles size={28} className="text-podcast-teal relative z-10" />
          </div>
          <p className="text-sm text-muted-foreground">Crafting your podcast script...</p>
        </div>
      </div>
    );
  }
  
  if (!content) {
    return null;
  }
  
  // Process markdown content for simple rendering
  const processMarkdown = (text: string) => {
    // Handle headers
    let processed = text.replace(/^# (.*$)/gm, '<h1 class="text-xl font-display font-medium mt-4 mb-2">$1</h1>');
    processed = processed.replace(/^## (.*$)/gm, '<h2 class="text-lg font-display font-medium mt-3 mb-1">$1</h2>');
    
    // Handle lists
    processed = processed.replace(/^\- (.*$)/gm, '<li class="ml-4 mb-1">$1</li>');
    processed = processed.replace(/^\d\. (.*$)/gm, '<li class="ml-4 list-decimal mb-1">$1</li>');
    
    // Handle paragraphs
    processed = processed.replace(/^(?!<h|<li)(.*$)/gm, function(match) {
      if (match.trim() === '') return '';
      return `<p class="mb-3">${match}</p>`;
    });
    
    return processed;
  };
  
  return (
    <div className="w-full glass-morphism rounded-xl overflow-hidden flex flex-col">
      <div className="p-5 border-b border-podcast-light-gray flex justify-between items-center">
        <h3 className="font-display font-medium text-podcast-charcoal">
          {title || "Generated Script"}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-podcast-light-gray hover:bg-podcast-peach/10"
            onClick={handleCopy}
          >
            <Copy size={14} className="mr-1" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-podcast-light-gray hover:bg-podcast-teal/10"
            onClick={handleDownload}
          >
            <Download size={14} className="mr-1" />
            Download
          </Button>
        </div>
      </div>
      
      <div className="script-container p-5 bg-podcast-cream/30">
        <div className="prose prose-sm max-w-none font-serif leading-relaxed text-podcast-charcoal/90"
             dangerouslySetInnerHTML={{ __html: processMarkdown(content) }} />
      </div>
    </div>
  );
};

export default ScriptDisplay;
