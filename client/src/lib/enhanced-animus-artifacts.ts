import { InventoryItem, Character, GameData } from "@shared/schema";
import { Location, LOCATIONS } from "./location-system";

export interface AnimusArtifact extends InventoryItem {
  discoveryLocation: string;
  discoveryRequirement?: (character: Character) => boolean;
  soulCorruptionRisk: number;
  moralDilemma: string;
  powerLevel: 'minor' | 'moderate' | 'major' | 'legendary';
  historicalSignificance: string;
}

// Comprehensive animus artifacts distributed across all locations
export const ANIMUS_ARTIFACTS: AnimusArtifact[] = [
  // JADE MOUNTAIN ACADEMY
  {
    id: "teachers_scroll",
    name: "Ever-Writing Scroll",
    type: "magical_artifact",
    discoveryLocation: "jade_mountain_academy",
    description: "A scroll that writes down everything spoken in its presence, created by an ancient NightWing animus.",
    rarity: "rare",
    effects: ["Can record conversations and lectures automatically", "Reveals hidden knowledge when activated"],
    soulCorruptionRisk: 2,
    powerLevel: "minor",
    moralDilemma: "This scroll could invade privacy and record private conversations. Do you use it for learning or destroy it?",
    historicalSignificance: "Created by the scholar Truthseeker to preserve important knowledge for future generations."
  },
  {
    id: "founders_compass",
    name: "Founder's Compass",
    type: "magical_artifact", 
    discoveryLocation: "jade_mountain_academy",
    description: "A golden compass that always points toward peace and understanding between tribes.",
    rarity: "legendary",
    effects: ["Guides toward peaceful solutions", "Reveals the intentions of others", "Promotes inter-tribal harmony"],
    soulCorruptionRisk: 1,
    powerLevel: "major",
    moralDilemma: "This compass could eliminate all conflict, but would also remove free will to choose discord. Should peace be forced?",
    historicalSignificance: "Enchanted by the academy's animus founder to guide future generations toward unity."
  },

  // MUD KINGDOM
  {
    id: "healing_mud_pot",
    name: "Eternal Healing Pot",
    type: "magical_artifact",
    discoveryLocation: "mud_kingdom", 
    description: "A clay pot that generates infinite healing mud, able to cure any injury or illness.",
    rarity: "rare",
    effects: ["Provides unlimited healing", "Can cure diseases", "Regenerates lost limbs"],
    soulCorruptionRisk: 3,
    powerLevel: "moderate",
    moralDilemma: "Unlimited healing could make dragons reckless or eliminate natural selection. Do you share this freely?",
    historicalSignificance: "Created during the great plague to save thousands of MudWing lives."
  },
  {
    id: "sibling_bond_amulet",
    name: "Sibling Bond Amulet",
    type: "magical_artifact",
    discoveryLocation: "mud_kingdom",
    description: "An amulet that lets MudWings share their fireproof abilities with their siblings permanently.",
    rarity: "uncommon", 
    effects: ["Shares fireproof ability with all siblings", "Strengthens sibling bonds", "Allows shared experiences"],
    soulCorruptionRisk: 4,
    powerLevel: "minor",
    moralDilemma: "This changes the fundamental nature of MudWing abilities. Is altering natural traits ethical?",
    historicalSignificance: "Made by a bigwings who wanted to protect all their siblings equally."
  },

  // SAND KINGDOM
  {
    id: "desert_oasis_stone",
    name: "Oasis Stone",
    type: "magical_artifact",
    discoveryLocation: "sand_kingdom",
    description: "A blue stone that can create a permanent oasis anywhere in the desert, bringing life to barren lands.",
    rarity: "rare",
    effects: ["Creates permanent water sources", "Makes desert bloom", "Provides shelter from heat"],
    soulCorruptionRisk: 5,
    powerLevel: "major",
    moralDilemma: "Creating oases could disrupt desert ecosystems and change territorial boundaries. Do you risk environmental chaos?",
    historicalSignificance: "Forged during the great drought to save the SandWing kingdom from starvation."
  },

  // SCORPION DEN  
  {
    id: "luck_changing_dice",
    name: "Fortune's Dice",
    type: "magical_artifact",
    discoveryLocation: "scorpion_den",
    description: "Enchanted dice that can change luck itself - making the roller incredibly fortunate or cursed.",
    rarity: "uncommon",
    effects: ["Manipulates probability", "Can curse or bless others", "Influences gambling outcomes"],
    soulCorruptionRisk: 6,
    powerLevel: "moderate", 
    moralDilemma: "Manipulating luck affects everyone around you. Do you use this power knowing it might harm innocent dragons?",
    historicalSignificance: "Created by a desperate gambler who lost everything and wanted to control fate itself."
  },
  {
    id: "truth_revealing_coin",
    name: "Coin of Truth",
    type: "magical_artifact",
    discoveryLocation: "scorpion_den",
    description: "A golden coin that compels absolute honesty from anyone who touches it.",
    rarity: "rare",
    effects: ["Forces truthfulness", "Reveals hidden motives", "Prevents deception"],
    soulCorruptionRisk: 4,
    powerLevel: "minor",
    moralDilemma: "Forcing truth eliminates privacy and free will. Should you use this to expose criminals?",
    historicalSignificance: "Made by an information broker to guarantee honest dealings in the lawless den."
  },

  // SKY KINGDOM
  {
    id: "wind_rider_crown",
    name: "Crown of Wind Mastery", 
    type: "magical_artifact",
    discoveryLocation: "sky_kingdom",
    description: "A crown that grants perfect control over wind currents and weather patterns.",
    rarity: "legendary",
    effects: ["Controls wind and weather", "Perfect flight abilities", "Can create storms or calm skies"],
    soulCorruptionRisk: 8,
    powerLevel: "major",
    moralDilemma: "Weather control affects entire kingdoms. Do you risk creating droughts or floods for personal advantage?",
    historicalSignificance: "Worn by the ancient SkyWing queen who ended the hurricane wars."
  },
  {
    id: "mountain_throne",
    name: "Unshakeable Throne",
    type: "magical_artifact", 
    discoveryLocation: "sky_kingdom",
    description: "A throne that makes its occupant completely immune to physical harm and mental manipulation.",
    rarity: "legendary",
    effects: ["Complete invulnerability", "Mental protection", "Authority enhancement"],
    soulCorruptionRisk: 10,
    powerLevel: "legendary",
    moralDilemma: "Ultimate protection could corrupt absolutely. Would you become a tyrant if nothing could stop you?",
    historicalSignificance: "Created to protect SkyWing rulers during the age of assassins."
  },

  // SEA KINGDOM
  {
    id: "coral_palace_pearl",
    name: "Pearl of Deep Wisdom",
    type: "magical_artifact",
    discoveryLocation: "sea_kingdom",
    description: "A massive pearl that contains all the knowledge of the ancient SeaWings.",
    rarity: "legendary",
    effects: ["Grants ancient knowledge", "Improves intelligence dramatically", "Reveals ocean secrets"],
    soulCorruptionRisk: 7,
    powerLevel: "major",
    moralDilemma: "Ancient knowledge includes dangerous secrets. Should you learn things that were buried for good reasons?",
    historicalSignificance: "Contains the wisdom of every SeaWing scholar who ever lived."
  },
  {
    id: "tide_controlling_conch",
    name: "Conch of the Tides",
    type: "magical_artifact",
    discoveryLocation: "sea_kingdom", 
    description: "A magical conch shell that can control ocean tides and underwater currents.",
    rarity: "rare",
    effects: ["Controls tides", "Commands sea creatures", "Creates underwater pathways"],
    soulCorruptionRisk: 5,
    powerLevel: "moderate",
    moralDilemma: "Controlling tides affects coastal communities. Do you risk flooding settlements for strategic advantage?",
    historicalSignificance: "Used by SeaWing generals during the naval battles of the succession wars."
  },

  // ICE KINGDOM
  {
    id: "eternal_winter_scepter",
    name: "Scepter of Eternal Winter",
    type: "magical_artifact",
    discoveryLocation: "ice_kingdom",
    description: "A crystal scepter that can bring permanent winter to any location.",
    rarity: "legendary",
    effects: ["Creates permanent winter", "Flash-freezes enemies", "Controls ice and snow"],
    soulCorruptionRisk: 12,
    powerLevel: "legendary",
    moralDilemma: "Permanent winter could kill entire ecosystems. Do you use this weapon despite the environmental devastation?",
    historicalSignificance: "Forged during the Great Melting to restore the Ice Kingdom's power."
  },
  {
    id: "ranking_circle_crown",
    name: "Crown of Perfect Rank",
    type: "magical_artifact",
    discoveryLocation: "ice_kingdom",
    description: "A crown that automatically adjusts the wearer's ranking circle to be higher than any IceWing they encounter.",
    rarity: "uncommon",
    effects: ["Highest ranking among IceWings", "Social dominance", "Command authority"],
    soulCorruptionRisk: 6,
    powerLevel: "minor",
    moralDilemma: "False ranking undermines IceWing society. Do you cheat your way to power or respect their traditions?",
    historicalSignificance: "Created by an ambitious IceWing who was tired of the ranking system."
  },

  // RAINFOREST KINGDOM
  {
    id: "camouflage_vine",
    name: "Vine of Perfect Concealment",
    type: "magical_artifact",
    discoveryLocation: "rainforest_kingdom",
    description: "A magical vine that grants perfect invisibility to any dragon who wears it.",
    rarity: "rare",
    effects: ["Complete invisibility", "Silent movement", "Undetectable presence"],
    soulCorruptionRisk: 4,
    powerLevel: "moderate", 
    moralDilemma: "Perfect invisibility enables both protection and harmful spying. How will you use this power?",
    historicalSignificance: "Grown by RainWing botanists during the NightWing occupation for resistance activities."
  },
  {
    id: "fruit_of_knowledge",
    name: "All-Knowing Fruit",
    type: "magical_artifact",
    discoveryLocation: "rainforest_kingdom",
    description: "A magical fruit that grants knowledge of any question asked, but each bite costs memories.",
    rarity: "legendary",
    effects: ["Answers any question", "Trades memories for knowledge", "Reveals hidden truths"],
    soulCorruptionRisk: 9,
    powerLevel: "major",
    moralDilemma: "Knowledge at the cost of memories - is wisdom worth losing yourself?",
    historicalSignificance: "Grew from seeds planted by the first NightWing-RainWing hybrid who wanted to bridge both tribes."
  },

  // OLD NIGHT KINGDOM
  {
    id: "prophecy_obsidian",
    name: "Obsidian of Future Sight",
    type: "magical_artifact",
    discoveryLocation: "night_kingdom_old",
    description: "A shard of volcanic glass that shows visions of possible futures, but each vision ages the user.",
    rarity: "legendary",
    effects: ["Shows future possibilities", "Prophetic visions", "Ages user with each use"],
    soulCorruptionRisk: 15,
    powerLevel: "legendary",
    moralDilemma: "Seeing the future comes at the cost of your own life force. Is preventing disaster worth aging decades?",
    historicalSignificance: "Formed from the last volcanic eruption, containing the concentrated prophetic power of the lost kingdom."
  },
  {
    id: "mind_reading_crystal",
    name: "Crystal of Infinite Thoughts", 
    type: "magical_artifact",
    discoveryLocation: "night_kingdom_old",
    description: "A dark crystal that allows reading the minds of every dragon within miles, but risks mental overload.",
    rarity: "rare",
    effects: ["Mass mind reading", "Telepathic communication", "Risks insanity from information overload"],
    soulCorruptionRisk: 11,
    powerLevel: "major",
    moralDilemma: "Reading everyone's thoughts could drive you insane. Do you risk madness for ultimate knowledge?",
    historicalSignificance: "Created by the last mind-reading NightWing before the evacuation."
  },

  // NIGHTWING-RAINWING VILLAGE
  {
    id: "harmony_medallion",
    name: "Medallion of Tribal Harmony",
    type: "magical_artifact",
    discoveryLocation: "rainforest_night_village",
    description: "A medallion that allows the wearer to use abilities from both NightWing and RainWing tribes.",
    rarity: "uncommon",
    effects: ["Dual tribal abilities", "Enhanced camouflage AND mind reading", "Cultural understanding"],
    soulCorruptionRisk: 3,
    powerLevel: "moderate",
    moralDilemma: "Mixing tribal abilities could be seen as diluting both cultures. Do you embrace fusion or preserve traditions?",
    historicalSignificance: "Forged to celebrate the first successful NightWing-RainWing cooperation."
  },

  // PANTALA LOCATIONS - JEWEL HIVE
  {
    id: "mind_control_crown",
    name: "Crown of Absolute Control",
    type: "magical_artifact",
    discoveryLocation: "jewel_hive",
    description: "Queen Wasp's backup crown that can control the minds of any HiveWing or SilkWing instantly.",
    rarity: "legendary", 
    effects: ["Mind control over HiveWings/SilkWings", "Telepathic commands", "Absolute obedience"],
    soulCorruptionRisk: 20,
    powerLevel: "legendary",
    moralDilemma: "Ultimate control over others - do you destroy this evil artifact or use it to free the oppressed?",
    historicalSignificance: "Queen Wasp's secret contingency plan for maintaining absolute power."
  },
  {
    id: "resistance_map",
    name: "Map of Hidden Paths",
    type: "magical_artifact", 
    discoveryLocation: "jewel_hive",
    description: "A map that reveals all secret passages and resistance hideouts in every hive.",
    rarity: "rare",
    effects: ["Reveals secret passages", "Shows resistance locations", "Updates in real time"],
    soulCorruptionRisk: 2,
    powerLevel: "minor",
    moralDilemma: "This map could help free slaves or help tyrants find rebels. Who do you give it to?",
    historicalSignificance: "Created by a HiveWing sympathizer to aid SilkWing resistance efforts."
  },

  // CICADA HIVE
  {
    id: "silk_mastery_spindle",
    name: "Spindle of Perfect Silk",
    type: "magical_artifact",
    discoveryLocation: "cicada_hive",
    description: "A golden spindle that allows any dragon to create flamesilk, but burns away their natural abilities.",
    rarity: "rare",
    effects: ["Grants flamesilk ability", "Removes natural tribal powers", "Creates incredibly strong silk"],
    soulCorruptionRisk: 7,
    powerLevel: "moderate",
    moralDilemma: "Trading your natural abilities for flamesilk - is artificial power worth losing your true self?",
    historicalSignificance: "Hidden by SilkWing rebels who wanted to give everyone flamesilk to fight back."
  },

  // YELLOWJACKET HIVE
  {
    id: "war_generals_blade",
    name: "Blade of Endless Victory",
    type: "magical_artifact",
    discoveryLocation: "yellowjacket_hive", 
    description: "A sword that ensures victory in every battle, but each victory demands a greater sacrifice.",
    rarity: "legendary",
    effects: ["Guarantees victory in combat", "Increases power with each battle", "Demands escalating sacrifices"],
    soulCorruptionRisk: 18,
    powerLevel: "legendary",
    moralDilemma: "Endless victory seems perfect, but what will you sacrifice to maintain it? Your friends? Your values?",
    historicalSignificance: "Forged by a HiveWing general who conquered everything but lost everyone he cared about."
  },

  // POISON JUNGLE
  {
    id: "nature_speakers_staff",
    name: "Staff of Nature's Voice",
    type: "magical_artifact",
    discoveryLocation: "poison_jungle",
    description: "A living wooden staff that gives the user ultimate leafspeak abilities over all plant life.",
    rarity: "legendary",
    effects: ["Control over all plants", "Accelerated growth", "Can create plant armies"],
    soulCorruptionRisk: 8,
    powerLevel: "major",
    moralDilemma: "Ultimate plant control could restore forests or destroy cities. Do you use it for nature or revenge?",
    historicalSignificance: "Grown from the Tree of Life by the first LeafWing to master complete leafspeak."
  },
  {
    id: "poison_immunity_flower",
    name: "Flower of Pure Immunity",
    type: "magical_artifact",
    discoveryLocation: "poison_jungle",
    description: "A crystallized flower that makes the holder immune to all poisons, venoms, and toxins forever.",
    rarity: "rare",
    effects: ["Complete poison immunity", "Purifies contaminated areas", "Neutralizes venom attacks"],
    soulCorruptionRisk: 3,
    powerLevel: "moderate",
    moralDilemma: "Immunity to all poisons could save lives or enable dangerous experimentation. How do you use this gift?",
    historicalSignificance: "Preserved by LeafWing healers during the great poisoning to help survivors."
  },

  // VINEGAROON HIVE  
  {
    id: "winter_survival_cloak",
    name: "Cloak of Eternal Warmth",
    type: "magical_artifact",
    discoveryLocation: "vinegaroon_hive",
    description: "A cloak that provides perfect warmth and can melt ice instantly, but slowly drains life force.",
    rarity: "uncommon",
    effects: ["Perfect temperature control", "Melts ice and snow", "Gradually drains vitality"],
    soulCorruptionRisk: 5,
    powerLevel: "minor",
    moralDilemma: "Perfect warmth at the cost of life force - do you trade longevity for comfort and power?",
    historicalSignificance: "Made by northern HiveWings who couldn't adapt to the harsh winters."
  }
];

