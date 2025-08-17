import { useState } from "react";
import { Character, GameData, InventoryItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Package, Gift, Sparkles } from "lucide-react";
import { InventorySystem } from "@/lib/inventory-system";

interface InventoryGivingModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  gameData: GameData;
  onGiveItem: (itemId: string, npcName: string, result: string) => void;
}

export default function InventoryGivingModal({
  isOpen,
  onClose,
  character,
  gameData,
  onGiveItem
}: InventoryGivingModalProps) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedNPC, setSelectedNPC] = useState<string>("");
  const [customNPCName, setCustomNPCName] = useState("");

  const giveableItems = InventorySystem.getGiveableItems(gameData);
  
  // Extract NPC names from recent scenarios and relationships
  const potentialNPCs = [
    ...Object.keys(character.relationships),
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

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case "legendary": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "rare": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "uncommon": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-black/90 border-purple-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="font-fantasy text-xl text-purple-300 flex items-center">
            <Gift className="w-5 h-5 mr-2" />
            Give Items to Dragons
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          {/* Item Selection */}
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
                            {item.enchantments.length > 0 && (
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
                    {character.relationships[npc] && (
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
          </div>
        </div>

        {/* Selected Item Preview */}
        {selectedItem && (
          <div className="border-t border-purple-500/20 pt-4">
            <h4 className="font-semibold text-purple-300 mb-2">Selected Item:</h4>
            <div className="bg-purple-900/20 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xl">{getTypeIcon(selectedItem.type)}</span>
                <span className="font-medium">{selectedItem.name}</span>
                {selectedItem.rarity && (
                  <Badge className={getRarityColor(selectedItem.rarity)}>
                    {selectedItem.rarity}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-300">{selectedItem.description}</p>
              {selectedItem.enchantments.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-purple-300">Enchantments:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedItem.enchantments.map((enchantment, index) => (
                      <Badge key={index} className="bg-purple-500/20 text-purple-300">
                        {enchantment}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4 border-t border-purple-500/20">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleGiveItem}
            disabled={
              !selectedItem ||
              (!selectedNPC && !customNPCName) ||
              (selectedNPC === "custom" && !customNPCName.trim())
            }
            className="bg-purple-600 hover:bg-purple-700"
          >
            Give Item
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}