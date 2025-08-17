import { useState } from "react";
import { Character, GameData, InventoryItem, Choice } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Gift, Sparkles, Trash2, Eye, EyeOff, Wand2 } from "lucide-react";
import { InventorySystem } from "@/lib/inventory-system";

interface ContextualInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  gameData: GameData;
  onGiveItem: (itemId: string, npcName: string, result: string) => void;
  onInventoryAction: (action: string, itemId: string, result: string) => void;
  scenarioContext?: string;
}

export default function ContextualInventoryModal({
  isOpen,
  onClose,
  character,
  gameData,
  onGiveItem,
  onInventoryAction,
  scenarioContext = ""
}: ContextualInventoryModalProps) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedNPC, setSelectedNPC] = useState<string>("");
  const [customNPCName, setCustomNPCName] = useState("");
  const [actionResult, setActionResult] = useState<string>("");

  const giveableItems = InventorySystem.getGiveableItems(gameData);
  
  // Extract NPC names from recent scenarios and relationships
  const potentialNPCs = [
    ...(character.relationships ? Object.keys(character.relationships) : []),
    "Suspicious Dragon", "Injured Dragon", "Young Dragonet", "Elder Dragon",
    "Animus Dragon", "Prophecy Dragon", "Academy Student", "Tribal Guard"
  ].filter((name, index, arr) => arr.indexOf(name) === index);

  const handleGiveItem = () => {
    if (!selectedItem) return;
    
    const npcName = selectedNPC === "custom" ? customNPCName : selectedNPC;
    if (!npcName.trim()) return;

    const result = InventorySystem.giveItemToNPC(character, gameData, selectedItem.id, npcName);
    onGiveItem(selectedItem.id, npcName, result.result);
    
    setSelectedItem(null);
    setSelectedNPC("");
    setCustomNPCName("");
    onClose();
  };

  const handleInventoryAction = (action: string) => {
    if (!selectedItem) return;

    let result = "";
    
    switch (action) {
      case "tear_up":
        result = `You tear up the ${selectedItem.name}, destroying it completely. The pieces scatter in the wind...`;
        break;
      case "hide_mundane":
        result = `You carefully hide the ${selectedItem.name} using your natural stealth and cunning...`;
        break;
      case "hide_animus":
        if (character.isAnimus) {
          result = `Your animus magic wraps around the ${selectedItem.name}, rendering it completely invisible to all eyes...`;
        } else {
          result = "You don't have animus magic to hide items this way.";
        }
        break;
      case "examine":
        result = `You carefully examine the ${selectedItem.name}. ${selectedItem.description}`;
        if (selectedItem.enchantments && selectedItem.enchantments.length > 0) {
          result += ` You sense magical enchantments: ${selectedItem.enchantments.join(", ")}.`;
        }
        break;
      case "activate":
        if (selectedItem.isActive) {
          result = `You activate the ${selectedItem.name}, feeling its power surge through you...`;
        } else {
          result = `The ${selectedItem.name} cannot be activated in its current state.`;
        }
        break;
      default:
        result = `You attempt to ${action} the ${selectedItem.name}.`;
    }

    onInventoryAction(action, selectedItem.id, result);
    setActionResult(result);
  };

  const getItemActions = (item: InventoryItem): string[] => {
    const actions = ["examine"];
    
    // Basic actions for all items
    if (item.canGiveAway !== false) {
      actions.push("give");
    }
    
    // Destructible items
    if (item.type === "scroll" || item.type === "treasure") {
      actions.push("tear_up");
    }
    
    // Hideable items
    if (item.type === "scroll" || item.type === "magical_artifact" || item.type === "enchanted_object") {
      actions.push("hide_mundane");
      if (character.isAnimus) {
        actions.push("hide_animus");
      }
    }
    
    // Activatable items
    if (item.isActive || item.type === "enchanted_object") {
      actions.push("activate");
    }
    
    return actions;
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "give": return <Gift className="w-4 h-4" />;
      case "tear_up": return <Trash2 className="w-4 h-4" />;
      case "hide_mundane": return <EyeOff className="w-4 h-4" />;
      case "hide_animus": return <Wand2 className="w-4 h-4" />;
      case "examine": return <Eye className="w-4 h-4" />;
      case "activate": return <Sparkles className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "give": return "Give Away";
      case "tear_up": return "Tear Up";
      case "hide_mundane": return "Hide Carefully";
      case "hide_animus": return "Hide with Magic";
      case "examine": return "Examine Closely";
      case "activate": return "Activate";
      default: return action;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "scroll": return "📜";
      case "treasure": return "💎";
      case "magical_artifact": return "✨";
      case "enchanted_object": return "🔮";
      case "weapon": return "⚔️";
      case "tool": return "🔧";
      default: return "📦";
    }
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case "legendary": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "rare": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "uncommon": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "common": return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default: return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-black/90 border-purple-500/30 text-white overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-fantasy text-xl text-purple-300 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Inventory Management
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/50">
            <TabsTrigger value="inventory" className="data-[state=active]:bg-purple-600/30">View Items</TabsTrigger>
            <TabsTrigger value="give" className="data-[state=active]:bg-purple-600/30">Give Items</TabsTrigger>
          </TabsList>
          
          {/* View Items Tab */}
          <TabsContent value="inventory" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Item Selection */}
              <div>
                <h3 className="font-semibold text-purple-300 mb-3 flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Select Item
                </h3>
                <div className="h-64 overflow-y-auto pr-4">
                  <div className="space-y-2">
                    {!gameData.inventory || gameData.inventory.length === 0 ? (
                      <p className="text-slate-400 text-sm">No items in inventory.</p>
                    ) : (
                      gameData.inventory.map((item) => (
                        <Card
                          key={item.id}
                          className={`cursor-pointer transition-all duration-200 ${
                            selectedItem?.id === item.id
                              ? "bg-purple-600/30 border-purple-400"
                              : "bg-black/40 border-purple-500/20 hover:border-purple-500/40"
                          }`}
                          onClick={() => setSelectedItem(item)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start space-x-3">
                              <span className="text-2xl">{getTypeIcon(item.type)}</span>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-medium text-sm">{item.name}</h4>
                                  {item.rarity && (
                                    <Badge className={getRarityColor(item.rarity)}>
                                      {item.rarity}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                  {item.description}
                                </p>
                                {item.enchantments && item.enchantments.length > 0 && (
                                  <div className="mt-2">
                                    <p className="text-xs text-purple-300 flex items-center">
                                      <Sparkles className="w-3 h-3 mr-1" />
                                      Enchantments:
                                    </p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {item.enchantments.map((enchantment, index) => (
                                        <Badge
                                          key={index}
                                          className="text-xs bg-purple-500/20 text-purple-300"
                                        >
                                          {enchantment}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Actions for Selected Item */}
              <div>
                <h3 className="font-semibold text-purple-300 mb-3">
                  Available Actions
                </h3>
                {selectedItem ? (
                  <div className="space-y-2">
                    {getItemActions(selectedItem).map((action) => (
                      <Button
                        key={action}
                        variant="outline"
                        className="w-full justify-start text-left"
                        onClick={() => handleInventoryAction(action)}
                      >
                        {getActionIcon(action)}
                        <span className="ml-2">{getActionLabel(action)}</span>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">Select an item to see available actions.</p>
                )}
                
                {actionResult && (
                  <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                    <p className="text-green-300 text-sm">{actionResult}</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Give Items Tab */}
          <TabsContent value="give" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Item Selection for Giving */}
              <div>
                <h3 className="font-semibold text-purple-300 mb-3 flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Select Item to Give
                </h3>
                <ScrollArea className="h-64 pr-4">
                  <div className="space-y-2">
                    {giveableItems.length === 0 ? (
                      <p className="text-slate-400 text-sm">No items available to give away.</p>
                    ) : (
                      giveableItems.map((item) => (
                        <Card
                          key={item.id}
                          className={`cursor-pointer transition-all duration-200 ${
                            selectedItem?.id === item.id
                              ? "bg-purple-600/30 border-purple-400"
                              : "bg-black/40 border-purple-500/20 hover:border-purple-500/40"
                          }`}
                          onClick={() => setSelectedItem(item)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start space-x-3">
                              <span className="text-2xl">{getTypeIcon(item.type)}</span>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-medium text-sm">{item.name}</h4>
                                  {item.rarity && (
                                    <Badge className={getRarityColor(item.rarity)}>
                                      {item.rarity}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* NPC Selection */}
              <div>
                <h3 className="font-semibold text-purple-300 mb-3">
                  Select Dragon to Give To
                </h3>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {potentialNPCs.map((npc) => (
                      <Button
                        key={npc}
                        variant="ghost"
                        className={`w-full text-left justify-start ${
                          selectedNPC === npc
                            ? "bg-purple-600/30 text-purple-300"
                            : "text-slate-300 hover:bg-purple-500/20"
                        }`}
                        onClick={() => {
                          setSelectedNPC(npc);
                          setCustomNPCName("");
                        }}
                      >
                        {npc}
                        {character.relationships && character.relationships[npc] && (
                          <Badge className="ml-2 text-xs bg-green-500/20 text-green-300">
                            Known
                          </Badge>
                        )}
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      className={`w-full text-left justify-start ${
                        selectedNPC === "custom"
                          ? "bg-purple-600/30 text-purple-300"
                          : "text-slate-300 hover:bg-purple-500/20"
                      }`}
                      onClick={() => setSelectedNPC("custom")}
                    >
                      Custom Dragon Name...
                    </Button>
                    
                    {selectedNPC === "custom" && (
                      <input
                        type="text"
                        placeholder="Enter dragon name..."
                        className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded text-white placeholder-slate-400"
                        value={customNPCName}
                        onChange={(e) => setCustomNPCName(e.target.value)}
                      />
                    )}
                  </div>
                </ScrollArea>
                
                <div className="mt-4">
                  <Button
                    onClick={handleGiveItem}
                    disabled={
                      !selectedItem ||
                      (selectedNPC === "" && customNPCName === "") ||
                      (selectedNPC === "custom" && !customNPCName.trim())
                    }
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:text-gray-400"
                  >
                    Give Item
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          

        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 mt-4 border-t border-purple-500/20">
          <Button variant="outline" onClick={onClose} className="px-6">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}