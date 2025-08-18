import { Character, GameData, InventoryItem, Scenario, Choice } from "@shared/schema";
import { generateEnhancedScenario } from "./enhanced-scenario-system";
import { generateScenario } from "./scenario-generator-final";

type ActionType = 'social' | 'magical' | 'combat' | 'item_usage' | 'exploration' | 'stealth' | 'diplomatic';

interface ItemUsageContext {
  triggersEnchantment: boolean;
  enchantmentComplexity: 'simple' | 'moderate' | 'complex';
  expectedEffect: string;
  itemRelevant: boolean;
}

interface ActionAnalysis {
  actionType: ActionType;
  magicalNature: boolean;
  destructive: boolean;
  complexity: 'simple' | 'moderate' | 'complex';
  consumesItem: boolean;
  itemContext?: ItemUsageContext;
  rawAction: string;
}

export interface ProcessedCustomAction {
  actionResult: string;
  nextScenario: Scenario;
  consequences: string[];
  itemConsumed?: boolean;
  soulCost: number;
  sanityCost: number;
  achievementUnlocked?: string;
}

export class IntelligentActionProcessor {
  
  static processCustomAction(
    action: string,
    character: Character,
    gameData: GameData,
    selectedItem?: InventoryItem
  ): ProcessedCustomAction {
    
    // Analyze the action to understand intent
    const actionAnalysis = this.analyzeAction(action, selectedItem);
    
    // Generate contextual result based on action analysis
    const actionResult = this.generateContextualResult(actionAnalysis, character, gameData, selectedItem);
    
    // Determine consequences based on action type and character state
    const consequences = this.determineConsequences(actionAnalysis, character, selectedItem);
    
    // Calculate costs based on action complexity and magical nature
    const costs = this.calculateActionCosts(actionAnalysis, character, selectedItem);
    
    // Generate next scenario that continues the story based on what happened
    const nextScenario = this.generateFollowUpScenario(actionAnalysis, actionResult, character, gameData);
    
    // Check for achievements
    const achievement = this.checkForAchievements(actionAnalysis, character);
    
    return {
      actionResult,
      nextScenario,
      consequences,
      itemConsumed: actionAnalysis.consumesItem,
      soulCost: costs.soulCost,
      sanityCost: costs.sanityCost,
      achievementUnlocked: achievement
    };
  }

  private static analyzeAction(action: string, item?: InventoryItem): ActionAnalysis {
    const lowerAction = action.toLowerCase();
    
    // Detect action type based on keywords and context
    let actionType: ActionType = 'social';
    let magicalNature = false;
    let destructive = false;
    let consumesItem = false;
    let complexity: 'simple' | 'moderate' | 'complex' = 'simple';
    
    // Magic-related keywords
    if (this.containsKeywords(lowerAction, ['enchant', 'spell', 'magic', 'animus', 'curse', 'bewitch'])) {
      actionType = 'magical';
      magicalNature = true;
      complexity = 'moderate';
    }
    
    // Combat/violence keywords
    else if (this.containsKeywords(lowerAction, ['attack', 'fight', 'kill', 'destroy', 'battle', 'strike', 'claw', 'bite'])) {
      actionType = 'combat';
      destructive = true;
    }
    
    // Item usage keywords
    else if (this.containsKeywords(lowerAction, ['use', 'activate', 'break', 'smash', 'trigger', 'open', 'read']) && item) {
      actionType = 'item_usage';
      if (this.containsKeywords(lowerAction, ['break', 'smash', 'destroy', 'shatter'])) {
        destructive = true;
        consumesItem = true;
      }
    }
    
    // Exploration keywords
    else if (this.containsKeywords(lowerAction, ['explore', 'search', 'investigate', 'look', 'examine', 'scout'])) {
      actionType = 'exploration';
    }
    
    // Stealth keywords
    else if (this.containsKeywords(lowerAction, ['sneak', 'hide', 'camouflage', 'invisible', 'stealth'])) {
      actionType = 'stealth';
    }
    
    // Diplomatic keywords
    else if (this.containsKeywords(lowerAction, ['talk', 'speak', 'negotiate', 'convince', 'persuade', 'ask', 'tell'])) {
      actionType = 'diplomatic';
    }
    
    // Check for catastrophic actions
    if (this.containsKeywords(lowerAction, ['plague', 'apocalypse', 'genocide', 'destroy world', 'kill everyone', 'end all life'])) {
      complexity = 'complex';
      destructive = true;
      magicalNature = true;
    }
    
    // Analyze item context if present
    let itemContext: ItemUsageContext | undefined;
    if (item) {
      itemContext = this.analyzeItemUsage(action, item);
      if (itemContext.triggersEnchantment) {
        magicalNature = true;
        complexity = itemContext.enchantmentComplexity;
      }
    }
    
    return {
      actionType,
      magicalNature,
      destructive,
      complexity,
      consumesItem,
      itemContext,
      rawAction: action
    };
  }
  
