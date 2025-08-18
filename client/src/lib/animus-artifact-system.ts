import { InventoryItem, Character, GameData } from "@shared/schema";
import { LocationSystem, Location } from "./location-system";

export interface AnimusArtifact extends InventoryItem {
  discoveryLocation: string;
  rarity: "common" | "uncommon" | "rare" | "legendary" | "mythical";
  discoveryScenario: string;
  usageOptions: ArtifactOption[];
  isDiscovered: boolean;
  cursed: boolean;
  powerLevel: "minor" | "moderate" | "major" | "catastrophic";
}

export interface ArtifactOption {
  id: string;
  text: string;
  outcome: string;
  soulCost: number;
  sanityCost: number;
  consequences: string[];
  corruption: boolean;
}

export const ANIMUS_ARTIFACTS: AnimusArtifact[] = [
  {
    id: "necklace_whispers",
    name: "Necklace of Whispers",
    description: "A golden necklace humming with faint voices buried in ancient SeaWing ruins. The metal feels warm against your scales, and shadows seem to bend toward it.",
    type: "magical_artifact",
    enchantments: ["Voice Detection", "Lie Detection", "Paranoia Curse"],
    rarity: "uncommon",
    discoveryLocation: "Sea Kingdom",
    discoveryScenario: "You find a golden necklace humming with faint voices buried in ancient SeaWing ruins. The metal feels warm against your scales, and shadows seem to bend toward it.",
    isActive: false,
    canGiveAway: true,
    isDiscovered: false,
    cursed: true,
    powerLevel: "moderate",
    usageOptions: [
      {
        id: "wear_necklace",
        text: "Wear it and embrace the voices",
        outcome: "You begin hearing every cruel thought dragons have about you, driving you toward paranoid isolation but granting you the ability to detect lies and hidden intentions.",
        soulCost: 3,
        sanityCost: 8,
        consequences: ["Gained lie detection ability", "Became paranoid and isolated", "Can sense hidden intentions"],
        corruption: true
      },
      {
        id: "sell_necklace", 
        text: "Sell it to a merchant",
        outcome: "You gain quick wealth but the necklace curses its next owner with madness, and they eventually return seeking revenge against you.",
        soulCost: 1,
        sanityCost: 2,
        consequences: ["Gained wealth", "Created a vengeful enemy", "Spread cursed artifact"],
        corruption: false
      },
      {
        id: "hide_necklace",
        text: "Hide it in your hoard",
        outcome: "The voices follow you at night, slowly eroding your sanity as they whisper secrets of the dead, but you learn valuable information about hidden treasures.",
        soulCost: 0,
        sanityCost: 5,
        consequences: ["Learn treasure locations", "Suffer recurring nightmares", "Voices whisper constantly"],
        corruption: false
      }
    ]
  },
  {
    id: "albatross_quill",
    name: "Albatross' Lost Quill",
    description: "A silver quill said to have belonged to Albatross himself, found clutched in a skeleton's talons deep underwater. It pulses with residual animus magic.",
    type: "magical_artifact",
    enchantments: ["Prophetic Writing", "Soul Binding", "Ancient Magic"],
    rarity: "legendary",
    discoveryLocation: "Sea Kingdom",
    discoveryScenario: "You stumble upon a silver quill said to have belonged to Albatross himself, found clutched in a skeleton's talons deep underwater. It pulses with residual animus magic.",
    isActive: false,
    canGiveAway: true,
    isDiscovered: false,
    cursed: true,
    powerLevel: "catastrophic",
    usageOptions: [
      {
        id: "write_name_quill",
        text: "Write your name with it",
        outcome: "You bind yourself to endless writing, your claws moving against your will until you collapse from exhaustion, but the words you write become prophecies.",
        soulCost: 5,
        sanityCost: 10,
        consequences: ["Gained prophetic writing ability", "Lost control of your claws", "Collapse from exhaustion"],
        corruption: true
      },
      {
        id: "write_enemy_quill",
        text: "Write an enemy's name",
        outcome: "Their fate twists violently as misfortune after misfortune befalls them, but the quill demands more names and you become addicted to its power.",
        soulCost: 8,
        sanityCost: 5,
        consequences: ["Enemy suffers misfortunes", "Became addicted to the quill's power", "Quill demands more victims"],
        corruption: true
      },
      {
        id: "snap_quill",
        text: "Snap the quill in half",
        outcome: "You feel a surge of animus magic lash back at you, scarring your soul permanently but freeing you from the temptation of its dark power.",
        soulCost: 15,
        sanityCost: 3,
        consequences: ["Soul permanently scarred", "Freed from dark temptation", "Destroyed dangerous artifact"],
        corruption: false
      }
    ]
  },
  {
    id: "mirror_endless_selves",
    name: "Mirror of Endless Selves", 
    description: "A polished obsidian mirror that shows not your reflection, but what you could become if corrupted by unlimited animus power. Your reflection smiles while you frown.",
    type: "magical_artifact",
    enchantments: ["Power Corruption", "Future Sight", "Soul Manipulation"],
    rarity: "rare",
    discoveryLocation: "Ice Kingdom",
    discoveryScenario: "A polished obsidian mirror that shows not your reflection, but what you could become if corrupted by unlimited animus power. Your reflection smiles while you frown.",
    isActive: false,
    canGiveAway: true,
    isDiscovered: false,
    cursed: true,
    powerLevel: "major",
    usageOptions: [
      {
        id: "touch_mirror",
        text: "Touch the mirror's surface",
        outcome: "You gain temporary animus powers for one day, but they burn away a cherished memory forever, leaving you more callous.",
        soulCost: 4,
        sanityCost: 6,
        consequences: ["Gained temporary animus powers", "Lost a cherished memory", "Became more callous"],
        corruption: true
      },
      {
        id: "stare_mirror",
        text: "Stare into it for hours",
        outcome: "Your ambition grows insatiable, and you begin plotting to seize power at any cost, but gain insight into your enemies' weaknesses.",
        soulCost: 2,
        sanityCost: 8,
        consequences: ["Ambition became insatiable", "Plot to seize power", "Gained insight into enemies"],
        corruption: true
      },
      {
        id: "smash_mirror",
        text: "Smash it with your tail",
        outcome: "The shards embed themselves in your scales, still whispering temptations of power, but you resist corruption at the cost of constant pain.",
        soulCost: 0,
        sanityCost: 10,
        consequences: ["Shards embedded in scales", "Constant pain", "Resisted corruption"],
        corruption: false
      }
    ]
  },

  {
    id: "mirror_endless_selves",
    name: "Mirror of Endless Selves",
    description: "A polished obsidian mirror that shows not your reflection, but what you could become if corrupted by unlimited animus power. Your reflection smiles while you frown.",
    type: "magical_artifact",
    enchantments: ["Corruption Vision", "Power Temptation", "Memory Drain"],
    rarity: "rare",
    discoveryLocation: "Ice Kingdom",
    discoveryScenario: "A polished obsidian mirror that shows not your reflection, but what you could become if corrupted by unlimited animus power. Your reflection smiles while you frown.",
    isActive: false,
    canGiveAway: true,
    isDiscovered: false,
    cursed: true,
    powerLevel: "major",
    usageOptions: [
      {
        id: "touch_mirror",
        text: "Touch the mirror's surface",
        outcome: "You gain temporary animus powers for one day, but they burn away a cherished memory forever, leaving you more callous.",
        soulCost: 5,
        sanityCost: 3,
        consequences: ["Gained temporary animus powers", "Lost a cherished memory", "Became more callous"],
        corruption: true
      },
      {
        id: "stare_mirror",
        text: "Stare into it for hours",
        outcome: "Your ambition grows insatiable, and you begin plotting to seize power at any cost, but gain insight into your enemies' weaknesses.",
        soulCost: 2,
        sanityCost: 6,
        consequences: ["Ambition became insatiable", "Gained knowledge of enemy weaknesses", "Began plotting for power"],
        corruption: true
      },
      {
        id: "smash_mirror",
        text: "Smash it with your tail",
        outcome: "The shards embed themselves in your scales, still whispering temptations of power, but you resist corruption at the cost of constant pain.",
        soulCost: 0,
        sanityCost: 8,
        consequences: ["Shards embedded in scales", "Constant whispers of temptation", "Resisted major corruption"],
        corruption: false
      }
    ]
  },
  {
    id: "singing_stone_tides",
    name: "Singing Stone of Tides",
    description: "A carved aquamarine gemstone that hums ancient SeaWing war songs. When held underwater, it glows like captured sunlight.",
    type: "magical_artifact", 
    enchantments: ["Voice Enhancement", "Leadership Aura", "Suspicion Curse"],
    rarity: "uncommon",
    discoveryLocation: "Sea Kingdom",
    discoveryScenario: "A carved aquamarine gemstone that hums ancient SeaWing war songs. When held underwater, it glows like captured sunlight.",
    isActive: false,
    canGiveAway: true,
    isDiscovered: false,
    cursed: false,
    powerLevel: "minor",
    usageOptions: [
      {
        id: "keep_close",
        text: "Keep it close to your heart",
        outcome: "The songs empower your voice and presence, making others naturally want to follow you, but other dragons grow suspicious of your influence.",
        soulCost: 1,
        sanityCost: 0,
        consequences: ["Enhanced charisma and leadership", "Others follow you naturally", "Some dragons become suspicious"],
        corruption: false
      },
      {
        id: "sell_stone",
        text: "Sell it to the highest bidder",
        outcome: "Rival dragons fight bloody wars to claim it from each other, and you're blamed for starting the conflict.",
        soulCost: 2,
        sanityCost: 3,
        consequences: ["Started wars over the stone", "Blamed for the conflict", "Multiple dragons became enemies"],
        corruption: false
      },
      {
        id: "return_ocean",
        text: "Drop it back into the ocean",
        outcome: "It grows louder in your mind, the songs echoing in your skull even on dry land, but sea creatures begin to aid you.",
        soulCost: 0,
        sanityCost: 2,
        consequences: ["Songs echo in your mind constantly", "Sea creatures become allies", "Mental connection to ocean"],
        corruption: false
      }
    ]
  },
  {
    id: "crown_conquered_bones",
    name: "Crown of Conquered Bones",
    description: "A circlet carved from the bones of dragons Albatross once killed, each bone inscribed with their dying words. It radiates cold power.",
    type: "magical_artifact",
    enchantments: ["Command Aura", "Life Drain", "Death Whispers"],
    rarity: "legendary",
    discoveryLocation: "Old Night Kingdom",
    discoveryScenario: "A circlet carved from the bones of dragons Albatross once killed, each bone inscribed with their dying words. It radiates cold power.",
    isActive: false,
    canGiveAway: true,
    isDiscovered: false,
    cursed: true,
    powerLevel: "catastrophic",
    usageOptions: [
      {
        id: "wear_meetings",
        text: "Wear it during important meetings",
        outcome: "Others feel compelled to obey your words, but your own body grows weaker with each command as the crown drains your life force.",
        soulCost: 6,
        sanityCost: 2,
        consequences: ["Others compelled to obey", "Life force gradually drains", "Commands become more powerful"],
        corruption: true
      },
      {
        id: "hide_hoard",
        text: "Hide it in your treasure hoard",
        outcome: "You hear constant whispers of conquest and domination in your sleep, gradually making you more ruthless and ambitious.",
        soulCost: 3,
        sanityCost: 5,
        consequences: ["Whispers of conquest in sleep", "Became more ruthless", "Increased ambition"],
        corruption: true
      },
      {
        id: "sell_collector",
        text: "Sell it to a collector",
        outcome: "The buyer returns within days, their eyes hollow and their voice not quite their own, and they're now utterly loyal to you whether you want it or not.",
        soulCost: 4,
        sanityCost: 3,
        consequences: ["Created a hollow-eyed servant", "Buyer became unnaturally loyal", "Spread dangerous artifact"],
        corruption: true
      }
    ]
  },
  {
    id: "compass_lost_souls",
    name: "Compass of Lost Souls", 
    description: "A golden compass whose needle points not north, but toward the dragon you've wronged most deeply. It belonged to a guilt-ridden animus seeking redemption.",
    type: "magical_artifact",
    enchantments: ["Guilt Detection", "Soul Navigation", "Redemption Path"],
    rarity: "rare",
    discoveryLocation: "Old Night Kingdom",
    discoveryScenario: "A golden compass whose needle points not north, but toward the dragon you've wronged most deeply. It belonged to a guilt-ridden animus seeking redemption.",
    isActive: false,
    canGiveAway: true,
    isDiscovered: false,
    cursed: false,
    powerLevel: "moderate",
    usageOptions: [
      {
        id: "follow_compass",
        text: "Follow where it points",
        outcome: "You're led into increasingly dangerous territory as it guides you toward your victim, but each step heals a small part of your guilt.",
        soulCost: -2,
        sanityCost: 4,
        consequences: ["Led into dangerous territory", "Healed guilt gradually", "Found path to redemption"],
        corruption: false
      },
      {
        id: "ignore_pull",
        text: "Ignore its pull",
        outcome: "The needle spins frantically, and you feel a growing weight of unresolved guilt crushing your chest, affecting your ability to sleep or eat.",
        soulCost: 0,
        sanityCost: 6,
        consequences: ["Unresolved guilt weighs heavily", "Difficulty sleeping and eating", "Needle spins frantically"],
        corruption: false
      },
      {
        id: "destroy_compass",
        text: "Destroy it completely",
        outcome: "All your past victims appear to you in dreams, demanding justice you can never give, but you're free from the compass's compulsion.",
        soulCost: 5,
        sanityCost: 8,
        consequences: ["Past victims haunt dreams", "Free from compulsion", "Justice can never be given"],
        corruption: false
      }
    ]
  },
  {
    id: "scales_truth_lies",
    name: "Scales of Truth and Lies",
    description: "A set of golden weighing scales that glow when touched. Whatever truth you place on one side must be balanced with a lie on the other to function.",
    type: "magical_artifact",
    enchantments: ["Truth Detection", "Lie Creation", "Balance Magic"],
    rarity: "rare",
    discoveryLocation: "Jade Mountain Academy",
    discoveryScenario: "A set of golden weighing scales that glow when touched. Whatever truth you place on one side must be balanced with a lie on the other to function.",
    isActive: false,
    canGiveAway: true,
    isDiscovered: false,
    cursed: true,
    powerLevel: "major",
    usageOptions: [
      {
        id: "expose_enemies",
        text: "Use them to expose enemies",
        outcome: "Every truth you reveal forces you to spread an equally damaging lie about yourself, slowly destroying your reputation.",
        soulCost: 3,
        sanityCost: 4,
        consequences: ["Revealed enemy truths", "Forced to spread lies about yourself", "Reputation slowly destroyed"],
        corruption: true
      },
      {
        id: "keep_hidden",
        text: "Keep them hidden as insurance",
        outcome: "The temptation to use them grows stronger each day, eating at your conscience as you watch injustices you could expose.",
        soulCost: 1,
        sanityCost: 3,
        consequences: ["Temptation grows daily", "Conscience eaten by inaction", "Witnessed injustices"],
        corruption: false
      },
      {
        id: "sell_judge",
        text: "Sell them to a judge",
        outcome: "Justice in the kingdom becomes twisted as truth and falsehood become equally weighted in all legal proceedings.",
        soulCost: 8,
        sanityCost: 2,
        consequences: ["Justice system became twisted", "Truth and lies equally weighted", "Legal proceedings corrupted"],
        corruption: true
      }
    ]
  },
  {
    id: "crown_conquered_bones",
    name: "Crown of Conquered Bones",
    description: "A circlet carved from the bones of dragons Albatross once killed, each bone inscribed with their dying words. It radiates cold power.",
    type: "magical_artifact",
    enchantments: ["Command Aura", "Life Drain", "Whispers of Conquest"],
    rarity: "legendary",
    discoveryLocation: "Scorpion Den",
    discoveryScenario: "A circlet carved from the bones of dragons Albatross once killed, each bone inscribed with their dying words. It radiates cold power.",
    isActive: false,
    canGiveAway: true,
    isDiscovered: false,
    cursed: true,
    powerLevel: "major",
    usageOptions: [
      {
        id: "wear_meetings",
        text: "Wear it during important meetings",
        outcome: "Others feel compelled to obey your words, but your own body grows weaker with each command as the crown drains your life force.",
        soulCost: 4,
        sanityCost: 2,
        consequences: ["Others compelled to obey", "Life force drained with each command", "Body grows weaker"],
        corruption: true
      },
      {
        id: "hide_hoard",
        text: "Hide it in your treasure hoard",
        outcome: "You hear constant whispers of conquest and domination in your sleep, gradually making you more ruthless and ambitious.",
        soulCost: 1,
        sanityCost: 6,
        consequences: ["Whispers of conquest in dreams", "Became more ruthless", "Ambition increased"],
        corruption: true
      },
      {
        id: "sell_collector",
        text: "Sell it to a collector",
        outcome: "The buyer returns within days, their eyes hollow and their voice not quite their own, and they're now utterly loyal to you whether you want it or not.",
        soulCost: 3,
        sanityCost: 4,
        consequences: ["Buyer became mind-controlled servant", "Gained unwilling loyal follower", "Spread cursed artifact"],
        corruption: true
      }
    ]
  },

  // Adding more artifacts for broader distribution across all locations
  {
    id: "crystal_shard_memories",
    name: "Crystal Shard of Memories",
    description: "A jagged crystal that glows with trapped memories of ancient IceWing royalty. Touching it reveals glimpses of forgotten palace secrets.",
    type: "magical_artifact",
    enchantments: ["Memory Viewing", "Royal Secrets", "Frost Curse"],
    rarity: "rare",
    discoveryLocation: "Ice Kingdom",
    discoveryScenario: "Deep in the IceWing palace, you discover a jagged crystal glowing with trapped memories. Each facet shows glimpses of ancient royal secrets.",
    isActive: false,
    canGiveAway: true,
    isDiscovered: false,
    cursed: true,
    powerLevel: "moderate",
    usageOptions: [
      {
        id: "view_memories",
        text: "Peer into the royal memories",
        outcome: "You see secret IceWing plots and betrayals, gaining political knowledge but becoming cold and calculating like the ancient royals.",
        soulCost: 3,
        sanityCost: 2,
        consequences: ["Gained knowledge of IceWing political secrets", "Became cold and calculating", "Learned ancient palace layouts"],
        corruption: true
      },
      {
        id: "shatter_crystal",
        text: "Shatter the crystal",
        outcome: "The memories explode outward, freezing your emotions temporarily but freeing you from the royal curse.",
        soulCost: 1,
        sanityCost: 4,
        consequences: ["Emotions temporarily frozen", "Freed from royal influence", "Crystal destroyed"],
        corruption: false
      }
    ]
  },

  {
    id: "wind_rider_crown",
    name: "Crown of the Wind Riders",
    description: "A circlet of polished steel and eagle feathers that once belonged to legendary SkyWing aerial commanders. It hums with the power of the high winds.",
    type: "magical_artifact",
    enchantments: ["Flight Enhancement", "Wind Control", "Battle Fury"],
    rarity: "uncommon",
    discoveryLocation: "Sky Kingdom",
    discoveryScenario: "Hidden in an abandoned SkyWing watchtower, you find a crown of steel and eagle feathers that belonged to legendary aerial commanders.",
    isActive: false,
    canGiveAway: true,
    isDiscovered: false,
    cursed: false,
    powerLevel: "minor",
    usageOptions: [
      {
        id: "wear_crown",
        text: "Wear the crown into battle",
        outcome: "Your flight speed doubles and you can command wind currents, but you become aggressive and seek out conflicts.",
        soulCost: 2,
        sanityCost: 1,
        consequences: ["Flight speed doubled", "Can control wind currents", "Became more aggressive"],
        corruption: false
      },
      {
        id: "gift_crown",
        text: "Gift it to a SkyWing warrior",
        outcome: "They become your loyal ally, grateful for the honor, but other SkyWings grow jealous of their new abilities.",
        soulCost: 0,
        sanityCost: 2,
        consequences: ["Gained loyal SkyWing ally", "Created jealous enemies", "Spread powerful artifact"],
        corruption: false
      }
    ]
  },

  {
    id: "mud_brothers_shield",
    name: "Shield of the Mud Brothers",
    description: "A large shield made from hardened mud and reeds, enchanted to protect entire sibling groups. It bears the names of fallen MudWing heroes.",
    type: "magical_artifact",
    enchantments: ["Sibling Protection", "Mud Armor", "Heroic Sacrifice"],
    rarity: "uncommon",
    discoveryLocation: "Mud Kingdom",
    discoveryScenario: "In an old MudWing military camp, you discover a shield made of hardened mud bearing the names of fallen heroes who died protecting their siblings.",
    isActive: false,
    canGiveAway: true,
    isDiscovered: false,
    cursed: false,
    powerLevel: "moderate",
    usageOptions: [
      {
        id: "use_protection",
        text: "Use it to protect loved ones",
        outcome: "All dragons you care about become harder to harm, but you feel compelled to throw yourself into danger to save others.",
        soulCost: 1,
        sanityCost: 0,
        consequences: ["Loved ones protected from harm", "Compelled to heroic sacrifice", "Became more selfless"],
        corruption: false
      },
      {
        id: "study_names",
        text: "Study the heroes' names inscribed on it",
        outcome: "You learn combat techniques from MudWing legends but become obsessed with achieving similar glory through battle.",
        soulCost: 0,
        sanityCost: 3,
        consequences: ["Learned legendary combat techniques", "Became obsessed with battle glory", "Gained tactical knowledge"],
        corruption: false
      }
    ]
  },

  {
    id: "desert_mirage_chalice",
    name: "Chalice of Desert Mirages",
    description: "A golden cup that creates realistic illusions when filled with sand. It was crafted by ancient SandWing sorcerers to confuse enemies in the endless dunes.",
    type: "magical_artifact",
    enchantments: ["Illusion Creation", "Desert Navigation", "Thirst Curse"],
    rarity: "rare",
    discoveryLocation: "Sand Kingdom",
    discoveryScenario: "Buried in shifting dunes, you uncover a golden chalice that shimmers with heat mirages. Ancient SandWing runes warn of its deceptive power.",
    isActive: false,
    canGiveAway: true,
    isDiscovered: false,
    cursed: true,
    powerLevel: "moderate",
    usageOptions: [
      {
        id: "create_illusions",
        text: "Use it to create desert mirages",
        outcome: "You can create convincing illusions to confuse enemies, but you start to lose track of what's real and what's illusion.",
        soulCost: 2,
        sanityCost: 5,
        consequences: ["Can create convincing illusions", "Difficulty distinguishing reality", "Enemies become confused"],
        corruption: true
      },
      {
        id: "navigate_desert",
        text: "Use it to navigate the desert",
        outcome: "The chalice reveals hidden oases and safe paths through the dunes, but you become dependent on it for direction.",
        soulCost: 0,
        sanityCost: 2,
        consequences: ["Can find hidden oases", "Always know desert paths", "Became dependent on artifact"],
        corruption: false
      }
    ]
  },

  {
    id: "outlaw_coin_pouch",
    name: "Outlaw's Endless Coin Pouch",
    description: "A leather pouch that always contains exactly enough coins for what you need, but the money comes from stealing from other dragons without them knowing.",
    type: "magical_artifact",
    enchantments: ["Infinite Wealth", "Silent Theft", "Guilt Manifestation"],
    rarity: "legendary",
    discoveryLocation: "Scorpion Den",
    discoveryScenario: "Hidden in the wall of an old gambling den, you find a leather pouch that always seems to have the perfect amount of coins for any purchase.",
    isActive: false,
    canGiveAway: true,
    isDiscovered: false,
    cursed: true,
    powerLevel: "major",
    usageOptions: [
      {
        id: "use_coins",
        text: "Use the coins to buy what you need",
        outcome: "You always have enough money for anything, but you gradually realize it's being stolen from innocent dragons, haunting your conscience.",
        soulCost: 4,
        sanityCost: 6,
        consequences: ["Always have enough money", "Money stolen from innocents", "Haunted by victims' suffering"],
        corruption: true
      },
      {
        id: "return_money",
        text: "Try to return the stolen money",
        outcome: "The pouch fights back, creating confusion and chaos as you attempt to give away its cursed coins, but your conscience feels lighter.",
        soulCost: 1,
        sanityCost: 3,
        consequences: ["Created confusion and chaos", "Conscience feels lighter", "Partially broke the curse"],
        corruption: false
      }
    ]
  },

  {
    id: "rainbow_bridge_feather",
    name: "Feather of the Rainbow Bridge",
    description: "A color-shifting feather that changes hue with your emotions. It belonged to a legendary RainWing who could bridge any divide between dragons.",
    type: "magical_artifact",
    enchantments: ["Emotion Reading", "Peace Aura", "Color Camouflage"],
    rarity: "uncommon",
    discoveryLocation: "Rainforest Kingdom",
    discoveryScenario: "High in the canopy, you discover a feather that shifts through every color imaginable, left by a RainWing peacemaker who ended countless conflicts.",
    isActive: false,
    canGiveAway: true,
    isDiscovered: false,
    cursed: false,
    powerLevel: "minor",
    usageOptions: [
      {
        id: "mediate_conflicts",
        text: "Use it to resolve conflicts between others",
        outcome: "You become incredibly good at stopping fights and making peace, but you absorb all the negative emotions you resolve.",
        soulCost: 0,
        sanityCost: 4,
        consequences: ["Excellent at conflict resolution", "Absorbed others' negative emotions", "Became a natural mediator"],
        corruption: false
      },
      {
        id: "perfect_camouflage",
        text: "Use it for perfect camouflage",
        outcome: "You can become completely invisible by matching any environment, but you start to feel invisible in social situations too.",
        soulCost: 1,
        sanityCost: 3,
        consequences: ["Perfect camouflage ability", "Feel socially invisible", "Difficulty maintaining relationships"],
        corruption: false
      }
    ]
  },

  {
    id: "nightwing_prophecy_scroll",
    name: "Scroll of False Prophecies",
    description: "An ancient scroll that writes prophecies about the reader's future, but half of them are lies designed to manipulate the reader into dark paths.",
    type: "magical_artifact",
    enchantments: ["Future Sight", "False Visions", "Destiny Manipulation"],
    rarity: "legendary",
    discoveryLocation: "NightWing Village",
    discoveryScenario: "Hidden in the new NightWing settlement, you find a scroll covered in prophecies written in silver ink that seems to respond to your presence.",
    isActive: false,
    canGiveAway: true,
    isDiscovered: false,
    cursed: true,
    powerLevel: "major",
    usageOptions: [
      {
        id: "read_prophecies",
        text: "Read your own prophecies",
        outcome: "You see potential futures, some glorious and some terrible, but can't tell which are real, driving you to make increasingly desperate choices.",
        soulCost: 3,
        sanityCost: 7,
        consequences: ["Can see potential futures", "Can't distinguish truth from lies", "Making desperate choices"],
        corruption: true
      },
      {
        id: "burn_scroll",
        text: "Burn the lying scroll",
        outcome: "As it burns, you feel a weight lift from your destiny, but you also lose any glimpse into what your future might hold.",
        soulCost: 2,
        sanityCost: 1,
        consequences: ["Freed from manipulative prophecies", "Lost all future sight", "Destiny became truly your own"],
        corruption: false
      }
    ]
  },

  {
    id: "student_wisdom_tome",
    name: "Tome of Infinite Wisdom",
    description: "A book that contains the answer to any question, but each question asked ages the reader by one year and makes them more isolated from others.",
    type: "magical_artifact",
    enchantments: ["All Knowledge", "Age Acceleration", "Social Isolation"],
    rarity: "legendary",
    discoveryLocation: "Jade Mountain Academy",
    discoveryScenario: "In the deepest part of the academy library, you discover a book that seems to know every secret in the world, but reading it feels strangely lonely.",
    isActive: false,
    canGiveAway: false,
    isDiscovered: false,
    cursed: true,
    powerLevel: "catastrophic",
    usageOptions: [
      {
        id: "seek_knowledge",
        text: "Ask it important questions",
        outcome: "You gain incredible wisdom and knowledge about anything you desire, but each question ages you and makes others find you harder to relate to.",
        soulCost: 2,
        sanityCost: 4,
        consequences: ["Gained incredible wisdom", "Aged rapidly", "Became socially isolated"],
        corruption: true
      },
      {
        id: "close_book",
        text: "Close the book forever",
        outcome: "You give up infinite knowledge to preserve your connections with others and your natural lifespan, choosing ignorance over isolation.",
        soulCost: 0,
        sanityCost: 2,
        consequences: ["Preserved social connections", "Gave up infinite knowledge", "Chose relationships over wisdom"],
        corruption: false
      }
    ]
  },

  {
    id: "hivewing_control_mask",
    name: "Mask of the Mind Controller",
    description: "A chitin mask decorated with HiveWing patterns that allows the wearer to control other dragons' minds, but slowly replaces their personality with Queen Wasp's.",
    type: "magical_artifact",
    enchantments: ["Mind Control", "Personality Replacement", "Hive Connection"],
    rarity: "legendary",
    discoveryLocation: "Jewel Hive",
    discoveryScenario: "In Queen Wasp's abandoned chambers, you find a mask of polished chitin that pulses with the power to control minds, bearing her personal insignia.",
    isActive: false,
    canGiveAway: true,
    isDiscovered: false,
    cursed: true,
    powerLevel: "catastrophic",
    usageOptions: [
      {
        id: "control_minds",
        text: "Use it to control others",
        outcome: "You can force any dragon to obey your commands, but your own thoughts become increasingly similar to Queen Wasp's tyrannical mindset.",
        soulCost: 8,
        sanityCost: 5,
        consequences: ["Can control other dragons' minds", "Personality becoming like Queen Wasp", "Thoughts turning tyrannical"],
        corruption: true
      },
      {
        id: "destroy_mask",
        text: "Destroy the tyrannical mask",
        outcome: "You shatter the mask but its fragments embed in your scales, giving you resistance to mind control while causing constant pain.",
        soulCost: 3,
        sanityCost: 6,
        consequences: ["Immune to mind control", "Fragments embedded in scales", "Constant physical pain"],
        corruption: false
      }
    ]
  },

  {
    id: "silk_rebellion_banner",
    name: "Banner of the Silk Rebellion",
    description: "A silk banner woven with the hopes and dreams of enslaved SilkWings. It inspires revolution but marks the bearer as an enemy of the HiveWings.",
    type: "magical_artifact",
    enchantments: ["Revolution Inspiration", "Hope Restoration", "Enemy Marking"],
    rarity: "rare",
    discoveryLocation: "Cicada Hive",
    discoveryScenario: "Hidden in a silk production facility, you discover a banner woven with silvery thread that seems to shimmer with the dreams of freedom.",
    isActive: false,
    canGiveAway: true,
    isDiscovered: false,
    cursed: false,
    powerLevel: "moderate",
    usageOptions: [
      {
        id: "inspire_rebellion",
        text: "Raise the banner to inspire rebels",
        outcome: "Oppressed dragons everywhere feel hope and begin to resist their oppressors, but you become a prime target for HiveWing assassins.",
        soulCost: 0,
        sanityCost: 4,
        consequences: ["Inspired widespread rebellion", "Gave hope to oppressed dragons", "Became target for assassins"],
        corruption: false
      },
      {
        id: "keep_hidden",
        text: "Keep it hidden for safety",
        outcome: "You preserve the banner's power for a crucial moment, but the weight of unfulfilled hope begins to crush your spirit.",
        soulCost: 2,
        sanityCost: 5,
        consequences: ["Preserved banner for crucial moment", "Crushed by weight of unfulfilled hope", "Waiting for perfect opportunity"],
        corruption: false
      }
    ]
  },

  {
    id: "leafwing_poison_vial",
    name: "Vial of Living Poison",
    description: "A glass vial containing a swirling green poison that moves like it's alive. It belonged to a LeafWing assassin who used it to fight HiveWing oppression.",
    type: "magical_artifact",
    enchantments: ["Living Poison", "Plant Control", "Toxic Immunity"],
    rarity: "rare",
    discoveryLocation: "Poison Jungle",
    discoveryScenario: "Deep in the most toxic part of the jungle, you find a vial of living poison abandoned by a LeafWing resistance fighter.",
    isActive: false,
    canGiveAway: true,
    isDiscovered: false,
    cursed: true,
    powerLevel: "major",
    usageOptions: [
      {
        id: "use_poison",
        text: "Use the poison against enemies",
        outcome: "The poison obeys your commands and can eliminate any threat, but it begins to view all other dragons as potential enemies to eliminate.",
        soulCost: 5,
        sanityCost: 3,
        consequences: ["Poison obeys your commands", "Can eliminate any threat", "Poison sees all dragons as enemies"],
        corruption: true
      },
      {
        id: "cure_creation",
        text: "Use it to create antidotes instead",
        outcome: "You become immune to all toxins and can cure any poison, but the vial's darkness slowly seeps into your soul.",
        soulCost: 2,
        sanityCost: 1,
        consequences: ["Immune to all toxins", "Can cure any poison", "Darkness seeping into soul"],
        corruption: true
      }
    ]
  }
];

