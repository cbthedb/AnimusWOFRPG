import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface GameOverScreenProps {
  isVisible: boolean;
  onNewGame: () => void;
  onMainMenu: () => void;
}

export function GameOverScreen({ isVisible, onNewGame, onMainMenu }: GameOverScreenProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
      data-testid="game-over-screen"
    >
      <Card className="w-full max-w-3xl mx-4 border-4 border-red-600 bg-black text-white">
        <CardContent className="p-12 text-center space-y-8">
          {/* Death Title */}
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-red-500 animate-pulse drop-shadow-2xl">
              💀 DEATH 💀
            </h1>
            <h2 className="text-2xl font-semibold text-red-300">
              Your Dragon Has Perished
            </h2>
          </div>

          {/* Death Description */}
          <div className="space-y-6 text-gray-200 max-w-2xl mx-auto">
            <p className="text-xl font-semibold text-red-400">
              The Final Animus Spell
            </p>
            
            <p className="text-lg leading-relaxed">
              Against all warnings, you chose to use animus magic with a soul already consumed by darkness. 
              The ancient power, no longer contained by any trace of your true self, 
              turned inward and destroyed what remained of your essence.
            </p>

            <p className="text-lg leading-relaxed">
              Your dragon's body crumbles to ash as the last spark of life is extinguished by the very magic 
              that once made you powerful. This is the fate of all animus dragons who lose themselves 
              completely to the corruption.
            </p>

            <div className="bg-red-900/50 p-6 rounded-lg border-2 border-red-500">
              <p className="text-lg font-bold text-red-300">
                "Power without soul is destruction without purpose."
              </p>
              <p className="text-base italic text-red-400 mt-2">
                — Ancient Warning of the Animus Dragons
              </p>
            </div>
          </div>

          {/* Final Stats */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Final Status</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Soul Percentage:</span>
                <span className="text-red-400 ml-2 font-bold">0%</span>
              </div>
              <div>
                <span className="text-gray-400">Cause of Death:</span>
                <span className="text-red-400 ml-2 font-bold">Animus Corruption</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 pt-4">
            <Button
              variant="destructive"
              size="lg"
              onClick={onNewGame}
              className="px-8 py-3 text-lg font-semibold"
              data-testid="new-game-button"
            >
              Start New Dragon
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={onMainMenu}
              className="px-8 py-3 text-lg font-semibold border-gray-500 text-gray-300 hover:bg-gray-800"
              data-testid="main-menu-button"
            >
              Return to Menu
            </Button>
          </div>

          {/* Warning Message */}
          <p className="text-sm text-gray-400 italic">
            Remember: In your next life, be more careful with animus magic. 
            The power is seductive, but the cost is always your soul.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}