  private static analyzeItemUsage(action: string, item: InventoryItem): ItemUsageContext {
    const lowerAction = action.toLowerCase();
    const itemName = item.name.toLowerCase();
    const enchantments = item.enchantments.map(e => e.toLowerCase());
    
    // Check if action would trigger enchantments
    let triggersEnchantment = false;
    let enchantmentComplexity: 'simple' | 'moderate' | 'complex' = 'simple';
    let expectedEffect = '';
    
    // Look for breaking/activation keywords that would trigger enchanted effects
    if (this.containsKeywords(lowerAction, ['break', 'activate', 'use', 'trigger', 'smash', 'shatter']) && enchantments.length > 0) {
      triggersEnchantment = true;
      
      // Analyze enchantment for complexity and effects
      for (const enchantment of enchantments) {
        if (this.containsKeywords(enchantment, ['plague', 'death', 'kill', 'destroy', 'apocalypse'])) {
          enchantmentComplexity = 'complex';
          expectedEffect = `The ${item.name} unleashes its dark enchantment: ${enchantment}`;
        } else if (this.containsKeywords(enchantment, ['curse', 'harm', 'poison', 'pain'])) {
          enchantmentComplexity = 'moderate';
          expectedEffect = `The ${item.name} activates its harmful magic: ${enchantment}`;
        } else {
          expectedEffect = `The ${item.name} triggers its enchantment: ${enchantment}`;
        }
      }
    }
    
    return {
      triggersEnchantment,
      enchantmentComplexity,
      expectedEffect,
      itemRelevant: lowerAction.includes(itemName) || this.containsKeywords(lowerAction, ['use', 'with'])
    };
  }
  
  private static generateContextualResult(
    analysis: ActionAnalysis,
    character: Character,
    gameData: GameData,
    item?: InventoryItem
  ): string {
    // Enhanced contextual responses that work for ALL scenario types
    const location = gameData?.location || 'unknown location';
    const characterName = character?.name || 'the dragon';
    const rawAction = analysis.rawAction;
    
    // Get current scenario context if available
    const currentScenario = gameData?.currentScenario;
    const scenarioType = currentScenario?.type || 'normal';
    
    // Generate result based on action type with comprehensive responses
    let baseResult: string;
    
    // If using an enchanted item with specific effects
    if (analysis.itemContext?.triggersEnchantment && item) {
      return this.generateEnchantedItemResult(analysis, character, gameData, item);
    }
    
    // Generate result based on action type with enhanced scenario awareness
    switch (analysis.actionType) {
      case 'magical':
        baseResult = this.generateMagicalResult(analysis, character, gameData);
        break;
      
      case 'combat':
        baseResult = this.generateCombatResult(analysis, character, gameData);
        break;
      
      case 'item_usage':
        baseResult = this.generateItemUsageResult(analysis, character, gameData, item);
        break;
      
      case 'exploration':
        baseResult = this.generateExplorationResult(analysis, character, gameData);
        break;
      
      case 'stealth':
        baseResult = this.generateStealthResult(analysis, character, gameData);
        break;
      
      case 'diplomatic':
        baseResult = this.generateDiplomaticResult(analysis, character, gameData);
        break;
      
      default:
        baseResult = this.generateSocialResult(analysis, character, gameData);
        break;
    }
    
    // Add scenario-specific context to ALL action results
    return this.addScenarioContextToResult(baseResult, scenarioType, currentScenario, analysis, character);
  }
  
