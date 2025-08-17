import { Character, GameData, Choice, GameEvent, Scenario } from "@shared/schema";
import { AIDungeonMaster } from "./ai-dungeon-master";
import { SoulCorruptionManager } from "./enhanced-magic-system";
import { generateScenario, generateTimeInfo } from "./scenario-generator-final";
import { MockAIService } from "./mock-ai-service";
import { RomanceSystem } from "./romance-system";

export class EnhancedGameEngine {
  static processChoice(
    character: Character,
    gameData: GameData,
    choice: Choice,
    scenario: Scenario
  ): { newCharacter: Character; newGameData: GameData; event: GameEvent } {
    const newCharacter = { ...character };
    const newGameData = { ...gameData };

    // Apply soul loss and update corruption stage
    if (choice.soulCost > 0) {
      const actualSoulLoss = this.calculateSoulLoss(choice.soulCost);
      newCharacter.soulPercentage = Math.max(0, character.soulPercentage - actualSoulLoss);
      newCharacter.soulCorruptionStage = SoulCorruptionManager.getSoulCorruptionStage(newCharacter.soulPercentage);
    }

    // Apply sanity changes
    if (choice.sanityCost !== 0) {
      const actualSanityChange = this.calculateSanityChange(choice.sanityCost);
      newCharacter.sanityPercentage = Math.max(0, Math.min(100, character.sanityPercentage - actualSanityChange));
    }

    // Age progression and season changes
    this.progressTime(newCharacter, newGameData);

    // Handle relationships based on choice
    this.updateRelationships(newCharacter, choice, scenario);

    // Check for achievements
    this.checkAchievements(newCharacter, choice, scenario);

    // Generate next scenario using original system
    const nextScenario = this.generateNextScenario(newCharacter, newGameData);

    // Create game event
    const event: GameEvent = {
      turn: gameData.turn,
      scenario: scenario.id,
      choice: choice.id,
      consequences: choice.consequences,
      soulLoss: choice.soulCost,
      sanityLoss: choice.sanityCost
    };

    // Update game data
    newGameData.turn += 1;
    newGameData.currentScenario = nextScenario;
    newGameData.history.push(event);

    // Check if AI should take control
    if (SoulCorruptionManager.shouldAITakeControl(newCharacter)) {
      newCharacter.isAIControlled = true;
    }

    return { newCharacter, newGameData, event };
  }

  static processCustomAction(
    character: Character,
    gameData: GameData,
    action: { action: string; consequences: string[] },
    scenario: Scenario
  ): GameData {
    const newGameData = { ...gameData };
    
    // Create a game event for the custom action
    const event: GameEvent = {
      turn: gameData.turn,
      scenario: scenario.id,
      choice: `custom_action_${Date.now()}`,
      consequences: action.consequences,
      soulLoss: 0,
      sanityLoss: 0
    };

    // Update game data
    newGameData.turn += 1;
    newGameData.history.push(event);
    
    // Generate next scenario
    newGameData.currentScenario = this.generateNextScenario(character, newGameData);
    
    return newGameData;
  }

  static generateNextScenario(character: Character, gameData: GameData): Scenario {
    // Use original scenario generator
    return generateScenario(character, gameData);
  }

  static calculateSoulLoss(baseCost: number): number {
    // Add slight randomness to soul cost
    const modifier = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2 multiplier
    return Math.floor(baseCost * modifier);
  }

  static calculateSanityChange(baseCost: number): number {
    // Add slight randomness to sanity cost
    const modifier = 0.8 + (Math.random() * 0.4);
    return Math.floor(baseCost * modifier);
  }

  static progressTime(character: Character, gameData: GameData): void {
    // Age progression - every 10 turns advances age slightly
    if (gameData.turn % 10 === 0) {
      character.age += 0.1;
    }

    // Season changes every 25 turns
    if (gameData.turn % 25 === 0) {
      const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
      const currentIndex = seasons.indexOf(character.currentSeason || 'Spring');
      character.currentSeason = seasons[(currentIndex + 1) % 4] as "Spring" | "Summer" | "Fall" | "Winter";
    }
  }

