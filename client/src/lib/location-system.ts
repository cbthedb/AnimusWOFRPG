import { Character } from "@shared/schema";

// Location types based on Wings of Fire map
export interface Location {
  id: string;
  name: string;
  continent: "Pyrrhia" | "Pantala";
  region: string;
  primaryTribes: string[];
  climate: string;
  description: string;
  specialFeatures: string[];
  dangerLevel: 1 | 2 | 3 | 4 | 5; // 1 = Safe, 5 = Extremely Dangerous
  travelCost: number; // Days to travel there
}

// All major locations from the Wings of Fire map
export const LOCATIONS: Location[] = [
  // PYRRHIA LOCATIONS
  {
    id: "jade_mountain_academy",
    name: "Jade Mountain Academy",
    continent: "Pyrrhia",
    region: "Central Mountains",
    primaryTribes: ["MudWing", "SandWing", "SkyWing", "SeaWing", "IceWing", "RainWing", "NightWing"],
    climate: "Temperate Mountain",
    description: "A prestigious academy where dragons from all tribes learn together, built into the side of Jade Mountain itself.",
    specialFeatures: ["Multi-tribal education", "Ancient tunnels", "Library", "Training grounds", "Safe haven"],
    dangerLevel: 1,
    travelCost: 0
  },
  {
    id: "mud_kingdom",
    name: "Mud Kingdom",
    continent: "Pyrrhia", 
    region: "Eastern Marshlands",
    primaryTribes: ["MudWing"],
    climate: "Swampy and humid",
    description: "Vast marshlands and wetlands where MudWings make their homes in reed-covered villages and mud palaces.",
    specialFeatures: ["Healing mud baths", "Reed architecture", "Sibling bonds", "Military training"],
    dangerLevel: 2,
    travelCost: 3
  },
  {
    id: "sand_kingdom",
    name: "Sand Kingdom",
    continent: "Pyrrhia",
    region: "Western Desert", 
    primaryTribes: ["SandWing"],
    climate: "Hot desert",
    description: "Endless golden dunes and oasis towns, with the magnificent Scorpion Den as its largest settlement.",
    specialFeatures: ["Oasis settlements", "Treasure hoards", "Desert survival", "Trade routes"],
    dangerLevel: 3,
    travelCost: 4
  },
  {
    id: "sky_kingdom",
    name: "Sky Kingdom",
    continent: "Pyrrhia",
    region: "Northern Mountains",
    primaryTribes: ["SkyWing"],
    climate: "High altitude, thin air",
    description: "Towering peaks and cloud-shrouded palaces where SkyWings rule the highest reaches of Pyrrhia.",
    specialFeatures: ["Aerial combat training", "Mountain fortresses", "Thin air adaptation", "Strategic advantage"],
    dangerLevel: 3,
    travelCost: 2
  },
  {
    id: "sea_kingdom",
    name: "Sea Kingdom",
    continent: "Pyrrhia",
    region: "Bay of a Thousand Scales",
    primaryTribes: ["SeaWing"],
    climate: "Oceanic",
    description: "Underwater palaces and coral cities beneath the waves, accessible only to those who can breathe underwater.",
    specialFeatures: ["Underwater cities", "Coral architecture", "Royal heritage", "Aquatic life"],
    dangerLevel: 4,
    travelCost: 5
  },
  {
    id: "ice_kingdom",
    name: "Ice Kingdom",
    continent: "Pyrrhia",
    region: "Far North",
    primaryTribes: ["IceWing"],
    climate: "Arctic tundra",
    description: "Frozen wasteland of ice and snow, with crystalline palaces that reflect the aurora borealis.",
    specialFeatures: ["Ice architecture", "Ranking circles", "Aurora viewing", "Extreme cold survival"],
    dangerLevel: 5,
    travelCost: 7
  },
  {
    id: "rainforest_kingdom",
    name: "Rainforest Kingdom",
    continent: "Pyrrhia",
    region: "Southern Rainforest",
    primaryTribes: ["RainWing"],
    climate: "Tropical rainforest",
    description: "Lush canopy cities hidden among the trees, where RainWings live in harmony with nature.",
    specialFeatures: ["Canopy villages", "Fruit abundance", "Camouflage training", "Peaceful lifestyle"],
    dangerLevel: 2,
    travelCost: 4
  },
  {
    id: "night_kingdom_old",
    name: "Old Night Kingdom",
    continent: "Pyrrhia",
    region: "Talon Peninsula",
    primaryTribes: ["NightWing"],
    climate: "Volcanic",
    description: "The ancestral home of the NightWings, now largely abandoned after the volcano's eruption.",
    specialFeatures: ["Volcanic landscape", "Ancient ruins", "Dangerous terrain", "Historical significance"],
    dangerLevel: 5,
    travelCost: 6
  },
  {
    id: "rainforest_night_village",
    name: "NightWing Village",
    continent: "Pyrrhia",
    region: "Southern Rainforest",
    primaryTribes: ["NightWing", "RainWing"],
    climate: "Tropical rainforest",
    description: "New settlement where NightWings and RainWings live together after the tribe's relocation.",
    specialFeatures: ["Inter-tribal cooperation", "New architecture", "Cultural fusion", "Peaceful coexistence"],
    dangerLevel: 1,
    travelCost: 4
  },

  // PANTALA LOCATIONS
  {
    id: "jewel_hive",
    name: "Jewel Hive",
    continent: "Pantala",
    region: "Central Pantala",
    primaryTribes: ["HiveWing"],
    climate: "Temperate",
    description: "The grand capital of the HiveWings, a massive crystalline structure that houses Queen Wasp's court.",
    specialFeatures: ["Crystal architecture", "Royal court", "Mind control network", "Advanced technology"],
    dangerLevel: 4,
    travelCost: 10
  },
  {
    id: "cicada_hive",
    name: "Cicada Hive",
    continent: "Pantala",
    region: "Eastern Pantala",
    primaryTribes: ["HiveWing", "SilkWing"],
    climate: "Temperate",
    description: "One of the major HiveWing cities where SilkWings work in the silk production facilities.",
    specialFeatures: ["Silk production", "Forced labor", "Hive architecture", "Underground resistance"],
    dangerLevel: 3,
    travelCost: 9
  },
  {
    id: "yellowjacket_hive", 
    name: "Yellowjacket Hive",
    continent: "Pantala",
    region: "Western Pantala",
    primaryTribes: ["HiveWing"],
    climate: "Arid",
    description: "A militaristic HiveWing settlement focused on training and warfare.",
    specialFeatures: ["Military training", "Weapon development", "Strategic location", "Harsh discipline"],
    dangerLevel: 4,
    travelCost: 11
  },
  {
    id: "poison_jungle",
    name: "Poison Jungle",
    continent: "Pantala",
    region: "Southern Pantala", 
    primaryTribes: ["LeafWing"],
    climate: "Toxic jungle",
    description: "Dense, poisonous jungle where the remaining LeafWings hide from HiveWing persecution.",
    specialFeatures: ["Poisonous plants", "Hidden villages", "Guerrilla warfare", "Natural defenses"],
    dangerLevel: 5,
    travelCost: 8
  },
  {
    id: "vinegaroon_hive",
    name: "Vinegaroon Hive", 
    continent: "Pantala",
    region: "Northern Pantala",
    primaryTribes: ["HiveWing", "SilkWing"],
    climate: "Cool temperate",
    description: "Northern HiveWing settlement known for its harsh winters and disciplined inhabitants.",
    specialFeatures: ["Cold adaptation", "Northern trade routes", "Strict hierarchy", "Winter survival"],
    dangerLevel: 3,
    travelCost: 12
  }
];