export class EnhancedAnimusArtifactSystem {
  private static discoveredArtifacts = new Set<string>();
  private static maxArtifactsPerGame = 5; // Increased from 3

  static getAvailableArtifactsForLocation(locationId: string): AnimusArtifact[] {
    return ANIMUS_ARTIFACTS.filter(artifact => 
      artifact.discoveryLocation === locationId &&
      !this.discoveredArtifacts.has(artifact.id)
    );
  }

  static canDiscoverArtifact(character: Character, locationId: string): boolean {
    if (this.discoveredArtifacts.size >= this.maxArtifactsPerGame) return false;
    
    const availableArtifacts = this.getAvailableArtifactsForLocation(locationId);
    if (availableArtifacts.length === 0) return false;

    // Higher chance for animus dragons
    let baseChance = character.isAnimus ? 0.08 : 0.05; // 8% vs 5% chance
    
    // Bonus chance based on intelligence and charisma
    baseChance += (character.intelligence - 15) * 0.01;
    baseChance += (character.charisma - 15) * 0.005;

    return Math.random() < baseChance;
  }

  static discoverArtifact(character: Character, locationId: string): AnimusArtifact | null {
    const availableArtifacts = this.getAvailableArtifactsForLocation(locationId);
    if (availableArtifacts.length === 0) return null;

    // Filter by discovery requirements
    const eligibleArtifacts = availableArtifacts.filter(artifact => 
      !artifact.discoveryRequirement || artifact.discoveryRequirement(character)
    );

    if (eligibleArtifacts.length === 0) return null;

    // Select artifact based on rarity weights
    const weightedArtifacts = eligibleArtifacts.flatMap(artifact => {
      let weight = 1;
      switch (artifact.rarity) {
        case 'legendary': weight = 1; break;
        case 'rare': weight = 3; break;
        case 'uncommon': weight = 6; break;
        default: weight = 10; break;
      }
      return Array(weight).fill(artifact);
    });

    const selectedArtifact = weightedArtifacts[Math.floor(Math.random() * weightedArtifacts.length)];
    this.discoveredArtifacts.add(selectedArtifact.id);

    return selectedArtifact;
  }

