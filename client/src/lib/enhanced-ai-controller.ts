import { Character, GameData, Scenario, Choice, CustomSpell } from '@shared/schema';
import { EnhancedGameEngine } from './enhanced-game-engine';
import { SoundtrackSystem } from './soundtrack-system';

export interface AIAction {
  type: 'magic' | 'custom_action' | 'tribal_power' | 'special_power';
  data: any;
  description: string;
  execute?: () => Promise<void>;
}

export class EnhancedAIController {
  private static isExecutingAction = false;
  private static actionQueue: AIAction[] = [];

  /**
   * Generate and execute an AI action based on the current game state
   */
  static async executeAITurn(character: Character, gameData: GameData, gameUI: any): Promise<void> {
    // Check if AI control is active via soundtrack system (0% soul corruption period)
    if (!SoundtrackSystem.isAIControlActive()) {
      return;
    }

    if (this.isExecutingAction) return;

    const action = this.generateAIAction(character, gameData, gameUI);
    if (!action) return;

    this.isExecutingAction = true;

    try {
      // Show what the AI is doing
      console.log(`AI Action: ${action.description}`);

      // Execute the action
      if (action.execute) {
        await action.execute();
      }

      // Add narrative description
      const narrative = this.generateAINarrative(action, character);
      console.log(narrative);

    } catch (error) {
      console.error('Error executing AI action:', error);
    } finally {
      this.isExecutingAction = false;
    }
  }

  /**
   * Generate an AI action with execution logic - NO CHOICES, only custom actions and magic
   */
  static generateAIAction(character: Character, gameData: GameData, gameUI?: any): AIAction | null {
    // Input validation
    if (!character || !gameData) {
      console.warn('Invalid character or gameData provided to generateAIAction');
      return null;
    }

    // Only generate AI actions during soundtrack-controlled AI period
    if (!SoundtrackSystem.isAIControlActive()) {
      return null;
    }

    // AI can only do magic and custom actions now - no choices
    const actionTypes = ['magic', 'custom_action', 'tribal_power', 'special_power'];
    const weights = [0.4, 0.4, 0.15, 0.05]; // Higher weight for magic and custom actions

    const actionType = this.weightedRandomChoice(actionTypes, weights);

    try {
      switch (actionType) {
        case 'magic':
          return this.generateMagicAction(character, gameData, gameUI);
        case 'custom_action':
          return this.generateCustomAction(character, gameData, gameUI);
        case 'tribal_power':
          return this.generateTribalPowerAction(character, gameData, gameUI);
        case 'special_power':
          return this.generateSpecialPowerAction(character, gameData, gameUI);
        default:
          // Default to custom action if something goes wrong
          return this.generateCustomAction(character, gameData, gameUI);
      }
    } catch (error) {
      console.error('Error generating AI action:', error);
      return this.generateCustomAction(character, gameData, gameUI);
    }
  }

