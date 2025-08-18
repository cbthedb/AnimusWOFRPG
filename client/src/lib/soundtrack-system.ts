import { Character, GameData } from "@shared/schema";

export interface SoundtrackTrack {
  id: string;
  name: string;
  url: string;
  type: "basic" | "button" | "soul_trigger" | "ai_control" | "game_over";
  soulThreshold?: number;
  volume: number;
  loop: boolean;
  duration?: number;
}

export class SoundtrackSystem {
  private static currentAudio: HTMLAudioElement | null = null;
  private static currentTrack: string | null = null;
  private static isMuted: boolean = false;
  private static volume: number = 0.7;
  private static aiControlTimer: NodeJS.Timeout | null = null;
  private static onAIControlStart?: () => void;
  private static onAIControlEnd?: () => void;

  private static readonly TRACKS: SoundtrackTrack[] = [
    // Basic background OSTs (passive)
    {
      id: "basic_ost",
      name: "Basic Academy Ambience",
      url: "/ost/basicost_1755480743859.mp3",
      type: "basic",
      volume: 0.4,
      loop: true
    },
    {
      id: "basic_ost_2",
      name: "Alternative Academy Theme",
      url: "/ost/basicost2_1755480743857.mp3",
      type: "basic",
      volume: 0.4,
      loop: true
    },
    
    // Button click sound
    {
      id: "button_sound",
      name: "Button Click",
      url: "/ost/buttonsound_1755480743860.mp3",
      type: "button",
      volume: 0.6,
      loop: false
    },
    
    // Soul threshold triggers
    {
      id: "soul_below_40",
      name: "Soul Corruption Warning",
      url: "/ost/ifsoulbelow40%loopsong_1755480743860.mp3",
      type: "soul_trigger",
      soulThreshold: 40,
      volume: 0.5,
      loop: true
    },
    {
      id: "soul_below_20",
      name: "Critical Soul Loss",
      url: "/ost/ifsoulbelow20%playandloop_1755480787933.mp3",
      type: "soul_trigger",
      soulThreshold: 20,
      volume: 0.6,
      loop: true
    },
    
    // AI Control (when soul hits 0%)
    {
      id: "soul_0_ai_control",
      name: "AI Takes Control",
      url: "/ost/ifsoul0%play_1755480787934.mp3",
      type: "ai_control",
      soulThreshold: 0,
      volume: 0.8,
      loop: false,
      duration: 133000 // 2 minutes 13 seconds in milliseconds
    },
    
    // Game Over (if animus magic used again after warning)
    {
      id: "animus_death",
      name: "Final Corruption",
      url: "/ost/ifuseanimusmagicagainplay_1755480879926.mp3",
      type: "game_over",
      volume: 0.7,
      loop: false
    }
  ];

  static initialize(onAIControlStart?: () => void, onAIControlEnd?: () => void): void {
    // Set default volume from localStorage if available
    const savedVolume = localStorage.getItem('wof_game_volume');
    const savedMuted = localStorage.getItem('wof_game_muted');
    
    if (savedVolume) {
      this.volume = parseFloat(savedVolume);
    }
    
    if (savedMuted) {
      this.isMuted = savedMuted === 'true';
    }

    // Set AI control callbacks
    this.onAIControlStart = onAIControlStart;
    this.onAIControlEnd = onAIControlEnd;

    // Start with basic academy music
    this.playTrack('basic_ost');
  }

  static playTrack(trackId: string, force: boolean = false): void {
    if (this.isMuted && !force) return;
    if (this.currentTrack === trackId && !force) return;

    const track = this.TRACKS.find(t => t.id === trackId);
    if (!track) {
      console.warn(`Track not found: ${trackId}`);
      return;
    }

    // Stop current audio
    this.stopCurrentTrack();

    try {
      // Create new audio element
      this.currentAudio = new Audio(track.url);
      this.currentAudio.volume = this.volume * track.volume;
      this.currentAudio.loop = track.loop;
      
      // Handle AI control track specially
      if (track.type === 'ai_control') {
        this.handleAIControlTrack(track);
      }
      
      // Play the track
      const playPromise = this.currentAudio.play();
      if (playPromise) {
        playPromise.catch(error => {
          console.warn("Could not play audio track:", error);
        });
      }
      
      this.currentTrack = trackId;
      console.log(`🎵 Now playing: ${track.name}`);
      
    } catch (error) {
      console.warn("Could not play audio track:", error);
    }
  }

