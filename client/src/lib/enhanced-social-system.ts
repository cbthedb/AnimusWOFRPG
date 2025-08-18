import { Character, Relationship } from "@shared/schema";

export interface SocialEvent {
  id: string;
  type: "friendship" | "rivalry" | "alliance" | "betrayal" | "gossip" | "party" | "conflict";
  participantName: string;
  participantTribe: string;
  description: string;
  relationshipChange: number;
  requirements?: (character: Character) => boolean;
}

export interface SocialGroup {
  name: string;
  members: string[];
  type: "study_group" | "combat_training" | "secret_society" | "political_faction" | "hobby_club";
  influence: number;
  reputation: number;
}

export class EnhancedSocialSystem {
  private static readonly DRAGON_NAMES_BY_TRIBE = {
    MudWing: ['Clay', 'Marsh', 'Umber', 'Sora', 'Reed', 'Pheasant', 'Cattail', 'Newt', 'Crane', 'Sepia'],
    SandWing: ['Sunny', 'Thorn', 'Qibli', 'Ostrich', 'Jackal', 'Camel', 'Fennec', 'Addax', 'Cobra', 'Rattlesnake'],
    SkyWing: ['Scarlet', 'Ruby', 'Peril', 'Clay', 'Flame', 'Garnet', 'Hawk', 'Eagle', 'Kestrel', 'Osprey'],
    SeaWing: ['Tsunami', 'Coral', 'Anemone', 'Riptide', 'Pearl', 'Current', 'Nautilus', 'Turtle', 'Shark', 'Whale'],
    IceWing: ['Winter', 'Lynx', 'Snowfall', 'Hailstorm', 'Icicle', 'Frost', 'Arctic', 'Glacier', 'Blizzard', 'Tundra'],
    RainWing: ['Glory', 'Kinkajou', 'Bromeliad', 'Tamarin', 'Orchid', 'Coconut', 'Mango', 'Papaya', 'Liana', 'Heliconia'],
    NightWing: ['Starflight', 'Fatespeaker', 'Mastermind', 'Morrowseer', 'Moonwatcher', 'Darkstalker', 'Clearsight', 'Listener', 'Mindreader', 'Thoughtful'],
    SilkWing: ['Blue', 'Cricket', 'Luna', 'Admiral', 'Morpho', 'Silverspot', 'Tau', 'Danaid', 'Fritillary', 'Pierid'],
    HiveWing: ['Wasp', 'Hornet', 'Yellowjacket', 'Cicada', 'Vinegaroon', 'Tsetse', 'Jewel', 'Katydid', 'Grasshopper', 'Weevil'],
    LeafWing: ['Sundew', 'Willow', 'Hazel', 'Sequoia', 'Maple', 'Pokeweed', 'Bryony', 'Hemlock', 'Nettle', 'Mandrake']
  };

  private static readonly SOCIAL_EVENTS: SocialEvent[] = [
    {
      id: "study_partner",
      type: "friendship",
      participantName: "",
      participantTribe: "",
      description: "A classmate asks you to be their study partner for upcoming exams.",
      relationshipChange: 15
    },
    {
      id: "combat_rivalry",
      type: "rivalry",
      participantName: "",
      participantTribe: "",
      description: "Another dragon challenges your combat skills publicly.",
      relationshipChange: -20
    },
    {
      id: "tribal_alliance",
      type: "alliance",
      participantName: "",
      participantTribe: "",
      description: "A dragon from another tribe offers a political alliance.",
      relationshipChange: 25
    },
    {
      id: "secret_betrayal",
      type: "betrayal",
      participantName: "",
      participantTribe: "",
      description: "You discover someone you trusted has been spreading rumors about you.",
      relationshipChange: -35
    },
    {
      id: "gossip_session",
      type: "gossip",
      participantName: "",
      participantTribe: "",
      description: "You're invited to join a group sharing the latest academy gossip.",
      relationshipChange: 10
    },
    {
      id: "birthday_celebration",
      type: "party",
      participantName: "",
      participantTribe: "",
      description: "A friend invites you to their hatching day celebration.",
      relationshipChange: 20
    },
    {
      id: "philosophical_debate",
      type: "conflict",
      participantName: "",
      participantTribe: "",
      description: "A heated debate about inter-tribal politics causes tension.",
      relationshipChange: -10
    },
    {
      id: "rescue_mission",
      type: "alliance",
      participantName: "",
      participantTribe: "",
      description: "You and another dragon work together to rescue someone in danger.",
      relationshipChange: 30
    },
    {
      id: "talent_show",
      type: "friendship",
      participantName: "",
      participantTribe: "",
      description: "You participate in a talent show together, bonding over shared performance.",
      relationshipChange: 18
    },
    {
      id: "food_sharing",
      type: "friendship",
      participantName: "",
      participantTribe: "",
      description: "You share your favorite tribal food with someone curious about your culture.",
      relationshipChange: 12
    },
    {
      id: "academic_competition",
      type: "rivalry",
      participantName: "",
      participantTribe: "",
      description: "Competition for the top academic spot creates tension between you and a peer.",
      relationshipChange: -15
    },
    {
      id: "cultural_exchange",
      type: "friendship",
      participantName: "",
      participantTribe: "",
      description: "You exchange cultural traditions and stories with a dragon from another tribe.",
      relationshipChange: 22
    }
  ];

