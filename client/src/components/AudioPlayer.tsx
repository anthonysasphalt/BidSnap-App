import { useAudio } from "@/contexts/AudioContext";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

/**
 * AudioPlayer — Floating audio control in corner
 * Shows volume slider and play/pause toggle
 * Persists volume and playback state to localStorage
 */
export function AudioPlayer() {
  const { isPlaying, volume, togglePlayback, setVolume } = useAudio();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <div className="flex items-center gap-3">
        {/* Volume Slider */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 120 }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 backdrop-blur-sm"
            >
              <VolumeX className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={(e) => setVolume(parseFloat(e.target.value) / 100)}
                className="w-full h-1 bg-muted rounded-full cursor-pointer appearance-none"
                style={{
                  background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                    volume * 100
                  }%, #374151 ${volume * 100}%, #374151 100%)`,
                }}
              />
              <Volume2 className="w-3 h-3 text-primary flex-shrink-0" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play/Pause Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePlayback}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/30 hover:border-primary/50 transition-all backdrop-blur-sm hover:bg-primary/15 group"
          title={isPlaying ? "Pause ambient audio" : "Play ambient audio"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-primary fill-primary" />
          ) : (
            <Play className="w-5 h-5 text-primary fill-primary" />
          )}
        </motion.button>
      </div>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-full right-0 mb-2 text-xs text-muted-foreground whitespace-nowrap pointer-events-none"
      >
        {isPlaying ? "Ambient audio playing" : "Click to enable audio"}
      </motion.div>
    </motion.div>
  );
}
