import { Character, GameData, InventoryItem } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { IntelligentActionProcessor } from "@/lib/intelligent-action-processor";
import { Sparkles, Send, Package, Zap, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface CustomActionModalProps {
  character: Character;
  gameData: GameData;
  inventory: InventoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onExecuteAction: (action: string, result: string, itemUsed?: InventoryItem, processedAction?: any) => void;
}

export default function CustomActionModal({ 
  character, 
  gameData,
  inventory, 
  isOpen, 
  onClose, 
  onExecuteAction 
}: CustomActionModalProps) {
  const [customAction, setCustomAction] = useState("");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [actionResult, setActionResult] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [processedAction, setProcessedAction] = useState<any>(null);
  const [showWarning, setShowWarning] = useState(false);

  const generateActionResult = () => {
    if (!customAction.trim()) return;
    
    setIsGenerating(true);
    setShowWarning(false);
    
    // Use intelligent action processor for contextual results
    setTimeout(() => {
      try {
        const processed = IntelligentActionProcessor.processCustomAction(
          customAction,
          character,
          gameData,
          selectedItem || undefined
        );
        
        setProcessedAction(processed);
        setActionResult(processed.actionResult);
        
        // Show warning for high-consequence actions
        if (processed.soulCost > 10 || processed.consequences.includes('major_action_consequences')) {
          setShowWarning(true);
        }
        
        setIsGenerating(false);
      } catch (error) {
        console.error("Error processing action:", error);
        setActionResult(`You attempt to ${customAction.toLowerCase()}, but something goes wrong with your approach. Perhaps try a different strategy.`);
        setIsGenerating(false);
      }
    }, 1500);
  };

  const executeAction = () => {
    if (actionResult) {
      onExecuteAction(customAction, actionResult, selectedItem || undefined, processedAction);
      reset();
      onClose();
    }
  };

  const reset = () => {
    setCustomAction("");
    setSelectedItem(null);
    setActionResult("");
    setIsGenerating(false);
    setProcessedAction(null);
    setShowWarning(false);
  };

  // Get scenario-specific custom actions
  const getScenarioActions = () => {
    const currentScenario = gameData.currentScenario;
    if (!currentScenario) return [];
    
    const actions = [];
    const description = (currentScenario.description || currentScenario.text || "").toLowerCase();

    // Common scenario-specific actions based on scenario content
    if (description.includes('dragon') && description.includes('approach')) {
      actions.push("Approach the dragon cautiously");
      actions.push("Try to read their mind");
      actions.push("Offer them something from your inventory");
    }

    if (description.includes('battle') || description.includes('fight')) {
      actions.push("Use animus magic in battle");
      actions.push("Try to end the fight peacefully");
      actions.push("Retreat strategically");
    }

    if (description.includes('ancient') || description.includes('artifact')) {
      actions.push("Examine the ancient object closely");
      actions.push("Try to activate the artifact");
      actions.push("Research its history");
    }

    if (description.includes('injured') || description.includes('hurt')) {
      actions.push("Use healing magic");
      actions.push("Bandage their wounds");
      actions.push("Find a healer");
    }

    if (description.includes('prophecy') || description.includes('vision')) {
      actions.push("Seek more details about the prophecy");
      actions.push("Try to change the predicted future");
      actions.push("Share the vision with others");
    }

    if (description.includes('scroll') || description.includes('message')) {
      actions.push("Read the scroll carefully");
      actions.push("Enchant the scroll to reveal hidden text");
      actions.push("Share the message with trusted allies");
    }

    if (description.includes('suspicious') || description.includes('strange')) {
      actions.push("Investigate the strange occurrence");
      actions.push("Use your tribal abilities to sense danger");
      actions.push("Alert others to the suspicious activity");
    }

    return actions.slice(0, 6); // Limit to 6 suggestions
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { reset(); onClose(); } }}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-yellow-300 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Custom Action
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-slate-300">
              Describe what you want your dragon to do. Be creative! You can interact with other dragons, 
              explore locations, use items, or try anything you can imagine within the Wings of Fire universe.
            </p>
          </div>

          {/* Scenario-Specific Suggestions */}
          {getScenarioActions().length > 0 && (
            <div className="space-y-3">
              <Label>Quick Actions for This Scenario:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {getScenarioActions().map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => setCustomAction(action)}
                    className="text-left p-3 h-auto whitespace-normal"
                    disabled={isGenerating}
                  >
                    <div className="flex items-start">
                      <Sparkles className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{action}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Action Input */}
          <div className="space-y-2">
            <Label htmlFor="action">What do you want to do?</Label>
            <Input
              id="action"
              value={customAction}
              onChange={(e) => setCustomAction(e.target.value)}
              placeholder="e.g., 'Approach the group of SkyWing dragonets and ask about the missing scroll' or 'Use my fire breath to light the ancient torch'"
              className="bg-black/50 border-yellow-500/30"
              disabled={isGenerating}
            />
          </div>

          {/* Inventory Selection */}
          {inventory.length > 0 && (
            <div className="space-y-3">
              <Label>Use an item (optional):</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Button
                  variant={selectedItem === null ? "default" : "outline"}
                  onClick={() => setSelectedItem(null)}
                  className="text-left p-3"
                  disabled={isGenerating}
                >
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    No item (use natural abilities)
                  </div>
                </Button>
                
                {inventory.slice(0, 5).map((item, index) => (
                  <Button
                    key={index}
                    variant={selectedItem?.id === item.id ? "default" : "outline"}
                    onClick={() => setSelectedItem(item)}
                    className="text-left p-3"
                    disabled={isGenerating}
                  >
                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-slate-400">{item.type.replace('_', ' ')}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
              
              {selectedItem && (
                <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4" />
                    <span className="font-medium text-purple-300">Selected: {selectedItem.name}</span>
                  </div>
                  <p className="text-sm text-slate-300">{selectedItem.description}</p>
                  {selectedItem.enchantments.length > 0 && (
                    <div className="text-sm text-blue-300 mt-2">
                      ✨ Enchantments: {selectedItem.enchantments.join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={generateActionResult}
            disabled={!customAction.trim() || isGenerating}
            className="w-full bg-yellow-600 hover:bg-yellow-700"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                AI is narrating your action...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                See What Happens
              </>
            )}
          </Button>

          {/* Result Display */}
          {actionResult && (
            <div className="space-y-4">
              {/* Warning for high-consequence actions */}
              {showWarning && processedAction && (
                <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 mr-2" />
                    <h4 className="font-semibold text-red-300">High-Consequence Action</h4>
                  </div>
                  <div className="text-sm text-red-200 space-y-2">
                    {processedAction.soulCost > 0 && (
                      <p>Soul Cost: {processedAction.soulCost}%</p>
                    )}
                    {processedAction.sanityCost > 0 && (
                      <p>Sanity Cost: {processedAction.sanityCost}%</p>
                    )}
                    {processedAction.itemConsumed && (
                      <p>This action will destroy the {selectedItem?.name}</p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="p-4 bg-gradient-to-r from-yellow-900/30 to-black/30 rounded-lg border border-yellow-500/30">
                <div className="flex items-center mb-2">
                  <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
                  <h4 className="font-semibold text-yellow-300">Action Result</h4>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">{actionResult}</p>
                
                {/* Show achievement notification */}
                {processedAction?.achievementUnlocked && (
                  <div className="mt-3 p-2 bg-purple-900/30 border border-purple-500/50 rounded">
                    <p className="text-xs text-purple-300">
                      🏆 Achievement Unlocked: {processedAction.achievementUnlocked}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={executeAction}
                    className={showWarning ? "bg-red-600 hover:bg-red-700" : "bg-yellow-600 hover:bg-yellow-700"}
                  >
                    {showWarning ? "Accept Consequences" : "Commit to This Action"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Examples */}
          <div className="p-3 bg-slate-900/20 border border-slate-600/30 rounded-lg">
            <h5 className="font-semibold text-slate-300 mb-2">Example Actions:</h5>
            <div className="text-xs text-slate-400 space-y-1">
              <div>• "Challenge the arrogant SkyWing to a flying race"</div>
              <div>• "Sneak into the forbidden library using my RainWing camouflage"</div>
              <div>• "Ask the wise SeaWing elder about ancient prophecies"</div>
              <div>• "Use my enchanted amulet to communicate with distant allies"</div>
              <div>• "Practice my tribal powers in the training caves"</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={() => { reset(); onClose(); }} variant="outline">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}