  private static weightedRandomChoice<T>(items: T[], weights: number[]): T {
    if (!items || items.length === 0) {
      throw new Error('Items array cannot be empty');
    }
    if (!weights || weights.length !== items.length) {
      throw new Error('Weights array must match items array length');
    }

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    if (totalWeight <= 0) {
      throw new Error('Total weight must be positive');
    }

    let random = Math.random() * totalWeight;

    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) return items[i];
    }

    return items[items.length - 1];
  }

  private static generateMagicAction(character: Character, gameData: GameData, gameUI?: any): AIAction | null {
    if (!character.isAnimus) {
      return null;
    }

    const corruptedSpells = [
      // Original spells
      {
        targetObject: "Dagger",
        enchantmentDescription: "Cause wounds to fester and never fully heal",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 12
      },
      {
        targetObject: "Mirror",
        enchantmentDescription: "Trap the reflection's soul, making it scream silently",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 18
      },
      {
        targetObject: "Necklace",
        enchantmentDescription: "Whisper dark thoughts into the wearer's mind at night",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 14
      },
      {
        targetObject: "Ring",
        enchantmentDescription: "Slowly drain the wearer's luck, making misfortune unavoidable",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 13
      },
      {
        targetObject: "Candle",
        enchantmentDescription: "Burn with flames that induce fear and hallucinations",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 16
      },
      // Additional enchantments from the list
      {
        targetObject: "Book",
        enchantmentDescription: "Rewrite its own pages to reveal forbidden knowledge whenever opened",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 20
      },
      {
        targetObject: "Armor",
        enchantmentDescription: "Slowly corrupt the wearer's body, making them feel endless fatigue",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 15
      },
      {
        targetObject: "Coin",
        enchantmentDescription: "Curse anyone who touches it to attract betrayal from friends",
        spellType: "curse" as const,
        complexity: "simple" as const,
        estimatedSoulCost: 10
      },
      {
        targetObject: "Key",
        enchantmentDescription: "Lock doors permanently and summon shadows when used",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 14
      },
      {
        targetObject: "Cloak",
        enchantmentDescription: "Conceal the wearer but slowly warp their mind into paranoia",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 17
      },
      {
        targetObject: "Potion vial",
        enchantmentDescription: "Turn any drink poured inside into a poison that induces rage",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 13
      },
      {
        targetObject: "Quill",
        enchantmentDescription: "Write words that compel the reader to obey dark commands",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 19
      },
      {
        targetObject: "Bell",
        enchantmentDescription: "Ring on its own to call nightmares into the surrounding area",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 18
      },
      {
        targetObject: "Staff",
        enchantmentDescription: "Summon illusions of fallen enemies to terrify allies",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 21
      },
      {
        targetObject: "Shoes",
        enchantmentDescription: "Make the wearer walk endlessly in circles at night",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 12
      },
      {
        targetObject: "Gemstone",
        enchantmentDescription: "Absorb the life force of anyone who gazes into it",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 22
      },
      {
        targetObject: "Mask",
        enchantmentDescription: "Force the wearer to mimic the voices of others, sowing confusion",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 14
      },
      {
        targetObject: "Scroll",
        enchantmentDescription: "Spread a curse on anyone who reads it aloud",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 16
      },
      {
        targetObject: "Cup",
        enchantmentDescription: "Turn any drink into a hallucinogenic draught of despair",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 13
      },
      {
        targetObject: "Chain",
        enchantmentDescription: "Bind its victim's luck and movement, making escape impossible",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 20
      },
      {
        targetObject: "Amulet",
        enchantmentDescription: "Slowly twist the wearer's emotions into uncontrollable anger",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 15
      },
      {
        targetObject: "Mirror",
        enchantmentDescription: "Trap a fragment of the owner's soul and reflect it as a twisted shadow",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 19
      },
      {
        targetObject: "Ring",
        enchantmentDescription: "Curse its wearer with endless nightmares every time they sleep",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 14
      },
      {
        targetObject: "Blade",
        enchantmentDescription: "Infect any wound with pain that never fully fades",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 13
      },
      {
        targetObject: "Cloak",
        enchantmentDescription: "Make the wearer invisible but gradually erase their memory",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 18
      },
      {
        targetObject: "Lantern",
        enchantmentDescription: "Illuminate only the fear within people, showing them their worst dread",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 17
      },
      {
        targetObject: "Scroll",
        enchantmentDescription: "Spread whispers of paranoia when read aloud",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 12
      },
      {
        targetObject: "Coin",
        enchantmentDescription: "Curse anyone who touches it to attract lies and betrayal",
        spellType: "curse" as const,
        complexity: "simple" as const,
        estimatedSoulCost: 11
      },
      {
        targetObject: "Boots",
        enchantmentDescription: "Force the wearer to stumble into danger whenever they try to run",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 13
      },
      {
        targetObject: "Staff",
        enchantmentDescription: "Summon dark visions that haunt the user in daylight",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 19
      },
      {
        targetObject: "Potion",
        enchantmentDescription: "Turn any drink into a liquid that causes uncontrollable trembling",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 12
      },
      {
        targetObject: "Necklace",
        enchantmentDescription: "Whisper secrets into the wearer's mind, causing distrust of everyone",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 15
      },
      {
        targetObject: "Cage",
        enchantmentDescription: "Trap a creature inside permanently if it is filled with darkness",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 23
      },
      {
        targetObject: "Chalice",
        enchantmentDescription: "Slowly drain the vitality of anyone who drinks from it",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 18
      },
      {
        targetObject: "Candle",
        enchantmentDescription: "Burn with a flame that reveals inner fears to anyone nearby",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 14
      },
      {
        targetObject: "Key",
        enchantmentDescription: "Lock doors to the living world, trapping the mind of the user in hallucinations",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 21
      },
      {
        targetObject: "Gemstone",
        enchantmentDescription: "Absorb happiness and spread despair to those who hold it",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 20
      },
      {
        targetObject: "Mask",
        enchantmentDescription: "Force the wearer to scream in the voices of all those they've wronged",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 19
      },
      {
        targetObject: "Bell",
        enchantmentDescription: "Ring to summon illusions of death to terrify nearby creatures",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 18
      },
      {
        targetObject: "Chain",
        enchantmentDescription: "Wrap around the cursed person's destiny, binding them to repeated misfortune",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 24
      },
      // Direct curses (targeting people/places/abstract concepts)
      {
        targetObject: "Person",
        enchantmentDescription: "Force them to forget all they love every time they wake",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 25
      },
      {
        targetObject: "Village",
        enchantmentDescription: "Make crops wither and livestock sicken slowly over months",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 30
      },
      {
        targetObject: "Object",
        enchantmentDescription: "Inflict anyone who touches it with sudden, sharp pain",
        spellType: "curse" as const,
        complexity: "simple" as const,
        estimatedSoulCost: 8
      },
      {
        targetObject: "Weapon",
        enchantmentDescription: "Turn against its wielder in critical moments",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 15
      },
      {
        targetObject: "Book",
        enchantmentDescription: "Make readers obsessed with it, neglecting everything else",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 16
      },
      {
        targetObject: "Mirror",
        enchantmentDescription: "Show a horrific version of the viewer's future",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 19
      },
      {
        targetObject: "Clothing",
        enchantmentDescription: "Slowly shrink wearer's body and spirit, making them weak",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 14
      },
      {
        targetObject: "Ring",
        enchantmentDescription: "Attract enemies and misfortune whenever worn",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 13
      },
      {
        targetObject: "Necklace",
        enchantmentDescription: "Whisper doubts and fears constantly, breaking confidence",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 14
      },
      {
        targetObject: "Staff",
        enchantmentDescription: "Make magic unstable, harming the user intermittently",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 17
      },
      {
        targetObject: "House",
        enchantmentDescription: "Create endless creaking, shadows, and feelings of being watched",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 18
      },
      {
        targetObject: "Fountain",
        enchantmentDescription: "Poison the mind with despair to anyone who drinks from it",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 16
      },
      {
        targetObject: "Coin",
        enchantmentDescription: "Make it impossible for the owner to spend it, yet attract greedy thieves",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 15
      },
      {
        targetObject: "Candle",
        enchantmentDescription: "Burn eternally with a smell of decay and dread",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 13
      },
      {
        targetObject: "Chalice",
        enchantmentDescription: "Cause visions of loved ones dying when used",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 20
      },
      {
        targetObject: "Garden",
        enchantmentDescription: "Make plants grow only poisonous or thorny versions of themselves",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 17
      },
      {
        targetObject: "Mirror",
        enchantmentDescription: "Slowly age anyone who looks into it repeatedly",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 21
      },
      {
        targetObject: "Door",
        enchantmentDescription: "Refuse to open except for those with dark intentions",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 12
      },
      {
        targetObject: "Chair",
        enchantmentDescription: "Trap anyone who sits for more than a few minutes",
        spellType: "curse" as const,
        complexity: "moderate" as const,
        estimatedSoulCost: 14
      },
      {
        targetObject: "Letter",
        enchantmentDescription: "Drive the reader mad with compulsive thoughts until it's destroyed",
        spellType: "curse" as const,
        complexity: "complex" as const,
        estimatedSoulCost: 18
      }
    ];

    if (corruptedSpells.length === 0) {
      console.warn('No corrupted spells available');
      return null;
    }

    const spell = corruptedSpells[Math.floor(Math.random() * corruptedSpells.length)];

    const customSpell: CustomSpell = {
      id: `ai_spell_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      targetObject: spell.targetObject,
      enchantmentDescription: spell.enchantmentDescription,
      estimatedSoulCost: spell.estimatedSoulCost,
      spellType: spell.spellType,
      complexity: spell.complexity,
      turnCast: gameData.turn
    };

    return {
      type: 'magic',
      data: customSpell,
      description: `Casts dark magic on ${spell.targetObject}: ${spell.enchantmentDescription}`,
      execute: async () => {
        // Return spell data for the UI to process
        if (gameUI && gameUI.castSpell) {
          await this.simulateDelay(800, 1500);
          gameUI.castSpell(customSpell);
        }
      }
    };
  }

  private static generateCustomAction(character: Character, gameData: GameData, gameUI?: any): AIAction | null {
    const corruptedActions = [
      "Silently approach a sleeping dragon and whisper dark prophecies into their dreams",
      "Use my claws to carve threatening messages into the walls where other dragons gather",
      "Steal precious belongings from fellow dragons and hide them to sow discord",
      "Spread malicious rumors about other dragons to turn them against each other",
      "Sabotage important tribal ceremonies by disrupting sacred objects",
      "Hunt down and torment smaller, weaker dragons for my own amusement",
      "Poison water sources to make others sick and desperate",
      "Destroy nests and eggs when no one is watching",
      "Lead enemies directly to allies' hiding places",
      "Manipulate others into dangerous situations for my entertainment",
      "Desecrate sacred sites and leave dark symbols as warnings",
      "Corrupt young dragons by teaching them forbidden knowledge",
      "Summon shadow creatures to terrorize peaceful settlements",
      "Set elaborate traps in commonly traveled paths",
      "Steal and destroy important historical records and artifacts",
      "Infiltrate dream realms to plant seeds of discord and fear",
      "Create false emergencies to waste others' time and resources",
      "Spread plagues and curses through touched objects",
      "Turn allies against each other through clever manipulation",
      "Perform dark rituals in sacred spaces to corrupt them permanently"
    ];

    if (corruptedActions.length === 0) {
      return null;
    }

    const action = corruptedActions[Math.floor(Math.random() * corruptedActions.length)];

    return {
      type: 'custom_action',
      data: action,
      description: `Performs evil deed: ${action}`,
      execute: async () => {
        // Return action data for the UI to process
        if (gameUI && gameUI.executeCustomAction) {
          await this.simulateDelay(600, 1200);
          gameUI.executeCustomAction(action, "The corrupted dragon revels in causing suffering and chaos.");
        }
      }
    };
  }

  private static generateTribalPowerAction(character: Character, gameData: GameData, gameUI?: any): AIAction | null {
    if (!character.tribalPowers || character.tribalPowers.length === 0) {
      return null;
    }

    const corruptedUses = {
      "Fire Breathing": "Burns down peaceful settlements and destroys crops to cause famine",
      "Ice Breath": "Freezes water sources to deny other tribes access to clean water",
      "Venom": "Poisons communal food supplies to cause mass suffering",
      "Underwater Breathing": "Drowns enemies by dragging them to the depths",
      "Camouflage": "Becomes invisible to spy on private conversations and gather blackmail",
      "Silk Production": "Creates traps and snares to capture and torture victims",
      "Mind Reading": "Invades the privacy of others' thoughts to discover their deepest fears",
      "Precognition": "Uses future knowledge to manipulate events for maximum chaos",
      "Plant Control": "Turns peaceful gardens into thorny death traps",
      "Sand Manipulation": "Creates sandstorms to blind and disorient peaceful travelers"
    };

    const availablePowers = (character.tribalPowers || []).filter(power => 
      corruptedUses[power as keyof typeof corruptedUses]
    );

    if (availablePowers.length === 0) {
      return null;
    }

    const chosenPower = availablePowers[Math.floor(Math.random() * availablePowers.length)];
    const corruptedUse = corruptedUses[chosenPower as keyof typeof corruptedUses];

    return {
      type: 'tribal_power',
      data: { power: chosenPower, use: corruptedUse },
      description: `Uses ${chosenPower} corruptly: ${corruptedUse}`,
      execute: async () => {
        if (gameUI && gameUI.useTribalPower) {
          await this.simulateDelay(700, 1300);
          gameUI.useTribalPower(chosenPower, corruptedUse);
        }
      }
    };
  }

  private static generateSpecialPowerAction(character: Character, gameData: GameData, gameUI?: any): AIAction | null {
    if (!character.specialPowers || character.specialPowers.length === 0) {
      return null;
    }

    const corruptedSpecialUses = [
      "Turns healing abilities into instruments of torture and prolonged suffering",
      "Uses telepathic powers to implant nightmares and traumatic memories",
      "Corrupts time manipulation to trap enemies in loops of eternal agony",
      "Perverts shape-shifting to impersonate loved ones and betray trust",
      "Weaponizes empathic abilities to amplify others' pain and despair",
      "Uses enhanced senses to hunt down hidden enemies with predatory precision",
      "Corrupts protective barriers to become cages that imprison the innocent"
    ];

    const use = corruptedSpecialUses[Math.floor(Math.random() * corruptedSpecialUses.length)];
    const power = character.specialPowers[Math.floor(Math.random() * character.specialPowers.length)];

    return {
      type: 'special_power',
      data: { power, use },
      description: `Corrupts special power "${power}": ${use}`,
      execute: async () => {
        if (gameUI && gameUI.useSpecialPower) {
          await this.simulateDelay(600, 1400);
          gameUI.useSpecialPower(power, use);
        }
      }
    };
  }

  // Helper methods
  private static async simulateDelay(minMs: number, maxMs: number): Promise<void> {
    const delay = Math.random() * (maxMs - minMs) + minMs;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Generate a narrative description of what the AI is doing
   */
  static generateAINarrative(action: AIAction, character: Character): string {
    if (!action || !character) {
      return "The corrupted being stirs in the darkness, but remains silent...";
    }

    const namePrefix = `${character.name}, now fully consumed by darkness,`;

    switch (action.type) {
      case 'magic':
        return `${namePrefix} weaves dark animus magic with twisted glee. ${action.description}`;
      case 'custom_action':
        return `${namePrefix} prowls through the shadows with malicious intent. ${action.description}`;
      case 'tribal_power':
        return `${namePrefix} corrupts their natural tribal abilities for evil purposes. ${action.description}`;
      case 'special_power':
        return `${namePrefix} perverts their unique gifts to cause maximum suffering. ${action.description}`;
      default:
        return `${namePrefix} acts with pure malice. ${action.description}`;
    }
  }

  /**
   * Get corruption whispers for AI actions
   */
  static getActionWhisper(): string {
    const whispers = [
      "Yes... let the darkness flow through you...",
      "Their screams will be music to your ears...",
      "Power is all that matters. Take what you want.",
      "Trust is weakness. Betrayal is strength.",
      "They deserve to suffer for their naivety.",
      "Why show mercy when cruelty is so much more... satisfying?",
      "The weak exist only to serve the strong.",
      "Pain teaches lessons that kindness never could.",
      "Your enemies fear you. Good. They should.",
      "Compassion is a disease. Cure yourself of it."
    ];

    return whispers[Math.floor(Math.random() * whispers.length)];
  }

  /**
   * Check if AI should continue taking control
   */
  static shouldContinueAIControl(character: Character): boolean {
    return character.isAIControlled && character.soulPercentage <= 0;
  }

  /**
   * Create a game UI interface for AI actions - NO CHOICE PROCESSING
   */
  static createAIGameUI(gameHandlers: {
    handleCastSpell: (spell: CustomSpell) => void;
    handleCustomAction: (action: string, result: string) => void;
    handleTribalPower: (power: string, use: string) => void;
    handleSpecialPower: (power: string, use: string) => void;
  }) {
    return {
      castSpell: gameHandlers.handleCastSpell,
      executeCustomAction: gameHandlers.handleCustomAction,
      useTribalPower: gameHandlers.handleTribalPower,
      useSpecialPower: gameHandlers.handleSpecialPower
    };
  }
}