import { Character, GameData, Choice, GameEvent, Scenario } from "@shared/schema";
import { AIDungeonMaster } from "./ai-dungeon-master";
import { SoulCorruptionManager } from "./enhanced-magic-system";
import { generateScenario, generateTimeInfo } from "./scenario-generator-final";
import { generateEnhancedScenario } from "./enhanced-scenario-system";
import { MockAIService } from "./mock-ai-service";
import { RomanceSystem } from "./romance-system";
import { LocationSystem, LOCATIONS, Location } from "./location-system";
import { LocationBasedScenarios } from "./location-based-scenarios";
import { InventorySystem } from "./inventory-system";
import { SpecialEventsSystem } from "./special-events-system";
import { ExpandedScenarioSystem } from './expanded-scenarios';
import { EnhancedGameIntegration } from "./enhanced-game-integration";
import { SoundtrackSystem } from "./soundtrack-system";
import { AttributeProgressionSystem } from "./attribute-progression-system";
import { AnimusArtifactSystem } from "./animus-artifact-system";
import { EnhancedSocialSystem } from "./enhanced-social-system";

export class EnhancedGameEngine {
  static processChoice(
    character: Character,
    gameData: GameData,
    choice: Choice,
    scenario: Scenario
  ): { newCharacter: Character; newGameData: GameData; event: GameEvent } {
    const newCharacter = { ...character };
    const newGameData = { ...gameData };

    // Regeneration system: restore soul/sanity based on positive actions
    const isPositiveAction = EnhancedGameEngine.isPositiveChoice(choice);
    const isNegativeAction = EnhancedGameEngine.isNegativeChoice(choice);
    
    if (isPositiveAction) {
      // Good deeds restore small amounts of soul and sanity
      newCharacter.soulPercentage = Math.min(100, character.soulPercentage + 2);
      newCharacter.sanityPercentage = Math.min(100, character.sanityPercentage + 3);
    }

    // Apply soul loss and update corruption stage
    const oldSoulPercentage = character.soulPercentage;
    if (choice.soulCost > 0) {
      const actualSoulLoss = this.calculateSoulLoss(choice.soulCost);
      newCharacter.soulPercentage = Math.max(0, character.soulPercentage - actualSoulLoss);
      newCharacter.soulCorruptionStage = SoulCorruptionManager.getSoulCorruptionStage(newCharacter.soulPercentage);
    }

    // Check soul thresholds for soundtrack changes and AI control
    const aiControlTriggered = SoundtrackSystem.checkSoulThresholds(
      oldSoulPercentage, 
      newCharacter.soulPercentage, 
      newCharacter, 
      newGameData
    );

    // Apply sanity changes
    if (choice.sanityCost !== 0) {
      const actualSanityChange = this.calculateSanityChange(choice.sanityCost);
      newCharacter.sanityPercentage = Math.max(0, Math.min(100, character.sanityPercentage - actualSanityChange));
    }
    
    // Additional negative consequences for bad actions
    if (isNegativeAction && !choice.corruption) {
      newCharacter.soulPercentage = Math.max(0, newCharacter.soulPercentage - 1);
      newCharacter.sanityPercentage = Math.max(0, newCharacter.sanityPercentage - 1);
    }

    // Process attribute gains
    const attributeGains = AttributeProgressionSystem.processAttributeGains(newCharacter, choice, scenario);
    if (attributeGains) {
      AttributeProgressionSystem.applyAttributeGains(newCharacter, attributeGains);
    }

    // Age progression - 1 year per turn
    this.progressTime(newCharacter, newGameData, 1);

    // Handle relationships based on choice
    this.updateRelationships(newCharacter, choice, scenario);

    // Handle artifact collection if this is an artifact choice
    console.log(`Processing choice with ID: ${choice.id}`);
    
    if (choice.id.startsWith('collect_')) {
      const artifactId = choice.id.replace('collect_', '');
      const pendingArtifact = (gameData as any).pendingArtifact;
      
      console.log(`ARTIFACT COLLECTION ATTEMPT - Choice ID: ${choice.id}, Artifact ID: ${artifactId}`);
      console.log(`Pending artifact:`, pendingArtifact);
      console.log(`Inventory before collection:`, newGameData.inventory?.length || 0, 'items');
      
      if (pendingArtifact && pendingArtifact.id === artifactId) {
        console.log(`Matching artifact found for collection!`);
        
        // Initialize inventory if it doesn't exist
        if (!newGameData.inventory) {
          newGameData.inventory = [];
        }
        
        // Add artifact directly to inventory
        const artifactItem = {
          id: pendingArtifact.id,
          name: pendingArtifact.name,
          description: pendingArtifact.description,
          type: 'magical_artifact' as const,
          enchantments: pendingArtifact.enchantments || [],
          isActive: false,
          canGiveAway: pendingArtifact.canGiveAway || false
        };
        
        newGameData.inventory.push(artifactItem);
        
        // Increment artifacts discovered counter only when successfully collected
        SpecialEventsSystem.incrementArtifactsDiscovered();
        
        // Add collection message to last choice result
        newGameData.lastChoiceResult = `You have collected the ${pendingArtifact.name}! It has been added to your inventory.`;
        
        // Clear pending artifact
        delete (newGameData as any).pendingArtifact;
        
        console.log(`Artifact ${pendingArtifact.name} successfully collected!`);
        console.log(`Inventory after collection:`, newGameData.inventory?.length || 0, 'items');
        console.log(`New inventory contents:`, newGameData.inventory?.map(i => i.name) || []);
      } else {
        console.log(`Collection failed - no matching pending artifact found`);
        console.log(`Expected artifact ID: ${artifactId}, Pending artifact:`, pendingArtifact);
      }
    }
    
    // Handle continue button - clear outcome display and generate next scenario
    if (choice.id === 'continue' && gameData.awaitingResponse) {
      newGameData.lastChoiceResult = undefined;
      newGameData.awaitingResponse = false;
      
      // Generate next scenario after clearing outcome
      const nextScenario = this.generateNextScenario(newCharacter, newGameData);
      newGameData.currentScenario = nextScenario;
      
      return {
        newCharacter,
        newGameData,
        event: {
          turn: gameData.turn,
          scenario: 'continue',
          choice: 'continue',
          consequences: ['Story continues...'],
          soulLoss: 0,
          sanityLoss: 0
        }
      };
    }

    // Store outcome for display with continue button
    let outcomeText = "";
    if (choice.consequences && choice.consequences.length > 0) {
      outcomeText = choice.consequences.join(". ");
    }
    
    // Check if this is a special event choice
    if (scenario.id.includes('artifact_') || scenario.id.includes('mindreading_') || scenario.id.includes('prophecy_')) {
      try {
        const specialEvent = SpecialEventsSystem.checkForSpecialEvent(newCharacter, newGameData);
        if (specialEvent && specialEvent.scenario.id === scenario.id) {
          const result = SpecialEventsSystem.processSpecialEventChoice(specialEvent, choice.id, newCharacter, newGameData);
          outcomeText = result.outcome;
          Object.assign(newCharacter, result.newCharacter);
          Object.assign(newGameData, result.newGameData);
        }
      } catch (error) {
        console.warn("Special event processing failed:", error);
      }
    }
    
    // Set outcome for display
    if (outcomeText) {
      newGameData.lastChoiceResult = outcomeText;
      newGameData.awaitingResponse = true;
    }

    // Check for achievements
    this.checkAchievements(newCharacter, choice, scenario);

    // Handle inventory rewards from choices
    if (choice.rewardItem) {
      const updatedGameData = InventorySystem.addItem(newGameData, choice.rewardItem);
      newGameData.inventory = updatedGameData.inventory;
    }

    // Handle item consumption if required
    if (choice.requiresItem && (choice as any).consumesItem) {
      const requiredItem = (newGameData.inventory || []).find(item => 
        item.id === choice.requiresItem || 
        item.name.toLowerCase().includes(choice.requiresItem!)
      );
      if (requiredItem) {
        const updatedGameData = InventorySystem.removeItem(newGameData, requiredItem.id);
        newGameData.inventory = updatedGameData.inventory;
      }
    }

    // Process enhanced consequences from our new systems
    if (choice.consequences && choice.consequences.length > 0) {
      try {
        this.processEnhancedConsequences(newCharacter, newGameData, choice.consequences, scenario);
      } catch (error) {
        console.warn("Enhanced consequence processing failed:", error);
      }
    }

    // Check for special events every 10 turns using the actual turn number
    let nextScenario: Scenario;
    
    // Increment turn first
    const nextTurn = gameData.turn + 1;
    
    // Initialize special events system with current game data
    SpecialEventsSystem.initializeEventState(newGameData);
    
    // Check for special events every 10 turns (turn 10, 20, 30, etc.)
    if (nextTurn % 10 === 0) {
      console.log(`Turn ${nextTurn}: Checking for special events...`);
      const specialEvent = SpecialEventsSystem.checkForSpecialEvent(newCharacter, { ...newGameData, turn: nextTurn });
      if (specialEvent) {
        console.log(`Special event triggered at turn ${nextTurn}:`, specialEvent.type);
        nextScenario = specialEvent.scenario;
        // Save updated event state
        SpecialEventsSystem.saveEventState(newGameData);
      } else {
        console.log(`No special event triggered at turn ${nextTurn}`);
        
        // Try location-specific special scenario
        const locationSpecial = ExpandedScenarioSystem.tryGetLocationSpecialScenario(newCharacter, newGameData.location);
        if (locationSpecial) {
          console.log(`Location special scenario triggered: ${locationSpecial.title}`);
          nextScenario = ExpandedScenarioSystem.convertToScenario(locationSpecial, newGameData);
        } else {
          // Generate next scenario using original system
          nextScenario = this.generateNextScenario(newCharacter, newGameData);
        }
      }
    } else {
      // Try location-specific special scenario occasionally
      const locationSpecial = ExpandedScenarioSystem.tryGetLocationSpecialScenario(newCharacter, newGameData.location);
      if (locationSpecial) {
        console.log(`Location special scenario triggered: ${locationSpecial.title}`);
        nextScenario = ExpandedScenarioSystem.convertToScenario(locationSpecial, newGameData);
      } else {
        // Generate next scenario using original system
        nextScenario = this.generateNextScenario(newCharacter, newGameData);
      }
    }

    // Create game event
    const event: GameEvent = {
      turn: gameData.turn,
      scenario: scenario.id,
      choice: choice.id,
      consequences: choice.consequences,
      soulLoss: choice.soulCost,
      sanityLoss: choice.sanityCost
    };

    // Update game data with year and season progression
    newGameData.turn += 1;
    
    // Advance years by 0.5 per turn (2 turns = 1 year)
    newGameData.yearsPassed = (newGameData.yearsPassed || 0) + 0.5;
    
    // Change seasons every turn
    const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
    const currentSeasonIndex = ((newGameData.turn - 1) % 4);
    newGameData.currentSeason = seasons[currentSeasonIndex];
    
    newGameData.currentScenario = nextScenario;
    newGameData.history.push(event);

    // Check if AI should take control
    if (SoulCorruptionManager.shouldAITakeControl(newCharacter)) {
      newCharacter.isAIControlled = true;
    }

    return { newCharacter, newGameData, event };
  }

