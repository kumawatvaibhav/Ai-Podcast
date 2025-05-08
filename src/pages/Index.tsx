
import React, { useState } from "react";
import { Headphones, Sparkles, MessageSquare } from "lucide-react";
import InputForm from "@/components/InputForm";
import ScriptDisplay from "@/components/ScriptDisplay";
import VoiceSelector from "@/components/VoiceSelector";
import AudioPlayer from "@/components/AudioPlayer";
import { useToast } from "@/hooks/use-toast";
import {
  generateScript,
  generateAudio,
  voiceOptions,
  VoiceOption,
  GeneratedScript
} from "@/services/apiService";

const Index = () => {
  const { toast } = useToast();
  const [topic, setTopic] = useState<string>("");
  const [isGeneratingScript, setIsGeneratingScript] = useState<boolean>(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState<boolean>(false);
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const handleTopicSubmit = async (submittedTopic: string) => {
    try {
      setTopic(submittedTopic);
      setIsGeneratingScript(true);
      setGeneratedScript(null);
      setAudioUrl(null);
      
      const script = await generateScript(submittedTopic);
      
      setGeneratedScript(script);
      
      toast({
        title: "Script generated successfully!",
        description: "Now you can generate audio for your podcast.",
      });
    } catch (error) {
      console.error("Error generating script:", error);
      toast({
        title: "Error generating script",
        description: "Please try again with a different topic.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingScript(false);
    }
  };
  
  const handleGenerateAudio = async () => {
    if (!generatedScript || !selectedVoice || !apiKey) {
      toast({
        title: "Missing information",
        description: "Please ensure you have a script, selected voice, and API key.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsGeneratingAudio(true);
      
      // For better user experience, we'll use a shorter excerpt of the script
      // Removing markdown formatting for better TTS results
      const cleanText = generatedScript.content
        .replace(/^#.*$/gm, '') // Remove headers
        .replace(/^\s*[-*]\s*/gm, '') // Remove bullet points
        .replace(/\n\n+/g, '\n\n') // Normalize spacing
        .trim()
        .substring(0, 2000); // Limit length for API call
      
      const audioResult = await generateAudio(
        cleanText,
        selectedVoice.id,
        apiKey
      );
      
      setAudioUrl(audioResult);
      
      toast({
        title: "Audio generated successfully!",
        description: "You can now play and download your podcast.",
      });
    } catch (error) {
      console.error("Error generating audio:", error);
      let errorMessage = "Please check your API key and try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("401")) {
          errorMessage = "Invalid API key. Please check your ElevenLabs API key.";
        } else if (error.message.includes("429")) {
          errorMessage = "API rate limit reached. Please try again later.";
        }
      }
      
      toast({
        title: "Error generating audio",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-subtle subtle-pattern">
      <header className="pt-8 pb-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-podcast-teal to-podcast-lilac flex items-center justify-center">
              <Headphones className="text-white" size={20} />
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-semibold text-podcast-charcoal">
              AudioVerseCraft
            </h1>
          </div>
          <p className="text-muted-foreground max-w-lg">
            Transform your ideas into polished podcast scripts with Grok AI and professional audio
            using ElevenLabs voices. Enter a topic, generate a script, pick a voice, and listen.
          </p>
          <div className="flex items-center mt-2 gap-1.5 text-xs text-muted-foreground">
            <MessageSquare size={12} className="text-podcast-teal" />
            <span>Powered by Grok for script generation</span>
          </div>
        </div>
      </header>
      
      <main className="px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-6">
          <section className="glass-morphism p-6 rounded-2xl">
            <InputForm onSubmit={handleTopicSubmit} isLoading={isGeneratingScript} />
          </section>
          
          {(isGeneratingScript || generatedScript) && (
            <section>
              <ScriptDisplay
                title={generatedScript?.title || ""}
                content={generatedScript?.content || ""}
                isLoading={isGeneratingScript}
              />
            </section>
          )}
          
          {generatedScript && !isGeneratingScript && (
            <section>
              <VoiceSelector
                voices={voiceOptions}
                selectedVoice={selectedVoice}
                onSelectVoice={setSelectedVoice}
                apiKey={apiKey}
                onApiKeyChange={setApiKey}
                isGeneratingAudio={isGeneratingAudio}
                onGenerateAudio={handleGenerateAudio}
              />
            </section>
          )}
          
          {(audioUrl || isGeneratingAudio) && (
            <section className={isGeneratingAudio ? "opacity-70" : ""}>
              <AudioPlayer
                audioUrl={audioUrl}
                title={generatedScript?.title || "Generated Podcast"}
              />
            </section>
          )}
        </div>
      </main>
      
      <footer className="py-6 px-4 border-t border-podcast-light-gray">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AudioVerseCraft
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Sparkles size={12} className="text-podcast-lilac" />
              <span>Audio by ElevenLabs</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquare size={12} className="text-podcast-teal" />
              <span>Scripts by Grok</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
