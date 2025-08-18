import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { SoundtrackSystem } from '@/lib/soundtrack-system';

interface SoundtrackControlsProps {
  isVisible?: boolean;
}

export function SoundtrackControls({ isVisible = false }: SoundtrackControlsProps) {
  const [soundtrackState, setSoundtrackState] = React.useState(SoundtrackSystem.getState());
  const [volume, setVolume] = React.useState(0.3);

  React.useEffect(() => {
    // Initialize soundtrack system
    SoundtrackSystem.init();
    
    // Update state periodically
    const interval = setInterval(() => {
      setSoundtrackState(SoundtrackSystem.getState());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    SoundtrackSystem.setVolume(newVolume);
  };

  const handleTogglePlayback = () => {
    SoundtrackSystem.togglePlayback();
    setSoundtrackState(SoundtrackSystem.getState());
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Card className="w-full max-w-md" data-testid="soundtrack-controls">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Soundtrack Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Track Display */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Now Playing:</span>
          <Badge variant="secondary" data-testid="current-track">
            {soundtrackState.currentTrack || 'None'}
          </Badge>
        </div>

        {/* AI Control Warning */}
        {soundtrackState.soul0ControlActive && (
          <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg border-2 border-red-500">
            <div className="flex items-center justify-between text-red-800 dark:text-red-200">
              <span className="font-bold">🤖 AI CONTROL ACTIVE</span>
              <Badge variant="destructive" data-testid="ai-control-timer">
                {formatTime(SoundtrackSystem.getAIControlTimeRemaining())}
              </Badge>
            </div>
            <p className="text-sm mt-1 text-red-700 dark:text-red-300">
              Your dragon is being controlled by animus magic corruption
            </p>
          </div>
        )}

        {/* Zero Soul Warning */}
        {SoundtrackSystem.shouldShowZeroSoulWarning() && (
          <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg border-2 border-yellow-500">
            <div className="text-yellow-800 dark:text-yellow-200">
              <span className="font-bold">⚠️ SOUL DEPLETED</span>
              <p className="text-sm mt-1">
                {SoundtrackSystem.getZeroSoulWarningMessage()}
              </p>
            </div>
          </div>
        )}

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTogglePlayback}
            disabled={!soundtrackState.currentTrack}
            data-testid="toggle-playback"
          >
            {soundtrackState.isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          
          <div className="flex-1">
            <label className="text-sm font-medium">Volume: {Math.round(volume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full mt-1"
              data-testid="volume-slider"
            />
          </div>
        </div>

        {/* Track Info */}
        {soundtrackState.currentTrack && (
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Status: {soundtrackState.isPlaying ? 'Playing' : 'Paused'}</div>
            {soundtrackState.currentTrack.includes('soul') && (
              <div>Soul-based track active</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}