  static updateRelationships(character: Character, choice: Choice, scenario: Scenario): void {
    // Handle romance-specific choices
    if (scenario.id.includes('romance_') || choice.id.includes('romance_')) {
      this.handleRomanceChoice(character, choice, scenario);
      return;
    }

    // Handle general relationship consequences
    if (choice.consequences.some(c => c.toLowerCase().includes('friend'))) {
      // Positive social interaction
      const dragonName = this.extractDragonName(choice.consequences.join(' '));
      if (dragonName && character.relationships[dragonName] !== undefined) {
        const relationship = character.relationships[dragonName];
        if (typeof relationship === 'object') {
          relationship.strength = Math.min(100, relationship.strength + 10);
          relationship.history.push("Had a positive interaction");
        }
      }
    }

    if (choice.consequences.some(c => c.toLowerCase().includes('betray') || c.toLowerCase().includes('hurt'))) {
      // Negative social interaction  
      const dragonName = this.extractDragonName(choice.consequences.join(' '));
      if (dragonName && character.relationships[dragonName] !== undefined) {
        const relationship = character.relationships[dragonName];
        if (typeof relationship === 'object') {
          relationship.strength = Math.max(-100, relationship.strength - 15);
          relationship.history.push("Had a negative interaction");
        }
      }
    }

    // Check for romance progression with existing relationships
    Object.keys(character.relationships).forEach(dragonName => {
      const relationship = character.relationships[dragonName];
      if (typeof relationship === 'object' && relationship.type === 'romantic') {
        // Check if ready to become mates
        if (RomanceSystem.canMate(character, dragonName) && !character.mate && Math.random() < 0.2) {
          character.mate = dragonName;
          relationship.type = 'mate';
          relationship.history.push("Became life mates");
          
          // Add life event
          if (!character.lifeEvents) character.lifeEvents = [];
          character.lifeEvents.push({
            turn: scenario ? scenario.id.includes('ai_') ? parseInt(scenario.id.split('_')[2]) || 0 : 0 : 0,
            category: 'romance',
            description: `Became mates with ${dragonName}`,
            impact: 'positive'
          });
          
          // Chance for dragonets
          if (Math.random() < 0.4) {
            const partnerTribe = this.getRandomTribe();
            const offspring = RomanceSystem.generateOffspring(character, dragonName, partnerTribe);
            if (offspring) {
              character.lifeEvents.push({
                turn: scenario ? scenario.id.includes('ai_') ? parseInt(scenario.id.split('_')[2]) || 0 : 0 : 0,
                category: 'birth',
                description: `Had a dragonet named ${offspring.name}`,
                impact: 'positive'
              });
            }
          }
        }
      }
    });
  }

  static handleRomanceChoice(character: Character, choice: Choice, scenario: Scenario): void {
    // Extract partner name from scenario narrative
    const narrativeText = scenario.narrativeText.join(' ');
    const partnerName = this.extractPartnerFromRomanceScenario(narrativeText);
    
    if (!partnerName) return;

    // Handle different romance choices
    if (choice.id === 'romance_accept') {
      // Accept romantic advances - develop relationship
      const partnerTribe = this.getRandomTribe();
      RomanceSystem.developRomance(character, partnerName, partnerTribe);
      
      // Add life event
      if (!character.lifeEvents) character.lifeEvents = [];
      character.lifeEvents.push({
        turn: scenario ? scenario.id.includes('ai_') ? parseInt(scenario.id.split('_')[2]) || 0 : 0 : 0,
        category: 'romance',
        description: `Started a romantic relationship with ${partnerName}`,
        impact: 'positive'
      });
      
    } else if (choice.id === 'romance_cautious') {
      // Cautious approach - develop friendship first
      character.relationships[partnerName] = {
        name: partnerName,
        type: 'friend',
        strength: Math.floor(Math.random() * 20) + 40, // 40-60 strength
        history: ["Met through romantic encounter", "Taking things slowly"],
        isAlive: true
      };
      
    } else if (choice.id === 'romance_reject') {
      // Polite rejection - neutral relationship
      character.relationships[partnerName] = {
        name: partnerName,
        type: 'neutral',
        strength: Math.floor(Math.random() * 20) + 20, // 20-40 strength
        history: ["Met through romantic encounter", "Politely declined romantic advances"],
        isAlive: true
      };
    }
  }

