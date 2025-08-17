import { Character, GameData, Scenario } from "@shared/schema";

interface EnhancedScenarioTemplate {
  id: string;
  type: 'ANIMUS' | 'MINDREADING' | 'PROPHECY' | 'WARS' | 'LEARNING' | 'NORMAL';
  title: string;
  description: string;
  narrativeText: string[];
  weight: number; // How likely this scenario is to appear
  requirements?: (character: Character) => boolean;
  choices: {
    id: string;
    text: string;
    description: string;
    soulCost: number;
    sanityCost: number;
    consequences: string[];
    corruption?: boolean;
    requirements?: string[];
  }[];
}

// Comprehensive scenario database merged from all attached files
export const COMPREHENSIVE_SCENARIOS: EnhancedScenarioTemplate[] = [
  // Animus Power Scenarios (from attached files)
  {
    id: "animus_first_discovery",
    type: "ANIMUS",
    title: "First Animus Power Discovery",
    description: "A dragon discovers their Animus power for the first time in a heated battle",
    narrativeText: [
      "The battle rages around you, scales clashing against claws, fire against fire.",
      "Suddenly, in a moment of desperation, you feel something stir within you—a power unlike anything you've felt before.",
      "Energy courses through your veins as your Animus magic awakens for the first time.",
      "The magic erupts from you uncontrolled, and you realize with both wonder and terror that you are animus."
    ],
    weight: 3,
    requirements: (character) => character.isAnimus && character.age <= 5,
    choices: [
      {
        id: "control_power",
        text: "Try to control the magical energy",
        description: "Focus on controlling the power surge",
        soulCost: 2,
        sanityCost: 0,
        consequences: ["learned_control", "power_stabilized"]
      },
      {
        id: "let_power_rage",
        text: "Let the power rage uncontrolled",
        description: "Allow the magic to flow freely without restraint",
        soulCost: 8,
        sanityCost: 5,
        consequences: ["massive_damage", "power_revealed", "enemies_defeated"],
        corruption: true
      },
      {
        id: "try_to_suppress",
        text: "Try to suppress the awakening magic",
        description: "Attempt to push the power back down",
        soulCost: 0,
        sanityCost: 15,
        consequences: ["magic_suppressed", "internal_conflict", "missed_opportunity"]
      }
    ]
  },
  
  {
    id: "animus_power_backfire",
    type: "ANIMUS",
    title: "Magic Backfires in Combat",
    description: "Your Animus power suddenly backfires during a fight",
    narrativeText: [
      "You channel your animus magic, preparing to turn the tide of battle.",
      "But something goes wrong—the magic twists against itself, writhing like a living thing.",
      "The spell backfires spectacularly, and you feel the dark energy recoiling through your soul.",
      "Your opponents pause, sensing the magical disturbance, as you struggle to regain control."
    ],
    weight: 2,
    requirements: (character) => character.isAnimus && character.soulPercentage < 70,
    choices: [
      {
        id: "retreat_and_meditate",
        text: "Retreat to calm yourself and meditate",
        description: "Pull back from combat to stabilize your magic",
        soulCost: 0,
        sanityCost: 5,
        consequences: ["magic_stabilized", "tactical_retreat", "wisdom_gained"]
      },
      {
        id: "push_through_backfire",
        text: "Push through the magical feedback",
        description: "Force the magic to work despite the backfire",
        soulCost: 12,
        sanityCost: 10,
        consequences: ["power_through", "dangerous_precedent", "soul_damage"],
        corruption: true
      },
      {
        id: "seek_immediate_help",
        text: "Call for help from allies",
        description: "Ask other dragons to assist you",
        soulCost: 0,
        sanityCost: 8,
        consequences: ["received_help", "magic_contained", "vulnerability_revealed"]
      }
    ]
  },

  {
    id: "heal_ally_carefully",
    type: "ANIMUS",
    title: "Healing Without Harm",
    description: "A dragon with Animus magic must heal an ally without harming them",
    narrativeText: [
      "Your closest friend lies wounded before you, their breathing shallow and labored.",
      "You have the power to heal them instantly with animus magic, but you know the risks.",
      "One wrong move, one moment of lost concentration, and your healing could become a curse.",
      "Your hands hover over their wounds as you prepare to channel the most delicate magic you've ever attempted."
    ],
    weight: 2,
    requirements: (character) => character.isAnimus,
    choices: [
      {
        id: "careful_healing",
        text: "Use small, careful bursts of healing magic",
        description: "Channel magic slowly and precisely",
        soulCost: 3,
        sanityCost: 0,
        consequences: ["successful_healing", "friend_saved", "precise_control_learned"]
      },
      {
        id: "powerful_healing",
        text: "Pour all your power into healing them",
        description: "Use maximum power to ensure complete healing",
        soulCost: 15,
        sanityCost: 5,
        consequences: ["complete_healing", "soul_cost_high", "magical_exhaustion"],
        corruption: true
      },
      {
        id: "refuse_to_heal",
        text: "Refuse to use magic, seek mundane healing",
        description: "Find a healer or use traditional medicine",
        soulCost: 0,
        sanityCost: 20,
        consequences: ["soul_preserved", "friend_at_risk", "guilt_burden"]
      }
    ]
  },

  // Wars and Battles Scenarios
  {
    id: "tribal_war_choice",
    type: "WARS",
    title: "Choose Your Side",
    description: "Two tribes declare war, and your clan must choose a side",
    narrativeText: [
      "The great hall falls silent as messengers from both the SkyWings and SeaWings await your clan's decision.",
      "War has been declared, and neutrality is no longer an option.",
      "Your clan leader looks to you—your voice carries weight in this decision that will reshape alliances across Pyrrhia.",
      "The choice you make today will determine which dragons live and which dragons die."
    ],
    weight: 3,
    requirements: (character) => character.age >= 7,
    choices: [
      {
        id: "support_skywings",
        text: "Advise supporting the SkyWings",
        description: "Side with the martial might of the SkyWings",
        soulCost: 0,
        sanityCost: 5,
        consequences: ["skywing_alliance", "seawing_enmity", "military_strength"]
      },
      {
        id: "support_seawings",
        text: "Advise supporting the SeaWings", 
        description: "Side with the diplomatic SeaWings",
        soulCost: 0,
        sanityCost: 5,
        consequences: ["seawing_alliance", "skywing_enmity", "diplomatic_advantage"]
      },
      {
        id: "propose_mediation",
        text: "Propose attempting to mediate the conflict",
        description: "Try to broker peace between the warring tribes",
        soulCost: 0,
        sanityCost: 10,
        consequences: ["peace_attempt", "respect_from_both", "dangerous_neutrality"]
      },
      {
        id: "animus_intervention",
        text: "Suggest using animus magic to end the war quickly",
        description: "Use magical power to force a resolution",
        soulCost: 20,
        sanityCost: 0,
        consequences: ["magical_resolution", "political_upheaval", "power_feared"],
        corruption: true,
        requirements: ["character.isAnimus"]
      }
    ]
  },

  {
    id: "village_under_siege",
    type: "WARS", 
    title: "Army at the Gates",
    description: "A dragon army surrounds your village",
    narrativeText: [
      "The thunder of wings fills the sky as hundreds of enemy dragons circle your village.",
      "From the watchtower, you can see their organized formations—this is no raiding party.",
      "The villagers look to the defenders with fear in their eyes, knowing that conventional defenses may not be enough.",
      "You realize that creative tactics and courage will be needed to save your home."
    ],
    weight: 2,
    choices: [
      {
        id: "guerrilla_tactics",
        text: "Use terrain and ambush tactics",
        description: "Fight smart using the landscape to your advantage",
        soulCost: 0,
        sanityCost: 8,
        consequences: ["tactical_victory", "minimal_casualties", "strategic_thinking"]
      },
      {
        id: "direct_assault",
        text: "Launch a direct counter-attack", 
        description: "Meet force with force in open battle",
        soulCost: 0,
        sanityCost: 15,
        consequences: ["costly_victory", "heavy_casualties", "brave_stand"]
      },
      {
        id: "magical_defense",
        text: "Use animus magic to defend the village",
        description: "Create magical barriers and weapons",
        soulCost: 12,
        sanityCost: 0,
        consequences: ["magical_victory", "village_saved", "power_displayed"],
        requirements: ["character.isAnimus"]
      },
      {
        id: "negotiate_surrender",
        text: "Attempt to negotiate terms of surrender",
        description: "Try to minimize bloodshed through diplomacy",
        soulCost: 0,
        sanityCost: 25,
        consequences: ["peaceful_resolution", "village_spared", "honor_questioned"]
      }
    ]
  },

  // Mind Reading Scenarios
  {
    id: "sudden_mind_reading",
    type: "MINDREADING",
    title: "Unexpected Thought Intrusion",
    description: "A dragon suddenly knows what another is thinking",
    narrativeText: [
      "Without warning, thoughts that aren't your own flood into your mind.",
      "You can hear them as clearly as spoken words—fears, secrets, plans, emotions.",
      "The dragon in front of you has no idea that their mental walls have crumbled before your unexpected ability.",
      "The power is intoxicating, but you realize this violation of privacy comes with serious moral implications."
    ],
    weight: 2,
    requirements: (character) => character.tribalPowers.includes('Mind Reading') || character.specialPowers.includes('Enhanced Mind Reading'),
    choices: [
      {
        id: "respect_privacy",
        text: "Immediately stop reading their thoughts",
        description: "Respect their mental privacy and withdraw",
        soulCost: 0,
        sanityCost: 0,
        consequences: ["ethical_choice", "power_controlled", "trust_maintained"]
      },
      {
        id: "gather_information",
        text: "Continue reading to gather useful information",
        description: "Use this opportunity to learn their secrets",
        soulCost: 0,
        sanityCost: 12,
        consequences: ["information_gained", "privacy_violated", "guilt_acquired"]
      },
      {
        id: "manipulate_thoughts",
        text: "Try to influence or change their thoughts",
        description: "Attempt to alter their thinking patterns",
        soulCost: 8,
        sanityCost: 20,
        consequences: ["mind_manipulation", "dangerous_precedent", "ethical_corruption"],
        corruption: true,
        requirements: ["character.specialPowers.includes('Enhanced Mind Reading')"]
      }
    ]
  },

  {
    id: "multiple_thoughts_chaos",
    type: "MINDREADING", 
    title: "Mental Cacophony",
    description: "You hear multiple thoughts at once from different dragons",
    narrativeText: [
      "The marketplace buzzes with activity, but for you, it's a nightmare of overlapping voices.",
      "Dozens of dragons' thoughts crash into your mind simultaneously—worries about crops, excitement about festivals, dark secrets, petty grievances.",
      "The mental noise threatens to overwhelm you completely, leaving you dizzy and disoriented.",
      "You must find a way to regain control before you collapse from the psychic overload."
    ],
    weight: 2,
    requirements: (character) => character.tribalPowers.includes('Mind Reading') || character.specialPowers.includes('Enhanced Mind Reading'),
    choices: [
      {
        id: "focus_on_one",
        text: "Focus intensely on one dragon's thoughts",
        description: "Block out the noise by concentrating on a single mind",
        soulCost: 0,
        sanityCost: 5,
        consequences: ["mental_focus", "information_gained", "exhaustion"]
      },
      {
        id: "retreat_mentally",
        text: "Retreat from the mental noise entirely",
        description: "Shut down your mind reading ability temporarily",
        soulCost: 0,
        sanityCost: 10,
        consequences: ["peace_restored", "ability_suppressed", "missed_opportunities"]
      },
      {
        id: "embrace_chaos",
        text: "Try to process all the thoughts simultaneously",
        description: "Attempt to handle the full mental assault",
        soulCost: 0,
        sanityCost: 25,
        consequences: ["mental_overload", "expanded_awareness", "psychological_damage"],
        corruption: true
      }
    ]
  },

  // Prophecy Scenarios
  {
    id: "cryptic_battle_prophecy",
    type: "PROPHECY",
    title: "Vision of Coming Battle",
    description: "You receive a cryptic prophecy about an upcoming battle",
    narrativeText: [
      "The vision hits you like lightning—flashes of scales and fire, the sound of clashing talons, the taste of blood in the air.",
      "Through the prophetic haze, you see dragons you recognize fighting desperately against an unseen enemy.",
      "The prophecy speaks in riddles: 'When moon meets sun in dragon's eye, the false king's crown shall crack and die.'",
      "You have knowledge of what's coming, but interpreting it correctly could mean the difference between victory and catastrophe."
    ],
    weight: 2,
    requirements: (character) => character.tribalPowers.includes('Prophecy (rare)') || character.specialPowers.includes('Enhanced Prophecy') || character.specialPowers.includes('Foresight'),
    choices: [
      {
        id: "warn_everyone",
        text: "Warn everyone about the coming battle",
        description: "Share your vision to prepare for the conflict",
        soulCost: 0,
        sanityCost: 8,
        consequences: ["warning_given", "preparation_time", "prophecy_revealed"]
      },
      {
        id: "interpret_carefully",
        text: "Study the prophecy to understand its true meaning",
        description: "Analyze the riddle before taking action",
        soulCost: 0,
        sanityCost: 5,
        consequences: ["deeper_understanding", "strategic_advantage", "time_invested"]
      },
      {
        id: "act_on_prophecy",
        text: "Take immediate action based on your interpretation",
        description: "Act decisively on what you think it means",
        soulCost: 0,
        sanityCost: 15,
        consequences: ["bold_action", "potential_misinterpretation", "fate_altered"]
      },
      {
        id: "use_magic_to_change_fate",
        text: "Use animus magic to try changing the prophesied outcome",
        description: "Attempt to alter destiny itself with magic",
        soulCost: 25,
        sanityCost: 10,
        consequences: ["fate_challenged", "magical_interference", "cosmic_consequences"],
        corruption: true,
        requirements: ["character.isAnimus"]
      }
    ]
  },

  // Learning and Normal Life Scenarios
  {
    id: "hidden_library_discovery",
    type: "LEARNING",
    title: "Ancient Knowledge Found",
    description: "You find a hidden scroll in a library containing forbidden knowledge",
    narrativeText: [
      "While researching in the depths of the old library, your claw catches on a loose stone.",
      "Behind it, you discover a hidden compartment containing ancient scrolls that seem to pulse with dark energy.",
      "The writing is in old Dragon script, describing animus techniques that have been banned for centuries.",
      "As you read, you realize this knowledge could make you incredibly powerful—or incredibly dangerous."
    ],
    weight: 2,
    choices: [
      {
        id: "study_forbidden_knowledge",
        text: "Study the forbidden techniques carefully",
        description: "Learn the dangerous magical arts described",
        soulCost: 5,
        sanityCost: 10,
        consequences: ["forbidden_knowledge", "dangerous_power", "moral_corruption"],
        corruption: true
      },
      {
        id: "report_to_authorities",
        text: "Report the discovery to the librarians",
        description: "Let the proper authorities handle the forbidden texts",
        soulCost: 0,
        sanityCost: 0,
        consequences: ["responsible_choice", "knowledge_secured", "trust_earned"]
      },
      {
        id: "destroy_scrolls",
        text: "Destroy the scrolls to keep them from anyone",
        description: "Burn the dangerous knowledge to protect everyone",
        soulCost: 0,
        sanityCost: 5,
        consequences: ["knowledge_destroyed", "protection_achieved", "history_lost"]
      },
      {
        id: "secretly_copy_knowledge",
        text: "Secretly copy the knowledge for yourself",
        description: "Make your own copies before reporting the find",
        soulCost: 3,
        sanityCost: 15,
        consequences: ["secret_knowledge", "deception", "personal_advantage"],
        corruption: true
      }
    ]
  },

  {
    id: "dragon_offers_friendship",
    type: "NORMAL",
    title: "Unexpected Friendship",
    description: "A dragon from another tribe offers genuine friendship",
    narrativeText: [
      "You're sitting alone in the courtyard when a dragon you've never seen before approaches.",
      "They're clearly from a different tribe—their scales shimmer with unfamiliar colors.",
      "'I've been watching you,' they say with a friendly smile. 'You seem like someone I'd like to know better.'",
      "In a world where inter-tribal relationships can be complicated, this gesture of friendship feels both welcome and risky."
    ],
    weight: 4,
    choices: [
      {
        id: "accept_friendship",
        text: "Welcome their friendship openly",
        description: "Accept their offer and get to know them",
        soulCost: 0,
        sanityCost: 0,
        consequences: ["new_friendship", "inter_tribal_bond", "social_growth"]
      },
      {
        id: "cautious_acceptance",
        text: "Accept but remain cautious",
        description: "Be friendly but keep your guard up",
        soulCost: 0,
        sanityCost: 3,
        consequences: ["guarded_friendship", "trust_issues", "safety_maintained"]
      },
      {
        id: "politely_decline",
        text: "Politely decline their friendship",
        description: "Kindly refuse to avoid complications",
        soulCost: 0,
        sanityCost: 8,
        consequences: ["missed_opportunity", "safety_prioritized", "isolation"]
      },
      {
        id: "push_them_away_rudely",
        text: "Rudely push them away",
        description: "Be hostile to make them leave you alone",
        soulCost: 0,
        sanityCost: 15,
        consequences: ["enemy_made", "reputation_damaged", "cruelty_shown"],
        corruption: true
      }
    ]
  },

  // Complex Multi-Path Scenarios
  {
    id: "immortality_request",
    type: "ANIMUS",
    title: "The Ultimate Request",
    description: "A desperate dragon asks you to enchant them immortal",
    narrativeText: [
      "The old dragon before you trembles with age, their once-proud wings now brittle and worn.",
      "'Please,' they whisper, tears in their ancient eyes. 'I've lived a good life, but I'm not ready to die.'",
      "'I have grandchildren I want to see grow up, knowledge I haven't finished sharing.'",
      "You have the power to grant their wish—but immortality is perhaps the most dangerous magic of all."
    ],
    weight: 1,
    requirements: (character) => character.isAnimus && character.age >= 10,
    choices: [
      {
        id: "grant_immortality",
        text: "Grant their wish for immortality",
        description: "Use animus magic to make them immortal",
        soulCost: 30,
        sanityCost: 0,
        consequences: ["immortality_granted", "massive_soul_loss", "god_like_power"],
        corruption: true
      },
      {
        id: "grant_extended_life",
        text: "Grant them a few more healthy years instead",
        description: "Give them time without full immortality",
        soulCost: 10,
        sanityCost: 0,
        consequences: ["life_extended", "compromise_made", "gratitude_earned"]
      },
      {
        id: "refuse_kindly",
        text: "Gently refuse and explain the dangers",
        description: "Help them understand why you can't do this",
        soulCost: 0,
        sanityCost: 10,
        consequences: ["wisdom_shared", "request_denied", "understanding_reached"]
      },
      {
        id: "make_them_understand_death",
        text: "Use magic to make them accept death peacefully",
        description: "Alter their mind to remove their fear of dying",
        soulCost: 15,
        sanityCost: 5,
        consequences: ["mind_altered", "peace_given", "ethical_violation"],
        corruption: true
      }
    ]
  },

  // Additional scenarios from the scenario files, formatted for the comprehensive database
  {
    id: "rare_herbs_discovery",
    type: "NORMAL",
    title: "Forest Treasures",
    description: "You wander into a forest and find rare medicinal herbs",
    narrativeText: [
      "The ancient forest is quiet except for the whisper of leaves in the wind.",
      "Among the twisted roots of an enormous tree, you spot something unusual—herbs that glow faintly with inner light.",
      "These are healing herbs, incredibly rare and valuable, used to treat the most serious injuries.",
      "But you also know that taking them depletes this grove's natural magic."
    ],
    weight: 3,
    choices: [
      {
        id: "collect_all_herbs",
        text: "Collect all the herbs you can find",
        description: "Gather every valuable herb for maximum benefit",
        soulCost: 0,
        sanityCost: 5,
        consequences: ["wealth_gained", "herbs_collected", "grove_depleted"]
      },
      {
        id: "take_only_what_you_need",
        text: "Take only a few herbs, leaving the rest",
        description: "Practice restraint and conservation",
        soulCost: 0,
        sanityCost: 0,
        consequences: ["moderate_gain", "conservation", "grove_preserved"]
      },
      {
        id: "leave_herbs_untouched",
        text: "Leave the herbs untouched",
        description: "Respect the forest's natural balance",
        soulCost: 0,
        sanityCost: 0,
        consequences: ["nature_respected", "opportunity_missed", "karma_gained"]
      },
      {
        id: "enchant_herbs_to_regrow",
        text: "Use magic to make the herbs regrow faster",
        description: "Enhance the grove's natural regeneration",
        soulCost: 5,
        sanityCost: 0,
        consequences: ["grove_enhanced", "sustainable_harvesting", "magical_intervention"],
        requirements: ["character.isAnimus"]
      }
    ]
  },

  // New Custom Action Required Scenarios
  {
    id: "suspicious_ancient_door",
    title: "The Sealed Chamber",
    description: "You discover an ancient door with strange markings that pulses with magical energy",
    narrativeText: [
      "Deep in the academy's forgotten tunnels, you find a door unlike any other.",
      "Ancient runes cover its surface, glowing faintly with inner power.",
      "The air around it hums with magical energy, and you sense something important lies beyond.",
      "But the door has no handle, no obvious way to open it—only those mysterious symbols."
    ],
    choices: [
      {
        id: "study_runes",
        text: "Study the runes carefully",
        description: "Examine the ancient markings for clues",
        consequences: ["You learn the runes speak of ancient animus magic"],
        soulCost: 0,
        sanityCost: 0
      },
      {
        id: "force_open",
        text: "Try to force the door open",
        description: "Use physical force to breach the sealed chamber",
        consequences: ["The door resists, and magical energy crackles around you"],
        soulCost: 0,
        sanityCost: 5
      }
    ],
    locations: ["Jade Mountain Academy"],
    categories: ["mystery", "magic"],
    customActionRequired: true,
    rarity: "rare"
  },

  {
    id: "injured_dragon_complex",
    title: "Life or Death Decision",
    description: "A critically injured dragon needs immediate help, but saving them might expose your abilities",
    narrativeText: [
      "You come across a dragon collapsed in the hallway, breathing shallowly.",
      "Their injuries are severe—internal bleeding, broken bones, possibly dying.",
      "Other dragons are panicking, calling for healers, but they might not arrive in time.",
      "You could save them with your powers, but doing so openly would reveal your secret abilities to everyone."
    ],
    choices: [
      {
        id: "heal_openly",
        text: "Heal them with magic, regardless of consequences",
        description: "Use your animus power to save their life",
        consequences: ["The dragon lives, but your animus powers are exposed"],
        soulCost: 3,
        sanityCost: 0
      },
      {
        id: "conventional_help",
        text: "Try to help with conventional methods",
        description: "Apply first aid and basic medical care",
        consequences: ["You do what you can, but it might not be enough"],
        soulCost: 0,
        sanityCost: 10
      }
    ],
    location: ["Any"],
    categories: ["crisis", "moral"],
    customActionRequired: true,
    rarity: "uncommon"
  },

  {
    id: "tribal_artifact_dispute",
    title: "The Contested Relic",
    description: "Two tribes are on the verge of war over an ancient artifact, and you might be the key to peace",
    narrativeText: [
      "The tension in the great hall is palpable as representatives from two rival tribes face off.",
      "Between them sits an ancient artifact—a crystal orb that supposedly holds great tribal power.",
      "Both sides claim it belongs to their tribe, both have legitimate historical claims.",
      "War seems inevitable unless someone can find a solution that satisfies both parties."
    ],
    choices: [
      {
        id: "suggest_sharing",
        text: "Suggest they share custody of the artifact",
        description: "Propose a compromise to prevent war",
        consequences: ["Both tribes are skeptical but consider the proposal"],
        soulCost: 0,
        sanityCost: 5
      },
      {
        id: "research_history",
        text: "Offer to research the true historical ownership",
        description: "Investigate to find the rightful owner",
        consequences: ["You begin investigating the artifact's origins"],
        soulCost: 0,
        sanityCost: 0
      }
    ],
    location: ["Any"],
    categories: ["political", "tribal"],
    customActionRequired: true,
    rarity: "rare"
  },

  {
    id: "prophecy_intervention",
    title: "Changing Fate",
    description: "You witness a prophecy beginning to unfold and must decide whether to intervene",
    narrativeText: [
      "The pieces of a dark prophecy you once heard are starting to come together before your eyes.",
      "A dragon you know is about to make a choice that will lead to exactly what was foretold—tragedy.",
      "You could warn them, change their path, potentially alter the course of fate itself.",
      "But prophecies exist for a reason, and changing them might have unforeseen consequences."
    ],
    choices: [
      {
        id: "warn_them",
        text: "Warn them about the prophecy",
        description: "Intervene to change fate itself",
        consequences: ["You alter fate, but the future becomes uncertain"],
        soulCost: 0,
        sanityCost: 15
      },
      {
        id: "let_fate_unfold",
        text: "Let events unfold as prophesied",
        description: "Allow destiny to proceed unchanged",
        consequences: ["The prophecy comes to pass as predicted"],
        soulCost: 0,
        sanityCost: 20
      }
    ],
    location: ["Any"],
    categories: ["prophecy", "moral"],
    customActionRequired: true,
    rarity: "very_rare"
  }
];

