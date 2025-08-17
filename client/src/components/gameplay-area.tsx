import { Character, GameData, Choice } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2, Package, SkipForward, Eye, Brain, Sparkles, Zap, MapPin, Gift } from "lucide-react";
import { LocationMigrationSystem } from "./location-migration-system";
import ContextualInventoryModal from "./contextual-inventory-modal";
import { LocationSystem, Location } from "@/lib/location-system";
import { useState } from "react";

interface GameplayAreaProps {
  character: Character;
  gameData: GameData;
  onChoice: (choice: Choice) => void;
  onShowMagic: () => void;
  onShowSpecialPower: (powerType: 'prophecy' | 'mindreading' | 'future') => void;
  onShowTribalPowers: () => void;
  onCustomAction: () => void;
  onLocationMigration?: (destination: Location) => void;
  onGiveItem?: (itemId: string, npcName: string, result: string) => void;
  onInventoryAction?: (action: string, itemId: string, result: string) => void;
  isProcessing: boolean;
}

export default function GameplayArea({
  character,
  gameData,
  onChoice,
  onShowMagic,
  onShowSpecialPower,
  onShowTribalPowers,
  onCustomAction,
  onLocationMigration,
  onGiveItem,
  onInventoryAction,
  isProcessing,
}: GameplayAreaProps) {
  const scenario = gameData.currentScenario;
  const [showMigrationSystem, setShowMigrationSystem] = useState(false);
  const [showGivingModal, setShowGivingModal] = useState(false);
  const currentLocation = LocationSystem.getCurrentLocation(gameData);

  const getChoiceButtonColor = (choice: Choice, index: number) => {
    if (choice.corruption) {
      return "bg-red-900/50 hover:bg-red-900/70 border-red-600/30 text-red-300";
    }
    if (choice.soulCost > 10) {
      return "bg-orange-900/50 hover:bg-orange-900/70 border-orange-600/30";
    }
    if (choice.soulCost > 0) {
      return "bg-yellow-900/50 hover:bg-yellow-900/70 border-yellow-600/30";
    }
    return "bg-black/50 hover:bg-purple-500/20 border-purple-500/30";
  };

  return (
    <div className="lg:col-span-2">
      <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30 h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-purple-500/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-fantasy text-xl font-semibold text-purple-300">
                {currentLocation?.name || gameData.location.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </h3>
              <p className="text-sm text-purple-200">
                {gameData.currentSeason || 'Spring'} • Year {Math.floor((gameData.yearsPassed || 0) + character.age)} • {gameData.timeInfo}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">Turn</div>
              <div className="font-bold text-lg">{gameData.turn}</div>
            </div>
          </div>
        </div>

        {/* Narrative Display */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="narrative-text font-narrative text-base leading-relaxed">
            {/* Show choice outcome if waiting for user to continue */}
            {gameData.lastChoiceResult && gameData.awaitingResponse && (
              <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-purple-400/50 rounded-lg p-6 mb-6 animate-pulse">
                <h4 className="font-fantasy text-lg font-semibold text-purple-300 mb-3 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  What Happened
                </h4>
                <p className="text-purple-100 leading-relaxed mb-4">{gameData.lastChoiceResult}</p>
                <Button
                  onClick={() => onChoice({ id: 'continue', text: 'Continue', description: '', soulCost: 0, sanityCost: 0, consequences: [], corruption: false })}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Continue Your Story
                </Button>
              </div>
            )}

            {!gameData.awaitingResponse && scenario.narrativeText.map((paragraph, index) => (
              <p
                key={index}
                className="mb-4"
                dangerouslySetInnerHTML={{
                  __html: paragraph
                    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
                    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                }}
              />
            ))}

            {!gameData.awaitingResponse && scenario.type === 'magical' && (
              <div className="bg-black/50 border-l-4 border-purple-400 p-4 rounded-r-lg mb-6">
                <p className="font-semibold text-purple-300 mb-2">Current Scenario:</p>
                <p>{scenario.description}</p>
              </div>
            )}

            {/* Special Event Indicators */}
            {!gameData.awaitingResponse && (scenario.type === 'magical' || scenario.id.includes('artifact') || scenario.id.includes('mindreading') || scenario.id.includes('prophecy')) && (
              <div className="bg-gradient-to-r from-yellow-900/30 to-red-900/30 border border-yellow-500/50 rounded-lg p-4 mb-6">
                <p className="font-semibold text-yellow-300 mb-2 flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  {scenario.id.includes('artifact') && "Rare Animus Artifact Discovery!"}
                  {scenario.id.includes('mindreading') && "Mind Reading Event!"}
                  {scenario.id.includes('prophecy') && "Prophetic Vision!"}
                  {scenario.type === 'magical' && !scenario.id.includes('artifact') && !scenario.id.includes('mindreading') && !scenario.id.includes('prophecy') && "Magical Event!"}
                </p>
                <p className="text-yellow-200 text-sm">This is a rare special event that will have significant consequences for your dragon's journey.</p>
              </div>
            )}
          </div>
        </div>

        {/* Choice Selection Area */}
        <div className="border-t border-purple-500/30 p-6">
          {/* Don't show choices if awaiting response */}
          {!gameData.awaitingResponse && (
            <>
              {character.isAIControlled ? (
                <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-4 mb-4">
                  <h4 className="font-fantasy text-lg font-semibold text-red-300 mb-2 flex items-center">
                    <Eye className="w-5 h-5 mr-2 animate-pulse" />
                    AI Controlling Your Dragon
                  </h4>
                  <p className="text-red-200 text-sm">
                    Your corrupted dragon is now under AI control. Watch as evil choices are made automatically...
                  </p>
                </div>
              ) : (
                <h4 className="font-fantasy text-lg font-semibold text-purple-300 mb-4">
                  Choose your action:
                </h4>
              )}

              <div className="space-y-3">
                {scenario.choices.map((choice, index) => (
                  <Button
                    key={choice.id}
                    variant="ghost"
                    className={`choice-button w-full text-left p-4 border transition-all duration-300 ${getChoiceButtonColor(choice, index)}`}
                    onClick={() => onChoice(choice)}
                    disabled={isProcessing || character.isAIControlled}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold">{choice.text}</p>
                        {choice.description && (
                          <p className="text-xs opacity-75 mt-1">{choice.description}</p>
                        )}
                      </div>
                      <div className="text-right text-xs flex flex-col items-end gap-1">
                        {choice.soulCost > 0 && (
                          <span className="text-red-400">-{choice.soulCost} Soul</span>
                        )}
                        {choice.sanityCost > 0 && (
                          <span className="text-yellow-400">-{choice.sanityCost} Sanity</span>
                        )}
                        {choice.corruption && (
                          <span className="text-red-500 font-bold">⚠ Corrupting</span>
                        )}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </>
          )}

          {/* Quick Actions Bar */}
          {!character.isAIControlled && (
            <div className="mt-6 pt-4 border-t border-purple-500/20">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {/* Animus Magic - Only for animus dragons */}
              {character.isAnimus && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onShowMagic}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <Wand2 className="w-4 h-4 mr-1" />
                  Animus Magic
                </Button>
              )}
              
              {/* Special Powers - Prophecy, Mind Reading, Future Sight */}
              {character.tribalPowers.some(power => power.toLowerCase().includes('prophecy') || power.toLowerCase().includes('future')) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShowSpecialPower('prophecy')}
                  className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Prophecy
                </Button>
              )}
              
              {character.tribalPowers.some(power => power.toLowerCase().includes('mind')) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShowSpecialPower('mindreading')}
                  className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                >
                  <Brain className="w-4 h-4 mr-1" />
                  Mind Reading
                </Button>
              )}
              
              {character.specialPowers.some(power => power.toLowerCase().includes('foresight') || power.toLowerCase().includes('future')) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShowSpecialPower('future')}
                  className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  Future Sight
                </Button>
              )}
              
              {/* Tribal Powers */}
              <Button
                variant="outline"
                size="sm"
                onClick={onShowTribalPowers}
                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              >
                <Zap className="w-4 h-4 mr-1" />
                Tribal Powers
              </Button>
              
              {/* Custom Action */}
              <Button
                variant="outline"
                size="sm"
                onClick={onCustomAction}
                className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
              >
                <Package className="w-4 h-4 mr-1" />
                Custom Action
              </Button>
              
              {/* Location Migration */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMigrationSystem(true)}
                className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
              >
                <MapPin className="w-4 h-4 mr-1" />
                Travel
              </Button>
              
              {/* Inventory Actions */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGivingModal(true)}
                className="border-pink-500/50 text-pink-400 hover:bg-pink-500/10"
                disabled={gameData.inventory.length === 0}
              >
                <Package className="w-4 h-4 mr-1" />
                Inventory
              </Button>
            </div>
            </div>
          )}
        </div>
        
        {/* Location Migration System Modal/Panel */}
        {showMigrationSystem && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-black/90 border border-purple-500/30 rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-fantasy text-purple-300">Location Migration</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowMigrationSystem(false)}
                  className="text-purple-400 hover:bg-purple-500/20"
                >
                  ✕
                </Button>
              </div>
              
              <LocationMigrationSystem
                character={character}
                currentLocation={currentLocation}
                gameData={gameData}
                onMigrate={(destination) => {
                  setShowMigrationSystem(false);
                  if (onLocationMigration) {
                    onLocationMigration(destination);
                  }
                }}
              />
            </div>
          </div>
        )}
        
        {/* Contextual Inventory Modal */}
        {showGivingModal && (
          <ContextualInventoryModal
            isOpen={showGivingModal}
            onClose={() => setShowGivingModal(false)}
            character={character}
            gameData={gameData}
            scenarioContext={scenario.type}
            onGiveItem={(itemId, npcName, result) => {
              if (onGiveItem) {
                onGiveItem(itemId, npcName, result);
              }
            }}
            onInventoryAction={(action, itemId, result) => {
              if (onInventoryAction) {
                onInventoryAction(action, itemId, result);
              }
            }}
          />
        )}
      </Card>
    </div>
  );
}
