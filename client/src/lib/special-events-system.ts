import { Character, GameData, Scenario, Choice } from "@shared/schema";
import { AnimusArtifactSystem } from "./animus-artifact-system";
import { SpecialPowerScenarioSystem } from "./special-power-scenarios";
import { LocationSystem } from "./location-system";

export interface SpecialEvent {
  id: string;
  type: 'artifact_discovery' | 'mindreading_event' | 'prophecy_event';
  scenario: Scenario;
  timestamp: number;
}

export interface SpecialEventState {
  lastArtifactEventTurn: number;
  lastMindreadingEventTurn: number;
  lastProphecyEventTurn: number;
  artifactsDiscovered: number;
  maxArtifactsPerGame: number;
}

export class SpecialEventsSystem {
  private static readonly ARTIFACT_COOLDOWN_TURNS = 10; // 10 turns
  private static readonly MINDREADING_COOLDOWN_TURNS = 10; // 10 turns  
  private static readonly PROPHECY_COOLDOWN_TURNS = 10; // 10 turns
  private static readonly ARTIFACT_BASE_CHANCE = 0.15; // 15% chance per turn
  private static readonly SPECIAL_POWER_BASE_CHANCE = 0.12; // 12% chance per turn
  private static readonly MAX_ARTIFACTS_PER_GAME = 5;
  
  private static eventState: SpecialEventState = {
    lastArtifactEventTurn: 0,
    lastMindreadingEventTurn: 0,
    lastProphecyEventTurn: 0,
    artifactsDiscovered: 0,
    maxArtifactsPerGame: this.MAX_ARTIFACTS_PER_GAME
  };
  
  static checkForSpecialEvent(character: Character, gameData: GameData): SpecialEvent | null {
    const currentTurn = gameData.turn;
    
    // Check for artifact discovery (location-based)
    if (this.canTriggerArtifactEvent(currentTurn) && this.eventState.artifactsDiscovered < this.MAX_ARTIFACTS_PER_GAME) {
      const artifactEvent = this.tryGenerateArtifactEvent(character, gameData, currentTurn);
      if (artifactEvent) {
        this.eventState.lastArtifactEventTurn = currentTurn;
        this.eventState.artifactsDiscovered++;
        return artifactEvent;
      }
    }
    
    // Check for mindreading special scenario
    if (this.canTriggerMindreadingEvent(character, currentTurn)) {
      const mindreadingEvent = this.tryGenerateMindreadingEvent(character, gameData, currentTurn);
      if (mindreadingEvent) {
        this.eventState.lastMindreadingEventTurn = currentTurn;
        return mindreadingEvent;
      }
    }
    
    // Check for prophecy special scenario
    if (this.canTriggerProphecyEvent(character, currentTurn)) {
      const prophecyEvent = this.tryGenerateProphecyEvent(character, gameData, currentTurn);
      if (prophecyEvent) {
        this.eventState.lastProphecyEventTurn = currentTurn;
        return prophecyEvent;
      }
    }
    
    return null;
  }
  
  private static canTriggerArtifactEvent(currentTurn: number): boolean {
    return (currentTurn - this.eventState.lastArtifactEventTurn) >= this.ARTIFACT_COOLDOWN_TURNS;
  }
  
  private static canTriggerMindreadingEvent(character: Character, currentTurn: number): boolean {
    const hasMindreading = character.tribalPowers.some(p => p.toLowerCase().includes('mind')) ||
                          character.specialPowers.some(p => p.toLowerCase().includes('mind'));
    return hasMindreading && (currentTurn - this.eventState.lastMindreadingEventTurn) >= this.MINDREADING_COOLDOWN_TURNS;
  }
  
  private static canTriggerProphecyEvent(character: Character, currentTurn: number): boolean {
    const hasProphecy = character.tribalPowers.some(p => p.toLowerCase().includes('prophecy')) ||
                       character.specialPowers.some(p => p.toLowerCase().includes('prophecy') || p.toLowerCase().includes('foresight'));
    return hasProphecy && (currentTurn - this.eventState.lastProphecyEventTurn) >= this.PROPHECY_COOLDOWN_TURNS;
  }
  
  private static tryGenerateArtifactEvent(character: Character, gameData: GameData, turn: number): SpecialEvent | null {
    const currentLocation = LocationSystem.getCurrentLocation(gameData);
    if (!currentLocation) return null;
    
    // Base chance modified by location exploration and character traits
    let chance = this.ARTIFACT_BASE_CHANCE;
    
    // Higher chance for first time in location
    const visitedBefore = gameData.explorationLog.some(log => log.location === currentLocation.name);
    if (!visitedBefore) {
      chance *= 2;
    }
    
    // Higher chance for curious characters
    if (character.traits.includes('Curious')) {
      chance *= 1.5;
    }
    
    if (Math.random() > chance) return null;
    
    const artifact = AnimusArtifactSystem.generateArtifactDiscovery(character, gameData);
    if (!artifact) return null;
    
    // Create scenario for artifact discovery
    const scenario: Scenario = {
      id: `artifact_discovery_${artifact.id}`,
      title: `Discovery: ${artifact.name}`,
      description: `You have discovered a mysterious animus artifact!`,
      narrativeText: [
        `While exploring ${currentLocation.name}, you stumble upon something extraordinary...`,
        artifact.discoveryScenario,
        `The artifact radiates ${artifact.cursed ? 'dark' : 'ancient'} magical energy. What do you do?`
      ],
      choices: artifact.usageOptions.map((option, index) => ({
        id: option.id,
        text: option.text,
        description: `${option.outcome.substring(0, 100)}...`,
        soulCost: option.soulCost,
        sanityCost: option.sanityCost,
        consequences: option.consequences,
        corruption: option.corruption,
        requiresModal: 'artifact'
      })),
      type: 'magical',
      location: currentLocation.name,
      timeOfDay: 'afternoon',
      weather: 'mysterious'
    };
    
    // Add artifact to inventory for the scenario
    gameData.inventory.push(artifact);
    
    return {
      id: `artifact_${artifact.id}`,
      type: 'artifact_discovery',
      scenario,
      timestamp: turn
    };
  }
  