// Function to get random scenarios based on character and game state
export function getRandomScenarios(character: Character, gameData: Partial<GameData>, count: number = 10): EnhancedScenarioTemplate[] {
  const availableScenarios = COMPREHENSIVE_SCENARIOS.filter(scenario => {
    // Check requirements
    if (scenario.requirements && !scenario.requirements(character)) {
      return false;
    }
    
    // Filter by type based on character abilities
    if (scenario.type === 'ANIMUS' && !character.isAnimus) {
      return false;
    }
    
    if (scenario.type === 'MINDREADING' && 
        !character.tribalPowers.includes('Mind Reading') && 
        !character.specialPowers.includes('Enhanced Mind Reading')) {
      return false;
    }
    
    if (scenario.type === 'PROPHECY' && 
        !character.tribalPowers.includes('Prophecy (rare)') && 
        !character.specialPowers.includes('Enhanced Prophecy') &&
        !character.specialPowers.includes('Foresight')) {
      return false;
    }
    
    return true;
  });
  
  // Weight-based selection
  const weightedScenarios: EnhancedScenarioTemplate[] = [];
  availableScenarios.forEach(scenario => {
    for (let i = 0; i < scenario.weight; i++) {
      weightedScenarios.push(scenario);
    }
  });
  
  // Shuffle and return requested count
  const shuffled = weightedScenarios.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Convert enhanced scenario to standard scenario format
export function convertToStandardScenario(template: EnhancedScenarioTemplate, gameData: Partial<GameData>): Scenario {
  return {
    id: template.id,
    title: template.title,
    description: template.description,
    narrativeText: template.narrativeText,
    choices: template.choices.map(choice => ({
      ...choice,
      requirements: choice.requirements || []
    })),
    type: template.type.toLowerCase() as any,
    location: gameData.location || "Unknown Location",
    timeOfDay: gameData.timeInfo || "Midday",
    weather: "Clear skies"
  };
}

export { EnhancedScenarioTemplate };