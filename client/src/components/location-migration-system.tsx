import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, Plane, Clock, AlertTriangle, Users, Thermometer } from 'lucide-react';
import { Character } from '@shared/schema';
import { LOCATIONS, LocationSystem, Location } from '@/lib/location-system';

interface LocationMigrationSystemProps {
  character: Character;
  currentLocation: Location;
  gameData: any;
  onMigrate: (destination: Location) => void;
}

export function LocationMigrationSystem({ 
  character, 
  currentLocation, 
  gameData, 
  onMigrate 
}: LocationMigrationSystemProps) {
  const [selectedDestination, setSelectedDestination] = useState<Location | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);
  
  const availableDestinations = LocationSystem.getAvailableDestinations(currentLocation);

  const handleMigration = async (destination: Location) => {
    const travelCheck = LocationSystem.canTravelToLocation(character, destination);
    
    if (!travelCheck.canTravel) {
      alert(travelCheck.reason);
      return;
    }

    setIsMigrating(true);
    setMigrationProgress(0);
    
    // Animate migration progress
    const travelTime = LocationSystem.calculateTravelTime(currentLocation, destination);
    const progressInterval = setInterval(() => {
      setMigrationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsMigrating(false);
            setMigrationProgress(0);
            onMigrate(destination);
          }, 500);
          return 100;
        }
        return prev + (100 / (travelTime * 2)); // Smooth animation over travel time
      });
    }, 200);
  };

  const getDangerLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-green-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-orange-500';
      case 4: return 'bg-red-500';
      case 5: return 'bg-red-700';
      default: return 'bg-gray-500';
    }
  };

  const getDangerLevelText = (level: number) => {
    switch (level) {
      case 1: return 'Very Safe';
      case 2: return 'Safe';
      case 3: return 'Moderate Risk';
      case 4: return 'Dangerous';
      case 5: return 'Extremely Dangerous';
      default: return 'Unknown';
    }
  };

  if (isMigrating) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Plane className="h-5 w-5 animate-bounce" />
            Traveling...
          </CardTitle>
          <CardDescription>
            Flying to {selectedDestination?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={migrationProgress} className="w-full" />
            <div className="text-center text-sm text-gray-600">
              {Math.round(migrationProgress)}% Complete
            </div>
            {/* Dragon flying animation */}
            <div className="relative h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg overflow-hidden">
              <div 
                className="absolute top-4 h-8 w-8 bg-purple-600 rounded-full transition-all duration-200 ease-linear"
                style={{ 
                  left: `${migrationProgress}%`,
                  transform: 'translateX(-50%)',
                  clipPath: 'polygon(0% 50%, 25% 0%, 50% 25%, 75% 0%, 100% 50%, 75% 100%, 50% 75%, 25% 100%)'
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">
                Flying across the world...
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Location Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Current Location: {currentLocation.name}
          </CardTitle>
          <CardDescription>
            {currentLocation.continent} - {currentLocation.region}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-2">{currentLocation.description}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Thermometer className="h-3 w-3" />
              {currentLocation.climate}
            </Badge>
            <Badge 
              variant="secondary" 
              className={`${getDangerLevelColor(currentLocation.dangerLevel)} text-white`}
            >
              {getDangerLevelText(currentLocation.dangerLevel)}
            </Badge>
          </div>
          {currentLocation.specialFeatures.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium mb-1">Special Features:</h4>
              <div className="flex flex-wrap gap-1">
                {currentLocation.specialFeatures.map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Migration Options */}
      <Card>
        <CardHeader>
          <CardTitle>Available Destinations</CardTitle>
          <CardDescription>
            Choose where to travel next. Different locations offer unique experiences and storylines.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {availableDestinations.map((destination) => {
              const travelTime = LocationSystem.calculateTravelTime(currentLocation, destination);
              const travelCheck = LocationSystem.canTravelToLocation(character, destination);
              const tribalRelation = LocationSystem.getTribalRelationships(destination, character);

              return (
                <Dialog key={destination.id}>
                  <DialogTrigger asChild>
                    <Card 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        !travelCheck.canTravel ? 'opacity-50' : ''
                      }`}
                      onClick={() => setSelectedDestination(destination)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center justify-between">
                          {destination.name}
                          <Badge variant="outline" className="text-xs">
                            {destination.continent}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {destination.region}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {travelTime} days
                          </div>
                          <Badge 
                            className={`${getDangerLevelColor(destination.dangerLevel)} text-white text-xs`}
                          >
                            {getDangerLevelText(destination.dangerLevel)}
                          </Badge>
                        </div>
                        {!travelCheck.canTravel && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                            <AlertTriangle className="h-3 w-3" />
                            Restricted
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {destination.name}
                      </DialogTitle>
                      <DialogDescription>
                        {destination.continent} - {destination.region}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <p className="text-sm">{destination.description}</p>
                      
                      {/* Travel Information */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Travel Info</h4>
                          <div className="text-xs space-y-1">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              {travelTime} days journey
                            </div>
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-3 w-3" />
                              <Badge className={`${getDangerLevelColor(destination.dangerLevel)} text-white`}>
                                {getDangerLevelText(destination.dangerLevel)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Primary Tribes</h4>
                          <div className="flex flex-wrap gap-1">
                            {destination.primaryTribes.map((tribe, index) => (
                              <Badge 
                                key={index} 
                                variant={tribe === character.tribe ? "default" : "outline"}
                                className="text-xs"
                              >
                                {tribe}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Tribal Relations */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Local Reception
                        </h4>
                        <p className="text-xs text-gray-600">{tribalRelation.description}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              tribalRelation.welcomeLevel >= 0 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ 
                              width: `${Math.abs(tribalRelation.welcomeLevel)}%`,
                              marginLeft: tribalRelation.welcomeLevel < 0 ? `${100 - Math.abs(tribalRelation.welcomeLevel)}%` : '0'
                            }}
                          />
                        </div>
                      </div>

                      {/* Special Features */}
                      {destination.specialFeatures.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Special Features</h4>
                          <div className="flex flex-wrap gap-1">
                            {destination.specialFeatures.map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Travel Restrictions */}
                      {!travelCheck.canTravel && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-red-700">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="font-medium text-sm">Cannot Travel</span>
                          </div>
                          <p className="text-xs text-red-600 mt-1">{travelCheck.reason}</p>
                        </div>
                      )}

                      {/* Travel Button */}
                      <div className="flex justify-end pt-4">
                        <Button
                          onClick={() => handleMigration(destination)}
                          disabled={!travelCheck.canTravel}
                          className="flex items-center gap-2"
                        >
                          <Plane className="h-4 w-4" />
                          Travel Here
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}