  private static generateEnchantedItemResult(
    analysis: ActionAnalysis,
    character: Character,
    gameData: GameData,
    item: InventoryItem
  ): string {
    
    const enchantmentEffect = analysis.itemContext!.expectedEffect;
    
    // Handle catastrophic enchantments (like plague sticks)
    if (analysis.complexity === 'complex' && this.containsKeywords(enchantmentEffect.toLowerCase(), ['plague', 'death', 'kill'])) {
      return `You ${analysis.rawAction.toLowerCase()}. ${enchantmentEffect}
      
The moment the ${item.name} breaks, a sickly green mist erupts from the fragments. The ancient curse contained within spreads rapidly across the land.

Within hours, reports flood in from across Pyrrhia - dragons are falling ill with a mysterious plague. The symptoms are unlike anything seen before: scales turning black, breathing becoming labored, and an unnatural weakness spreading through entire tribes.

You realize with horror that your action has unleashed devastation upon the world. The plague spreads faster than wildfire, claiming roughly half the population of each tribe before scholars and healers can even begin to understand it.

The guilt weighs heavily on your soul as you watch the consequences of your choice unfold. Entire families are torn apart, kingdoms fall into chaos, and the balance of power across both continents shifts dramatically.

What have you done?`;
    }
    
    // Handle moderate enchantments
    if (analysis.complexity === 'moderate') {
      return `You ${analysis.rawAction.toLowerCase()}. ${enchantmentEffect}
      
The magical energies stored within the ${item.name} burst forth as intended. The enchantment activates with a shimmer of otherworldly light.

${this.generateMagicalConsequenceNarrative(character, gameData, 'moderate')}`;
    }
    
    // Handle simple enchantments
    return `You ${analysis.rawAction.toLowerCase()}. ${enchantmentEffect}
    
The ${item.name} glows briefly as its magic activates. ${this.generateMagicalConsequenceNarrative(character, gameData, 'simple')}`;
  }
  
  private static generateMagicalResult(analysis: ActionAnalysis, character: Character, gameData: GameData): string {
    if (!character.isAnimus) {
      return `You attempt to ${analysis.rawAction.toLowerCase()}, but you lack animus magic. Your efforts produce no magical effect, though your determination is noted by those around you.`;
    }
    
    const corruption = character.soulCorruptionStage;
    const magicalPower = this.getMagicalPowerLevel(character);
    
    if (analysis.complexity === 'complex') {
      return `You channel your animus magic to ${analysis.rawAction.toLowerCase()}. 
      
The immense power flows through you, but such magic comes at a terrible cost. You feel a significant piece of your soul tear away as the spell takes effect.

${this.generateMagicalConsequenceNarrative(character, gameData, 'complex')}

Other dragons nearby sense the disturbance in magical energies. Your power level has not gone unnoticed.`;
    }
    
    return `You use your animus magic to ${analysis.rawAction.toLowerCase()}. The magic flows through you with ${corruption === 'Normal' ? 'pure energy' : 'dark, twisted power'}.

${this.generateMagicalConsequenceNarrative(character, gameData, analysis.complexity)}`;
  }
  
  private static generateCombatResult(analysis: ActionAnalysis, character: Character, gameData: GameData): string {
    const tribalPowers = character.tribalPowers.join(', ');
    
    return `You ${analysis.rawAction.toLowerCase()}!

Using your ${character.tribe} abilities${tribalPowers ? ` (${tribalPowers})` : ''}, you engage in combat. Your ${character.strength >= 15 ? 'powerful' : character.strength >= 10 ? 'adequate' : 'limited'} physical capabilities serve you ${character.strength >= 15 ? 'well' : character.strength >= 10 ? 'adequately' : 'poorly'}.

${this.generateCombatOutcome(character, gameData, analysis.destructive)}`;
  }
  
