import { useState, useRef, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SOSButton = () => {
  const [pressing, setPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activated, setActivated] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Create audio element for siren
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const startPress = () => {
    setPressing(true);
    setProgress(0);
    
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (progressRef.current) clearInterval(progressRef.current);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    timerRef.current = setTimeout(() => {
      activateSOS();
    }, 5000);
  };

  const endPress = () => {
    setPressing(false);
    setProgress(0);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
  };

  const activateSOS = async () => {
    setActivated(true);
    setPressing(false);

    // Play siren sound
    if (audioRef.current) {
      try {
        // Using a data URL for a simple beep sound
        audioRef.current.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzKH0fPTgjMGHm7A7+OZSA0PVq/n7KhUFApFnd/yuGsbCDGCzPLThTQHHWq77eSVSA4RU6zn66lXEwpEl9z0vWwhBzSEyvPTiDMHHm3A6+SaSwwQUqfj7KtZEwoWX7zt66RRFApFnOD0wWwdCDOIzPPUhjQIHWvB7uebSg4PU67p7a1aEwpDmeD3vnAgBzWIzPPVhTQHHW3C7uWdSg4PUq7p7axaEwpDmN/3vnAgBzWJy/PVhTMHHGzA7eScSg4PU63p7KxaEwoXYLzt7KVSFApFneH1wm0eCDOIzPPVhzUIHmzC7+WdSw4QU6/q7q5bFApEmeL4wHAfCDWKzPTWhzQIHW3B6+OaSw4QU6/r7K1bEwpEmd/3vnEfCDWJy/PWhTQIHWzB6+OZSw4QU67q7K1aEwoWYLzt66RRFQpGneD1wWweCDSIy/PVhzQIHW3C6+ObSg4QU6/r7K1cEwpDl9/3vnAfCDWJy/PVhTQIHG3B6+OZSw4RU67p7K1bEwoVX7vs66RRFQpHnuD1wWwdBzSJy/PVhzQIHG3B6+OZSw4RU6/p7K1bEwoVYLvs66RRFQpGnuH1wWwdCDSJy/PVhzQIHG3B6+OZSw4RU6/p7K1bEwoUX7vs66NQFQpHnuD1wWwdCDSJy/PVhzQIHG3B6+OZSw4RU6/p7K1bEwoVYLvs66RRFQpGnuH1wWwdBzSJy/PVhzQIHG3B6+OZSw4RU6/p7K1bEwoUX7vs66NQFQpHnuD1wWwdCDSJy/PVhzQIHG3B6+OZSw4RU6/p7K1bEwoUX7vs66NQFQpHnuD1wWwdCDSJy/PVhzQIHG3B6+OZSw4RU6/p7K1bEwoUX7vs66NQFQpHnuD1wWwdCDSJy/PVhzQIHG3B6+OZSw4RU6/p7K1bEwoUX7vs66NQFQpHnuD1wWwdCDSJy/PVhzQIHG3B6+OZSw4RU6/p7K1bEwoUX7vs66NQFQpHnuD1wWwdCDSJy/PVhzQIHG3B6+OZSw4RU6/p7K1bEwo=";
        await audioRef.current.play();
      } catch (err) {
        console.error("Audio playback failed:", err);
      }
    }

    // Get location and save SOS alert
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            await supabase.from("sos_alerts").insert({
              user_id: user.id,
              location_lat: latitude,
              location_lng: longitude,
              status: "active",
            });
          }

          // Fetch emergency contacts
          const { data: contacts } = await supabase
            .from("emergency_contacts")
            .select("*")
            .limit(3);

          toast({
            title: "SOS ACTIVATED",
            description: `Emergency contacts notified. Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            variant: "destructive",
          });

          // In a real app, you would send SMS/calls to emergency contacts here
          if (contacts && contacts.length > 0) {
            console.log("Notifying contacts:", contacts);
          }
        }
      );
    }

    // Stop siren after 10 seconds
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setActivated(false);
    }, 10000);
  };

  return (
    <div className="relative">
      <button
        onMouseDown={startPress}
        onMouseUp={endPress}
        onMouseLeave={endPress}
        onTouchStart={startPress}
        onTouchEnd={endPress}
        className={`relative w-48 h-48 rounded-full ${
          activated
            ? "bg-gradient-to-br from-red-500 to-red-700 animate-pulse"
            : pressing
            ? "bg-gradient-to-br from-red-400 to-red-600"
            : "bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
        } shadow-strong flex items-center justify-center transition-all active:scale-95`}
      >
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0 bg-white/30 transition-all"
            style={{ height: `${progress}%` }}
          />
        </div>
        <div className="relative flex flex-col items-center text-white">
          <AlertCircle className="w-16 h-16 mb-2" />
          <span className="text-xl font-bold">
            {activated ? "ACTIVE" : pressing ? "HOLD..." : "SOS"}
          </span>
          <span className="text-xs mt-1">Hold 5 sec</span>
        </div>
      </button>
    </div>
  );
};

export default SOSButton;
