import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SoundtrackSystem } from '@/lib/soundtrack-system';

interface AIControlOverlayProps {
  isVisible: boolean;
}

export function AIControlOverlay({ isVisible }: AIControlOverlayProps) {
  const [timeRemaining, setTimeRemaining] = React.useState(0);

  React.useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      const remaining = SoundtrackSystem.getAIControlTimeRemaining();
      setTimeRemaining(remaining);
    }, 100); // Update more frequently for smooth countdown

    return () => clearInterval(interval);
  }, [isVisible]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
      data-testid="ai-control-overlay"
    >
      <Card className="w-full max-w-2xl mx-4 border-4 border-red-500 bg-red-50 dark:bg-red-950">
        <CardContent className="p-8 text-center space-y-6">
          {/* Dramatic Title */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-red-800 dark:text-red-200 animate-pulse">
              🤖 ANIMUS MAGIC CORRUPTION 🤖
            </h1>
            <Badge variant="destructive" className="text-lg px-4 py-2" data-testid="ai-timer">
              {formatTime(timeRemaining)}
            </Badge>
          </div>

          {/* Corruption Description */}
          <div className="space-y-4 text-red-700 dark:text-red-300">
            <p className="text-lg font-semibold">
              Your soul has been completely consumed by animus magic!
            </p>
            
            <p className="text-base">
              The dark power now controls your mind and body. Ancient magic flows through you, 
              making decisions beyond your conscious will. You are a passenger in your own form, 
              watching helplessly as corruption guides your actions.
            </p>

            <p className="text-base italic">
              "This is what happens when dragons delve too deep into animus magic. 
              The power that once served them now rules them entirely."
            </p>
          </div>

          {/* Visual Effects */}
          <div className="flex justify-center space-x-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>

          {/* Status Message */}
          <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg border-2 border-red-400">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              The AI is making choices for your character. Control will return when the corruption subsides.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}