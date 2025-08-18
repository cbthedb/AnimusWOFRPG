import { Character, GameData } from "@shared/schema";

// Audio file imports using attached assets
import basicOst1 from "@assets/basicost_1755478413148.mp3";
import basicOst2 from "@assets/basicost2_1755478413146.mp3";
import buttonSound from "@assets/buttonsound_1755478413149.mp3";
import soulBelow40 from "@assets/ifsoulbelow40%loopsong_1755478413149.mp3";
import soulBelow20 from "@assets/ifsoulbelow20%playandloop_1755478426381.mp3";
import soul0 from "@assets/ifsoul0%play_1755478448415.mp3";
import gameOverMusic from "@assets/ifuseanimusmagicagainplay_1755478459047.mp3";

export interface SoundtrackState {
  currentBgMusic?: HTMLAudioElement;
  isPlaying: boolean;
  volume: number;
  currentTrack?: string;
  soul0ControlActive: boolean;
  soul0StartTime?: number;
  hasUsedAnimusAtZero: boolean;
}

export class SoundtrackSystem {
  private static state: SoundtrackState = {
    isPlaying: false,
    volume: 0.3,
    soul0ControlActive: false,
    hasUsedAnimusAtZero: false
  };

  private static buttonAudio: HTMLAudioElement | null = null;
  private static gameOverAudio: HTMLAudioElement | null = null;

  // Initialize the soundtrack system
  static init(): void {
    // Preload button sound for instant playback
    this.buttonAudio = new Audio(buttonSound);
    this.buttonAudio.volume = this.state.volume;
    this.buttonAudio.preload = 'auto';

    // Preload game over sound
    this.gameOverAudio = new Audio(gameOverMusic);
    this.gameOverAudio.volume = this.state.volume;
    this.gameOverAudio.preload = 'auto';

    console.log("Soundtrack system initialized");
  }

  // Play button sound on any button click
  static playButtonSound(): void {
    if (this.buttonAudio) {
      this.buttonAudio.currentTime = 0;
      this.buttonAudio.play().catch(console.warn);
    }
  }

  // Update background music based on character's soul percentage
  static updateBackgroundMusic(character: Character, gameData: GameData): void {
    const soulPercentage = character.soulPercentage;
    let targetTrack: string;
    let shouldLoop = true;
    let audioSrc: string;

    // Determine which track to play based on soul percentage
    if (soulPercentage <= 0) {
      targetTrack = "soul0";
      audioSrc = soul0;
      shouldLoop = false; // 0% soul track plays once for 2:13
      
      // Start AI control period
      if (!this.state.soul0ControlActive) {
        this.state.soul0ControlActive = true;
        this.state.soul0StartTime = Date.now();
        console.log("0% soul reached - AI control activated for 2 minutes 13 seconds");
      }
    } else if (soulPercentage <= 20) {
      targetTrack = "soulBelow20";
      audioSrc = soulBelow20;
    } else if (soulPercentage <= 40) {
      targetTrack = "soulBelow40";
      audioSrc = soulBelow40;
    } else {
      // Normal background music rotation
      targetTrack = Math.random() > 0.5 ? "basicOst1" : "basicOst2";
      audioSrc = targetTrack === "basicOst1" ? basicOst1 : basicOst2;
    }

    // Only change track if it's different from current
    if (this.state.currentTrack !== targetTrack) {
      this.switchTrack(targetTrack, audioSrc, shouldLoop);
    }
  }

  // Switch to a new background track
  private static switchTrack(trackName: string, audioSrc: string, shouldLoop: boolean): void {
    // Stop current track
    if (this.state.currentBgMusic) {
      this.state.currentBgMusic.pause();
      this.state.currentBgMusic = undefined;
    }

    // Create and setup new track
    const newAudio = new Audio(audioSrc);
    newAudio.volume = this.state.volume;
    newAudio.loop = shouldLoop;
    
    // Special handling for 0% soul track
    if (trackName === "soul0") {
      newAudio.addEventListener('ended', () => {
        console.log("0% soul track ended - returning control to player");
        this.state.soul0ControlActive = false;
        this.state.soul0StartTime = undefined;
        
        // Switch back to appropriate background music
        const soulPercentage = 0; // Still 0% but no longer in control period
        if (soulPercentage <= 20) {
          this.switchTrack("soulBelow20", soulBelow20, true);
        } else {
          this.switchTrack("basicOst1", basicOst1, true);
        }
      });
    }

    // Start playing
    newAudio.play().catch(console.warn);
    
    this.state.currentBgMusic = newAudio;
    this.state.currentTrack = trackName;
    this.state.isPlaying = true;
    
    console.log(`Now playing: ${trackName}`);
  }

