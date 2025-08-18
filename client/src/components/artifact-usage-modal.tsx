import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Sparkles, Skull, Heart, Eye } from "lucide-react";
import { AnimusArtifact, ArtifactOption } from "@/lib/animus-artifact-system";
import { Character, InventoryItem } from "@shared/schema";

interface ArtifactUsageModalProps {
  isOpen: boolean;
  onClose: () => void;
  artifact: InventoryItem;
  character: Character;
  onUseArtifact: (artifactId: string, optionId: string) => void;
}

export function ArtifactUsageModal({
  isOpen,
  onClose,
  artifact,
  character,
  onUseArtifact
}: ArtifactUsageModalProps) {
  const [selectedOption, setSelectedOption] = useState<ArtifactOption | null>(null);

  // Get the full artifact data from the animus system
  const fullArtifact = require('@/lib/animus-artifact-system').ANIMUS_ARTIFACTS.find(
    (a: AnimusArtifact) => a.id === artifact.id
  ) as AnimusArtifact | undefined;

  if (!fullArtifact) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Artifact Not Found</DialogTitle>
          </DialogHeader>
          <p>This artifact's data could not be loaded.</p>
        </DialogContent>
      </Dialog>
    );
  }

  const handleUseOption = () => {
    if (selectedOption) {
      // Pass the option ID as part of the result string for the engine to process
      const result = `Using option: ${selectedOption.id} - ${selectedOption.outcome}`;
      onUseArtifact(artifact.id, result);
      onClose();
    }
  };

  const getCostColor = (cost: number) => {
    if (cost === 0) return "text-green-600";
    if (cost <= 2) return "text-yellow-600"; 
    return "text-red-600";
  };

  const getCorruptionIcon = (corruption: boolean) => {
    return corruption ? <Skull className="w-4 h-4 text-red-500" /> : <Heart className="w-4 h-4 text-blue-500" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Using: {fullArtifact.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Artifact Details */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {fullArtifact.cursed && <AlertTriangle className="w-5 h-5 text-red-500" />}
                  {fullArtifact.name}
                  <Badge variant={fullArtifact.cursed ? "destructive" : "secondary"}>
                    {fullArtifact.rarity}
                  </Badge>
                </CardTitle>
                <CardDescription>{fullArtifact.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Power Level:</span>
                    <Badge variant="outline">{fullArtifact.powerLevel}</Badge>
                  </div>
                  
                  {fullArtifact.enchantments && fullArtifact.enchantments.length > 0 && (
                    <div>
                      <span className="font-medium">Enchantments:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {fullArtifact.enchantments.map((enchantment, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {enchantment}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm">{fullArtifact.discoveryScenario}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage Options */}
          <div>
            <h3 className="font-semibold mb-3">How do you want to use this artifact?</h3>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {fullArtifact.usageOptions.map((option, index) => (
                  <Card 
                    key={option.id}
                    className={`cursor-pointer transition-colors ${
                      selectedOption?.id === option.id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedOption(option)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center justify-between">
                        {option.text}
                        <div className="flex items-center gap-1">
                          {getCorruptionIcon(option.corruption)}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">
                        {option.outcome}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs">
                          <span className={getCostColor(option.soulCost)}>
                            Soul Cost: {option.soulCost}
                          </span>
                          <span className={getCostColor(option.sanityCost)}>
                            Sanity Cost: {option.sanityCost}
                          </span>
                        </div>
                        
                        {option.corruption && (
                          <Badge variant="destructive" className="text-xs">
                            Corrupting
                          </Badge>
                        )}
                      </div>
                      
                      {option.consequences.length > 0 && (
                        <>
                          <Separator className="my-2" />
                          <div className="space-y-1">
                            <span className="text-xs font-medium">Consequences:</span>
                            {option.consequences.map((consequence, i) => (
                              <div key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {consequence}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <Separator />
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Current Soul: {character.soulPercentage}% | Current Sanity: {character.sanityPercentage}%
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleUseOption}
              disabled={!selectedOption}
              className="min-w-[100px]"
            >
              Use Artifact
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}