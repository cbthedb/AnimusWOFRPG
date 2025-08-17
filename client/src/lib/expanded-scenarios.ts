import { Character, GameData, Scenario, Choice } from "@shared/schema";

export interface ExpandedScenario {
  id: string;
  title: string;
  description: string;
  narrativeText: string[];
  type: 'normal' | 'mindreading' | 'prophecy' | 'animus' | 'wars' | 'learning';
  choices: Choice[];
  requirements?: (character: Character) => boolean;
  location?: string;
}

// Helper function to parse scenario requirements
function parseRequirements(typeStr: string): ((character: Character) => boolean) | undefined {
  switch (typeStr.toLowerCase()) {
    case 'mindreading':
      return (c) => c.tribalPowers.some(p => p.toLowerCase().includes('mind')) || c.specialPowers.some(p => p.toLowerCase().includes('mind'));
    case 'prophecy':
      return (c) => c.tribalPowers.some(p => p.toLowerCase().includes('prophecy') || p.toLowerCase().includes('future') || p.toLowerCase().includes('sight')) ||
                   c.specialPowers.some(p => p.toLowerCase().includes('prophecy') || p.toLowerCase().includes('foresight') || p.toLowerCase().includes('future'));
    case 'animus':
      return (c) => c.isAnimus;
    default:
      return undefined; // No requirements for normal, wars, learning
  }
}

// Auto-generated scenarios from attached file (first 100 as examples)
const AUTO_SCENARIOS: ExpandedScenario[] = [
  {
    id: "scenario_1",
    title: "Unexpected Friendship",
    description: "A dragon offers friendship. Do you accept or push them away?",
    narrativeText: ["A dragon approaches you with an earnest expression, offering their friendship."],
    type: 'normal',
    choices: [
      { id: "accept", text: "Accept their friendship", description: "Welcome this new connection", soulCost: 0, sanityCost: 0, consequences: ["Gained new friend"], corruption: false },
      { id: "reject", text: "Push them away", description: "Reject their offer", soulCost: 1, sanityCost: 0, consequences: ["Hurt their feelings"], corruption: false }
    ]
  },
  {
    id: "scenario_2",
    title: "Mental Overload",
    description: "You hear multiple thoughts at once. Do you focus or retreat from the noise?",
    narrativeText: ["Your mind-reading ability suddenly activates, flooding you with multiple thoughts at once."],
    type: 'mindreading',
    requirements: parseRequirements('mindreading'),
    choices: [
      { id: "focus", text: "Focus and filter the thoughts", description: "Try to control the mental flood", soulCost: 0, sanityCost: 5, consequences: ["Better mind control"], corruption: false },
      { id: "retreat", text: "Retreat from the noise", description: "Pull back from the mental chaos", soulCost: 0, sanityCost: 2, consequences: ["Avoided overload"], corruption: false }
    ]
  },
  {
    id: "scenario_7",
    title: "Immortality Request",
    description: "A dragon asks you to enchant them immortal. Do you grant their wish or refuse?",
    narrativeText: ["A desperate dragon begs you to use your animus magic to make them immortal."],
    type: 'animus',
    requirements: parseRequirements('animus'),
    choices: [
      { id: "grant", text: "Grant immortality", description: "Use powerful animus magic", soulCost: 20, sanityCost: 0, consequences: ["Massive soul corruption"], corruption: true },
      { id: "refuse", text: "Refuse the request", description: "Preserve your soul integrity", soulCost: 0, sanityCost: 3, consequences: ["Maintained ethics"], corruption: false }
    ]
  }
];