export class AnimusArtifactSystem {
  private static discoveredArtifacts: Set<string> = new Set();
  private static readonly MAX_ARTIFACTS_PER_GAME = 3; // Maximum 3 artifacts per playthrough
  
  static getAvailableArtifactsForLocation(location: string): AnimusArtifact[] {
    // Allow artifacts to be found at any location, but prefer their discovery location
    const exactLocationArtifacts = ANIMUS_ARTIFACTS.filter(artifact => 
      artifact.discoveryLocation === location && 
      !this.discoveredArtifacts.has(artifact.id)
    );
    
    // If no exact location matches, allow any undiscovered artifact to be found
    if (exactLocationArtifacts.length === 0) {
      const anyLocationArtifacts = ANIMUS_ARTIFACTS.filter(artifact => 
        !this.discoveredArtifacts.has(artifact.id)
      );
      console.log(`No artifacts for ${location}, using any available: ${anyLocationArtifacts.length} artifacts`);
      return anyLocationArtifacts;
    }
    
    console.log(`Found ${exactLocationArtifacts.length} artifacts for ${location}`);
    return exactLocationArtifacts;
  }
  
  static generateArtifactDiscovery(character: Character, gameData: GameData): AnimusArtifact | null {
    console.log("Attempting to generate artifact discovery...");
    
    // Check current inventory for artifacts instead of internal tracking
    const currentArtifacts = (gameData.inventory || []).filter(item => item.type === 'magical_artifact').length;
    console.log(`Current artifacts in inventory: ${currentArtifacts}/${this.MAX_ARTIFACTS_PER_GAME}`);
    
    if (currentArtifacts >= this.MAX_ARTIFACTS_PER_GAME) {
      console.log("Max artifacts already collected - no more discoveries");
      return null;
    }

    const currentLocation = LocationSystem.getCurrentLocation(gameData);
    if (!currentLocation) {
      console.log("No current location found");
      return null;
    }

    // Get artifacts not already in inventory
    const inventoryArtifactIds = (gameData.inventory || [])
      .filter(item => item.type === 'magical_artifact')
      .map(item => item.id);
      
    const availableArtifacts = this.getAvailableArtifactsForLocation(currentLocation.name)
      .filter(artifact => !inventoryArtifactIds.includes(artifact.id));
      
    console.log(`Available artifacts at ${currentLocation.name}: ${availableArtifacts.length}`);
    console.log(`Already collected: ${inventoryArtifactIds}`);
    
    if (availableArtifacts.length === 0) {
      console.log("No new artifacts available for location");
      return null;
    }

    // Pick the first available artifact
    const artifact = availableArtifacts[0];
    console.log(`Generated artifact: ${artifact.name}`);
    return { ...artifact, isDiscovered: true };
  }
  