  private static generateItemUsageResult(analysis: ActionAnalysis, character: Character, gameData: GameData, item?: InventoryItem): string {
    if (!item) {
      return `You attempt to ${analysis.rawAction.toLowerCase()}, but you don't have the necessary item to complete this action.`;
    }
    
    if (analysis.consumesItem) {
      return `You ${analysis.rawAction.toLowerCase()}.

The ${item.name} ${this.containsKeywords(analysis.rawAction.toLowerCase(), ['break', 'smash', 'shatter']) ? 'breaks apart' : 'is consumed'} in the process. ${item.description}

${this.generateItemUsageConsequence(item, character, gameData)}`;
    }
    
    return `You ${analysis.rawAction.toLowerCase()}.

The ${item.name} proves useful for your task. ${item.description}

${this.generateItemUsageConsequence(item, character, gameData)}`;
  }
  
  private static generateExplorationResult(analysis: ActionAnalysis, character: Character, gameData: GameData): string {
    const location = gameData.location;
    const discoveries = [
      "a hidden passage behind ancient tapestries",
      "mysterious scratches on the wall that might be a code",
      "a loose stone that conceals a small chamber",
      "old scrolls tucked away in forgotten corners",
      "evidence of someone else having been here recently"
    ];
    
    const discovery = discoveries[Math.floor(Math.random() * discoveries.length)];
    
    return `You ${analysis.rawAction.toLowerCase()} in ${location}.

Your careful investigation reveals ${discovery}. Your ${character.intelligence >= 15 ? 'keen intellect' : 'observational skills'} help you notice details others might miss.

${this.generateExplorationConsequence(discovery, character, gameData)}`;
  }
  
  private static generateStealthResult(analysis: ActionAnalysis, character: Character, gameData: GameData): string {
    const hasStealthPowers = (character.tribalPowers || []).includes('Color-changing scales') || 
                           (character.tribalPowers || []).includes('Night camouflage');
    
    if (hasStealthPowers) {
      return `You ${analysis.rawAction.toLowerCase()}.

Your natural ${character.tribe} stealth abilities make you nearly invisible. Moving like a shadow, you successfully avoid detection.

${this.generateStealthConsequence(true, character, gameData)}`;
    }
    
    const stealthSuccess = character.intelligence >= 12;
    return `You attempt to ${analysis.rawAction.toLowerCase()}.

${stealthSuccess ? 
  'Your careful movements and timing allow you to remain undetected.' : 
  'Despite your best efforts, you make too much noise and risk being discovered.'}

${this.generateStealthConsequence(stealthSuccess, character, gameData)}`;
  }
  
  private static generateDiplomaticResult(analysis: ActionAnalysis, character: Character, gameData: GameData): string {
    const charisma = character.charisma;
    const tribe = character.tribe;
    
    return `You ${analysis.rawAction.toLowerCase()}.

Your ${charisma >= 15 ? 'compelling words and natural charm' : charisma >= 10 ? 'earnest approach' : 'awkward but sincere attempt'} ${charisma >= 10 ? 'resonates with' : 'fails to fully convince'} your audience.

As a ${tribe} dragon, your tribal background ${this.getDiplomaticAdvantage(tribe)} in this conversation.

${this.generateDiplomaticConsequence(charisma >= 10, character, gameData)}`;
  }
  
  private static generateSocialResult(analysis: ActionAnalysis, character: Character, gameData: GameData): string {
    return `You ${analysis.rawAction.toLowerCase()}.

Your action draws various reactions from those around you. Some dragons ${character.charisma >= 12 ? 'seem impressed by your initiative' : 'watch with curiosity'}.

${this.generateSocialConsequence(character, gameData)}`;
  }
  
