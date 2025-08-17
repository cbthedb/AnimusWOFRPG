import { InventoryItem, Character, GameData, Choice } from "@shared/schema";

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

  /**
   * Gets inventory-specific choices for scenarios
   */
  static getInventoryChoices(gameData: GameData, character: Character, scenarioType: string): Choice[] {
    const choices: Choice[] = [];
    const inventory = gameData.inventory;

    // Scroll-related choices
    const scrolls = inventory.filter(item => item.type === "scroll" || item.name.toLowerCase().includes("scroll"));
    if (scrolls.length > 0) {
      choices.push({
        id: "hide_scroll_mundane",
        text: "Hide your scroll carefully",
        description: "Use stealth and cunning to conceal the scroll",
        soulCost: 0,
        sanityCost: 2,
        consequences: ["You carefully conceal the scroll using your natural stealth..."],
        requiresItem: "scroll"
      });

      if (character.isAnimus) {
        choices.push({
          id: "hide_scroll_animus",
          text: "Use animus magic to hide your scroll",
          description: "Make the scroll invisible with magical power",
          soulCost: 5,
          sanityCost: 0,
          consequences: ["Your animus magic wraps around the scroll, rendering it completely invisible..."],
          corruption: true,
          requiresModal: "animus",
          requiresItem: "scroll"
        });
      }
    }

    // Gem/treasure-related choices
    const treasures = inventory.filter(item => item.type === "treasure" || item.type === "magical_artifact");
    if (treasures.length > 0) {
      choices.push({
        id: "offer_treasure",
        text: "Offer valuable treasure",
        description: "Use your wealth to solve the problem",
        soulCost: 0,
        sanityCost: 0,
        consequences: ["You present your valuable treasure as an offering..."],
        requiresItem: "treasure"
      });

      if (character.isAnimus) {
        choices.push({
          id: "enhance_treasure_animus",
          text: "Enhance treasure with magic",
          description: "Make your treasure more valuable with animus power",
          soulCost: 8,
          sanityCost: 0,
          consequences: ["You channel animus magic into your treasure, making it far more powerful..."],
          corruption: true,
          requiresModal: "animus",
          requiresItem: "treasure"
        });
      }
    }

    // Weapon-related choices
    const weapons = inventory.filter(item => item.type === "weapon");
    if (weapons.length > 0) {
      choices.push({
        id: "brandish_weapon",
        text: "Brandish your weapon threateningly",
        description: "Use intimidation to resolve the situation",
        soulCost: 0,
        sanityCost: 3,
        consequences: ["You draw your weapon, its presence changing the dynamic immediately..."],
        requiresItem: "weapon"
      });

      if (character.isAnimus) {
        choices.push({
          id: "empower_weapon_animus",
          text: "Empower weapon with animus magic",
          description: "Make your weapon supernaturally deadly",
          soulCost: 12,
          sanityCost: 0,
          consequences: ["Dark power flows into your weapon, making it crackle with deadly energy..."],
          corruption: true,
          requiresModal: "animus",
          requiresItem: "weapon"
        });
      }
    }

    // Tool-related choices
    const tools = inventory.filter(item => item.type === "tool");
    if (tools.length > 0) {
      choices.push({
        id: "use_tool_creative",
        text: "Use your tools creatively",
        description: "Apply your equipment in an unexpected way",
        soulCost: 0,
        sanityCost: 1,
        consequences: ["You apply your tools in a clever and unexpected manner..."],
        requiresItem: "tool"
      });
    }

    // Enchanted object choices
    const enchantedObjects = inventory.filter(item => item.type === "enchanted_object" && item.isActive);
    if (enchantedObjects.length > 0) {
      choices.push({
        id: "activate_enchanted_object",
        text: "Activate your enchanted object",
        description: "Draw upon the power of your magical item",
        soulCost: 0,
        sanityCost: 2,
        consequences: ["You activate your enchanted object, feeling its power surge through you..."],
        requiresItem: "enchanted_object"
      });
    }

    return choices;
  }

  /**
   * Uses an item in a scenario choice and removes it if consumed
   */
  static useItemInChoice(gameData: GameData, choice: Choice): { gameData: GameData; itemUsed?: InventoryItem } {
    if (!choice.requiresItem) {
      return { gameData };
    }

    // Find the first item that matches the required type
    const itemIndex = gameData.inventory.findIndex(item => 
      item.type === choice.requiresItem || 
      item.name.toLowerCase().includes(choice.requiresItem?.toLowerCase() || "")
    );

    if (itemIndex === -1) {
      return { gameData };
    }

    const itemUsed = gameData.inventory[itemIndex];

    // Some choices consume the item, others don't
    const consumesItem = choice.id.includes("offer") || choice.id.includes("sacrifice") || choice.id.includes("give");
    
    if (consumesItem) {
      const newInventory = [...gameData.inventory];
      newInventory.splice(itemIndex, 1);
      return {
        gameData: {
          ...gameData,
          inventory: newInventory
        },
        itemUsed
      };
    }

    return { gameData, itemUsed };
  }
}