  // Process enhanced consequences and social interactions
  private static processEnhancedConsequences(character: Character, gameData: GameData, consequences: string[], scenario: Scenario): void {
    consequences.forEach(consequence => {
      // Extract names and process relationships from consequence text
      if (consequence.includes('warmly engage') || consequence.includes('positive connection') || consequence.includes('building a positive')) {
        // Extract dragon name from the consequence
        const nameMatch = consequence.match(/with\s+([A-Za-z]+)/);
        if (nameMatch && nameMatch[1]) {
          const dragonName = nameMatch[1];
          EnhancedSocialSystem.processRelationshipChange(
            character,
            dragonName,
            scenario.location || 'Unknown',
            15,
            'cooperation'
          );
        }
      }
      
      // Handle romantic developments
      if (consequence.includes('romantic connection') || consequence.includes('pursue a romantic')) {
        const nameMatch = consequence.match(/with\s+([A-Za-z]+)/);
        if (nameMatch && nameMatch[1]) {
          const dragonName = nameMatch[1];
          if (!character.relationships[dragonName]) {
            character.relationships[dragonName] = {
              name: dragonName,
              type: 'romantic',
              strength: 60,
              history: ['Romantic connection developed'],
              isAlive: true
            };
          } else {
            character.relationships[dragonName].type = 'romantic';
            character.relationships[dragonName].strength = Math.max(60, character.relationships[dragonName].strength);
          }
        }
      }
      
      // Handle family bond strengthening for dragonets
      if (consequence.includes('loving support') || consequence.includes('family bond')) {
        const nameMatch = consequence.match(/to\s+([A-Za-z]+)/);
        if (nameMatch && nameMatch[1]) {
          const dragonetName = nameMatch[1];
          const dragonet = character.dragonets.find(d => d.name === dragonetName);
          if (dragonet) {
            dragonet.personalityTraits = dragonet.personalityTraits || [];
            if (!dragonet.personalityTraits.includes('Well-loved')) {
              dragonet.personalityTraits.push('Well-loved');
            }
          }
        }
      }
    });
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

    // Update game data with year and season progression
    newGameData.turn += 1;
    
    // Advance years by 0.5 per turn
    newGameData.yearsPassed = (newGameData.yearsPassed || 0) + 0.5;
    
    // Change seasons every turn
    const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
    const currentSeasonIndex = ((newGameData.turn - 1) % 4);
    newGameData.currentSeason = seasons[currentSeasonIndex];
    
    newGameData.history.push(event);
    
    // Generate next scenario
    newGameData.currentScenario = this.generateNextScenario(character, newGameData);
    
    return newGameData;
  }