  // Check if AI should control the dragon (during 0% soul period)
  static isAIControlActive(): boolean {
    if (!this.state.soul0ControlActive || !this.state.soul0StartTime) {
      return false;
    }

    // Check if 2 minutes 13 seconds (133 seconds) have passed
    const elapsed = (Date.now() - this.state.soul0StartTime) / 1000;
    const controlDuration = 2 * 60 + 13; // 2 minutes 13 seconds

    if (elapsed >= controlDuration) {
      this.state.soul0ControlActive = false;
      this.state.soul0StartTime = undefined;
      console.log("AI control period ended");
      return false;
    }

    return true;
  }

  // Get remaining AI control time in seconds
  static getAIControlTimeRemaining(): number {
    if (!this.state.soul0ControlActive || !this.state.soul0StartTime) {
      return 0;
    }

    const elapsed = (Date.now() - this.state.soul0StartTime) / 1000;
    const controlDuration = 2 * 60 + 13;
    return Math.max(0, controlDuration - elapsed);
  }

  // Handle animus magic use at 0% soul
  static handleAnimusMagicAtZero(): boolean {
    if (this.state.hasUsedAnimusAtZero) {
      return true; // Already triggered game over
    }

    this.state.hasUsedAnimusAtZero = true;
    this.playGameOverMusic();
    return true;
  }

  // Play game over music and trigger game over state
  private static playGameOverMusic(): void {
    // Stop all other music
    if (this.state.currentBgMusic) {
      this.state.currentBgMusic.pause();
    }

    // Play game over music
    if (this.gameOverAudio) {
      this.gameOverAudio.currentTime = 0;
      this.gameOverAudio.play().catch(console.warn);
    }

    console.log("Game Over: Animus magic used at 0% soul");
  }

  // Set volume for all audio
  static setVolume(volume: number): void {
    this.state.volume = Math.max(0, Math.min(1, volume));
    
    if (this.state.currentBgMusic) {
      this.state.currentBgMusic.volume = this.state.volume;
    }
    
    if (this.buttonAudio) {
      this.buttonAudio.volume = this.state.volume;
    }
    
    if (this.gameOverAudio) {
      this.gameOverAudio.volume = this.state.volume;
    }
  }

  // Pause/resume background music
  static togglePlayback(): void {
    if (!this.state.currentBgMusic) return;

    if (this.state.isPlaying) {
      this.state.currentBgMusic.pause();
      this.state.isPlaying = false;
    } else {
      this.state.currentBgMusic.play().catch(console.warn);
      this.state.isPlaying = true;
    }
  }

  // Stop all audio
  static stopAll(): void {
    if (this.state.currentBgMusic) {
      this.state.currentBgMusic.pause();
      this.state.currentBgMusic = undefined;
    }
    
    this.state.isPlaying = false;
    this.state.currentTrack = undefined;
  }

  // Get current soundtrack state for UI display
  static getState(): SoundtrackState {
    return { ...this.state };
  }

  // Reset soundtrack system (for new games)
  static reset(): void {
    this.stopAll();
    this.state.soul0ControlActive = false;
    this.state.soul0StartTime = undefined;
    this.state.hasUsedAnimusAtZero = false;
    console.log("Soundtrack system reset");
  }

  // Check if player should see the 0% soul warning
  static shouldShowZeroSoulWarning(): boolean {
    return !this.state.soul0ControlActive && 
           this.state.soul0StartTime !== undefined && 
           !this.state.hasUsedAnimusAtZero;
  }

  // Get warning message for 0% soul state
  static getZeroSoulWarningMessage(): string {
    return "Your soul has been completely consumed by animus magic. You have been warned: using animus magic again will result in your death. Your magical power has become too dangerous to control.";
  }
}