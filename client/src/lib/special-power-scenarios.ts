import { Character, GameData, Scenario, Choice } from "@shared/schema";

export interface SpecialPowerScenario {
  id: string;
  type: 'mindreading' | 'prophecy';
  title: string;
  prompt: string;
  options: SpecialPowerOption[];
  requirements: (character: Character) => boolean;
}

export interface SpecialPowerOption {
  id: string;
  text: string;
  outcome: string;
  soulCost: number;
  sanityCost: number;
  consequences: string[];
  corruption: boolean;
}

export const MINDREADING_SCENARIOS: SpecialPowerScenario[] = [
  {
    id: "mindreading_amplified_battle",
    type: "mindreading",
    title: "Amplified Battle Thoughts",
    prompt: "In the middle of a fierce battle, your mindreading suddenly amplifies beyond your control. You can hear the thoughts of every dragon within miles - allies screaming in pain, enemies plotting kills, the dying calling for loved ones.",
    requirements: (c) => c.tribalPowers.some(p => p.toLowerCase().includes('mind')) || c.specialPowers.some(p => p.toLowerCase().includes('mind')),
    options: [
      {
        id: "push_through",
        text: "Try to push through and use the information to save lives",
        outcome: "You guide your forces to victory and save many lives, but the mental strain leaves you unable to sleep for weeks.",
        soulCost: 0,
        sanityCost: 15,
        consequences: ["Saved many allies in battle", "Gained tactical advantage", "Suffer severe insomnia"],
        corruption: false
      },
      {
        id: "retreat_battle",
        text: "Retreat from battle to protect your sanity",
        outcome: "You avoid mental damage but your allies suffer heavy casualties. Some call you a coward.",
        soulCost: 0,
        sanityCost: 5,
        consequences: ["Avoided mental strain", "Allies suffered casualties", "Reputation damaged"],
        corruption: false
      },
      {
        id: "shut_down_powers",
        text: "Attempt to shut down your mind reading entirely",
        outcome: "You succeed but permanently lose your powers. You must learn to live as an ordinary dragon.",
        soulCost: 0,
        sanityCost: 8,
        consequences: ["Lost mind reading powers permanently", "Must adapt to life without telepathy", "Mental peace restored"],
        corruption: false
      }
    ]
  },
  {
    id: "sibling_secret_reading",
    type: "mindreading", 
    title: "Sibling's Mental Betrayal",
    prompt: "You discover that your own sibling has been secretly reading your mind for years, learning all your secrets, fears, and plans. They've used this knowledge to always stay one step ahead of you in everything.",
    requirements: (c) => c.tribalPowers.some(p => p.toLowerCase().includes('mind')) || c.specialPowers.some(p => p.toLowerCase().includes('mind')),
    options: [
      {
        id: "confront_angrily",
        text: "Confront them angrily about the violation of trust",
        outcome: "They break down and reveal they were trying to protect you from threats you never knew existed.",
        soulCost: 0,
        sanityCost: 3,
        consequences: ["Learned of hidden threats", "Sibling was protecting you", "Trust partially restored"],
        corruption: false
      },
      {
        id: "feed_false_thoughts",
        text: "Start feeding them false thoughts to confuse them",
        outcome: "Your deception works, but the mental effort of constantly lying to yourself begins to fracture your personality.",
        soulCost: 2,
        sanityCost: 10,
        consequences: ["Successfully deceived sibling", "Personality began fracturing", "Mental strain increased"],
        corruption: true
      },
      {
        id: "read_their_secrets",
        text: "Pretend you don't know and try to learn their secrets in return",
        outcome: "You discover they're involved in a dangerous conspiracy, but they realize you're reading them and vanish.",
        soulCost: 1,
        sanityCost: 4,
        consequences: ["Learned of dangerous conspiracy", "Sibling disappeared", "Lost family connection"],
        corruption: false
      }
    ]
  },
  {
    id: "locked_mind_request",
    type: "mindreading",
    title: "The Locked Mind",
    prompt: "A dragon approaches you claiming their mind has been 'locked' by an animus spell. They desperately want you to try reading their thoughts to break the enchantment, but you sense something malevolent trapped inside.",
    requirements: (c) => c.tribalPowers.some(p => p.toLowerCase().includes('mind')) || c.specialPowers.some(p => p.toLowerCase().includes('mind')),
    options: [
      {
        id: "break_mental_lock",
        text: "Attempt to break the mental lock despite the danger",
        outcome: "You free them but release an ancient evil consciousness that begins possessing nearby dragons.",
        soulCost: 5,
        sanityCost: 8,
        consequences: ["Freed the dragon", "Released ancient evil", "Evil began possessing others"],
        corruption: true
      },
      {
        id: "refuse_help",
        text: "Refuse to help, fearing what might be unleashed",
        outcome: "The dragon begs and pleads, eventually dying in agony as the lock slowly crushes their mind.",
        soulCost: 2,
        sanityCost: 12,
        consequences: ["Dragon died in agony", "Haunted by their pleas", "Avoided unleashing evil"],
        corruption: false
      },
      {
        id: "read_carefully",
        text: "Try to read around the edges of the lock carefully",
        outcome: "You partially free their memories but become mentally linked to whatever dark entity is trapped inside.",
        soulCost: 3,
        sanityCost: 6,
        consequences: ["Partially freed their mind", "Mentally linked to dark entity", "Constant dark whispers"],
        corruption: true
      }
    ]
  },
  {
    id: "diplomatic_assassination_plot",
    type: "mindreading",
    title: "Diplomatic Assassination",
    prompt: "During a peaceful diplomatic meeting, you read the minds of the visiting delegates and realize they're all planning to assassinate your Queen during the feast tonight. However, one of them is having second thoughts about the plan.",
    requirements: (c) => c.tribalPowers.some(p => p.toLowerCase().includes('mind')) || c.specialPowers.some(p => p.toLowerCase().includes('mind')),
    options: [
      {
        id: "alert_guards",
        text: "Alert the guards and have all the delegates arrested immediately",
        outcome: "The assassination is prevented, but the sudden arrest ruins diplomatic relations and starts a war.",
        soulCost: 0,
        sanityCost: 2,
        consequences: ["Prevented assassination", "Diplomatic relations ruined", "War started"],
        corruption: false
      },
      {
        id: "turn_hesitant_ally",
        text: "Try to secretly turn the hesitant assassin into an ally",
        outcome: "They agree to help you, but during the battle their former allies kill them, leaving you to face the others alone.",
        soulCost: 1,
        sanityCost: 4,
        consequences: ["Gained temporary ally", "Ally was killed by conspirators", "Must face remaining assassins alone"],
        corruption: false
      },
      {
        id: "public_confrontation",
        text: "Confront all of them publicly during the feast",
        outcome: "The shock of being exposed causes them to panic and attack immediately, turning the feast into a bloodbath.",
        soulCost: 0,
        sanityCost: 8,
        consequences: ["Exposed the plot publicly", "Feast became violent battle", "Many innocents injured"],
        corruption: false
      }
    ]
  },
  {
    id: "dragonet_uncontrolled_powers",
    type: "mindreading",
    title: "The Mind-Reading Dragonet",
    prompt: "You accidentally read the mind of a dragonet and discover they have incredibly powerful but uncontrolled mind reading abilities. They're reading everyone's thoughts constantly and are slowly going insane from the mental noise.",
    requirements: (c) => c.tribalPowers.some(p => p.toLowerCase().includes('mind')) || c.specialPowers.some(p => p.toLowerCase().includes('mind')),
    options: [
      {
        id: "teach_control",
        text: "Try to teach them to control their powers like you learned to",
        outcome: "Your training helps, but other dragons become suspicious of why you're spending so much time with the 'weird' dragonet.",
        soulCost: 0,
        sanityCost: 3,
        consequences: ["Helped dragonet control powers", "Others became suspicious", "Gained young student"],
        corruption: false
      },
      {
        id: "suppress_powers",
        text: "Find an animus to suppress their abilities permanently",
        outcome: "The suppression works, but the dragonet becomes bitter and resentful, feeling you stole part of their identity.",
        soulCost: 1,
        sanityCost: 1,
        consequences: ["Powers suppressed permanently", "Dragonet became resentful", "Prevented mental breakdown"],
        corruption: false
      },
      {
        id: "isolate_dragonet",
        text: "Take them away from populated areas to somewhere quiet",
        outcome: "The isolation helps their sanity, but you're both cut off from dragon society and slowly become outcasts.",
        soulCost: 0,
        sanityCost: 4,
        consequences: ["Dragonet's sanity improved", "Both became social outcasts", "Cut off from dragon society"],
        corruption: false
      }
    ]
  }
];