  static getAllLocationsWithArtifacts(): { locationId: string; locationName: string; artifactCount: number }[] {
    const locationCounts = new Map<string, number>();
    
    ANIMUS_ARTIFACTS.forEach(artifact => {
      const count = locationCounts.get(artifact.discoveryLocation) || 0;
      locationCounts.set(artifact.discoveryLocation, count + 1);
    });

    return Array.from(locationCounts.entries()).map(([locationId, count]) => {
      const location = LOCATIONS.find(loc => loc.id === locationId);
      return {
        locationId,
        locationName: location?.name || locationId,
        artifactCount: count
      };
    });
  }

  static getArtifactMoralDilemmaChoices(artifact: AnimusArtifact): {
    acceptChoice: string;
    rejectChoice: string;
    alternativeChoice?: string;
  } {
    const powerLevelDescriptions = {
      minor: "small but useful",
      moderate: "significant", 
      major: "great and dangerous",
      legendary: "ultimate and corrupting"
    };

    return {
      acceptChoice: `Accept the ${artifact.name} despite its ${powerLevelDescriptions[artifact.powerLevel]} power and moral risks.`,
      rejectChoice: `Reject the artifact and leave it untouched, avoiding the moral complexity.`,
      alternativeChoice: `Try to purify or modify the artifact to remove its corrupting influence (requires animus magic).`
    };
  }