  static generateNextScenario(character: Character, gameData: GameData): Scenario {
    const currentLocation = LocationSystem.getCurrentLocation(gameData);
    
    // 40% chance to use location-specific scenario if available
    if (Math.random() < 0.4) {
      const locationScenario = LocationBasedScenarios.getRandomLocationScenario(currentLocation.id, character);
      if (locationScenario) {
        // Add random chance for item collection scenarios
        const enhancedChoices = ((locationScenario as any).choices || []).map((choice: any) => {
          // Add item rewards to some choices
          if (Math.random() < 0.3) {
            const item = InventorySystem.generateCollectibleItem(currentLocation.name, locationScenario.title);
            return {
              ...choice,
              rewardItem: item,
              consequences: [...(choice.consequences || []), `You found ${item.name}!`]
            };
          }
          return choice;
        }) || [];

        // Convert location scenario to standard scenario format
        return {
          id: locationScenario.id,
          title: locationScenario.title,
          description: locationScenario.narrativeText[0],
          narrativeText: locationScenario.narrativeText,
          choices: enhancedChoices,
          type: 'mundane', // Default type for location scenarios
          location: currentLocation.name,
          timeOfDay: gameData.timeInfo || "Midday",
          weather: this.getLocationWeather(currentLocation)
        };
      }
    }
    
    // Try enhanced social/family/romance scenarios first
    const enhancedScenario = EnhancedGameIntegration.generateEnhancedScenario(character, gameData);
    if (enhancedScenario) {
      return enhancedScenario;
    }

    // Fall back to enhanced scenario generation
    return generateEnhancedScenario(character, gameData);
  }