export const PROPHECY_SCENARIOS: SpecialPowerScenario[] = [
  {
    id: "three_moons_prophecy",
    type: "prophecy",
    title: "The Child of Two Tribes",
    prompt: "A dying NightWing seer gasps out a prophecy: 'When the three moons align, the child of two tribes will either save the world or destroy it completely.' The next alignment is in three days, and you just discovered your best friend is half SkyWing, half SeaWing.",
    requirements: (c) => c.tribalPowers.some(p => p.toLowerCase().includes('prophecy')) || c.specialPowers.some(p => p.toLowerCase().includes('prophecy') || p.toLowerCase().includes('foresight')),
    options: [
      {
        id: "tell_friend_prepare",
        text: "Tell your friend about the prophecy and help them prepare to be the savior",
        outcome: "The pressure drives your friend to make reckless decisions, accidentally fulfilling the 'destruction' part of the prophecy.",
        soulCost: 2,
        sanityCost: 8,
        consequences: ["Friend made reckless decisions", "Prophecy fulfilled destructively", "World damaged by your actions"],
        corruption: false
      },
      {
        id: "keep_secret",
        text: "Keep the prophecy secret to protect your friend from that burden",
        outcome: "Your friend faces the prophesied moment unprepared and fails to save anyone, leading to catastrophe.",
        soulCost: 1,
        sanityCost: 12,
        consequences: ["Friend faced moment unprepared", "Failed to prevent catastrophe", "Guilt over secrecy"],
        corruption: false
      },
      {
        id: "prevent_participation",
        text: "Try to prevent your friend from being anywhere near the moon alignment",
        outcome: "Your interference actually causes the events that put your friend in the position to either save or destroy the world.",
        soulCost: 0,
        sanityCost: 6,
        consequences: ["Interference backfired", "Caused the prophesied situation", "Friend thrust into destiny"],
        corruption: false
      }
    ]
  },
  {
    id: "betrayal_prophecy_scroll",
    type: "prophecy",
    title: "The Winter Betrayal",
    prompt: "You find an ancient scroll that reads: 'The reader of these words will betray their greatest love before the winter ends.' Winter is just beginning, and you're deeply in love with another dragon.",
    requirements: (c) => c.tribalPowers.some(p => p.toLowerCase().includes('prophecy')) || c.specialPowers.some(p => p.toLowerCase().includes('prophecy') || p.toLowerCase().includes('foresight')),
    options: [
      {
        id: "tell_love_prophecy",
        text: "Tell your love about the prophecy and ask them to help you fight fate",
        outcome: "Your honesty strengthens your bond, but the prophecy twists - you 'betray' them by sacrificing yourself to save them.",
        soulCost: 8,
        sanityCost: 0,
        consequences: ["Bond with love strengthened", "Self-sacrifice fulfilled prophecy", "Saved loved one's life"],
        corruption: false
      },
      {
        id: "break_up_preemptively",
        text: "Break up with them immediately to prevent betraying them",
        outcome: "Your breakup devastates them, and they die of heartbreak before winter ends, making your abandonment the ultimate betrayal.",
        soulCost: 3,
        sanityCost: 15,
        consequences: ["Loved one died of heartbreak", "Abandonment was the betrayal", "Prophecy fulfilled through avoidance"],
        corruption: false
      },
      {
        id: "ignore_prophecy",
        text: "Ignore the prophecy and act normally",
        outcome: "The prophecy fulfills itself when circumstances force you to choose between your love and saving hundreds of other dragons.",
        soulCost: 1,
        sanityCost: 10,
        consequences: ["Forced into impossible choice", "Had to choose between love and many lives", "Prophecy fulfilled inevitably"],
        corruption: false
      }
    ]
  },
  {
    id: "circle_breaking_prophecy",
    type: "prophecy",
    title: "Breaking the Circle",
    prompt: "You receive a vision that shows you standing in a circle of seven stones. A voice whispers: 'Break the circle and break the world, complete the circle and complete the curse.' You find these exact stones the next day.",
    requirements: (c) => c.tribalPowers.some(p => p.toLowerCase().includes('prophecy')) || c.specialPowers.some(p => p.toLowerCase().includes('prophecy') || p.toLowerCase().includes('foresight')),
    options: [
      {
        id: "break_stone_circle",
        text: "Break one of the stones to prevent completing the circle",
        outcome: "The broken stone releases an ancient curse that begins turning dragons to stone across the continent.",
        soulCost: 5,
        sanityCost: 12,
        consequences: ["Released ancient curse", "Dragons turning to stone", "Continent-wide disaster"],
        corruption: true
      },
      {
        id: "complete_circle",
        text: "Stand in the center and complete the circle",
        outcome: "You become trapped as the seventh stone, but your sacrifice prevents a curse that would have killed thousands.",
        soulCost: 15,
        sanityCost: 0,
        consequences: ["Became trapped as stone", "Prevented massive curse", "Sacrificed self for thousands"],
        corruption: false
      },
      {
        id: "find_alternate_meaning",
        text: "Try to find another interpretation - maybe 'breaking the circle' means something else",
        outcome: "You realize it means breaking a cycle of revenge in your family, which you do by forgiving an ancient enemy.",
        soulCost: 0,
        sanityCost: 2,
        consequences: ["Broke cycle of family revenge", "Forgave ancient enemy", "Found peaceful solution"],
        corruption: false
      }
    ]
  },
  {
    id: "trust_enemy_prophecy",
    type: "prophecy",
    title: "Trust and Doubt",
    prompt: "A prophecy scroll burns itself after you read: 'Trust the enemy, doubt the friend, or watch both become dust in the end.' The next day, your worst enemy offers to help you, while your best friend seems to be acting suspiciously.",
    requirements: (c) => c.tribalPowers.some(p => p.toLowerCase().includes('prophecy')) || c.specialPowers.some(p => p.toLowerCase().includes('prophecy') || p.toLowerCase().includes('foresight')),
    options: [
      {
        id: "trust_enemy_offer",
        text: "Trust your enemy's offer of help despite your instincts",
        outcome: "Your enemy genuinely wants to make amends, and together you expose your friend's plan to betray you both.",
        soulCost: 0,
        sanityCost: 4,
        consequences: ["Enemy genuinely sought redemption", "Exposed friend's betrayal", "Unlikely alliance formed"],
        corruption: false
      },
      {
        id: "doubt_friend",
        text: "Doubt your friend and investigate their suspicious behavior",
        outcome: "Your suspicion destroys your friendship, but you discover they were planning a surprise party, making you the villain.",
        soulCost: 1,
        sanityCost: 8,
        consequences: ["Friendship destroyed by suspicion", "Friend was planning surprise", "Became the villain"],
        corruption: false
      },
      {
        id: "ignore_prophecy_advice",
        text: "Ignore the prophecy and treat both dragons as you normally would",
        outcome: "Both dragons die in a conflict you could have prevented by following the prophecy's guidance.",
        soulCost: 0,
        sanityCost: 15,
        consequences: ["Both dragons died in conflict", "Could have prevented deaths", "Ignored prophetic guidance"],
        corruption: false
      }
    ]
  },
  {
    id: "keeper_of_secrets",
    type: "prophecy",
    title: "The Keeper's Burden",
    prompt: "A dying dragon whispers a prophecy: 'The keeper of secrets will speak three truths that doom their tribe, but silence will doom the world.' You realize you know three terrible truths that could destroy your tribe if revealed.",
    requirements: (c) => c.tribalPowers.some(p => p.toLowerCase().includes('prophecy')) || c.specialPowers.some(p => p.toLowerCase().includes('prophecy') || p.toLowerCase().includes('foresight')),
    options: [
      {
        id: "reveal_three_truths",
        text: "Reveal all three truths to save the world, even if it dooms your tribe",
        outcome: "Your tribe is destroyed but the world is saved, making you a hero to some and a traitor to others.",
        soulCost: 10,
        sanityCost: 20,
        consequences: ["Tribe destroyed by revelations", "World saved from catastrophe", "Became hero and traitor"],
        corruption: false
      },
      {
        id: "stay_silent",
        text: "Stay silent to protect your tribe, even if it dooms the world",
        outcome: "Your tribe survives temporarily, but the world-ending catastrophe eventually destroys them too.",
        soulCost: 5,
        sanityCost: 25,
        consequences: ["Tribe survived temporarily", "World-ending catastrophe occurred", "Everyone died eventually"],
        corruption: true
      },
      {
        id: "gradual_revelation",
        text: "Try to find a way to reveal the truths gradually to minimize damage",
        outcome: "Your partial revelations cause confusion and panic, making both outcomes worse than if you'd chosen one path.",
        soulCost: 3,
        sanityCost: 15,
        consequences: ["Caused confusion and panic", "Made both outcomes worse", "Half-measures failed"],
        corruption: false
      }
    ]
  }
];

