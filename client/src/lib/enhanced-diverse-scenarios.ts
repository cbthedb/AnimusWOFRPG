import { Character, GameData, Scenario, Choice } from "@shared/schema";
import { EnhancedSocialSystem } from "./enhanced-social-system";
import { EnhancedAnimusArtifactSystem } from "./enhanced-animus-artifacts";

interface ScenarioTemplate {
  id: string;
  type: 'SOCIAL' | 'ACADEMIC' | 'ADVENTURE' | 'MYSTERY' | 'CULTURAL' | 'NATURE' | 'POLITICAL' | 'PERSONAL_GROWTH' | 'ROMANCE' | 'FAMILY' | 'ACHIEVEMENT' | 'CRISIS' | 'DISCOVERY';
  title: string;
  baseText: string;
  variables: string[];
  requirements?: (character: Character, gameData: GameData) => boolean;
  generateChoices: (character: Character, gameData: GameData, variables: Record<string, string>) => Choice[];
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

export class EnhancedDiverseScenarios {
  private static lastUsedScenarios = new Set<string>();
  private static maxRecentScenarios = 20; // Prevent repetition

  private static readonly SCENARIO_TEMPLATES: ScenarioTemplate[] = [
    // SOCIAL SCENARIOS
    {
      id: "friendship_formation",
      type: "SOCIAL",
      title: "New Friendship Opportunity", 
      baseText: "{dragonName}, a {tribe} dragon, approaches you with an offer of friendship. They seem {personality} and {motivation}.",
      variables: ["dragonName", "tribe", "personality", "motivation"],
      rarity: "common",
      generateChoices: (character, gameData, vars) => [
        {
          id: "accept_friend",
          text: `Accept ${vars.dragonName}'s friendship warmly`,
          consequences: ["friendship_gained"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "cautious_friend", 
          text: "Be friendly but cautious about getting too close",
          consequences: ["cautious_relationship"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "reject_friend",
          text: `Politely decline ${vars.dragonName}'s friendship offer`,
          consequences: ["missed_opportunity"],
          soulCost: 0,
          sanityCost: -2
        }
      ]
    },

    {
      id: "group_dynamics", 
      type: "SOCIAL",
      title: "Group Social Dynamics",
      baseText: "You overhear a group of {tribe1} and {tribe2} dragons discussing {topic}. The conversation becomes {mood} when they notice you listening.",
      variables: ["tribe1", "tribe2", "topic", "mood"],
      rarity: "common",
      generateChoices: (character, gameData, vars) => [
        {
          id: "join_discussion",
          text: "Join the conversation and share your perspective",
          consequences: ["social_engagement"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "mediate_tension",
          text: "Try to ease any tension between the different tribes",
          consequences: ["peacemaker_reputation"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "quietly_listen",
          text: "Continue listening without participating",
          consequences: ["information_gained"],
          soulCost: 0,
          sanityCost: 0
        }
      ]
    },

    // ACADEMIC SCENARIOS
    {
      id: "advanced_studies",
      type: "ACADEMIC", 
      title: "Academic Challenge",
      baseText: "Professor {teacherName} offers you a chance to study {subject} - an advanced topic that could {benefit} but requires {sacrifice}.",
      variables: ["teacherName", "subject", "benefit", "sacrifice"],
      rarity: "uncommon",
      generateChoices: (character, gameData, vars) => [
        {
          id: "accept_studies",
          text: `Accept the advanced ${vars.subject} studies`,
          consequences: ["intelligence_gain", "time_commitment"],
          soulCost: 0,
          sanityCost: 2
        },
        {
          id: "partial_commitment",
          text: "Agree to study part-time while maintaining other activities",
          consequences: ["balanced_growth"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "decline_studies", 
          text: "Decline and focus on your current studies",
          consequences: ["missed_knowledge"],
          soulCost: 0,
          sanityCost: 0
        }
      ]
    },

    {
      id: "research_discovery",
      type: "ACADEMIC",
      title: "Research Breakthrough", 
      baseText: "While studying {researchTopic}, you make a discovery about {finding}. This knowledge could {implication} if shared.",
      variables: ["researchTopic", "finding", "implication"],
      rarity: "rare",
      generateChoices: (character, gameData, vars) => [
        {
          id: "publish_discovery",
          text: "Share your discovery with the academic community",
          consequences: ["scholarly_reputation", "knowledge_spread"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "selective_sharing",
          text: "Only share with trusted mentors and friends",
          consequences: ["careful_progress"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "keep_secret",
          text: "Keep the discovery secret until you understand it better",
          consequences: ["hidden_knowledge"],
          soulCost: 0,
          sanityCost: 1
        }
      ]
    },

    // ADVENTURE SCENARIOS
    {
      id: "exploration_opportunity",
      type: "ADVENTURE",
      title: "Exploration Adventure",
      baseText: "A group of students is planning to explore {location} during the weekend. They've heard rumors of {discovery} there, but also {danger}.",
      variables: ["location", "discovery", "danger"],
      rarity: "common",
      generateChoices: (character, gameData, vars) => [
        {
          id: "join_exploration",
          text: "Join the exploration group",
          consequences: ["adventure_experience", "potential_discovery"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "lead_expedition",
          text: "Volunteer to lead and organize the expedition",
          consequences: ["leadership_experience", "responsibility"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "stay_safe",
          text: "Stay at the academy where it's safe",
          consequences: ["missed_adventure"],
          soulCost: 0,
          sanityCost: -1
        }
      ]
    },

    // MYSTERY SCENARIOS
    {
      id: "academy_mystery",
      type: "MYSTERY",
      title: "Academy Mystery",
      baseText: "Strange {events} have been occurring around the academy. You notice {clue} that others seem to have missed. The mystery involves {connection}.",
      variables: ["events", "clue", "connection"],
      rarity: "uncommon",
      generateChoices: (character, gameData, vars) => [
        {
          id: "investigate_alone",
          text: "Investigate the mystery on your own",
          consequences: ["solo_discovery", "personal_risk"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "gather_team",
          text: "Gather friends to help solve the mystery",
          consequences: ["team_investigation", "shared_discovery"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "report_authority",
          text: "Report your findings to the academy authorities",
          consequences: ["official_investigation"],
          soulCost: 0,
          sanityCost: 0
        }
      ]
    },

    // CULTURAL SCENARIOS
    {
      id: "cultural_exchange",
      type: "CULTURAL",
      title: "Cultural Learning",
      baseText: "{cultureDragon} from {tribe} offers to teach you about {culturalAspect}. This could {cultureBenefit} but may {culturalChallenge}.",
      variables: ["cultureDragon", "tribe", "culturalAspect", "cultureBenefit", "culturalChallenge"],
      rarity: "common",
      generateChoices: (character, gameData, vars) => [
        {
          id: "embrace_culture",
          text: `Eagerly learn about ${vars.tribe} culture`,
          consequences: ["cultural_understanding", "friendship_bonus"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "mutual_exchange",
          text: `Suggest a mutual exchange - teach about your own tribe too`,
          consequences: ["cultural_bridge"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "polite_decline",
          text: "Politely decline, preferring to focus on your own heritage",
          consequences: ["cultural_preservation"],
          soulCost: 0,
          sanityCost: 0
        }
      ]
    },

    // NATURE SCENARIOS
    {
      id: "nature_encounter",
      type: "NATURE",
      title: "Nature Interaction", 
      baseText: "During a flight, you encounter {creature} in {environment}. The {creature} appears {behavior} and {condition}.",
      variables: ["creature", "environment", "behavior", "condition"],
      rarity: "common",
      generateChoices: (character, gameData, vars) => [
        {
          id: "help_creature",
          text: `Help the ${vars.creature}`,
          consequences: ["nature_bond", "karma_boost"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "observe_respectfully",
          text: "Watch from a respectful distance", 
          consequences: ["nature_knowledge"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "avoid_encounter",
          text: "Fly away to avoid any potential conflict",
          consequences: ["safety_first"],
          soulCost: 0,
          sanityCost: 0
        }
      ]
    },

    // POLITICAL SCENARIOS
    {
      id: "political_discussion",
      type: "POLITICAL",
      title: "Political Awareness",
      baseText: "A heated debate erupts about {politicalIssue} between dragons from different tribes. {opinion1} while {opinion2}. Your perspective could {impact}.",
      variables: ["politicalIssue", "opinion1", "opinion2", "impact"],
      rarity: "uncommon", 
      generateChoices: (character, gameData, vars) => [
        {
          id: "share_opinion",
          text: "Share your honest opinion about the issue",
          consequences: ["political_engagement"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "seek_compromise",
          text: "Try to find common ground between all viewpoints",
          consequences: ["diplomatic_reputation"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "stay_neutral",
          text: "Remain neutral and avoid taking sides",
          consequences: ["political_neutrality"],
          soulCost: 0,
          sanityCost: 0
        }
      ]
    },

    // PERSONAL GROWTH SCENARIOS
    {
      id: "personal_challenge",
      type: "PERSONAL_GROWTH",
      title: "Personal Challenge",
      baseText: "You face a personal challenge with {challenge}. This difficulty {description} and {emotion}. Overcoming it could {growth}.",
      variables: ["challenge", "description", "emotion", "growth"],
      rarity: "uncommon",
      generateChoices: (character, gameData, vars) => [
        {
          id: "face_challenge",
          text: "Face the challenge head-on with determination",
          consequences: ["personal_growth", "confidence_boost"],
          soulCost: 0,
          sanityCost: 1
        },
        {
          id: "seek_help",
          text: "Ask friends or mentors for help and guidance",
          consequences: ["support_network", "humble_growth"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "gradual_approach",
          text: "Take small steps to gradually overcome the challenge",
          consequences: ["steady_progress"],
          soulCost: 0,
          sanityCost: 0
        }
      ]
    },

    // ROMANCE SCENARIOS 
    {
      id: "romantic_moment",
      type: "ROMANCE",
      title: "Romantic Opportunity",
      baseText: "You find yourself alone with {romantic_interest} during {romantic_setting}. There's {romantic_tension} between you.",
      variables: ["romantic_interest", "romantic_setting", "romantic_tension"],
      requirements: (character, gameData) => character.age >= 4,
      rarity: "uncommon",
      generateChoices: (character, gameData, vars) => [
        {
          id: "express_feelings",
          text: `Express your feelings to ${vars.romantic_interest}`,
          consequences: ["romantic_confession"],
          soulCost: 0,
          sanityCost: 2
        },
        {
          id: "enjoy_moment",
          text: "Simply enjoy the moment without pressure",
          consequences: ["romantic_development"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "step_back",
          text: "Maintain appropriate boundaries",
          consequences: ["respectful_distance"], 
          soulCost: 0,
          sanityCost: -1
        }
      ]
    },

    // FAMILY SCENARIOS
    {
      id: "family_connection",
      type: "FAMILY",
      title: "Family Matters",
      baseText: "You receive news about {family_member}. They {family_situation} and {family_emotion}. This affects {family_impact}.",
      variables: ["family_member", "family_situation", "family_emotion", "family_impact"],
      rarity: "uncommon",
      generateChoices: (character, gameData, vars) => [
        {
          id: "support_family",
          text: `Offer strong support to your ${vars.family_member}`,
          consequences: ["family_bond_strengthened"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "visit_family",
          text: "Request time off to visit your family",
          consequences: ["family_visit", "academic_absence"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "emotional_support",
          text: "Send emotional support while maintaining your studies",
          consequences: ["balanced_care"],
          soulCost: 0,
          sanityCost: 1
        }
      ]
    },

    // ACHIEVEMENT SCENARIOS
    {
      id: "achievement_opportunity", 
      type: "ACHIEVEMENT",
      title: "Achievement Challenge",
      baseText: "An opportunity arises to {achievement_action} which could lead to {achievement_result}. This requires {achievement_requirement}.",
      variables: ["achievement_action", "achievement_result", "achievement_requirement"],
      rarity: "rare",
      generateChoices: (character, gameData, vars) => [
        {
          id: "pursue_achievement",
          text: `Fully commit to ${vars.achievement_action}`,
          consequences: ["achievement_progress", "dedication_required"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "balanced_pursuit",
          text: "Pursue the achievement while maintaining balance",
          consequences: ["moderate_achievement_progress"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "focus_elsewhere",
          text: "Focus on other priorities instead",
          consequences: ["missed_achievement"],
          soulCost: 0,
          sanityCost: 0
        }
      ]
    },

    // CRISIS SCENARIOS
    {
      id: "emergency_situation",
      type: "CRISIS",
      title: "Emergency Response",
      baseText: "A {crisis_type} emergency occurs involving {crisis_target}. The situation is {crisis_severity} and requires {crisis_action}.",
      variables: ["crisis_type", "crisis_target", "crisis_severity", "crisis_action"],
      rarity: "rare",
      generateChoices: (character, gameData, vars) => [
        {
          id: "heroic_response",
          text: "Take immediate heroic action to help",
          consequences: ["heroic_reputation", "personal_risk"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "organized_response",
          text: "Organize others to respond as a group",
          consequences: ["leadership_under_pressure"],
          soulCost: 0,
          sanityCost: 0
        },
        {
          id: "support_response",
          text: "Provide support to those taking the lead",
          consequences: ["team_support"],
          soulCost: 0,
          sanityCost: 0
        }
      ]
    }
  ];

  private static readonly VARIABLE_GENERATORS = {
    // Dragon names by tribe for social interactions
    dragonName: (character: Character) => EnhancedSocialSystem.generateRandomDragonName(
      EnhancedSocialSystem.generateRandomTribe(character.tribe)
    ),
    
    tribe: (character: Character) => EnhancedSocialSystem.generateRandomTribe(character.tribe),
    
    personality: () => [
      "curious and eager to learn", "cautious but friendly", "outgoing and confident", 
      "shy but thoughtful", "analytical and precise", "creative and imaginative",
      "protective and loyal", "adventurous and bold", "wise beyond their years"
    ][Math.floor(Math.random() * 9)],

    motivation: () => [
      "seem genuinely interested in getting to know you", "appear to need a study partner",
      "look like they could use a friend", "seem to share similar interests with you",
      "appear to admire your achievements", "look lonely and isolated"
    ][Math.floor(Math.random() * 6)],

    // Academic variables
    teacherName: () => [
      "Starlight", "Professor Wisdom", "Scholar Ancient", "Mentor Brightmind", 
      "Teacher Deepthought", "Professor Knowall"
    ][Math.floor(Math.random() * 6)],

    subject: () => [
      "advanced inter-tribal diplomacy", "ancient dragon history", "advanced magic theory",
      "strategic combat analysis", "cultural anthropology", "advanced prophecy interpretation"
    ][Math.floor(Math.random() * 6)],

    // Adventure variables
    location: () => [
      "the ancient ruins beyond the mountains", "a mysterious cave system",
      "the abandoned observatory", "the hidden valley", "the crystal caves"
    ][Math.floor(Math.random() * 5)],

    discovery: () => [
      "ancient artifacts", "rare crystals", "historical scrolls", "magical phenomena",
      "undiscovered species", "hidden chambers"
    ][Math.floor(Math.random() * 6)],

    danger: () => [
      "unstable terrain", "dangerous wildlife", "unpredictable weather", 
      "getting lost", "ancient traps", "toxic gases"
    ][Math.floor(Math.random() * 6)],

    // Nature variables  
    creature: () => [
      "injured scavenger", "lost dragonet", "wounded animal", "trapped bird",
      "distressed forest creature", "struggling sea life"
    ][Math.floor(Math.random() * 6)],

    environment: () => [
      "dense forest", "rocky mountainside", "peaceful meadow", "flowing river",
      "coastal shore", "desert oasis"
    ][Math.floor(Math.random() * 6)]
  };

  static generateScenario(character: Character, gameData: GameData): Scenario {
    // Filter out recently used scenarios
    const availableTemplates = this.SCENARIO_TEMPLATES.filter(template => {
      // Check requirements
      if (template.requirements && !template.requirements(character, gameData)) {
        return false;
      }
      
      // Avoid recent scenarios  
      if (this.lastUsedScenarios.has(template.id)) {
        return false;
      }

      return true;
    });

    // If we've used too many, clear some old ones
    if (this.lastUsedScenarios.size > this.maxRecentScenarios) {
      const oldestScenarios = Array.from(this.lastUsedScenarios).slice(0, 5);
      oldestScenarios.forEach(id => this.lastUsedScenarios.delete(id));
    }

    // Select template based on rarity weights
    const weightedTemplates = availableTemplates.flatMap(template => {
      let weight = 1;
      switch (template.rarity) {
        case 'legendary': weight = 1; break;
        case 'rare': weight = 2; break; 
        case 'uncommon': weight = 4; break;
        case 'common': weight = 8; break;
      }
      return Array(weight).fill(template);
    });

    if (weightedTemplates.length === 0) {
      // Fallback if no templates available
      this.lastUsedScenarios.clear();
      return this.generateScenario(character, gameData);
    }

    const selectedTemplate = weightedTemplates[Math.floor(Math.random() * weightedTemplates.length)];
    this.lastUsedScenarios.add(selectedTemplate.id);

    // Generate variables for this scenario
    const variables: Record<string, string> = {};
    selectedTemplate.variables.forEach(variable => {
      const generator = this.VARIABLE_GENERATORS[variable as keyof typeof this.VARIABLE_GENERATORS];
      if (generator) {
        variables[variable] = generator(character);
      } else {
        variables[variable] = `[${variable}]`; // Fallback
      }
    });

    // Replace variables in text
    let scenarioText = selectedTemplate.baseText;
    Object.entries(variables).forEach(([key, value]) => {
      scenarioText = scenarioText.replace(new RegExp(`{${key}}`, 'g'), value);
    });

    // Generate choices
    const choices = selectedTemplate.generateChoices(character, gameData, variables);

    return {
      id: `${selectedTemplate.id}_${Date.now()}`,
      type: selectedTemplate.type,
      text: scenarioText,
      choices,
      location: gameData.location || "jade_mountain_academy"
    };
  }

  static getScenarioStatistics(): {
    totalTemplates: number;
    recentlyUsed: number;
    availableForReuse: number;
    typeDistribution: Record<string, number>;
  } {
    const typeDistribution: Record<string, number> = {};
    this.SCENARIO_TEMPLATES.forEach(template => {
      typeDistribution[template.type] = (typeDistribution[template.type] || 0) + 1;
    });

    return {
      totalTemplates: this.SCENARIO_TEMPLATES.length,
      recentlyUsed: this.lastUsedScenarios.size,
      availableForReuse: this.SCENARIO_TEMPLATES.length - this.lastUsedScenarios.size,
      typeDistribution
    };
  }

  static resetScenarioHistory(): void {
    this.lastUsedScenarios.clear();
  }
}