  static generateRandomDragonName(tribe: string): string {
    const names = this.DRAGON_NAMES_BY_TRIBE[tribe as keyof typeof this.DRAGON_NAMES_BY_TRIBE] || this.DRAGON_NAMES_BY_TRIBE.NightWing;
    return names[Math.floor(Math.random() * names.length)];
  }

  static generateRandomTribe(excludeTribe?: string): string {
    const tribes = Object.keys(this.DRAGON_NAMES_BY_TRIBE);
    const availableTribes = excludeTribe ? tribes.filter(t => t !== excludeTribe) : tribes;
    return availableTribes[Math.floor(Math.random() * availableTribes.length)];
  }

  static generateSocialEvent(character: Character): SocialEvent {
    const baseEvent = this.SOCIAL_EVENTS[Math.floor(Math.random() * this.SOCIAL_EVENTS.length)];
    const participantTribe = this.generateRandomTribe(character.tribe);
    
    return {
      ...baseEvent,
      participantName: this.generateRandomDragonName(participantTribe),
      participantTribe
    };
  }

  static processRelationshipChange(
    character: Character, 
    dragonName: string, 
    tribe: string, 
    relationshipChange: number,
    eventType: SocialEvent['type']
  ): void {
    if (!character.relationships[dragonName]) {
      // Create new relationship
      character.relationships[dragonName] = {
        name: dragonName,
        type: this.getRelationshipType(relationshipChange, eventType),
        strength: Math.max(0, Math.min(100, 50 + relationshipChange)),
        history: [`First met through ${eventType}`],
        isAlive: true
      };
    } else {
      // Update existing relationship
      const relationship = character.relationships[dragonName];
      relationship.strength = Math.max(0, Math.min(100, relationship.strength + relationshipChange));
      relationship.history.push(`${eventType} event: ${relationshipChange > 0 ? 'improved' : 'worsened'} relationship`);
      
      // Update relationship type based on new strength
      relationship.type = this.getRelationshipType(relationship.strength, eventType);
    }
  }

  private static getRelationshipType(strengthOrChange: number, eventType: SocialEvent['type']): Relationship['type'] {
    const strength = strengthOrChange > 100 ? strengthOrChange : strengthOrChange + 50;
    
    if (eventType === 'betrayal' || strength < 20) return 'enemy';
    if (eventType === 'rivalry' || strength < 40) return 'rival';
    if (strength >= 60) return 'friend';
    return 'neutral';
  }

  static getRelationshipSummary(character: Character): {
    friends: number;
    enemies: number;
    rivals: number;
    romantic: number;
    neutral: number;
  } {
    const summary = {
      friends: 0,
      enemies: 0,
      rivals: 0,
      romantic: 0,
      neutral: 0
    };

    Object.values(character.relationships).forEach(relationship => {
      if (!relationship.isAlive) return;
      
      switch (relationship.type) {
        case 'friend':
          summary.friends++;
          break;
        case 'enemy':
          summary.enemies++;
          break;
        case 'rival':
          summary.rivals++;
          break;
        case 'romantic':
        case 'mate':
          summary.romantic++;
          break;
        case 'neutral':
          summary.neutral++;
          break;
      }
    });

    return summary;
  }

  static canHaveMoreSocialEvents(character: Character): boolean {
    const relationshipCount = Object.keys(character.relationships).length;
    const maxRelationships = 15 + Math.floor(character.charisma / 2);
    return relationshipCount < maxRelationships;
  }

  static generateSocialGroupInvitation(character: Character): {
    groupName: string;
    groupType: SocialGroup['type'];
    description: string;
  } | null {
    if (Math.random() > 0.3) return null; // 30% chance of group invitation

    const groups = [
      {
        groupName: "Jade Mountain Study Circle",
        groupType: "study_group" as const,
        description: "A group of academically minded dragons who meet weekly to discuss complex subjects and help each other with studies."
      },
      {
        groupName: "Inter-tribal Combat Training",
        groupType: "combat_training" as const,
        description: "Dragons from different tribes who practice combat techniques together, learning from each other's tribal fighting styles."
      },
      {
        groupName: "The Scroll Keepers",
        groupType: "secret_society" as const,
        description: "A secretive group dedicated to preserving ancient knowledge and protecting dangerous information from falling into wrong claws."
      },
      {
        groupName: "Peace Alliance Coalition",
        groupType: "political_faction" as const,
        description: "Dragons working toward better inter-tribal relations and preventing future wars through diplomacy and understanding."
      },
      {
        groupName: "Creative Arts Society",
        groupType: "hobby_club" as const,
        description: "Artists, storytellers, and creative dragons who share their work and inspire each other's artistic endeavors."
      }
    ];

    return groups[Math.floor(Math.random() * groups.length)];
  }
}