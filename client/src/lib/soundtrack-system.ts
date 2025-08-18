import { Character, GameData } from "@shared/schema";

export interface SoundtrackTrack {
  id: string;
  name: string;
  url: string;
  mood: "peaceful" | "dramatic" | "mysterious" | "combat" | "romantic" | "magical" | "dark";
  volume: number;
  loop: boolean;
}

export class SoundtrackSystem {
  private static currentAudio: HTMLAudioElement | null = null;
  private static currentTrack: string | null = null;
  private static isMuted: boolean = false;
  private static volume: number = 0.3;

  // Simple ambient tracks using data URIs for basic tones
  private static readonly TRACKS: SoundtrackTrack[] = [
    {
      id: "peaceful_academy",
      name: "Academy Life",
      url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwUOgR0H",
      mood: "peaceful",
      volume: 0.2,
      loop: true
    },
    {
      id: "dramatic_choice",
      name: "Critical Decision",
      url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwUOgR0H",
      mood: "dramatic",
      volume: 0.4,
      loop: false
    },
    {
      id: "magical_animus",
      name: "Animus Magic",
      url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwUOgR0H",
      mood: "magical",
      volume: 0.3,
      loop: true
    },
    {
      id: "dark_corruption",
      name: "Soul Corruption",
      url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwUOgR0H",
      mood: "dark",
      volume: 0.25,
      loop: true
    }
  ];

  static initialize(): void {
    // Set default volume from localStorage if available
    const savedVolume = localStorage.getItem('wof_game_volume');
    const savedMuted = localStorage.getItem('wof_game_muted');
    
    if (savedVolume) {
      this.volume = parseFloat(savedVolume);
    }
    
    if (savedMuted) {
      this.isMuted = savedMuted === 'true';
    }

    // Start with peaceful academy music
    this.playTrack('peaceful_academy');
  }

  static playTrack(trackId: string): void {
    if (this.isMuted || this.currentTrack === trackId) return;

    const track = this.TRACKS.find(t => t.id === trackId);
    if (!track) return;

    // Stop current audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    try {
      // Create simple tone using Web Audio API for ambient background
      this.createAmbientTone(track);
      this.currentTrack = trackId;
      
      console.log(`🎵 Now playing: ${track.name}`);
    } catch (error) {
      console.warn("Could not play audio track:", error);
    }
  }

  private static createAmbientTone(track: SoundtrackTrack): void {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Set frequency based on mood
      const frequencies = {
        peaceful: 220,
        dramatic: 110,
        magical: 330,
        dark: 55,
        mysterious: 165,
        combat: 82,
        romantic: 440
      };

      oscillator.frequency.setValueAtTime(frequencies[track.mood], audioContext.currentTime);
      oscillator.type = track.mood === 'dark' ? 'sawtooth' : 'sine';
      
      // Set volume
      gainNode.gain.setValueAtTime(this.volume * track.volume, audioContext.currentTime);
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Start playing
      oscillator.start();
      
      // Store reference for cleanup
      (this as any).currentOscillator = oscillator;
      (this as any).currentGainNode = gainNode;
      (this as any).currentAudioContext = audioContext;
      
      if (track.loop) {
        // For looping tracks, fade in and out subtly
        const duration = 30000; // 30 seconds
        setTimeout(() => {
          if (!this.isMuted) {
            this.createAmbientTone(track); // Restart for loop effect
          }
        }, duration);
      }
      
    } catch (error) {
      console.warn("Web Audio API not supported, playing silent track");
    }
  }

  static stopCurrentTrack(): void {
    if ((this as any).currentOscillator) {
      try {
        (this as any).currentOscillator.stop();
        (this as any).currentAudioContext.close();
      } catch (error) {
        // Audio context might already be closed
      }
    }
    this.currentTrack = null;
  }

  static setMuted(muted: boolean): void {
    this.isMuted = muted;
    localStorage.setItem('wof_game_muted', muted.toString());
    
    if (muted) {
      this.stopCurrentTrack();
    } else {
      // Resume with peaceful track
      this.playTrack('peaceful_academy');
    }
  }

  static setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('wof_game_volume', this.volume.toString());
    
    // Update current track volume
    if ((this as any).currentGainNode) {
      try {
        (this as any).currentGainNode.gain.setValueAtTime(this.volume * 0.3, (this as any).currentAudioContext.currentTime);
      } catch (error) {
        // Gain node might be disposed
      }
    }
  }

  static getContextualTrack(character: Character, gameData: GameData, scenarioType?: string): string {
    // Choose track based on game state
    if (character.soulPercentage < 30) {
      return 'dark_corruption';
    }
    
    if (scenarioType === 'magical' || gameData.currentScenario?.type === 'magical') {
      return 'magical_animus';
    }
    
    if (character.sanityPercentage < 50 || scenarioType === 'extraordinary') {
      return 'dramatic_choice';
    }
    
    return 'peaceful_academy';
  }

  static updateBasedOnGameState(character: Character, gameData: GameData): void {
    const contextualTrack = this.getContextualTrack(character, gameData, gameData.currentScenario?.type);
    this.playTrack(contextualTrack);
  }

  static isMutedState(): boolean {
    return this.isMuted;
  }

  static getCurrentVolume(): number {
    return this.volume;
  }
}