  static processArtifactDecision(
    character: Character, 
    artifact: AnimusArtifact, 
    decision: 'accept' | 'reject' | 'purify'
  ): {
    soulCostApplied: number;
    outcome: string;
    consequenceDescription: string;
  } {
    let soulCostApplied = 0;
    let outcome: string;
    let consequenceDescription: string;

    switch (decision) {
      case 'accept':
        soulCostApplied = artifact.soulCorruptionRisk;
        outcome = `You claim the ${artifact.name}, feeling its power course through you.`;
        consequenceDescription = `The artifact's power comes with a price - you feel your soul slightly corrupted by its dark magic.`;
        break;

      case 'reject':
        outcome = `You resist the temptation and leave the ${artifact.name} where you found it.`;
        consequenceDescription = `Your restraint preserves your soul's purity, but you wonder if you'll regret this decision later.`;
        break;

      case 'purify':
        if (!character.isAnimus) {
          soulCostApplied = artifact.soulCorruptionRisk; // Backfires for non-animus
          outcome = `You attempt to purify the artifact without animus magic, but its corruption overwhelms you instead.`;
          consequenceDescription = `Your noble attempt backfires catastrophically, corrupting your soul more than simply accepting would have.`;
        } else {
          soulCostApplied = Math.max(1, Math.floor(artifact.soulCorruptionRisk / 3)); // Reduced cost
          outcome = `You successfully purify the ${artifact.name}, removing much of its dark influence.`;
          consequenceDescription = `Your animus magic cleanses the artifact, though the effort still costs some of your soul's purity.`;
        }
        break;
    }

    return { soulCostApplied, outcome, consequenceDescription };
  }

  static resetDiscoveryTracking(): void {
    this.discoveredArtifacts.clear();
  }

  static getDiscoveryStats(): {
    totalArtifacts: number;
    discoveredCount: number;
    remainingCount: number;
    locationsWithArtifacts: number;
  } {
    return {
      totalArtifacts: ANIMUS_ARTIFACTS.length,
      discoveredCount: this.discoveredArtifacts.size,
      remainingCount: ANIMUS_ARTIFACTS.length - this.discoveredArtifacts.size,
      locationsWithArtifacts: new Set(ANIMUS_ARTIFACTS.map(a => a.discoveryLocation)).size
    };
  }
}