import { Character, GameData, Scenario, Choice } from "@shared/schema";
import { EnhancedSocialSystem } from "./enhanced-social-system";
import { EnhancedDragonetSystem } from "./enhanced-dragonet-system";
import { RomanceSystem } from "./romance-system";

// Simplified integration system that works with existing game
export class EnhancedGameIntegration {
  // Enhanced social interactions
  static generateSocialScenario(character: Character, gameData: GameData): Scenario | null {
    if (Math.random() < 0.3) {
      const socialEvent = EnhancedSocialSystem.generateSocialEvent(character);
      
      return {
        id: `social_${socialEvent.id}_${Date.now()}`,
        type: 'SOCIAL',
        text: socialEvent.narrativeText.join(' '),
        choices: [
          {
            id: "positive_social",
            text: "Respond positively and engage warmly",
            description: `Greet ${socialEvent.participantName} with enthusiasm and openness`,
            consequences: [`You warmly engage with ${socialEvent.participantName}, building a positive connection`],
            soulCost: 0,
            sanityCost: 0
          },
          {
            id: "neutral_social", 
            text: "Be polite but maintain distance",
            description: "Show courtesy while keeping things professional",
            consequences: [`You interact politely with ${socialEvent.participantName} but remain somewhat distant`],
            soulCost: 0,
            sanityCost: 0
          },
          {
            id: "negative_social",
            text: "Be dismissive or rude",
            description: `Show disinterest or hostility toward ${socialEvent.participantName}`,
            consequences: [`Your rude behavior damages your relationship with ${socialEvent.participantName}`],
            soulCost: 0,
            sanityCost: -1
          }
        ],
        location: gameData.location || "jade_mountain_academy"
      };
    }
    return null;
  }

  // Enhanced dragonet interactions  
  static generateDragonetScenario(character: Character, gameData: GameData): Scenario | null {
    if (character.dragonets.length > 0 && Math.random() < 0.25) {
      const randomDragonet = character.dragonets[Math.floor(Math.random() * character.dragonets.length)];
      
      const scenarios = [
        `Your dragonet ${randomDragonet.name} asks you about their ${randomDragonet.isAnimus ? 'animus powers' : 'tribal abilities'}. How do you respond?`,
        `${randomDragonet.name} is having trouble making friends at school. What guidance do you offer?`,
        `Your dragonet ${randomDragonet.name} shows interest in exploring dangerous places. How do you handle this?`,
        `${randomDragonet.name} asks about their other parent and why they look different from other dragonets. What do you tell them?`
      ];

      return {
        id: `dragonet_${randomDragonet.name}_${Date.now()}`,
        type: 'FAMILY',
        text: scenarios[Math.floor(Math.random() * scenarios.length)],
        choices: [
          {
            id: "supportive_parent",
            text: "Be supportive and understanding",
            description: `Encourage ${randomDragonet.name} with love and patience`,
            consequences: [`You offer loving support to ${randomDragonet.name}, strengthening your family bond`],
            soulCost: 0,
            sanityCost: 0
          },
          {
            id: "protective_parent",
            text: "Be protective and cautious",
            description: `Keep ${randomDragonet.name} safe while being firm about boundaries`,
            consequences: [`You prioritize ${randomDragonet.name}'s safety with protective guidance`],
            soulCost: 0,
            sanityCost: 0
          },
          {
            id: "wise_guidance",
            text: "Offer wise guidance and life lessons",
            description: `Share your wisdom and experience with ${randomDragonet.name}`,
            consequences: [`You pass on valuable life lessons to ${randomDragonet.name}, helping them grow wiser`],
            soulCost: 0,
            sanityCost: 0
          }
        ],
        location: gameData.location || "jade_mountain_academy"
      };
    }
    return null;
  }