  static useArtifact(artifact: AnimusArtifact, optionId: string, character: Character, gameData: GameData): {
    newCharacter: Character;
    newGameData: GameData;
    outcome: string;
    consequences: string[];
  } {
    const option = artifact.usageOptions.find(opt => opt.id === optionId);
    if (!option) {
      throw new Error(`Invalid option ${optionId} for artifact ${artifact.id}`);
    }
    
    const newCharacter = { ...character };
    const newGameData = { ...gameData };
    
    // Apply soul and sanity costs
    newCharacter.soulPercentage = Math.max(0, character.soulPercentage - option.soulCost);
    newCharacter.sanityPercentage = Math.max(0, character.sanityPercentage - option.sanityCost);
    
    // Update corruption stage if needed
    if (newCharacter.soulPercentage <= 25 && character.soulPercentage > 25) {
      newCharacter.soulCorruptionStage = "Broken";
    } else if (newCharacter.soulPercentage <= 50 && character.soulPercentage > 50) {
      newCharacter.soulCorruptionStage = "Twisted";
    } else if (newCharacter.soulPercentage <= 75 && character.soulPercentage > 75) {
      newCharacter.soulCorruptionStage = "Frayed";
    }
    
    // Remove or modify the artifact based on usage
    const inventoryIndex = newGameData.inventory.findIndex(item => item.id === artifact.id);
    if (inventoryIndex !== -1) {
      if (optionId.includes('destroy') || optionId.includes('smash') || optionId.includes('break') || optionId.includes('melt')) {
        // Remove artifact if destroyed
        newGameData.inventory.splice(inventoryIndex, 1);
      } else {
        // Mark as used/active
        newGameData.inventory[inventoryIndex].isActive = true;
      }
    }
    
    return {
      newCharacter,
      newGameData,
      outcome: option.outcome,
      consequences: option.consequences
    };
  }
  
