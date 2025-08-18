import { Character, Choice, Scenario } from "@shared/schema";

export interface AttributeGain {
  strength?: number;
  charisma?: number;
  wisdom?: number;
  intelligence?: number;
  reason: string;
}

export class AttributeProgressionSystem {
  private static readonly ATTRIBUTE_CAPS = {
    strength: 20,
    charisma: 20,
    wisdom: 20,
    intelligence: 20
  };

  static processAttributeGains(character: Character, choice: Choice, scenario: Scenario): AttributeGain | null {
    const gains: AttributeGain = { reason: "" };
    let hasGains = false;

    // Strength gains from combat, physical challenges, training
    if (this.isStrengthChoice(choice, scenario)) {
      const gain = Math.floor(Math.random() * 2) + 1; // 1-2 points
      if (character.strength < this.ATTRIBUTE_CAPS.strength) {
        gains.strength = Math.min(gain, this.ATTRIBUTE_CAPS.strength - character.strength);
        gains.reason = this.getStrengthGainReason(choice);
        hasGains = true;
      }
    }

    // Charisma gains from social interactions, leadership, diplomacy
    if (this.isCharismaChoice(choice, scenario)) {
      const gain = Math.floor(Math.random() * 2) + 1; // 1-2 points
      if (character.charisma < this.ATTRIBUTE_CAPS.charisma) {
        gains.charisma = Math.min(gain, this.ATTRIBUTE_CAPS.charisma - character.charisma);
        gains.reason = this.getCharismaGainReason(choice);
        hasGains = true;
      }
    }

    // Wisdom gains from moral choices, life experience, difficult decisions
    if (this.isWisdomChoice(choice, scenario)) {
      const gain = Math.floor(Math.random() * 2) + 1; // 1-2 points
      if (character.wisdom < this.ATTRIBUTE_CAPS.wisdom) {
        gains.wisdom = Math.min(gain, this.ATTRIBUTE_CAPS.wisdom - character.wisdom);
        gains.reason = this.getWisdomGainReason(choice);
        hasGains = true;
      }
    }

    // Intelligence gains from studying, solving puzzles, learning
    if (this.isIntelligenceChoice(choice, scenario)) {
      const gain = Math.floor(Math.random() * 2) + 1; // 1-2 points
      if (character.intelligence < this.ATTRIBUTE_CAPS.intelligence) {
        gains.intelligence = Math.min(gain, this.ATTRIBUTE_CAPS.intelligence - character.intelligence);
        gains.reason = this.getIntelligenceGainReason(choice);
        hasGains = true;
      }
    }

    return hasGains ? gains : null;
  }

  private static isStrengthChoice(choice: Choice, scenario: Scenario): boolean {
    const text = (choice.text || '').toLowerCase() + ' ' + (choice.description || '').toLowerCase();
    const strengthKeywords = [
      'fight', 'combat', 'battle', 'train', 'physical', 'strength', 'muscle', 
      'workout', 'exercise', 'lift', 'carry', 'push', 'climb', 'swim'
    ];
    
    return strengthKeywords.some(keyword => text.includes(keyword)) || 
           scenario.type === 'extraordinary' && text.includes('force');
  }

  private static isCharismaChoice(choice: Choice, scenario: Scenario): boolean {
    const text = (choice.text || '').toLowerCase() + ' ' + (choice.description || '').toLowerCase();
    const charismaKeywords = [
      'persuade', 'convince', 'negotiate', 'diplomacy', 'leadership', 'inspire',
      'charm', 'social', 'friend', 'alliance', 'speak', 'conversation', 'debate'
    ];
    
    return charismaKeywords.some(keyword => text.includes(keyword)) ||
           choice.relationshipChange > 0;
  }

  private static isWisdomChoice(choice: Choice, scenario: Scenario): boolean {
    const text = (choice.text || '').toLowerCase() + ' ' + (choice.description || '').toLowerCase();
    const wisdomKeywords = [
      'wise', 'careful', 'consider', 'think', 'moral', 'ethical', 'right',
      'wrong', 'justice', 'mercy', 'patience', 'experience', 'learn from'
    ];
    
    return wisdomKeywords.some(keyword => text.includes(keyword)) ||
           (choice.sanityCost > 5 && !choice.corruption) ||
           choice.soulCost < 0; // Soul restoration choices
  }

  private static isIntelligenceChoice(choice: Choice, scenario: Scenario): boolean {
    const text = (choice.text || '').toLowerCase() + ' ' + (choice.description || '').toLowerCase();
    const intelligenceKeywords = [
      'study', 'learn', 'research', 'analyze', 'solve', 'puzzle', 'knowledge',
      'understand', 'figure out', 'investigate', 'examine', 'explore', 'discover'
    ];
    
    return intelligenceKeywords.some(keyword => text.includes(keyword)) ||
           scenario.type === 'mundane' && text.includes('academic');
  }

  private static getStrengthGainReason(choice: Choice): string {
    const reasons = [
      "Your muscles grew stronger from the physical challenge",
      "Combat training has improved your physical prowess",
      "The exertion has built your stamina and power",
      "Your body adapted to the physical demands",
      "Regular training is paying off with increased strength"
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  private static getCharismaGainReason(choice: Choice): string {
    const reasons = [
      "Your social skills improved through interaction",
      "You learned how to better connect with others",
      "Your confidence in social situations has grown",
      "Leadership experience has enhanced your presence",
      "You've become more persuasive and engaging"
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  private static getWisdomGainReason(choice: Choice): string {
    const reasons = [
      "This experience taught you valuable life lessons",
      "You gained insight from this difficult decision",
      "Your understanding of right and wrong has deepened",
      "Moral reflection has made you wiser",
      "Life experience has broadened your perspective"
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  private static getIntelligenceGainReason(choice: Choice): string {
    const reasons = [
      "Your studies have expanded your knowledge",
      "Problem-solving has sharpened your mind",
      "Research and learning have made you smarter",
      "Academic pursuit has increased your intelligence",
      "Your curiosity led to greater understanding"
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  static applyAttributeGains(character: Character, gains: AttributeGain): void {
    if (gains.strength) {
      character.strength = Math.min(character.strength + gains.strength, this.ATTRIBUTE_CAPS.strength);
    }
    if (gains.charisma) {
      character.charisma = Math.min(character.charisma + gains.charisma, this.ATTRIBUTE_CAPS.charisma);
    }
    if (gains.wisdom) {
      character.wisdom = Math.min(character.wisdom + gains.wisdom, this.ATTRIBUTE_CAPS.wisdom);
    }
    if (gains.intelligence) {
      character.intelligence = Math.min(character.intelligence + gains.intelligence, this.ATTRIBUTE_CAPS.intelligence);
    }
  }

  static getAttributeGainMessage(gains: AttributeGain): string {
    const parts = [];
    
    if (gains.strength) {
      parts.push(`+${gains.strength} Strength`);
    }
    if (gains.charisma) {
      parts.push(`+${gains.charisma} Charisma`);
    }
    if (gains.wisdom) {
      parts.push(`+${gains.wisdom} Wisdom`);
    }
    if (gains.intelligence) {
      parts.push(`+${gains.intelligence} Intelligence`);
    }

    if (parts.length === 0) return "";
    
    return `${parts.join(', ')} - ${gains.reason}`;
  }
}