// Core detailed scenarios
export const EXPANDED_SCENARIOS: ExpandedScenario[] = [
  {
    id: "friendship_offer",
    title: "Unexpected Friendship",
    description: "A dragon approaches you with an offer of friendship.",
    narrativeText: [
      "A dragon you barely know approaches you in the halls of Jade Mountain Academy.",
      "Their expression is earnest but nervous. 'I've been watching you from afar,' they say.",
      "'You seem like someone I'd like to know better. Would you be interested in being friends?'"
    ],
    type: 'normal',
    choices: [
      {
        id: "accept_friendship",
        text: "Accept their friendship warmly",
        description: "Welcome this new connection into your life",
        soulCost: 0,
        sanityCost: 0,
        consequences: ["Gained a new loyal friend", "Increased social connections", "Built reputation for kindness"],
        corruption: false
      },
      {
        id: "push_away",
        text: "Push them away coldly",
        description: "Reject their offer and maintain your isolation",
        soulCost: 1,
        sanityCost: 0,
        consequences: ["Hurt their feelings deeply", "Reputation for being antisocial", "Missed potential friendship"],
        corruption: false
      },
      {
        id: "cautious_acceptance",
        text: "Accept cautiously",
        description: "Give them a chance but keep your guard up",
        soulCost: 0,
        sanityCost: 0,
        consequences: ["Formed cautious friendship", "Maintained healthy boundaries", "Learned to be more trusting"],
        corruption: false
      }
    ]
  },
  {
    id: "multiple_thoughts",
    title: "Mental Overload",
    description: "Your mind reading ability picks up multiple thoughts at once.",
    narrativeText: [
      "Suddenly, your mind reading ability activates without warning during a crowded gathering.",
      "Dozens of voices flood your consciousness - fears, secrets, petty thoughts, and deep emotions.",
      "The mental noise threatens to overwhelm your own thoughts entirely."
    ],
    type: 'mindreading',
    requirements: (c) => c.tribalPowers.some(p => p.toLowerCase().includes('mind')) || c.specialPowers.some(p => p.toLowerCase().includes('mind')),
    choices: [
      {
        id: "focus_filter",
        text: "Focus and try to filter the thoughts",
        description: "Attempt to control the mental flood and focus on specific voices",
        soulCost: 0,
        sanityCost: 5,
        consequences: ["Learned better mind reading control", "Discovered important secrets", "Mental strain from effort"],
        corruption: false
      },
      {
        id: "retreat_noise",
        text: "Retreat from the mental noise",
        description: "Pull back and shut down your mind reading ability",
        soulCost: 0,
        sanityCost: 2,
        consequences: ["Avoided mental overload", "Missed important information", "Powers temporarily weakened"],
        corruption: false
      },
      {
        id: "embrace_chaos",
        text: "Embrace the chaotic thoughts",
        description: "Let all the thoughts flow through you without resistance",
        soulCost: 0,
        sanityCost: 10,
        consequences: ["Gained profound empathy", "Learned everyone's deepest secrets", "Severe mental exhaustion"],
        corruption: false
      }
    ]
  },
  {
    id: "battle_tactics",
    title: "Advanced Combat Knowledge",
    description: "You overhear advanced battle tactics being discussed.",
    narrativeText: [
      "While studying in a quiet corner of the library, you overhear two older dragons discussing advanced battle tactics.",
      "They're sharing techniques that aren't taught in normal classes - strategies that could make you a formidable warrior.",
      "They haven't noticed you listening. This knowledge could be invaluable in future conflicts."
    ],
    type: 'learning',
    choices: [
      {
        id: "learn_tactics",
        text: "Listen carefully and memorize the tactics",
        description: "Absorb this valuable combat knowledge",
        soulCost: 0,
        sanityCost: 0,
        consequences: ["Learned advanced battle techniques", "Gained tactical advantage", "Improved combat skills"],
        corruption: false
      },
      {
        id: "forget_tactics",
        text: "Try to forget what you heard",
        description: "Decide this knowledge is too dangerous to possess",
        soulCost: 0,
        sanityCost: 3,
        consequences: ["Maintained moral innocence", "Avoided becoming militaristic", "Missed strategic advantage"],
        corruption: false
      },
      {
        id: "confront_teachers",
        text: "Reveal yourself and ask to be taught properly",
        description: "Be honest about overhearing and request formal training",
        soulCost: 0,
        sanityCost: 0,
        consequences: ["Earned respect for honesty", "Gained proper military training", "Built relationship with instructors"],
        corruption: false
      }
    ]
  },
  {
    id: "feast_invitation",
    title: "Grand Feast",
    description: "You are invited to a grand feast with important dragons.",
    narrativeText: [
      "A formal invitation arrives, written on expensive parchment with golden ink.",
      "You're invited to a feast hosted by influential dragons from multiple tribes.",
      "This could be a valuable networking opportunity, but such gatherings can also be politically dangerous."
    ],
    type: 'normal',
    choices: [
      {
        id: "join_feast",
        text: "Join the feast and mingle",
        description: "Attend the feast and try to make important connections",
        soulCost: 0,
        sanityCost: 0,
        consequences: ["Made important political connections", "Learned valuable information", "Gained social status"],
        corruption: false
      },
      {
        id: "decline_feast",
        text: "Politely decline the invitation",
        description: "Send your regrets and avoid the political complexity",
        soulCost: 0,
        sanityCost: 0,
        consequences: ["Avoided political entanglements", "Maintained neutrality", "Missed networking opportunities"],
        corruption: false
      },
      {
        id: "sneak_feast",
        text: "Sneak away from the feast after appearing",
        description: "Make a brief appearance then quietly leave",
        soulCost: 0,
        sanityCost: 1,
        consequences: ["Avoided commitment while maintaining appearances", "Gathered some information", "Risked appearing rude"],
        corruption: false
      }
    ]
  },
  {
    id: "darkstalker_dream",
    title: "The Dark Temptation",
    description: "Darkstalker appears to you in a dream, offering forbidden knowledge.",
    narrativeText: [
      "In your dreams, the massive form of Darkstalker materializes before you.",
      "His ancient eyes gleam with terrible wisdom. 'Young animus,' he purrs, 'I can teach you spells beyond imagination.'",
      "'Magic that could reshape the world itself. All you need do is listen and learn.'"
    ],
    type: 'animus',
    requirements: (c) => c.isAnimus,
    choices: [
      {
        id: "accept_knowledge",
        text: "Accept his forbidden teachings",
        description: "Learn powerful but dangerous animus magic",
        soulCost: 15,
        sanityCost: 5,
        consequences: ["Gained immense magical power", "Learned dangerous spells", "Soul deeply corrupted by darkness"],
        corruption: true
      },
      {
        id: "reject_darkstalker",
        text: "Reject his offer completely",
        description: "Turn away from his temptations",
        soulCost: 0,
        sanityCost: 0,
        consequences: ["Maintained soul integrity", "Resisted corruption", "Darkstalker marked you as an enemy"],
        corruption: false
      },
      {
        id: "bargain_carefully",
        text: "Try to bargain for safer knowledge",
        description: "Attempt to gain some power without full corruption",
        soulCost: 5,
        sanityCost: 3,
        consequences: ["Gained moderate power", "Partially corrupted soul", "Darkstalker finds you interesting"],
        corruption: true
      }
    ]
  },
  {
    id: "immortality_request",
    title: "The Immortality Plea",
    description: "A desperate dragon begs you to use animus magic to make them immortal.",
    narrativeText: [
      "A dragon approaches you with tears in their eyes, having learned of your animus abilities.",
      "'Please,' they beg, 'my family is dying of a plague. Make me immortal so I can care for them forever.'",
      "The desperation in their voice is heartbreaking, but immortality magic is among the most soul-corrupting spells."
    ],
    type: 'animus',
    requirements: (c) => c.isAnimus,
    choices: [
      {
        id: "grant_immortality",
        text: "Grant their wish for immortality",
        description: "Cast the immortality spell despite the cost",
        soulCost: 20,
        sanityCost: 0,
        consequences: ["Granted immortality", "Massive soul corruption", "Dragon becomes obsessed with you"],
        corruption: true
      },
      {
        id: "refuse_immortality",
        text: "Refuse to cast such dangerous magic",
        description: "Explain why immortality magic is too dangerous",
        soulCost: 0,
        sanityCost: 5,
        consequences: ["Preserved soul integrity", "Dragon died with their family", "Guilt over refusing help"],
        corruption: false
      },
      {
        id: "offer_alternative",
        text: "Offer to heal their family instead",
        description: "Use less corrupting magic to heal rather than prevent death",
        soulCost: 8,
        sanityCost: 0,
        consequences: ["Healed the family plague", "Moderate soul cost", "Dragon eternally grateful"],
        corruption: false
      }
    ]
  }
];