  // Add scenario-specific context to make custom actions more immersive
  private static addScenarioContextToResult(
    baseResult: string,
    scenarioType: string,
    currentScenario: any,
    analysis: ActionAnalysis,
    character: Character
  ): string {
    const scenarioSpecificAdditions = {
      'magical': `\n\nThe magical energies in the air seem to respond to your action, creating ripples of power that extend beyond what you intended.`,
      'prophetic': `\n\nYour action triggers a brief flash of prophetic insight - you glimpse potential futures branching from this moment.`,
      'tribal': `\n\nOther dragons of your tribe take notice of your actions, their reactions varying based on tribal customs and your standing among them.`,
      'political': `\n\nYour choice here could have far-reaching political implications for the relationships between tribes.`,
      'romantic': `\n\nThe romantic tension in the air shifts as your actions change the dynamics of the relationships around you.`,
      'learning': `\n\nThis experience teaches you something new about yourself and the world around you, adding to your growing wisdom.`,
      'combat': `\n\nThe sounds of battle echo around you as your actions influence the tide of conflict.`,
      'mystery': `\n\nYour action reveals new clues about the mysteries surrounding this place, but also raises additional questions.`
    };
    
    // Add scenario-specific context if available
    const additionalContext = scenarioSpecificAdditions[scenarioType as keyof typeof scenarioSpecificAdditions] || 
      `\n\nThe consequences of your action ripple outward, affecting the world around you in ways both seen and unseen.`;
    
    // Add Wings of Fire lore context based on character's situation
    let loreContext = '';
    if (character.isAnimus && analysis.magicalNature) {
      loreContext = `\n\nAs an animus dragon, you feel the familiar yet dangerous pull of unlimited power. Every use of magic leaves its mark on your soul.`;
    } else if ((character.tribalPowers || []).includes('Mind Reading') && scenarioType === 'social') {
      loreContext = `\n\nYour mind reading abilities pick up the emotional responses of those around you, giving you insight into their true feelings about your actions.`;
    }
    
    return baseResult + additionalContext + loreContext;
  }

  private static generateFollowUpScenario(
    analysis: ActionAnalysis,
    actionResult: string,
    character: Character,
    gameData: GameData
  ): Scenario {
    
    // Create a scenario that directly follows from the action taken
    let scenarioType: 'mundane' | 'extraordinary' | 'magical' | 'tribal' | 'prophetic' = 'mundane';
    
    if (analysis.magicalNature || analysis.complexity === 'complex') {
      scenarioType = 'magical';
    } else if (analysis.destructive) {
      scenarioType = 'extraordinary';
    }
    
    // Generate continuation based on what happened
    if (analysis.itemContext?.triggersEnchantment && analysis.complexity === 'complex') {
      return this.generatePlagueAftermath(character, gameData);
    }
    
    // Generate appropriate follow-up scenario
    const baseScenario = generateScenario(character, gameData);
    
    // Modify the scenario to reflect the action's consequences
    return {
      ...baseScenario,
      id: `followup_${analysis.actionType}_${Date.now()}`,
      title: this.generateFollowUpTitle(analysis),
      description: this.generateFollowUpDescription(analysis),
      narrativeText: this.generateFollowUpNarrative(analysis, actionResult, character, gameData),
      type: scenarioType
    };
  }
  