  static extractPartnerFromRomanceScenario(narrativeText: string): string | null {
    // Extract partner name from romance scenario text
    const words = narrativeText.split(' ');
    for (let i = 0; i < words.length; i++) {
      if (words[i].toLowerCase() === 'a' && i + 1 < words.length) {
        const potentialName = words[i + 2]; // Skip 'a [tribe]'
        if (potentialName && /^[A-Z][a-z]+$/.test(potentialName)) {
          return potentialName;
        }
      }
    }
    
    // Fallback: use common romance system names
    return RomanceSystem.getRandomPartnerName();
  }

  static getRandomTribe(): string {
    const tribes = ["MudWing", "SandWing", "SkyWing", "SeaWing", "IceWing", "RainWing", "NightWing", "SilkWing", "HiveWing", "LeafWing"];
    return tribes[Math.floor(Math.random() * tribes.length)];
  }

  static addDragonet(character: Character, partnerName: string): void {
    // Use the romance system for proper offspring generation
    const partnerTribe = this.getRandomTribe();
    const offspring = RomanceSystem.generateOffspring(character, partnerName, partnerTribe);
    
    if (!character.dragonets) {
      character.dragonets = [];
    }
    
    if (offspring) {
      character.dragonets.push(offspring);
    }
  }

  static generateDragonetPersonality(): string {
    const personalities = [
      'brave and adventurous', 'shy but kind', 'curious and intelligent',
      'mischievous and playful', 'wise beyond their years', 'energetic and loud',
      'thoughtful and careful', 'rebellious and independent'
    ];
    return personalities[Math.floor(Math.random() * personalities.length)];
  }

  static checkAchievements(character: Character, choice: Choice, scenario: Scenario): void {
    if (!character.achievements) {
      character.achievements = [];
    }

    const achievements = character.achievements;

    // First animus spell
    if (character.isAnimus && choice.soulCost > 0 && !achievements.includes('First Magic')) {
      achievements.push('First Magic');
    }

    // Soul corruption milestones
    if (character.soulPercentage < 50 && !achievements.includes('Soul Frayed')) {
      achievements.push('Soul Frayed');
    }
    if (character.soulPercentage < 25 && !achievements.includes('Soul Twisted')) {
      achievements.push('Soul Twisted');
    }

    // Relationship achievements
    if (choice.consequences.some(c => c.toLowerCase().includes('love')) && !achievements.includes('Found Love')) {
      achievements.push('Found Love');
    }

    // Survival milestones
    const relationshipCount = Object.keys(character.relationships).length;
    if (relationshipCount >= 5 && !achievements.includes('Social Butterfly')) {
      achievements.push('Social Butterfly');
    }

    // Family achievements
    if (character.dragonets && character.dragonets.length >= 3 && !achievements.includes('Big Family')) {
      achievements.push('Big Family');
    }

    // Corruption resistance
    if (character.isAnimus && character.soulPercentage > 75 && !achievements.includes('Pure Soul')) {
      achievements.push('Pure Soul');
    }
  }

  static checkGameOver(character: Character): { isGameOver: boolean; reason?: string } {
    // Traditional game over conditions
    if (character.sanityPercentage <= 0) {
      return { isGameOver: true, reason: "Insanity" };
    }

    if (character.age >= 100) {
      return { isGameOver: true, reason: "Old Age" };
    }

    // Soul completely lost - but allow AI takeover
    if (character.soulPercentage <= 0) {
      return { isGameOver: true, reason: "Soul Lost - AI Control Activated" };
    }

    return { isGameOver: false };
  }

