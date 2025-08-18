import { Character, GameData, Scenario, Choice } from "@shared/schema";
import { EnhancedSocialSystem } from "./enhanced-social-system";
import { EnhancedDragonetSystem } from "./enhanced-dragonet-system";

// Simplified integration system that works with existing game
export class EnhancedGameIntegration {
  // Enhanced social interactions
  static generateSocialScenario(character: Character, gameData: GameData): Scenario | null {
    if (Math.random() < 0.3 && EnhancedSocialSystem.canHaveMoreSocialEvents(character)) {
      const socialEvent = EnhancedSocialSystem.generateSocialEvent(character);
      
      return {
        id: `social_${socialEvent.id}_${Date.now()}`,
        type: 'SOCIAL',
        text: `${socialEvent.description} ${socialEvent.participantName} is a ${socialEvent.participantTribe} dragon.`,
        choices: [
          {
            id: "positive_social",
            text: "Respond positively and engage warmly",
            consequences: ["social_relationship_improved"],
            soulCost: 0,
            sanityCost: 0
          },
          {
            id: "neutral_social", 
            text: "Be polite but maintain distance",
            consequences: ["neutral_interaction"],
            soulCost: 0,
            sanityCost: 0
          },
          {
            id: "negative_social",
            text: "Be dismissive or rude",
            consequences: ["social_relationship_damaged"],
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
            consequences: ["family_bond_strengthened"],
            soulCost: 0,
            sanityCost: 0
          },
          {
            id: "protective_parent",
            text: "Be protective and cautious",
            consequences: ["parental_protection"],
            soulCost: 0,
            sanityCost: 0
          },
          {
            id: "wise_guidance",
            text: "Offer wise guidance and life lessons",
            consequences: ["wisdom_shared"],
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
        // Meeting potential romantic interest
        const tribes = ["MudWing", "SandWing", "SkyWing", "SeaWing", "IceWing", "RainWing", "NightWing", "SilkWing", "HiveWing", "LeafWing"];
        const partnerTribe = tribes[Math.floor(Math.random() * tribes.length)];
        const partnerName = `${['Dawn', 'Ember', 'Storm', 'River', 'Star', 'Moon', 'Fire', 'Ocean'][Math.floor(Math.random() * 8)]}`;
        
        return {
          id: `romance_meeting_${Date.now()}`,
          type: 'ROMANCE',
          text: `You meet ${partnerName}, an attractive ${partnerTribe} dragon, during a peaceful evening at the academy. There's an immediate connection between you.`,
          choices: [
            {
              id: "pursue_romance",
              text: `Show interest in getting to know ${partnerName} better`,
              consequences: ["romantic_interest_developed"],
              soulCost: 0,
              sanityCost: 1
            },
            {
              id: "friendship_first",
              text: "Start as friends and see what develops naturally",
              consequences: ["friendship_foundation"],
              soulCost: 0,
              sanityCost: 0
            },
            {
              id: "avoid_romance",
              text: "Keep things casual and avoid romantic complications",
              consequences: ["romance_avoided"],
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