  private static handleAIControlTrack(track: SoundtrackTrack): void {
    // Trigger AI control mode
    if (this.onAIControlStart) {
      this.onAIControlStart();
    }
    
    // Set timer for AI control duration (2 minutes 13 seconds)
    if (this.aiControlTimer) {
      clearTimeout(this.aiControlTimer);
    }
    
    this.aiControlTimer = setTimeout(() => {
      // Show warning and end AI control
      if (this.onAIControlEnd) {
        this.onAIControlEnd();
      }
      
      // Switch back to appropriate background music
      this.playTrack('soul_below_20', true);
      
    }, track.duration || 133000);
  }

  static stopCurrentTrack(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    
    if (this.aiControlTimer) {
      clearTimeout(this.aiControlTimer);
      this.aiControlTimer = null;
    }
    
    this.currentTrack = null;
  }

  static setMuted(muted: boolean): void {
    this.isMuted = muted;
    localStorage.setItem('wof_game_muted', muted.toString());
    
    if (muted) {
      this.stopCurrentTrack();
    } else {
      // Resume with basic track
      this.playTrack('basic_ost');
    }
  }

  static setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('wof_game_volume', this.volume.toString());
    
    // Update current track volume
    if (this.currentAudio) {
      const currentTrack = this.TRACKS.find(t => t.id === this.currentTrack);
      if (currentTrack) {
        this.currentAudio.volume = this.volume * currentTrack.volume;
      }
    }
  }

  static getContextualTrack(character: Character, gameData: GameData): string {
    // Soul-based track selection (highest priority)
    if (character.soulPercentage === 0) {
      return 'soul_0_ai_control';
    }
    
    if (character.soulPercentage <= 20) {
      return 'soul_below_20';
    }
    
    if (character.soulPercentage <= 40) {
      return 'soul_below_40';
    }
    
    // Default to basic OST
    return Math.random() > 0.5 ? 'basic_ost' : 'basic_ost_2';
  }

  static updateBasedOnGameState(character: Character, gameData: GameData): void {
    const contextualTrack = this.getContextualTrack(character, gameData);
    this.playTrack(contextualTrack);
  }

  static playButtonSound(): void {
    if (this.isMuted) return;
    
    // Play button sound without interrupting background music
    try {
      const buttonAudio = new Audio("/ost/buttonsound_1755480743860.mp3");
      buttonAudio.volume = this.volume * 0.6;
      buttonAudio.play().catch(error => {
        console.warn("Could not play button sound:", error);
      });
    } catch (error) {
      console.warn("Could not create button audio:", error);
    }
  }

  static playGameOverTrack(): void {
    this.playTrack('animus_death', true);
  }

  static checkSoulThresholds(oldSoul: number, newSoul: number, character: Character, gameData: GameData): boolean {
    // Check if any soul thresholds were crossed
    let shouldUpdateMusic = false;
    
    // Soul hit 0% - trigger AI control
    if (oldSoul > 0 && newSoul === 0) {
      this.playTrack('soul_0_ai_control', true);
      return true; // AI control started
    }
    
    // Soul dropped below 20%
    if (oldSoul > 20 && newSoul <= 20) {
      this.playTrack('soul_below_20', true);
      shouldUpdateMusic = true;
    }
    // Soul dropped below 40%
    else if (oldSoul > 40 && newSoul <= 40) {
      this.playTrack('soul_below_40', true);
      shouldUpdateMusic = true;
    }
    
    // Soul recovered above thresholds - play appropriate track based on current soul level
    if (oldSoul <= 20 && newSoul > 20 && newSoul <= 40) {
      this.playTrack('soul_below_40', true);
      shouldUpdateMusic = true;
    }
    else if (oldSoul <= 40 && newSoul > 40) {
      this.updateBasedOnGameState(character, gameData);
      shouldUpdateMusic = true;
    }
    
    // If no threshold crossed, ensure proper track is playing
    if (!shouldUpdateMusic) {
      const contextualTrack = this.getContextualTrack(character, gameData);
      if (this.currentTrack !== contextualTrack) {
        this.playTrack(contextualTrack, true);
      }
    }
    
    return false; // No AI control
  }

  static isMutedState(): boolean {
    return this.isMuted;
  }

  static getCurrentVolume(): number {
    return this.volume;
  }

  static isAIControlActive(): boolean {
    return this.currentTrack === 'soul_0_ai_control' && this.aiControlTimer !== null;
  }
}