// Location-specific special scenarios that are rare (3 every 10 minutes)
export const LOCATION_SPECIAL_SCENARIOS: ExpandedScenario[] = [
  {
    id: "nightwing_rainwing_architecture",
    title: "Cultural Architecture Dispute",
    description: "The NightWing-RainWing village faces an architectural disagreement.",
    narrativeText: [
      "The NightWing-RainWing village represents something unprecedented in dragon history - two tribes learning to live as one community.",
      "You witness daily interactions between dragons whose cultures couldn't be more different.",
      "A dispute has arisen over architectural styles for new buildings. Some NightWings want their traditional dark, angular designs while RainWings prefer organic, tree-integrated structures that blend with the forest.",
      "Your input could help shape how this experimental community develops. The decisions made here might serve as a model for inter-tribal cooperation throughout Pyrrhia."
    ],
    type: 'normal',
    location: "NightWing Village",
    choices: [
      {
        id: "support_nightwing_style",
        text: "Support traditional NightWing architecture",
        description: "Advocate for the structured, angular NightWing building style",
        soulCost: 0,
        sanityCost: 0,
        consequences: ["NightWings feel validated", "RainWings feel dismissed", "Village develops NightWing aesthetic"],
        corruption: false
      },
      {
        id: "support_rainwing_style", 
        text: "Support organic RainWing integration",
        description: "Advocate for buildings that blend with the forest",
        soulCost: 0,
        sanityCost: 0,
        consequences: ["RainWings feel heard", "NightWings feel marginalized", "Village maintains forest harmony"],
        corruption: false
      },
      {
        id: "propose_hybrid_design",
        text: "Propose a hybrid architectural style",
        description: "Suggest combining elements from both tribal traditions",
        soulCost: 0,
        sanityCost: 0,
        consequences: ["Created new architectural style", "Both tribes compromise", "Set precedent for cooperation"],
        corruption: false
      },
      {
        id: "suggest_district_system",
        text: "Suggest separate architectural districts",
        description: "Propose different areas for different building styles",
        soulCost: 0,
        sanityCost: 0,
        consequences: ["Maintained both traditions", "Created some segregation", "Practical compromise reached"],
        corruption: false
      }
    ]
  },
  {
    id: "ice_kingdom_diplomatic_crisis",
    title: "Ice Kingdom Diplomatic Incident",
    description: "A diplomatic crisis unfolds in the Ice Kingdom's frozen halls.",
    narrativeText: [
      "The Ice Kingdom's crystalline palace echoes with tension as delegates from warring tribes attempt negotiations.",
      "You witness a heated argument between a SkyWing ambassador and a MudWing representative over territory disputes.",
      "The IceWing queen watches with calculating eyes, clearly planning to use this conflict to her advantage.",
      "Your intervention could either prevent a war or escalate the situation beyond repair."
    ],
    type: 'normal',
    location: "Ice Kingdom",
    choices: [
      {
        id: "mediate_dispute",
        text: "Offer to mediate between the tribes",
        description: "Step forward and try to find common ground",
        soulCost: 0,
        sanityCost: 3,
        consequences: ["Prevented immediate war", "Gained diplomatic reputation", "Made enemies of war profiteers"],
        corruption: false
      },
      {
        id: "support_mudwings",
        text: "Publicly support the MudWing claims",
        description: "Take a side in the territorial dispute",
        soulCost: 0,
        sanityCost: 0,
        consequences: ["Gained MudWing alliance", "Made SkyWing enemies", "Influenced territorial outcome"],
        corruption: false
      },
      {
        id: "warn_icewing_queen",
        text: "Privately warn the IceWing queen about the implications",
        description: "Share your concerns about escalation with Queen Glacier",
        soulCost: 0,
        sanityCost: 0,
        consequences: ["Influenced IceWing policy", "Gained royal attention", "Potentially prevented larger conflict"],
        corruption: false
      },
      {
        id: "stay_neutral",
        text: "Remain neutral and observe",
        description: "Watch the situation unfold without intervention",
        soulCost: 0,
        sanityCost: 2,
        consequences: ["Avoided taking sides", "Learned valuable intelligence", "Felt guilt over inaction"],
        corruption: false
      }
    ]
  }
];

