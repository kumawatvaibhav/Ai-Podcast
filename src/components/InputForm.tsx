
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Sparkles, SendHorizonal } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputFormProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
}

const EXAMPLE_TOPICS = [
  "The future of artificial intelligence",
  "Deep sea exploration mysteries",
  "Evolution of social media",
  "Space travel in the next decade",
  "Climate change solutions"
];

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onSubmit(topic.trim());
    }
  };
  
  const handleExampleClick = (example: string) => {
    setTopic(example);
  };
  
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="mb-4">
        <h2 className="text-xl font-display font-medium text-podcast-charcoal flex items-center gap-2">
          <Lightbulb size={20} className="text-podcast-teal" />
          What would you like to explore today?
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter a topic or question, and we'll craft a professional podcast script around it.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="e.g., The history and future of artificial intelligence"
          className="min-h-24 resize-none border-podcast-light-gray focus-visible:ring-podcast-teal"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground pt-1.5">Try:</span>
            {EXAMPLE_TOPICS.slice(0, 2).map((example) => (
              <Button
                key={example}
                variant="outline"
                size="sm"
                type="button"
                className="text-xs h-7 rounded-full border-podcast-light-gray hover:bg-podcast-peach/10 hover:text-podcast-charcoal"
                onClick={() => handleExampleClick(example)}
              >
                {example}
              </Button>
            ))}
          </div>
          
          <Button
            type="submit"
            disabled={!topic.trim() || isLoading}
            className={cn(
              "bg-gradient-to-r from-podcast-teal to-podcast-lilac hover:opacity-90 text-white",
              isLoading && "opacity-80"
            )}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Generating
              </>
            ) : (
              <>
                <SendHorizonal size={18} className="mr-2" />
                Generate Podcast
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
