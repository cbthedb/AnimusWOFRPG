import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateCharacter } from "@/lib/character-generator";
import { generateScenario, generateTimeInfo } from "@/lib/scenario-generator-final";
import { Character, GameData, InsertGameState } from "@shared/schema";
import CharacterCreator from "@/components/character-creator";
import { User, Sparkles, GamepadIcon, Save, Music, Info } from "lucide-react";
import { useLocalGameState } from "@/hooks/use-local-game-state";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();
  const [isCreating, setIsCreating] = useState(false);
  const [showCharacterCreator, setShowCharacterCreator] = useState(false);
  const [showLoadMenu, setShowLoadMenu] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const { createGame, getAllGames, loadGame } = useLocalGameState();

  // Show loading screen for 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleNewGame = () => {
    setIsCreating(true);
    
    const character = generateCharacter();
    createGameWithCharacter(character);
  };

  const createGameWithCharacter = (character: Character) => {
    const gameData: GameData = {
      turn: 1,
      location: "Jade Mountain Academy",
      timeInfo: generateTimeInfo(character),
      currentScenario: generateScenario(character, {
        turn: 1,
        location: "Jade Mountain Academy",
        timeInfo: generateTimeInfo(character),
        currentScenario: {} as any,
        history: [],
        relationships: {},
        inventory: [],
        reputation: 0,
        politicalEvents: [],
        warStatus: { isAtWar: false, warringTribes: [], warCause: "", playerInvolvement: "neutral" },
        explorationLog: []
      } as GameData),
      history: [],
      relationships: {},
      inventory: [],
      reputation: 0,
      politicalEvents: [],
      warStatus: { isAtWar: false, warringTribes: [], warCause: "", playerInvolvement: "neutral" },
      explorationLog: []
    };

    const gameState: InsertGameState = {
      userId: null,
      characterData: character,
      gameData: gameData,
      turn: 1,
      location: gameData.location
    };

    try {
      const newGame = createGame(gameState);
      setLocation(`/game/${newGame.id}`);
    } catch (error) {
      console.error("Failed to create game:", error);
      setIsCreating(false);
    }
  };

  const handleCustomCharacter = (character: Character) => {
    setShowCharacterCreator(false);
    setIsCreating(true);
    createGameWithCharacter(character);
  };

  const handleLoadGame = (gameId: string) => {
    loadGame(gameId);
    setLocation(`/game/${gameId}`);
  };

  const savedGames = getAllGames();

  // Loading screen before main menu
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center overflow-hidden relative">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-purple-400/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            />
          ))}
        </div>

        {/* Main loading content */}
        <div className="text-center z-10 relative">
          {/* Spinning rings */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-2 border-4 border-blue-400/40 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
            <div className="absolute inset-4 border-4 border-cyan-300/50 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl animate-pulse">🐉</div>
            </div>
          </div>
          
          <h1 className="font-fantasy text-4xl font-bold text-purple-300 mb-4 animate-pulse">
            Animus: Wings of Fire RPG
          </h1>
          <p className="text-purple-400 text-lg mb-2 animate-bounce">
            Loading your adventure...
          </p>
          <p className="text-purple-500 text-sm">
            Preparing the dragon world
          </p>
          
          {/* Loading bar */}
          <div className="w-64 h-2 bg-purple-900/50 rounded-full mx-auto mt-6 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full animate-pulse" style={{ width: '100%', animation: 'slideIn 3s ease-out forwards' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (showCharacterCreator) {
    return (
      <CharacterCreator 
        onCreateCharacter={handleCustomCharacter}
        onCancel={() => setShowCharacterCreator(false)}
      />
    );
  }

  if (isCreating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40 animation-delay-1000"></div>
          <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-indigo-400 rounded-full animate-pulse opacity-50 animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-violet-400 rounded-full animate-pulse opacity-70 animation-delay-3000"></div>
        </div>
        
        {/* Main loading content */}
        <div className="text-center z-10 relative">
          <div className="relative mb-8">
            {/* Outer rotating ring */}
            <div className="w-32 h-32 border-4 border-purple-500/30 rounded-full animate-spin-slow absolute"></div>
            {/* Inner rotating ring */}
            <div className="w-24 h-24 border-4 border-blue-400/50 rounded-full animate-spin absolute top-4 left-4"></div>
            {/* Dragon icon in center */}
            <div className="w-32 h-32 flex items-center justify-center">
              <div className="text-6xl animate-pulse">🐉</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-fantasy text-purple-300 animate-fade-in">Weaving Your Destiny</h2>
            <p className="text-slate-300 font-narrative text-lg animate-fade-in animation-delay-500">
              Generating your dragon's soul...
            </p>
            <p className="text-slate-400 font-narrative text-sm animate-fade-in animation-delay-1000">
              Determining tribal heritage and magical affinities...
            </p>
            
            {/* Loading bar */}
            <div className="w-64 h-2 bg-purple-900/50 rounded-full mx-auto mt-6 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-loading-bar"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dragon-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-black/20 border-purple-500/30 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="text-6xl">🐉</div>
          </div>
          <CardTitle className="text-4xl font-fantasy text-purple-300 mb-2">
            Animus: Wings of Fire RPG
          </CardTitle>
          <CardDescription className="text-purple-200 text-lg font-narrative">
            A text-based RPG where you play as an animus dragon, wielding the most dangerous magic in Pyrrhia. 
            Every spell costs a piece of your soul—lose too much, and the darkness will consume you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-200">
            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-400 mb-2">🎭 Dynamic Storytelling</h3>
              <p>Every playthrough is unique with randomly generated characters, families, and scenarios.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-400 mb-2">🌟 Soul-Loss Mechanics</h3>
              <p>Using animus magic corrupts your soul. Lose control as darkness takes over.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-400 mb-2">⚔️ Meaningful Choices</h3>
              <p>Every decision has consequences that ripple through your dragon's story.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-400 mb-2">🔮 AI Corruption</h3>
              <p>When your soul is lost, the game makes increasingly dark choices for you.</p>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <Button 
              size="lg" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-fantasy text-lg py-6"
              onClick={handleNewGame}
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <div className="animate-spin mr-2">⚡</div>
                  Generating Your Dragon...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Quick Start (Random Dragon)
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full border-purple-400/50 text-purple-300 hover:bg-purple-500/10"
              onClick={() => setShowCharacterCreator(true)}
              disabled={isCreating}
            >
              <User className="w-5 h-5 mr-2" />
              Create Custom Dragon
            </Button>

            {savedGames.length > 0 && (
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full border-green-400/50 text-green-300 hover:bg-green-500/10"
                onClick={() => setShowLoadMenu(true)}
                disabled={isCreating}
              >
                <Save className="w-5 h-5 mr-2" />
                Load Saved Game ({savedGames.length})
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-purple-400 hover:bg-purple-500/10 text-sm"
              onClick={() => setShowCredits(true)}
              disabled={isCreating}
            >
              <Music className="w-4 h-4 mr-2" />
              Soundtrack Credits
            </Button>
          </div>

          <div className="text-center text-xs text-purple-400 pt-4 border-t border-purple-700">
            <p>Inspired by the Wings of Fire series by Tui T. Sutherland</p>
            <p className="mt-1">⚠️ Warning: Contains themes of moral corruption and difficult choices</p>
          </div>
        </CardContent>
      </Card>

      {/* Load Game Modal */}
      {showLoadMenu && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-black/90 border-purple-500/50">
            <CardHeader>
              <CardTitle className="text-purple-300">Load Saved Game</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {savedGames.map((game) => (
                  <div
                    key={game.id}
                    className="p-3 bg-purple-900/30 rounded-lg border border-purple-500/30 cursor-pointer hover:bg-purple-800/40 transition-colors"
                    onClick={() => {
                      handleLoadGame(game.id);
                      setShowLoadMenu(false);
                    }}
                  >
                    <div className="font-semibold text-purple-200">
                      {game.characterData.name} the {game.characterData.tribe}
                    </div>
                    <div className="text-xs text-purple-400">
                      Turn {game.turn} • {game.location}
                    </div>
                    <div className="text-xs text-purple-500">
                      Soul: {game.characterData.soulPercentage}% • 
                      Stage: {game.characterData.soulCorruptionStage}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowLoadMenu(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Credits Modal */}
      {showCredits && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg bg-black/95 border-purple-500/50">
            <CardHeader>
              <CardTitle className="text-purple-300 flex items-center">
                <Music className="w-5 h-5 mr-2" />
                Soundtrack Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 text-purple-200">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-purple-300 mb-2">🎵 Music Credits</h3>
                  <p className="text-sm text-purple-400">
                    This game features original soundtracks and compositions from talented artists
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
                    <h4 className="font-semibold text-purple-300 mb-2">Primary Soundtrack</h4>
                    <p className="text-sm">
                      <span className="text-purple-400">Forsaken Dev Team</span>
                    </p>
                    <p className="text-xs text-purple-500 mt-1">
                      Academy themes, corruption tracks, and ambient soundscapes
                    </p>
                  </div>
                  
                  <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
                    <h4 className="font-semibold text-purple-300 mb-2">Additional Compositions</h4>
                    <p className="text-sm">
                      <span className="text-purple-400">Limbus Company</span>
                    </p>
                    <p className="text-xs text-purple-500 mt-1">
                      Special event tracks and atmospheric music
                    </p>
                  </div>
                </div>
                
                <div className="text-center text-xs text-purple-400 pt-4 border-t border-purple-700">
                  <p>All music used with permission and respect to the original creators</p>
                  <p className="mt-1">🐉 Wings of Fire RPG • Enhanced Edition</p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCredits(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