  private static generatePlagueAftermath(character: Character, gameData: GameData): Scenario {
    return {
      id: `plague_aftermath_${Date.now()}`,
      title: "The Plague's Toll",
      description: "Deal with the consequences of unleashing a magical plague",
      narrativeText: [
        "Days have passed since the plague began spreading. The death toll mounts hourly.",
        "Desperate dragons seek you out, some begging for a cure, others demanding justice.",
        "Queens and kings send envoys, their messages ranging from pleas for help to threats of retribution.",
        "You stand at the center of a catastrophe that will reshape the world forever."
      ],
      choices: [
        {
          id: "attempt_cure",
          text: "Try to create a magical cure",
          description: "Risk: Massive soul loss • Potential redemption",
          soulCost: 25,
          sanityCost: 30,
          consequences: ["attempted_redemption", "massive_magic_use"],
          requirements: [`character.isAnimus`]
        },
        {
          id: "flee_consequences",
          text: "Flee to a distant land",
          description: "Escape punishment but live with guilt",
          soulCost: 0,
          sanityCost: 40,
          consequences: ["exile", "eternal_guilt"],
        },
        {
          id: "face_judgment",
          text: "Face the judgment of the tribes",
          description: "Accept responsibility for your actions",
          soulCost: 0,
          sanityCost: 20,
          consequences: ["accountability", "trial_by_tribes"],
        },
        {
          id: "embrace_chaos",
          text: "Revel in the destruction you've caused",
          description: "Embrace your role as a force of chaos",
          soulCost: 15,
          sanityCost: 0,
          consequences: ["full_corruption", "villain_path"],
          corruption: true
        }
      ],
      type: "magical",
      location: gameData.location,
      timeOfDay: "Crisis Time",
      weather: "Ominous darkness"
    };
  }
  
