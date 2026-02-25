import React, { createContext, useContext, useEffect, useState } from "react";
import { getAudioSynthesizer, AmbientAudioSynthesizer } from "@/lib/audioSynthesis";

interface AudioContextType {
  isPlaying: boolean;
  volume: number;
  togglePlayback: () => void;
  setVolume: (value: number) => void;
  requestPlayback: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.15);
  const [synthesizer, setSynthesizer] = useState<AmbientAudioSynthesizer | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize synthesizer on mount
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const synth = await getAudioSynthesizer();
        if (mounted) {
          setSynthesizer(synth);
          setInitialized(true);

          // Restore saved preferences
          const savedVolume = localStorage.getItem("bidsnap_audio_volume");
          const savedPlaying = localStorage.getItem("bidsnap_audio_playing");

          if (savedVolume) {
            const vol = parseFloat(savedVolume);
            synth.setVolume(vol);
            setVolumeState(vol);
          }

          if (savedPlaying === "true") {
            synth.resume();
            synth.start();
            setIsPlaying(true);
          }
        }
      } catch (error) {
        console.error("Failed to initialize audio:", error);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const togglePlayback = () => {
    if (!synthesizer) return;

    if (isPlaying) {
      synthesizer.stop();
      setIsPlaying(false);
      localStorage.setItem("bidsnap_audio_playing", "false");
    } else {
      synthesizer.resume();
      synthesizer.start();
      setIsPlaying(true);
      localStorage.setItem("bidsnap_audio_playing", "true");
    }
  };

  const requestPlayback = () => {
    if (!synthesizer || isPlaying) return;

    synthesizer.resume();
    synthesizer.start();
    setIsPlaying(true);
    localStorage.setItem("bidsnap_audio_playing", "true");
  };

  const setVolume = (value: number) => {
    if (!synthesizer) return;

    const clampedValue = Math.max(0, Math.min(1, value));
    synthesizer.setVolume(clampedValue);
    setVolumeState(clampedValue);
    localStorage.setItem("bidsnap_audio_volume", clampedValue.toString());
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        volume,
        togglePlayback,
        setVolume,
        requestPlayback,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within AudioProvider");
  }
  return context;
}