  // Romance and mating scenarios
  static generateRomanceScenario(character: Character, gameData: GameData): Scenario | null {
    if (character.age >= 4 && Math.random() < 0.2) {
      const hasPartner = character.mate || Object.values(character.relationships).some(r => r.type === 'romantic');
      
      if (!hasPartner) {
        // Generate a romantic encounter with proper narrative
        const romanticEncounter = RomanceSystem.generateRomanticEncounter(character);
        
        return {
          id: `romance_meeting_${Date.now()}`,
          type: 'ROMANCE',
          text: romanticEncounter.narrativeText.join(' '),
          choices: [
            {
              id: "pursue_romance",
              text: `Show romantic interest in ${romanticEncounter.partnerName}`,
              description: `Express your attraction and desire to get to know ${romanticEncounter.partnerName} better`,
              consequences: [`You pursue a romantic connection with ${romanticEncounter.partnerName}, the charming ${romanticEncounter.partnerTribe} dragon`],
              soulCost: 0,
              sanityCost: 1
            },
            {
              id: "friendship_first",
              text: "Suggest starting as friends",
              description: "Build a foundation of friendship before considering romance",
              consequences: [`You choose to develop a friendship with ${romanticEncounter.partnerName} first, letting romance develop naturally`],
              soulCost: 0,
              sanityCost: 0
            },
            {
              id: "avoid_romance",
              text: "Keep things casual",
              description: "Maintain a friendly but non-romantic relationship",
              consequences: [`You decide to keep your relationship with ${romanticEncounter.partnerName} purely platonic`],
              soulCost: 0,
              sanityCost: -1
            }
          ],
          location: gameData.location || "jade_mountain_academy"
        };
      } else if (character.mate && EnhancedDragonetSystem.canHaveOffspring(character)) {
        // Existing relationship - potential for offspring
        return {
          id: `offspring_consideration_${Date.now()}`,
          type: 'FAMILY',
          text: `You and your mate ${character.mate} have been discussing the possibility of having dragonets. This is a major life decision that would change everything.`,
          choices: [
            {
              id: "try_offspring",
              text: "Decide to try for dragonets together",
              consequences: ["offspring_attempted"],
              soulCost: 0,
              sanityCost: 2
            },
            {
              id: "wait_offspring", 
              text: "Wait until you're more established before having dragonets",
              consequences: ["family_planning"],
              soulCost: 0,
              sanityCost: 0
            },
            {
              id: "no_offspring",
              text: "Decide to focus on your relationship without dragonets for now",
              consequences: ["couple_focus"],
              soulCost: 0,
              sanityCost: 0
            }
          ],
          location: gameData.location || "jade_mountain_academy"
        };
      }
    }
    return null;
  }

