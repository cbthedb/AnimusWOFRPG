import { Character, Dragonet, RomanticEvent } from "@shared/schema";

export interface DragonetEvent {
  id: string;
  dragonetName: string;
  eventType: "birth" | "first_words" | "first_flight" | "school_start" | "power_manifestation" | "coming_of_age" | "independence";
  description: string;
  ageOccurred: number;
  parentReaction?: string;
}

export class EnhancedDragonetSystem {
  private static readonly DRAGONET_NAMES = [
    // Traditional names
    "Ember", "Spark", "Brook", "Pebble", "Frost", "Leaf", "Sky", "Ocean", "Storm", "Dawn",
    // Gemstone names
    "Ruby", "Sapphire", "Emerald", "Diamond", "Opal", "Topaz", "Garnet", "Jade", "Crystal", "Pearl",
    // Nature names
    "River", "Mountain", "Forest", "Desert", "Glacier", "Meadow", "Canyon", "Valley", "Ridge", "Falls",
    // Weather names
    "Thunder", "Lightning", "Rain", "Snow", "Wind", "Mist", "Cloud", "Sun", "Moon", "Star",
    // Unique names
    "Phoenix", "Galaxy", "Nova", "Comet", "Aurora", "Cosmos", "Nebula", "Stellar", "Solar", "Lunar"
  ];

  private static readonly PERSONALITY_TRAITS = [
    "Curious", "Brave", "Gentle", "Mischievous", "Thoughtful", "Energetic", "Shy", "Bold", 
    "Compassionate", "Independent", "Playful", "Serious", "Creative", "Logical", "Empathetic",
    "Adventurous", "Cautious", "Optimistic", "Determined", "Patient", "Impulsive", "Wise"
  ];

  static generateDragonetName(): string {
    return this.DRAGONET_NAMES[Math.floor(Math.random() * this.DRAGONET_NAMES.length)];
  }

  static canHaveOffspring(character: Character): boolean {
    return character.age >= 5 && 
           character.mate !== undefined && 
           character.soulPercentage >= 40 && 
           character.sanityPercentage >= 40;
  }

  static attemptOffspring(character: Character): Dragonet | null {
    if (!this.canHaveOffspring(character)) return null;
    if (Math.random() > 0.4) return null; // 40% chance of offspring per attempt

    const mate = character.relationships[character.mate!];
    if (!mate || mate.type !== 'mate') return null;

    const partnerTribe = this.getTribeFromRelationshipHistory(mate.history) || this.getRandomTribe();
    const isHybrid = character.tribe !== partnerTribe;
    
    const dragonetName = this.generateDragonetName();
    const inheritedTraits = this.generateInheritedTraits(character, partnerTribe);
    const isAnimus = this.calculateAnimusInheritance(character, isHybrid);

    const dragonet: Dragonet = {
      name: dragonetName,
      age: 0,
      tribe: character.tribe,
      hybridTribes: isHybrid ? [character.tribe, partnerTribe] : undefined,
      inheritedTraits,
      isAnimus,
      parentage: "biological",
      personality: this.generatePersonality()
    };

    // Add to character's dragonets
    character.dragonets.push(dragonet);

    // Add romantic event
    const romanticEvent: RomanticEvent = {
      partnerName: character.mate!,
      eventType: "mating",
      turnOccurred: character.age,
      outcome: `${dragonetName} was born`,
      hasOffspring: true
    };
    character.romanticHistory.push(romanticEvent);

    // Improve relationship with mate
    mate.strength = Math.min(100, mate.strength + 15);
    mate.history.push(`Had dragonet ${dragonetName} together`);

    return dragonet;
  }

  static progressDragonetDevelopment(character: Character): DragonetEvent[] {
    const events: DragonetEvent[] = [];

    character.dragonets.forEach(dragonet => {
      // Age the dragonet
      dragonet.age += 1;

      // Generate development events based on age
      const event = this.generateDragonetEvent(dragonet, character);
      if (event) {
        events.push(event);
      }

      // Handle coming of age (age 7+)
      if (dragonet.age >= 7 && Math.random() < 0.3) {
        const independenceEvent = this.generateIndependenceEvent(dragonet, character);
        if (independenceEvent) {
          events.push(independenceEvent);
        }
      }
    });

    return events;
  }

