import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SafeSpot {
  name: string;
  address: string;
  distance: string;
}

const SafeSpots = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [safeSpots, setSafeSpots] = useState<SafeSpot[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          
          // Mock safe spots - in a real app, this would query a database or API
          setSafeSpots([
            {
              name: "Police Station",
              address: "123 Main Street",
              distance: "0.5 km",
            },
            {
              name: "Hospital",
              address: "456 Medical Ave",
              distance: "0.8 km",
            },
            {
              name: "Women's Shelter",
              address: "789 Safety Boulevard",
              distance: "1.2 km",
            },
          ]);
        },
        () => {
          toast({
            title: "Location Error",
            description: "Could not get your location",
            variant: "destructive",
          });
        }
      );
    }
  }, [toast]);

  const openInMaps = (spot: SafeSpot) => {
    if (location) {
      const query = encodeURIComponent(`${spot.name}, ${spot.address}`);
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${query}`,
        "_blank"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <div className="p-4 flex items-center border-b border-border bg-card/50 backdrop-blur">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold ml-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Nearest Safe Spots
        </h1>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-md space-y-4">
        {location ? (
          <>
            <Card className="shadow-soft bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <p className="text-sm">
                    Your location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {safeSpots.map((spot, index) => (
              <Card key={index} className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {spot.name}
                    <span className="text-sm font-normal text-muted-foreground">
                      {spot.distance}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{spot.address}</p>
                  <Button
                    onClick={() => openInMaps(spot)}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <Card className="shadow-soft">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Getting your location...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SafeSpots;