  private static tryGenerateMindreadingEvent(character: Character, gameData: GameData, turn: number): SpecialEvent | null {
    if (Math.random() > this.SPECIAL_POWER_BASE_CHANCE) return null;
    
    const mindreadingScenario = SpecialPowerScenarioSystem.getRandomScenario(character, 'mindreading');
    if (!mindreadingScenario) return null;
    
    const scenario: Scenario = {
      id: mindreadingScenario.id,
      title: mindreadingScenario.title,
      description: "Your mind reading abilities have revealed something unexpected...",
      narrativeText: [
        "Your telepathic senses suddenly sharpen, picking up thoughts you weren't expecting...",
        mindreadingScenario.prompt,
        "The mental connection feels strong. How do you proceed?"
      ],
      choices: mindreadingScenario.options.map(option => ({
        id: option.id,
        text: option.text,
        description: `${option.outcome.substring(0, 100)}...`,
        soulCost: option.soulCost,
        sanityCost: option.sanityCost,
        consequences: option.consequences,
        corruption: option.corruption,
        requiresModal: 'mindreading'
      })),
      type: 'tribal',
      location: gameData.location,
      timeOfDay: 'evening',
      weather: 'tense'
    };
    
    return {
      id: `mindreading_${mindreadingScenario.id}`,
      type: 'mindreading_event',
      scenario,
      timestamp: turn
    };
  }
  
  private static tryGenerateProphecyEvent(character: Character, gameData: GameData, turn: number): SpecialEvent | null {
    if (Math.random() > this.SPECIAL_POWER_BASE_CHANCE) return null;
    
    const prophecyScenario = SpecialPowerScenarioSystem.getRandomScenario(character, 'prophecy');
    if (!prophecyScenario) return null;
    
    const scenario: Scenario = {
      id: prophecyScenario.id,
      title: prophecyScenario.title,
      description: "A vision of the future comes to you unbidden...",
      narrativeText: [
        "Your prophetic abilities activate without warning, showing you glimpses of what may come to pass...",
        prophecyScenario.prompt,
        "The vision fades, but its meaning weighs heavily on your mind. What path will you choose?"
      ],
      choices: prophecyScenario.options.map(option => ({
        id: option.id,
        text: option.text,
        description: `${option.outcome.substring(0, 100)}...`,
        soulCost: option.soulCost,
        sanityCost: option.sanityCost,
        consequences: option.consequences,
        corruption: option.corruption,
        requiresModal: 'prophecy'
      })),
      type: 'prophetic',
      location: gameData.location,
      timeOfDay: 'night',
      weather: 'ominous'
    };
    
    return {
      id: `prophecy_${prophecyScenario.id}`,
      type: 'prophecy_event',
      scenario,
      timestamp: turn
    };
  }
  
  static processSpecialEventChoice(
    event: SpecialEvent,
    choiceId: string,
    character: Character,
    gameData: GameData
  ): {
    newCharacter: Character;
    newGameData: GameData;
    outcome: string;
    consequences: string[];
  } {
    const choice = event.scenario.choices.find(c => c.id === choiceId);
    if (!choice) {
      throw new Error(`Invalid choice ${choiceId} for special event ${event.id}`);
    }
    
    switch (event.type) {
      case 'artifact_discovery':
        const artifactId = event.id.replace('artifact_', '');
        const artifact = AnimusArtifactSystem.getArtifactById(artifactId);
        if (artifact) {
          return AnimusArtifactSystem.useArtifact(artifact, choiceId, character, gameData);
        }
        break;
        
      case 'mindreading_event':
      case 'prophecy_event':
        const scenarioType = event.type === 'mindreading_event' ? 'mindreading' : 'prophecy';
        const specialScenario = SpecialPowerScenarioSystem.getApplicableScenarios(character, scenarioType)
          .find(s => s.id === event.scenario.id);
        if (specialScenario) {
          return SpecialPowerScenarioSystem.processSpecialPowerChoice(specialScenario, choiceId, character, gameData);
        }
        break;
    }
    
    // Fallback processing
    const newCharacter = { ...character };
    const newGameData = { ...gameData };
    
    newCharacter.soulPercentage = Math.max(0, character.soulPercentage - choice.soulCost);
    newCharacter.sanityPercentage = Math.max(0, character.sanityPercentage - choice.sanityCost);
    
    return {
      newCharacter,
      newGameData,
      outcome: choice.description,
      consequences: choice.consequences
    };
  }
  
  static resetEventState(): void {
    this.eventState = {
      lastArtifactEventTurn: 0,
      lastMindreadingEventTurn: 0,
      lastProphecyEventTurn: 0,
      artifactsDiscovered: 0,
      maxArtifactsPerGame: this.MAX_ARTIFACTS_PER_GAME
    };
  }
  
  static getEventState(): SpecialEventState {
    return { ...this.eventState };
  }
  
  static isSpecialEventAvailable(character: Character): boolean {
    const now = Date.now();
    
    // Check if any special event type is available
    if (this.canTriggerArtifactEvent(now) && this.eventState.artifactsDiscovered < this.MAX_ARTIFACTS_PER_GAME) {
      return true;
    }
    
    if (this.canTriggerMindreadingEvent(character, now)) {
      return true;
    }
    
    if (this.canTriggerProphecyEvent(character, now)) {
      return true;
    }
    
    return false;
  }
}