  // Helper methods for narrative generation
  private static containsKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }
  
  private static getMagicalPowerLevel(character: Character): string {
    if (character.soulPercentage >= 80) return "pure and strong";
    if (character.soulPercentage >= 50) return "moderately corrupted";
    if (character.soulPercentage >= 20) return "heavily tainted";
    return "dark and twisted";
  }
  
  private static generateMagicalConsequenceNarrative(character: Character, gameData: GameData, complexity: string): string {
    const corruption = character.soulCorruptionStage;
    
    if (complexity === 'complex') {
      return "The magical energies spiral beyond your control, affecting far more than intended. Reality itself seems to bend around your spell.";
    }
    if (complexity === 'moderate') {
      return `The spell succeeds, but you feel the familiar ache of soul loss. ${corruption !== 'Normal' ? 'The darkness within whispers approvingly.' : ''}`;
    }
    return "The magic flows smoothly, accomplishing your goal with minimal strain.";
  }
  
  private static generateCombatOutcome(character: Character, gameData: GameData, destructive: boolean): string {
    const success = character.strength >= 12;
    if (destructive && success) {
      return "Your attack proves devastatingly effective. Your opponent is seriously injured.";
    }
    if (success) {
      return "You emerge victorious from the confrontation, having proven your combat prowess.";
    }
    return "The fight doesn't go as planned. You struggle against your opponent's superior skill.";
  }
  
  private static generateItemUsageConsequence(item: InventoryItem, character: Character, gameData: GameData): string {
    if (item.type === 'magical_artifact') {
      return "The artifact's magic resonates with the ambient magical energies around you.";
    }
    if (item.type === 'enchanted_object') {
      return "The enchanted item fulfills its intended purpose, though you sense its power has changed you somehow.";
    }
    return "The item serves its purpose well, proving its value in this situation.";
  }
  
  private static generateExplorationConsequence(discovery: string, character: Character, gameData: GameData): string {
    return `This discovery could prove significant. Your exploration skills have served you well, and you make note of what you've found for future reference.`;
  }
  
  private static generateStealthConsequence(success: boolean, character: Character, gameData: GameData): string {
    if (success) {
      return "Your stealth pays off, allowing you to observe or move without interference. You've gained valuable information or position.";
    }
    return "Your attempt at stealth partially fails, but you manage to avoid the worst consequences through quick thinking.";
  }
  
  private static getDiplomaticAdvantage(tribe: string): string {
    const advantages: Record<string, string> = {
      'NightWing': 'adds an air of mystery and intelligence',
      'SeaWing': 'lends credibility through your tribe\'s diplomatic reputation',
      'SkyWing': 'commands respect through your tribe\'s martial tradition',
      'RainWing': 'brings a calming, peaceful energy',
      'SandWing': 'provides sharp wit and cunning insight',
      'IceWing': 'commands attention through regal bearing',
      'MudWing': 'offers grounded, practical wisdom'
    };
    return advantages[tribe] || 'influences the conversation in subtle ways';
  }
  
  private static generateDiplomaticConsequence(success: boolean, character: Character, gameData: GameData): string {
    if (success) {
      return "Your diplomatic approach opens new possibilities and strengthens relationships with those involved.";
    }
    return "While not entirely successful, your diplomatic attempt prevents the situation from escalating into conflict.";
  }
  
  private static generateSocialConsequence(character: Character, gameData: GameData): string {
    return "Your social interaction has subtle effects on your relationships and standing within the community.";
  }
  
  private static generateFollowUpTitle(analysis: ActionAnalysis): string {
    if (analysis.complexity === 'complex') return "Dealing with the Aftermath";
    if (analysis.destructive) return "Consequences of Violence";
    if (analysis.magicalNature) return "Magical Repercussions";
    return "What Happens Next";
  }
  
  private static generateFollowUpDescription(analysis: ActionAnalysis): string {
    return `The results of your action to ${analysis.rawAction.toLowerCase()} create new challenges and opportunities.`;
  }
  
  private static generateFollowUpNarrative(analysis: ActionAnalysis, actionResult: string, character: Character, gameData: GameData): string[] {
    return [
      "Time passes after your recent action.",
      "The consequences begin to unfold in ways you hadn't fully anticipated.",
      "New challenges arise that demand your attention and decision-making."
    ];
  }
  
  private static determineConsequences(analysis: ActionAnalysis, character: Character, item?: InventoryItem): string[] {
    const consequences: string[] = [];
    
    if (analysis.magicalNature) consequences.push('magical_action_taken');
    if (analysis.destructive) consequences.push('destructive_behavior');
    if (analysis.consumesItem && item) consequences.push(`item_consumed_${item.id}`);
    if (analysis.complexity === 'complex') consequences.push('major_action_consequences');
    
    return consequences;
  }
  
  private static calculateActionCosts(analysis: ActionAnalysis, character: Character, item?: InventoryItem): { soulCost: number; sanityCost: number } {
    let soulCost = 0;
    let sanityCost = 0;
    
    if (analysis.magicalNature && character.isAnimus) {
      switch (analysis.complexity) {
        case 'simple': soulCost = Math.floor(Math.random() * 3) + 1; break;
        case 'moderate': soulCost = Math.floor(Math.random() * 8) + 3; break;
        case 'complex': soulCost = Math.floor(Math.random() * 20) + 15; break;
      }
    }
    
    if (analysis.destructive) {
      sanityCost = Math.floor(Math.random() * 15) + 5;
    }
    
    // Item-triggered effects have their own costs
    if (analysis.itemContext?.triggersEnchantment && item?.soulCostToCreate) {
      soulCost += Math.floor(item.soulCostToCreate * 0.3); // Partial cost for activation
    }
    
    return { soulCost, sanityCost };
  }
  
  private static checkForAchievements(analysis: ActionAnalysis, character: Character): string | undefined {
    if (analysis.complexity === 'complex' && analysis.magicalNature) {
      return "World Shaper - Performed magic with global consequences";
    }
    if (analysis.actionType === 'magical' && character.soulPercentage < 10) {
      return "Dark Magician - Used magic while heavily corrupted";
    }
    return undefined;
  }
}

// Supporting interfaces
interface ActionAnalysis {
  actionType: ActionType;
  magicalNature: boolean;
  destructive: boolean;
  complexity: 'simple' | 'moderate' | 'complex';
  consumesItem: boolean;
  itemContext?: ItemUsageContext;
  rawAction: string;
}

interface ItemUsageContext {
  triggersEnchantment: boolean;
  enchantmentComplexity: 'simple' | 'moderate' | 'complex';
  expectedEffect: string;
  itemRelevant: boolean;
}

// ActionType already defined at the top of file