  static generateLocationScenarioChoices(locationScenario: any, character: Character): Choice[] {
    const choices: Choice[] = [];
    
    // Generate contextual choices based on location and scenario
    if (locationScenario.emotionalTone === 'peaceful' || locationScenario.emotionalTone === 'enlightening') {
      choices.push(
        {
          id: `${locationScenario.id}_wise_action`,
          text: "Act with wisdom and compassion",
          description: "Choose the path that helps others and strengthens your spirit",
          soulCost: 0,
          sanityCost: -3, // Restores sanity
          consequences: ["Your wise choice brings peace to your spirit and helps those around you."]
        },
        {
          id: `${locationScenario.id}_cautious_observation`,
          text: "Observe carefully before acting",
          description: "Take time to understand the situation fully",
          soulCost: 0,
          sanityCost: -1, // Restores sanity slightly
          consequences: ["Your patient observation leads to better understanding."]
        }
      );
    } else if (locationScenario.emotionalTone === 'dramatic' || locationScenario.emotionalTone === 'tense') {
      choices.push(
        {
          id: `${locationScenario.id}_bold_intervention`,
          text: "Intervene boldly",
          description: "Take decisive action despite the risks",
          soulCost: 0,
          sanityCost: 5,
          consequences: ["Your bold action changes the situation dramatically..."]
        },
        {
          id: `${locationScenario.id}_strategic_approach`,
          text: "Plan a strategic approach",
          description: "Think through the consequences before acting",
          soulCost: 0,
          sanityCost: 2,
          consequences: ["Your strategic thinking helps navigate the complex situation..."]
        }
      );
    }
    
    // Always add a choice to leave/avoid
    choices.push({
      id: `${locationScenario.id}_withdraw`,
      text: "Step away from the situation",
      description: "Avoid getting involved in this matter",
      soulCost: 1,
      sanityCost: 3,
      consequences: ["You choose not to get involved, leaving the situation to resolve itself..."]
    });
    
    return choices;
  }

