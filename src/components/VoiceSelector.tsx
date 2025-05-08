
import React, { useState } from "react";
import { Check, ChevronDown, Play, Pause, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VoiceOption } from "@/services/apiService";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VoiceSelectorProps {
  voices: VoiceOption[];
  selectedVoice: VoiceOption | null;
  onSelectVoice: (voice: VoiceOption) => void;
  onApiKeyChange: (key: string) => void;
  apiKey: string;
  isGeneratingAudio: boolean;
  onGenerateAudio: () => void;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  voices,
  selectedVoice,
  onSelectVoice,
  onApiKeyChange,
  apiKey,
  isGeneratingAudio,
  onGenerateAudio,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // In a real app, this would play the preview audio
  const handlePlayPreview = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 2000);
  };
  
  return (
    <div className="w-full glass-morphism rounded-xl p-5 space-y-4">
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-display font-medium text-podcast-charcoal">Voice Selection</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="voice-selector" className="text-sm mb-1.5 block">
            Select Voice
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between border-podcast-light-gray"
              >
                {selectedVoice ? selectedVoice.name : "Choose a voice"}
                <ChevronDown size={16} className="opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              {voices.map((voice) => (
                <DropdownMenuItem
                  key={voice.id}
                  onClick={() => onSelectVoice(voice)}
                  className="flex items-center justify-between"
                >
                  <span>{voice.name}</span>
                  {selectedVoice?.id === voice.id && <Check size={16} className="text-podcast-teal" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {selectedVoice && (
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-1 h-7 border-podcast-light-gray hover:bg-podcast-lilac/10"
                onClick={handlePlayPreview}
              >
                {isPlaying ? (
                  <Pause size={12} />
                ) : (
                  <Play size={12} />
                )}
                Preview voice
              </Button>
            </div>
          )}
        </div>
        
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Label htmlFor="api-key" className="text-sm">
              ElevenLabs API Key
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info size={14} className="text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Get your API key from ElevenLabs dashboard at elevenlabs.io
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex gap-2">
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder="Enter your API key"
              className="flex-1 border-podcast-light-gray focus-visible:ring-podcast-teal"
            />
            <Button
              onClick={onGenerateAudio}
              disabled={!selectedVoice || !apiKey || isGeneratingAudio}
              className="bg-podcast-teal text-white hover:bg-podcast-teal/90"
            >
              {isGeneratingAudio ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Processing
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1.5">
            Your API key is required to generate audio with ElevenLabs voices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceSelector;
