/**
 * Ambient Piano Synthesis using Web Audio API
 * Generates a soft, premium ambient piano soundscape
 */

export class AmbientAudioSynthesizer {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private oscillators: OscillatorNode[] = [];
  private gains: GainNode[] = [];

  async initialize(): Promise<void> {
    if (this.audioContext) return;

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0.15; // Soft volume
    this.masterGain.connect(this.audioContext.destination);
  }

  private playNote(
    frequency: number,
    startTime: number,
    duration: number,
    gainValue: number
  ): void {
    if (!this.audioContext || !this.masterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = "sine";
    osc.frequency.value = frequency;

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainValue, startTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);

    this.oscillators.push(osc);
    this.gains.push(gain);
  }

  private playChord(
    frequencies: number[],
    startTime: number,
    duration: number,
    gainValue: number
  ): void {
    frequencies.forEach((freq) => {
      this.playNote(freq, startTime, duration, gainValue);
    });
  }

  start(): void {
    if (!this.audioContext || this.isPlaying) return;

    this.isPlaying = true;

    // Ambient piano progression: Cmaj7 -> Fmaj7 -> Cmaj7 -> Gmaj7
    // Using lower octaves for warmth
    const baseTime = this.audioContext.currentTime;
    const beatDuration = 4; // 4 seconds per chord

    // Cmaj7: C3, E3, G3, B3
    this.playChord([130.81, 164.81, 196.0, 246.94], baseTime, beatDuration, 0.08);

    // Fmaj7: F3, A3, C4, E4
    this.playChord([174.61, 220.0, 261.63, 329.63], baseTime + beatDuration, beatDuration, 0.08);

    // Cmaj7 again
    this.playChord([130.81, 164.81, 196.0, 246.94], baseTime + beatDuration * 2, beatDuration, 0.08);

    // Gmaj7: G3, B3, D4, F#4
    this.playChord([196.0, 246.94, 293.66, 369.99], baseTime + beatDuration * 3, beatDuration, 0.08);

    // Schedule next loop
    const loopDuration = beatDuration * 4;
    setTimeout(() => {
      if (this.isPlaying) {
        this.start();
      }
    }, loopDuration * 1000);
  }

  stop(): void {
    this.isPlaying = false;
    this.oscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.oscillators = [];
    this.gains = [];
  }

  setVolume(value: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, value));
    }
  }

  getVolume(): number {
    return this.masterGain?.gain.value ?? 0;
  }

  resume(): void {
    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }
}

// Singleton instance
let synthesizer: AmbientAudioSynthesizer | null = null;

export async function getAudioSynthesizer(): Promise<AmbientAudioSynthesizer> {
  if (!synthesizer) {
    synthesizer = new AmbientAudioSynthesizer();
    await synthesizer.initialize();
  }
  return synthesizer;
}