export class LocationSystem {
  static getCurrentLocation(gameData: any): Location {
    const currentLocationId = gameData.location || "jade_mountain_academy";
    return LOCATIONS.find(loc => loc.id === currentLocationId) || LOCATIONS[0];
  }

  static getAvailableDestinations(currentLocation: Location): Location[] {
    // All locations are available to travel to, but with different costs/risks
    return LOCATIONS.filter(loc => loc.id !== currentLocation.id);
  }

  static calculateTravelTime(from: Location, to: Location): number {
    // Base travel cost plus continent crossing penalty
    let travelTime = to.travelCost;
    
    if (from.continent !== to.continent) {
      travelTime += 5; // Extra time to cross the ocean between continents
    }
    
    return travelTime;
  }

  static canTravelToLocation(character: Character, destination: Location): {
    canTravel: boolean;
    reason?: string;
  } {
    // Check if character is strong enough for dangerous locations
    if (destination.dangerLevel >= 4 && character.strength < 60) {
      return {
        canTravel: false,
        reason: "You need more strength to survive such a dangerous location."
      };
    }

    // Check if character is sane enough for challenging journeys
    if (destination.travelCost >= 8 && character.sanityPercentage < 30) {
      return {
        canTravel: false,
        reason: "Your mind is too fractured for such a long, difficult journey."
      };
    }

    // Special location requirements
    if (destination.id === "sea_kingdom" && !character.tribalPowers.includes("Underwater Breathing")) {
      return {
        canTravel: false,
        reason: "You cannot breathe underwater. Only SeaWings or specially enchanted dragons can survive there."
      };
    }

    return { canTravel: true };
  }