export class ExpandedScenarioSystem {
  private static lastSpecialScenarioTime: number = 0;
  private static readonly SPECIAL_SCENARIO_COOLDOWN = 10 * 60 * 1000; // 10 minutes in milliseconds
  private static specialScenariosUsed: number = 0;
  private static readonly MAX_SPECIAL_SCENARIOS_PER_PERIOD = 3;

  static getRandomExpandedScenario(character: Character, type?: string): ExpandedScenario | null {
    // Combine all scenarios
    const allScenarios = [...EXPANDED_SCENARIOS, ...AUTO_SCENARIOS];
    
    let eligibleScenarios = allScenarios.filter(scenario => {
      // Check type filter
      if (type && scenario.type !== type) return false;
      
      // Check requirements
      if (scenario.requirements && !scenario.requirements(character)) return false;
      
      return true;
    });

    if (eligibleScenarios.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * eligibleScenarios.length);
    return eligibleScenarios[randomIndex];
  }

  static tryGetLocationSpecialScenario(character: Character, location: string): ExpandedScenario | null {
    const now = Date.now();
    
    // Check cooldown and usage limits
    if (now - this.lastSpecialScenarioTime < this.SPECIAL_SCENARIO_COOLDOWN) {
      return null;
    }
    
    if (this.specialScenariosUsed >= this.MAX_SPECIAL_SCENARIOS_PER_PERIOD) {
      return null;
    }

    // Reset counter if enough time has passed
    if (now - this.lastSpecialScenarioTime > this.SPECIAL_SCENARIO_COOLDOWN * 2) {
      this.specialScenariosUsed = 0;
    }

    // Find scenarios for this location
    const locationScenarios = LOCATION_SPECIAL_SCENARIOS.filter(scenario => 
      !scenario.location || scenario.location === location
    );

    if (locationScenarios.length === 0) return null;

    // 15% chance to trigger special scenario
    if (Math.random() > 0.15) return null;

    const randomIndex = Math.floor(Math.random() * locationScenarios.length);
    const scenario = locationScenarios[randomIndex];

    // Update tracking
    this.lastSpecialScenarioTime = now;
    this.specialScenariosUsed++;

    console.log(`Special location scenario triggered: ${scenario.title} (${this.specialScenariosUsed}/${this.MAX_SPECIAL_SCENARIOS_PER_PERIOD})`);

    return scenario;
  }

  static resetSpecialScenarioState(): void {
    this.lastSpecialScenarioTime = 0;
    this.specialScenariosUsed = 0;
  }

  static convertToScenario(expandedScenario: ExpandedScenario, gameData: GameData): Scenario {
    return {
      id: expandedScenario.id,
      title: expandedScenario.title,
      description: expandedScenario.description,
      narrativeText: expandedScenario.narrativeText,
      choices: expandedScenario.choices,
      type: expandedScenario.type as any,
      location: gameData.location,
      timeOfDay: 'afternoon',
      weather: 'clear'
    };
  }
}