  private static generateDragonetEvent(dragonet: Dragonet, parent: Character): DragonetEvent | null {
    const eventChance = 0.4; // 40% chance of event per turn
    if (Math.random() > eventChance) return null;

    let eventType: DragonetEvent['eventType'];
    let description: string;
    let parentReaction: string;

    if (dragonet.age === 0) {
      eventType = "first_words";
      description = `${dragonet.name} speaks their first word: "${parent.name}!"`;
      parentReaction = "You feel overwhelming pride and joy as your dragonet recognizes you.";
    } else if (dragonet.age === 1) {
      eventType = "first_flight";
      description = `${dragonet.name} takes their first successful flight, wobbling but determined.`;
      parentReaction = "You watch nervously but encourage their efforts, remembering your own first flight.";
    } else if (dragonet.age === 2) {
      eventType = "school_start";
      description = `${dragonet.name} starts attending basic classes at the academy.`;
      parentReaction = "You feel proud watching them join other young dragonets in learning.";
    } else if (dragonet.age === 3 && (dragonet.isAnimus || dragonet.hybridTribes)) {
      eventType = "power_manifestation";
      if (dragonet.isAnimus) {
        description = `${dragonet.name} accidentally enchants a toy, revealing their animus powers.`;
        parentReaction = "You feel a mix of pride and concern, knowing the burden they will carry.";
      } else {
        description = `${dragonet.name} shows signs of their hybrid abilities.`;
        parentReaction = "You're amazed by their unique heritage and the potential it represents.";
      }
    } else if (dragonet.age >= 4 && dragonet.age < 7) {
      const randomEvents = [
        {
          type: "school_start" as const,
          desc: `${dragonet.name} excels in their studies and makes new friends.`,
          reaction: "You beam with pride at their academic and social success."
        },
        {
          type: "power_manifestation" as const,
          desc: `${dragonet.name} shows impressive skill in their tribal abilities.`,
          reaction: "You see echoes of yourself in their growing abilities."
        }
      ];
      const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
      eventType = event.type;
      description = event.desc;
      parentReaction = event.reaction;
    } else if (dragonet.age >= 6) {
      eventType = "coming_of_age";
      description = `${dragonet.name} demonstrates adult-level reasoning and independence.`;
      parentReaction = "You realize your little dragonet is growing into a capable adult dragon.";
    } else {
      return null;
    }

    return {
      id: `${dragonet.name}_${eventType}_${dragonet.age}`,
      dragonetName: dragonet.name,
      eventType,
      description,
      ageOccurred: dragonet.age,
      parentReaction
    };
  }

  private static generateIndependenceEvent(dragonet: Dragonet, parent: Character): DragonetEvent {
    const outcomes = [
      `${dragonet.name} decides to travel to explore other kingdoms and learn about the world.`,
      `${dragonet.name} chooses to stay at Jade Mountain Academy to continue their advanced studies.`,
      `${dragonet.name} joins a diplomatic mission to help improve inter-tribal relations.`,
      `${dragonet.name} becomes interested in preserving ancient dragon history and artifacts.`,
      `${dragonet.name} starts their own adventure, following in your footsteps but forging their own path.`
    ];

    return {
      id: `${dragonet.name}_independence`,
      dragonetName: dragonet.name,
      eventType: "independence",
      description: outcomes[Math.floor(Math.random() * outcomes.length)],
      ageOccurred: dragonet.age,
      parentReaction: "You feel bittersweet pride as you watch them become independent, knowing you've raised them well."
    };
  }

  private static generateInheritedTraits(parent: Character, partnerTribe: string): string[] {
    const traits: string[] = [];
    
    // Inherit some parent traits
    const parentTraits = parent.traits.filter(trait => Math.random() < 0.4);
    traits.push(...parentTraits);

    // Add tribal-specific traits
    if (parent.isAnimus && Math.random() < 0.1) { // 10% chance to inherit animus
      traits.push("Potential Animus Heritage");
    }

    // Add personality traits
    const personalityTraits = this.PERSONALITY_TRAITS.filter(() => Math.random() < 0.3).slice(0, 2);
    traits.push(...personalityTraits);

    return [...new Set(traits)]; // Remove duplicates
  }

  private static calculateAnimusInheritance(parent: Character, isHybrid: boolean): boolean {
    if (!parent.isAnimus) return false;
    
    let baseChance = 0.15; // 15% base chance
    if (isHybrid) baseChance *= 1.5; // Hybrids have higher chance
    
    return Math.random() < baseChance;
  }

  private static generatePersonality(): string {
    const traits = this.PERSONALITY_TRAITS.filter(() => Math.random() < 0.4).slice(0, 3);
    return traits.join(", ") || "Balanced";
  }

  private static getTribeFromRelationshipHistory(history: string[]): string | null {
    // Try to extract tribe from relationship history
    const tribes = ["MudWing", "SandWing", "SkyWing", "SeaWing", "IceWing", "RainWing", "NightWing", "SilkWing", "HiveWing", "LeafWing"];
    
    for (const entry of history) {
      for (const tribe of tribes) {
        if (entry.includes(tribe)) {
          return tribe;
        }
      }
    }
    return null;
  }

  private static getRandomTribe(): string {
    const tribes = ["MudWing", "SandWing", "SkyWing", "SeaWing", "IceWing", "RainWing", "NightWing", "SilkWing", "HiveWing", "LeafWing"];
    return tribes[Math.floor(Math.random() * tribes.length)];
  }

  static getDragonetSummary(character: Character): {
    totalDragonets: number;
    youngDragonets: number; // age 0-3
    adolescentDragonets: number; // age 4-6
    adultDragonets: number; // age 7+
    animusDragonets: number;
    hybridDragonets: number;
  } {
    return {
      totalDragonets: character.dragonets.length,
      youngDragonets: character.dragonets.filter(d => d.age <= 3).length,
      adolescentDragonets: character.dragonets.filter(d => d.age >= 4 && d.age <= 6).length,
      adultDragonets: character.dragonets.filter(d => d.age >= 7).length,
      animusDragonets: character.dragonets.filter(d => d.isAnimus).length,
      hybridDragonets: character.dragonets.filter(d => d.hybridTribes).length
    };
  }
}