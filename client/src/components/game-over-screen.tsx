import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skull, Home, RotateCcw, Star } from "lucide-react";

interface GameOverScreenProps {
  isVisible: boolean;
  reason: string;
  allowContinue?: boolean;
  onNewGame: () => void;
  onMainMenu: () => void;
  onContinueCorrupted?: () => void;
}

export default function GameOverScreen({ 
  isVisible, 
  reason, 
  allowContinue, 
  onNewGame, 
  onMainMenu,
  onContinueCorrupted 
}: GameOverScreenProps) {
  if (!isVisible) return null;

  const isCorruptedSoul = reason.includes("soul") || reason.includes("corruption") || reason.includes("AI");

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-red-950/90 border-red-500/50 text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {isCorruptedSoul ? (
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center">
                <div className="text-4xl">💀</div>
              </div>
            ) : (
              <Skull className="w-16 h-16 text-red-400" />
            )}
          </div>
          <CardTitle className="text-2xl font-fantasy text-red-300">
            {isCorruptedSoul ? "Soul Consumed" : "Game Over"}
          </CardTitle>
          <CardDescription className="text-red-200">
            {reason}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isCorruptedSoul && (
            <div className="bg-red-900/50 p-4 rounded-lg border border-red-500/30 text-sm text-red-200">
              <p className="font-semibold mb-2">🔥 The Darkness Has Won</p>
              <p>Your animus magic has consumed your soul completely. The dragon you once were is gone, replaced by an instrument of corruption and chaos.</p>
            </div>
          )}

          <div className="space-y-3">
            {allowContinue && onContinueCorrupted && (
              <Button 
                onClick={onContinueCorrupted}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-fantasy"
                data-testid="button-continue-corrupted"
              >
                <Star className="w-4 h-4 mr-2" />
                Continue as Corrupted Soul
              </Button>
            )}
            
            <Button 
              onClick={onNewGame}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-fantasy"
              data-testid="button-new-game"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Start New Dragon
            </Button>
            
            <Button 
              variant="outline"
              onClick={onMainMenu}
              className="w-full border-red-400/50 text-red-300 hover:bg-red-500/10"
              data-testid="button-main-menu"
            >
              <Home className="w-4 h-4 mr-2" />
              Return to Main Menu
            </Button>
          </div>

          <div className="text-xs text-red-400 pt-4 border-t border-red-700">
            <p>Every choice has consequences in the world of Pyrrhia</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}