export class SpecialPowerScenarioSystem {
  static getApplicableScenarios(character: Character, type: 'mindreading' | 'prophecy'): SpecialPowerScenario[] {
    const scenarios = type === 'mindreading' ? MINDREADING_SCENARIOS : PROPHECY_SCENARIOS;
    const applicable = scenarios.filter(scenario => scenario.requirements(character));
    console.log(`Found ${applicable.length} applicable ${type} scenarios for character with powers: ${character.tribalPowers.join(', ')} / ${character.specialPowers.join(', ')}`);
    return applicable;
  }
  
  static getRandomScenario(character: Character, type: 'mindreading' | 'prophecy'): SpecialPowerScenario | null {
    const applicable = this.getApplicableScenarios(character, type);
    if (applicable.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * applicable.length);
    return applicable[randomIndex];
  }
  
  static processSpecialPowerChoice(
    scenario: SpecialPowerScenario,
    optionId: string,
    character: Character,
    gameData: GameData
  ): {
    newCharacter: Character;
    newGameData: GameData;
    outcome: string;
    consequences: string[];
  } {
    const option = scenario.options.find(opt => opt.id === optionId);
    if (!option) {
      throw new Error(`Invalid option ${optionId} for scenario ${scenario.id}`);
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
    
    // Advance turn and update game state
    newGameData.turn += 1;
    
    // Add to history
    newGameData.history.push({
      turn: gameData.turn,
      scenario: scenario.id,
      choice: optionId,
      consequences: option.consequences,
      soulLoss: option.soulCost,
      sanityLoss: option.sanityCost
    });
    
    return {
      newCharacter,
      newGameData,
      outcome: option.outcome,
      consequences: option.consequences
    };
  }
}