  static getLocationSpecificScenarios(location: Location): string[] {
    // Return scenario types that are more likely in specific locations
    const locationScenarios: Record<string, string[]> = {
      "jade_mountain_academy": ["ACADEMY", "LEARNING", "ROMANCE"],
      "mud_kingdom": ["FAMILY", "HEALING", "MUDWING_CULTURE"],
      "sand_kingdom": ["TREASURE", "SURVIVAL", "SANDWING_POLITICS"],
      "sky_kingdom": ["AERIAL_COMBAT", "MOUNTAIN_SURVIVAL", "SKYWING_HONOR"],
      "sea_kingdom": ["UNDERWATER_ADVENTURE", "SEAWING_ROYALTY", "OCEAN_MYSTERIES"],
      "ice_kingdom": ["ARCTIC_SURVIVAL", "ICEWING_HIERARCHY", "FROZEN_SECRETS"],
      "rainforest_kingdom": ["NATURE_HARMONY", "RAINWING_PEACE", "JUNGLE_MYSTERIES"],
      "night_kingdom_old": ["ANCIENT_SECRETS", "VOLCANIC_DANGER", "NIGHTWING_HISTORY"],
      "jewel_hive": ["HIVEWING_POLITICS", "MIND_CONTROL", "PANTALAN_INTRIGUE"],
      "poison_jungle": ["LEAFWING_RESISTANCE", "TOXIC_SURVIVAL", "GUERRILLA_WARFARE"]
    };

    return locationScenarios[location.id] || ["NORMAL", "SURVIVAL"];
  }

  static getTribalRelationships(location: Location, character: Character): {
    welcomeLevel: number; // -100 to 100
    description: string;
  } {
    const characterTribe = character.tribe;
    const primaryTribes = location.primaryTribes;

    if (primaryTribes.includes(characterTribe)) {
      return {
        welcomeLevel: 75,
        description: "You are welcomed as one of their own tribe."
      };
    }

    // Inter-tribal relationships based on WoF lore
    const tribalRelations: Record<string, Record<string, number>> = {
      "MudWing": { "SkyWing": -30, "IceWing": -20, "SeaWing": 20, "SandWing": 10, "RainWing": 30, "NightWing": -10 },
      "SandWing": { "MudWing": 10, "SkyWing": -40, "IceWing": -30, "SeaWing": 0, "RainWing": 20, "NightWing": -20 },
      "SkyWing": { "MudWing": -30, "SandWing": -40, "IceWing": -50, "SeaWing": 10, "RainWing": 0, "NightWing": -60 },
      "SeaWing": { "MudWing": 20, "SandWing": 0, "SkyWing": 10, "IceWing": 30, "RainWing": 40, "NightWing": -10 },
      "IceWing": { "MudWing": -20, "SandWing": -30, "SkyWing": -50, "SeaWing": 30, "RainWing": -60, "NightWing": -80 },
      "RainWing": { "MudWing": 30, "SandWing": 20, "SkyWing": 0, "SeaWing": 40, "IceWing": -60, "NightWing": 60 },
      "NightWing": { "MudWing": -10, "SandWing": -20, "SkyWing": -60, "SeaWing": -10, "IceWing": -80, "RainWing": 60 }
    };

    let avgWelcome = 0;
    let relationshipCount = 0;

    for (const tribe of primaryTribes) {
      if (tribalRelations[characterTribe] && tribalRelations[characterTribe][tribe] !== undefined) {
        avgWelcome += tribalRelations[characterTribe][tribe];
        relationshipCount++;
      }
    }

    if (relationshipCount > 0) {
      avgWelcome = Math.round(avgWelcome / relationshipCount);
    }

    let description = "";
    if (avgWelcome >= 50) {
      description = "You are warmly welcomed as a friend and ally.";
    } else if (avgWelcome >= 20) {
      description = "You are received with cautious friendliness.";
    } else if (avgWelcome >= -20) {
      description = "You are tolerated but watched carefully.";
    } else if (avgWelcome >= -50) {
      description = "You are met with suspicion and hostility.";
    } else {
      description = "You are seen as an enemy and face open hostility.";
    }

    return {
      welcomeLevel: avgWelcome,
      description
    };
  }
}