  static getDiscoveredArtifacts(): string[] {
    return Array.from(this.discoveredArtifacts);
  }
  
  static resetDiscoveredArtifacts(): void {
    this.discoveredArtifacts.clear();
  }
  
  static isArtifactDiscovered(artifactId: string): boolean {
    return this.discoveredArtifacts.has(artifactId);
  }
  
  static getArtifactById(id: string): AnimusArtifact | undefined {
    return ANIMUS_ARTIFACTS.find(artifact => artifact.id === id);
  }

  static generateArtifactChoices(artifact: AnimusArtifact): {
    id: string;
    text: string;
    description: string;
    soulCost: number;
    sanityCost: number;
    consequences: string[];
    collectsArtifact: boolean;
  }[] {
    return [
      {
        id: `collect_${artifact.id}`,
        text: `Collect the ${artifact.name}`,
        description: "Take the artifact and add it to your inventory",
        soulCost: 0,
        sanityCost: 3,
        consequences: [`You carefully collect the ${artifact.name} and store it safely`],
        collectsArtifact: true
      },
      {
        id: `examine_${artifact.id}`,
        text: "Examine it closely but don't touch",
        description: "Study the artifact without collecting it",
        soulCost: 0,
        sanityCost: 1,
        consequences: ["You study the artifact carefully but choose not to take it"],
        collectsArtifact: false
      },
      {
        id: `ignore_${artifact.id}`,
        text: "Leave it alone",
        description: "Walk away from the dangerous artifact",
        soulCost: 0,
        sanityCost: 0,
        consequences: ["You decide the artifact is too dangerous and leave it behind"],
        collectsArtifact: false
      }
    ];
  }