  static getLocationWeather(location: Location): string {
    const weatherPatterns: Record<string, string[]> = {
      "jade_mountain_academy": ["Clear mountain air", "Light mountain breeze", "Misty morning"],
      "mud_kingdom": ["Humid and muggy", "Swampy mist", "Gentle rain"],
      "sand_kingdom": ["Hot and dry", "Sandstorm approaching", "Scorching sun"],
      "sky_kingdom": ["Thin mountain air", "Strong winds", "Crystal clear skies"],
      "sea_kingdom": ["Ocean breeze", "Salty mist", "Gentle waves"],
      "ice_kingdom": ["Bitter cold", "Swirling snow", "Aurora visible"],
      "rainforest_kingdom": ["Warm humidity", "Tropical rain", "Dappled sunlight"],
      "poison_jungle": ["Toxic mists", "Oppressive humidity", "Strange plant odors"]
    };
    
    const patterns = weatherPatterns[location.id] || ["Pleasant weather"];
    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  static handleLocationMigration(character: Character, gameData: GameData, destination: Location): GameData {
    const travelTime = LocationSystem.calculateTravelTime(LocationSystem.getCurrentLocation(gameData), destination);
    
    return {
      ...gameData,
      location: destination.id,
      turn: gameData.turn + Math.ceil(travelTime / 2), // Advance turns based on travel time
      timeInfo: generateTimeInfo(character)
    };
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

  static progressTime(character: Character, gameData: GameData, multiplier: number = 1): void {
    // Age progression - every 5 turns advances age (faster aging)
    if (gameData.turn % 5 === 0) {
      character.age += 0.2 * multiplier;
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
    if (choice.consequences && choice.consequences.some(c => c.toLowerCase().includes('friend'))) {
      // Positive social interaction
      const dragonName = this.extractDragonName(choice.consequences.join(' '));
      if (dragonName && character.relationships && character.relationships[dragonName] !== undefined) {
        const relationship = character.relationships[dragonName];
        if (typeof relationship === 'object') {
          relationship.strength = Math.min(100, relationship.strength + 10);
          relationship.history.push("Had a positive interaction");
        }
      }
    }

    if (choice.consequences && choice.consequences.some(c => c.toLowerCase().includes('betray') || c.toLowerCase().includes('hurt'))) {
      // Negative social interaction  
      const dragonName = this.extractDragonName(choice.consequences.join(' '));
      if (dragonName && character.relationships && character.relationships[dragonName] !== undefined) {
        const relationship = character.relationships[dragonName];
        if (typeof relationship === 'object') {
          relationship.strength = Math.max(-100, relationship.strength - 15);
          relationship.history.push("Had a negative interaction");
        }
      }
    }

    // Check for romance progression with existing relationships
    if (character.relationships) {
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
  }

  static handleRomanceChoice(character: Character, choice: Choice, scenario: Scenario): void {
    // Extract partner name from scenario narrative
    const narrativeText = (scenario.narrativeText || []).join(' ');
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
      if (!character.relationships) character.relationships = {};
      character.relationships[partnerName] = {
        name: partnerName,
        type: 'friend',
        strength: Math.floor(Math.random() * 20) + 40, // 40-60 strength
        history: ["Met through romantic encounter", "Taking things slowly"],
        isAlive: true
      };
      
    } else if (choice.id === 'romance_reject') {
      // Polite rejection - neutral relationship
      if (!character.relationships) character.relationships = {};
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
      c.text?.toLowerCase()?.includes('attack') ||
      c.text?.toLowerCase()?.includes('hurt') ||
      c.text?.toLowerCase()?.includes('betray') ||
      c.text?.toLowerCase()?.includes('cruel')
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

  static isPositiveChoice(choice: Choice): boolean {
    const positiveKeywords = ['help', 'heal', 'save', 'protect', 'befriend', 'share', 'aid', 'comfort', 'mercy', 'forgive', 'peaceful', 'kind'];
    const text = (choice.text || '').toLowerCase() + ' ' + (choice.description || '').toLowerCase();
    return positiveKeywords.some(keyword => text.includes(keyword)) || choice.sanityCost < 0;
  }

  static isNegativeChoice(choice: Choice): boolean {
    const negativeKeywords = ['attack', 'hurt', 'betray', 'steal', 'kill', 'harm', 'cruel', 'abandon', 'ignore', 'threaten', 'manipulate'];
    const text = (choice.text || '').toLowerCase() + ' ' + (choice.description || '').toLowerCase();
    return negativeKeywords.some(keyword => text.includes(keyword)) || choice.corruption === true;
  }
}