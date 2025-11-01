import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, AlertTriangle, MessageSquare, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SOSButton from "@/components/SOSButton";
import FakeCallButton from "@/components/FakeCallButton";
import { User as SupabaseUser } from "@supabase/supabase-js";

const Home = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
          
          if (navigator.share) {
            navigator.share({
              title: "My Current Location",
              text: "I'm sharing my location with you for safety",
              url: locationUrl,
            }).catch(() => {
              toast({
                title: "Location",
                description: `Lat: ${latitude}, Lng: ${longitude}`,
              });
            });
          } else {
            toast({
              title: "Location",
              description: `Lat: ${latitude}, Lng: ${longitude}`,
            });
          }
        },
        () => {
          toast({
            title: "Error",
            description: "Could not get your location",
            variant: "destructive",
          });
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-border bg-card/50 backdrop-blur">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Rakshini
        </h1>
        <Button variant="ghost" size="icon" onClick={handleSignOut}>
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6 max-w-md pb-24">
        {/* Fake Call Button */}
        <FakeCallButton />

        {/* SOS Button */}
        <div className="flex justify-center my-8">
          <SOSButton />
        </div>

        {/* Action Buttons */}
        <div className="grid gap-4">
          <Button
            onClick={handleShareLocation}
            className="h-14 text-base bg-card hover:bg-card/80 text-foreground border-2 border-border shadow-soft"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Share Live Location
          </Button>

          <Button
            onClick={() => navigate("/emergency-contacts")}
            className="h-14 text-base bg-card hover:bg-card/80 text-foreground border-2 border-border shadow-soft"
          >
            <Phone className="w-5 h-5 mr-2" />
            Emergency Contacts
          </Button>

          <Button
            onClick={() => navigate("/safe-spots")}
            className="h-14 text-base bg-card hover:bg-card/80 text-foreground border-2 border-border shadow-soft"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Nearest Safe Spot
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-strong">
        <div className="container mx-auto max-w-md">
          <div className="grid grid-cols-3 gap-1 p-2">
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1 h-auto py-3"
              onClick={() => navigate("/ai-chat")}
            >
              <MessageSquare className="w-6 h-6 text-primary" />
              <span className="text-xs">RakshiniAI</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1 h-auto py-3"
              onClick={() => navigate("/authorities")}
            >
              <AlertTriangle className="w-6 h-6 text-primary" />
              <span className="text-xs">Authorities</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1 h-auto py-3"
              onClick={() => navigate("/profile")}
            >
              <User className="w-6 h-6 text-primary" />
              <span className="text-xs">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