  // Process social event outcomes with proper messaging
  static processSocialEvent(character: Character, choice: Choice, socialEvent: any): void {
    if (!socialEvent) return;
    
    // Update relationship based on choice
    let relationshipChange = 0;
    let newRelationshipType: 'friend' | 'neutral' | 'rival' | 'enemy' = 'neutral';
    
    switch (choice.id) {
      case "positive_social":
        relationshipChange = socialEvent.relationshipChange || 15;
        newRelationshipType = 'friend';
        break;
      case "neutral_social":
        relationshipChange = 5;
        newRelationshipType = 'neutral';
        break;
      case "negative_social":
        relationshipChange = -(Math.abs(socialEvent.relationshipChange) || 10);
        newRelationshipType = 'rival';
        break;
    }
    
    // Apply relationship change and ensure it's saved properly
    EnhancedSocialSystem.processRelationshipChange(
      character,
      socialEvent.participantName,
      socialEvent.participantTribe,
      relationshipChange,
      socialEvent.type || 'cooperation'
    );
    
    // Force character update to ensure relationships are saved and notify the system
    console.log(`Relationship updated: ${socialEvent.participantName} - Type: ${character.relationships[socialEvent.participantName]?.type}, Strength: ${character.relationships[socialEvent.participantName]?.strength}`);
    
    // Ensure the character data is marked as dirty for saving
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('characterUpdated', { detail: character }));
    }
  }

  // Process romance event outcomes
  static processRomanceEvent(character: Character, choice: Choice, romanticEncounter: any): void {
    if (!romanticEncounter) return;
    
    switch (choice.id) {
      case "pursue_romance":
        RomanceSystem.developRomance(character, romanticEncounter.partnerName, romanticEncounter.partnerTribe);
        break;
      case "friendship_first":
        // Add as friend relationship
        character.relationships[romanticEncounter.partnerName] = {
          name: romanticEncounter.partnerName,
          type: "friend",
          strength: 40,
          history: ["Started as friends"],
          isAlive: true
        };
        break;
      case "avoid_romance":
        // Add as neutral relationship
        character.relationships[romanticEncounter.partnerName] = {
          name: romanticEncounter.partnerName,
          type: "neutral",
          strength: 25,
          history: ["Kept relationship casual"],
          isAlive: true
        };
        break;
    }
  }

  // Enhanced artifact discovery
  static generateArtifactScenario(character: Character, gameData: GameData): Scenario | null {
    const currentLocation = gameData.location || "jade_mountain_academy";
    
    // Simple artifact discovery based on location
    if (Math.random() < 0.05) { // 5% chance
      const artifacts = {
        "jade_mountain_academy": { name: "Ancient Scroll of Wisdom", description: "glowing with magical energy" },
        "scorpion_den": { name: "Gambler's Lucky Charm", description: "pulsing with probability magic" },
        "sand_kingdom": { name: "Desert Rose Crystal", description: "shimmering with heat mirages" },
        "mud_kingdom": { name: "Healing Clay Pot", description: "emanating soothing warmth" },
        "sky_kingdom": { name: "Wind Rider's Compass", description: "spinning with aerial magic" },
        "sea_kingdom": { name: "Tide Turner's Pearl", description: "glowing with oceanic power" },
        "ice_kingdom": { name: "Frost Crown Shard", description: "radiating freezing energy" },
        "rainforest_kingdom": { name: "Camouflage Vine", description: "shifting colors mysteriously" },
        "night_kingdom_old": { name: "Prophecy Stone", description: "showing glimpses of possible futures" },
        "poison_jungle": { name: "Immunity Flower", description: "protected by a shimmering barrier" }
      };

      const artifact = artifacts[currentLocation as keyof typeof artifacts] || artifacts["jade_mountain_academy"];

      return {
        id: `artifact_discovery_${currentLocation}_${Date.now()}`,
        type: 'DISCOVERY',
        text: `While exploring ${currentLocation.replace('_', ' ')}, you discover a ${artifact.name} ${artifact.description}. This appears to be a powerful animus artifact.`,
        choices: [
          {
            id: "claim_artifact",
            text: `Take the ${artifact.name} despite unknown risks`,
            consequences: ["artifact_claimed", "soul_risk"],
            soulCost: 2,
            sanityCost: 0
          },
          {
            id: "study_artifact",
            text: "Study the artifact carefully before deciding",
            consequences: ["artifact_studied"],
            soulCost: 0,
            sanityCost: 1
          },
          {
            id: "leave_artifact",
            text: "Leave the artifact alone - it's too dangerous",
            consequences: ["artifact_avoided"],
            soulCost: 0,
            sanityCost: 0
          }
        ],
        location: currentLocation
      };
    }
    return null;
  }

  // Process consequences from enhanced scenarios
  static processEnhancedConsequences(
    character: Character,
    gameData: GameData,
    consequences: string[],
    scenario: Scenario
  ): void {
    consequences.forEach(consequence => {
      switch (consequence) {
        case "social_relationship_improved":
          // Add or improve a random relationship
          const socialEvent = EnhancedSocialSystem.generateSocialEvent(character);
          EnhancedSocialSystem.processRelationshipChange(
            character, 
            socialEvent.participantName, 
            socialEvent.participantTribe, 
            15, 
            'friendship'
          );
          break;

        case "family_bond_strengthened":
          // Improve relationships with family members
          Object.values(character.relationships).forEach(rel => {
            if (rel.type === 'family' || rel.type === 'mate') {
              rel.strength = Math.min(100, rel.strength + 10);
            }
          });
          break;

        case "offspring_attempted":
          // Try to generate offspring
          if (character.mate) {
            const newDragonet = EnhancedDragonetSystem.attemptOffspring(character);
            if (newDragonet) {
              gameData.relationships = gameData.relationships || {};
              gameData.relationships[`dragonet_${newDragonet.name}`] = 50;
            }
          }
          break;

        case "romantic_interest_developed":
          // Create new romantic relationship
          const partnerName = "NewRomanticInterest"; // Would be dynamic in full implementation
          character.relationships[partnerName] = {
            name: partnerName,
            type: 'romantic',
            strength: 40,
            history: ["Met and felt immediate connection"],
            isAlive: true
          };
          break;

        case "artifact_claimed":
          // Add artifact to inventory (simplified)
          gameData.achievements = gameData.achievements || [];
          if (!gameData.achievements.includes("Artifact Collector")) {
            gameData.achievements.push("Artifact Collector");
          }
          break;
      }
    });
  }

  // Main integration method - generates enhanced scenarios
  static generateEnhancedScenario(character: Character, gameData: GameData): Scenario | null {
    // Try different types of enhanced scenarios
    const scenarios = [
      () => this.generateSocialScenario(character, gameData),
      () => this.generateDragonetScenario(character, gameData), 
      () => this.generateRomanceScenario(character, gameData),
      () => this.generateArtifactScenario(character, gameData)
    ];

    // Randomly try each type
    const shuffled = scenarios.sort(() => Math.random() - 0.5);
    
    for (const scenarioGen of shuffled) {
      const scenario = scenarioGen();
      if (scenario) return scenario;
    }

    return null;
  }
}