  static getCorruptionLevel(soulPercentage: number): "Normal" | "Frayed" | "Twisted" | "Broken" {
    return SoulCorruptionManager.getSoulCorruptionStage(soulPercentage);
  }

  static getCorruptionMessage(stage: "Normal" | "Frayed" | "Twisted" | "Broken"): string {
    switch (stage) {
      case "Frayed":
        return "Your soul shows minor cracks. Dark thoughts occasionally surface.";
      case "Twisted":
        return "Your moral compass wavers. The corruption whispers suggestions.";
      case "Broken":
        return "Your soul is severely damaged. The AI will increasingly make evil choices for you.";
      default:
        return "";
    }
  }

  static shouldShowCorruptionPopup(character: Character): boolean {
    // Show corruption popups when soul is below 15% (but above 0%) - AI control handles its own messaging
    return character.soulPercentage < 15 && character.soulPercentage > 0;
  }

  static generateCorruptionWhisper(character: Character): string {
    const whispers = [
      "Perhaps a little cruelty would solve this problem faster...",
      "Why show mercy when power could settle this instantly?",
      "Others are weak. You could rule them all with your magic...",
      "Hurt them before they hurt you. Strike first.",
      "Your feelings are a weakness. Embrace the cold logic of power.",
      "They don't understand you. Make them fear you instead.",
      "Compassion is for the weak. You are beyond such things now.",
      "Why negotiate when you could simply take what you want?",
      "Trust no one. Everyone will eventually betray you.",
      "Pain teaches better lessons than kindness ever could."
    ];
    
    return whispers[Math.floor(Math.random() * whispers.length)];
  }

  static getAIChoice(character: Character, scenario: Scenario): Choice | null {
    // AI only takes control when soul is very low (under 5%)
    if (character.soulPercentage > 5) return null;
    
    // AI prefers the most cruel/corrupted choice
    const choices = scenario.choices;
    if (choices.length === 0) return null;

    // Look for choices with corruption markers or high soul costs
    const corruptChoices = choices.filter(c => 
      c.corruption || 
      c.soulCost > 5 ||
      c.text.toLowerCase().includes('attack') ||
      c.text.toLowerCase().includes('hurt') ||
      c.text.toLowerCase().includes('betray') ||
      c.text.toLowerCase().includes('cruel')
    );

    if (corruptChoices.length > 0) {
      return corruptChoices[Math.floor(Math.random() * corruptChoices.length)];
    }

    // Fall back to a random choice if no obviously corrupt ones
    return choices[Math.floor(Math.random() * choices.length)];
  }

  static extractDragonName(text: string): string | null {
    const patterns = [
      /([A-Z][a-z]+) (?:dragon|dragoness)/i,
      /(?:meet|see|encounter) ([A-Z][a-z]+)/i,
      /([A-Z][a-z]+) approaches/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  }

  static generateRandomDragonName(): string {
    const prefixes = ['Fire', 'Moon', 'Star', 'Shadow', 'Storm', 'Ice', 'Sand', 'Sea', 'Sky', 'Earth'];
    const suffixes = ['wing', 'claw', 'scale', 'flame', 'heart', 'spirit', 'song', 'dance', 'light', 'shade'];
    
    return prefixes[Math.floor(Math.random() * prefixes.length)] + 
           suffixes[Math.floor(Math.random() * suffixes.length)];
  }

  static inheritTraits(parent: Character): string[] {
    const traits = [
      'Strong scales', 'Keen eyesight', 'Quick reflexes', 'Natural leadership',
      'Magical sensitivity', 'Enhanced intelligence', 'Social charisma', 'Combat instincts'
    ];
    
    const inheritedCount = Math.floor(Math.random() * 3) + 1; // 1-3 traits
    const shuffled = traits.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, inheritedCount);
  }
}