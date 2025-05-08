
import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Download, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface AudioPlayerProps {
  audioUrl: string | null;
  title: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element when URL changes
  useEffect(() => {
    if (!audioUrl) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.volume = volume / 100;
      
      // Set up event listeners
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
      
      audioRef.current.addEventListener('timeupdate', () => {
        const current = audioRef.current?.currentTime || 0;
        setCurrentTime(current);
        setProgress((current / (audioRef.current?.duration || 1)) * 100);
      });
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
      });
    } else {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
    }
    
    return () => {
      // Clean up
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
      }
    };
  }, [audioUrl]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
  
  const togglePlay = () => {
    if (!audioUrl || !audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleDownload = () => {
    if (!audioUrl) return;
    
    // Create an anchor element and set attributes for download
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `${title.replace(/\s+/g, '_')}.mp3`; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const onProgressChange = (value: number[]) => {
    if (!audioRef.current) return;
    
    const newTime = (value[0] / 100) * (audioRef.current.duration || 0);
    audioRef.current.currentTime = newTime;
    setProgress(value[0]);
  };
  
  return (
    <div className="w-full p-5 glass-morphism rounded-xl">
      <h3 className="font-display font-medium text-lg mb-3 text-podcast-charcoal truncate">
        {title || "Your Podcast"}
      </h3>
      
      <div className="flex items-center gap-2 mb-3">
        <Button 
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-white border-podcast-teal text-podcast-teal hover:bg-podcast-teal hover:text-white transition-colors"
          onClick={togglePlay}
          disabled={!audioUrl}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </Button>
        
        <div className="flex-1 flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-10">
            {formatTime(currentTime)}
          </span>
          
          <div className="relative flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              onValueChange={onProgressChange}
              disabled={!audioUrl}
              className="absolute inset-0"
            />
            <div
              className="absolute h-full bg-gradient-to-r from-podcast-teal to-podcast-lilac"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <span className="text-xs text-muted-foreground w-10">
            {formatTime(duration)}
          </span>
        </div>
        
        <div className="flex items-center gap-2 ml-2">
          <Volume2 size={16} className="text-muted-foreground" />
          <Slider
            defaultValue={[volume]}
            max={100}
            step={1}
            className="w-20"
            onValueChange={(values) => setVolume(values[0])}
          />
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-podcast-teal"
          onClick={handleDownload}
          disabled={!audioUrl}
        >
          <Download size={18} />
        </Button>
      </div>
      
      <div className="flex justify-center mb-1">
        {isPlaying && (
          <div className="audio-wave text-podcast-teal">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="audio-wave-bar animate-wave"
                style={{
                  animationDelay: `${i * 0.05}s`,
                  height: `${12 + Math.random() * 15}px`
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
