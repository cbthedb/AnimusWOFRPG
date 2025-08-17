import { InventoryItem, Character, GameData } from "@shared/schema";

export class InventorySystem {
  /**
   * Adds an item to the player's inventory
   */
  static addItem(gameData: GameData, item: InventoryItem): GameData {
    // Check if item already exists and is stackable
    const existingItemIndex = gameData.inventory.findIndex(
      (invItem) => invItem.name === item.name && invItem.type === item.type
    );

    if (existingItemIndex >= 0 && item.type !== "enchanted_object") {
      // For non-enchanted items, just update the existing one
      return gameData;
    } else {
      // Add new item to inventory
      return {
        ...gameData,
        inventory: [...gameData.inventory, { ...item, id: `${item.name}_${Date.now()}` }]
      };
    }
  }

  /**
   * Removes an item from the player's inventory
   */
  static removeItem(gameData: GameData, itemId: string): GameData {
    return {
      ...gameData,
      inventory: gameData.inventory.filter(item => item.id !== itemId)
    };
  }

  /**
   * Gives an item to an NPC and advances story if applicable
   */
  static giveItemToNPC(
    character: Character, 
    gameData: GameData, 
    itemId: string, 
    npcName: string
  ): { character: Character; gameData: GameData; storyAdvanced: boolean; result: string } {
    const item = gameData.inventory.find(inv => inv.id === itemId);
    
    if (!item) {
      return {
        character,
        gameData,
        storyAdvanced: false,
        result: "Item not found in inventory."
      };
    }

    if (item.canGiveAway === false) {
      return {
        character,
        gameData,
        storyAdvanced: false,
        result: "This item cannot be given away."
      };
    }

    // Remove item from inventory
    const newGameData = this.removeItem(gameData, itemId);
    let newCharacter = { ...character };
    let storyAdvanced = false;
    let result = `You gave ${item.name} to ${npcName}.`;

    // Check if this was a quest item
    if (item.questItem && item.questItem.toLowerCase().includes(npcName.toLowerCase())) {
      storyAdvanced = true;
      
      // Special rewards for completing quests
      if (item.enchantments.some(e => e.toLowerCase().includes("immortal"))) {
        newCharacter.soulPercentage = Math.min(100, newCharacter.soulPercentage + 10);
        result += ` ${npcName} is overjoyed and grants you a powerful blessing that restores your soul!`;
      } else if (item.enchantments.some(e => e.toLowerCase().includes("heal"))) {
        newCharacter.sanityPercentage = Math.min(100, newCharacter.sanityPercentage + 15);
        result += ` ${npcName} feels much better and shares ancient wisdom that clears your mind!`;
      } else if (item.enchantments.some(e => e.toLowerCase().includes("power"))) {
        result += ` ${npcName} becomes incredibly powerful and swears a life debt to you!`;
      } else {
        result += ` ${npcName} is extremely grateful and your reputation grows!`;
        // Note: reputation will be handled by game data in future updates
      }

      // Add relationship improvement
      if (newCharacter.relationships[npcName]) {
        newCharacter.relationships[npcName].strength = Math.min(100, 
          newCharacter.relationships[npcName].strength + 30
        );
      } else {
        newCharacter.relationships[npcName] = {
          name: npcName,
          type: "friend",
          strength: 60,
          history: [`Received ${item.name} as a gift`],
          isAlive: true
        };
      }
    }

    return {
      character: newCharacter,
      gameData: newGameData,
      storyAdvanced,
      result
    };
  }

  /**
   * Generates common collectible items for scenarios
   */
  static generateCollectibleItem(location: string, scenario: string): InventoryItem {
    const items: InventoryItem[] = [
      {
        id: `scroll_${Date.now()}`,
        name: "Blank Scroll",
        description: "A pristine scroll perfect for enchanting with animus magic.",
        type: "scroll",
        enchantments: [],
        isActive: false,
        canGiveAway: true,
        rarity: "common"
      },
      {
        id: `gem_${Date.now()}`,
        name: "Dragon Gem",
        description: "A valuable gemstone that could be enchanted or traded.",
        type: "treasure",
        enchantments: [],
        isActive: false,
        canGiveAway: true,
        rarity: "uncommon"
      },
      {
        id: `crystal_${Date.now()}`,
        name: "Memory Crystal",
        description: "A crystal that can store memories and experiences.",
        type: "magical_artifact",
        enchantments: [],
        isActive: false,
        canGiveAway: true,
        rarity: "rare"
      },
      {
        id: `feather_${Date.now()}`,
        name: "Phoenix Feather",
        description: "A rare feather with healing properties.",
        type: "magical_artifact",
        enchantments: ["healing_aura"],
        isActive: true,
        canGiveAway: true,
        rarity: "legendary"
      }
    ];

    // Return a random item based on rarity
    const rand = Math.random();
    if (rand < 0.5) return items[0]; // Common
    if (rand < 0.8) return items[1]; // Uncommon  
    if (rand < 0.95) return items[2]; // Rare
    return items[3]; // Legendary
  }

  /**
   * Checks if player has required item for a choice
   */
  static hasRequiredItem(gameData: GameData, requiredItemId: string): boolean {
    return gameData.inventory.some(item => 
      item.id === requiredItemId || 
      item.name.toLowerCase().includes(requiredItemId.toLowerCase()) ||
      item.type === requiredItemId
    );
  }

  /**
   * Gets items that can be given to NPCs
   */
  static getGiveableItems(gameData: GameData): InventoryItem[] {
    // Default to true if canGiveAway is undefined (most items can be given)
    return gameData.inventory.filter(item => item.canGiveAway !== false);
  }
}