  static collectArtifact(artifact: AnimusArtifact, character: Character, gameData: GameData): {
    newCharacter: Character;
    newGameData: GameData;
    message: string;
  } {
    console.log(`COLLECTING ARTIFACT: ${artifact.name} with ID: ${artifact.id}`);
    const newCharacter = { ...character };
    const newGameData = { ...gameData };

    // Ensure inventory exists and is an array
    if (!newGameData.inventory || !Array.isArray(newGameData.inventory)) {
      console.log("Initializing inventory array");
      newGameData.inventory = [];
    }

    // Add artifact to inventory
    const inventoryItem = {
      id: artifact.id,
      name: artifact.name,
      description: artifact.description,
      type: artifact.type,
      enchantments: artifact.enchantments,
      isActive: false,
      canGiveAway: artifact.canGiveAway
    };

    console.log(`Adding artifact to inventory:`, inventoryItem);
    console.log(`Inventory before push:`, newGameData.inventory);
    newGameData.inventory.push(inventoryItem);
    console.log(`Inventory after push:`, newGameData.inventory);

    const message = `You have collected the ${artifact.name}! It has been added to your inventory.`;
    
    console.log(`Artifact ${artifact.name} added to inventory. Total items: ${newGameData.inventory.length}`);

    return {
      newCharacter,
      newGameData,
      message
    };
  }
}