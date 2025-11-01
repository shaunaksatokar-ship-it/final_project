import { useState } from "react";
import { Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const FakeCallButton = () => {
  const [showCall, setShowCall] = useState(false);

  const triggerCall = () => {
    setShowCall(true);
    // Auto dismiss after 10 seconds
    setTimeout(() => setShowCall(false), 10000);
  };

  return (
    <>
      <Button
        onClick={triggerCall}
        className="w-full h-16 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-soft"
      >
        <Phone className="w-6 h-6 mr-2" />
        Trigger Fake Call
      </Button>

      <Dialog open={showCall} onOpenChange={setShowCall}>
        <DialogContent className="max-w-md p-0 gap-0 border-0 bg-transparent">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            {/* Call Screen */}
            <div className="p-8 text-center">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4">
                  <span className="text-4xl">👤</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Raj</h2>
                <p className="text-gray-300">Incoming call...</p>
              </div>

              <div className="flex justify-center gap-8 mt-12">
                <button
                  onClick={() => setShowCall(false)}
                  className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition-all active:scale-95"
                >
                  <X className="w-8 h-8 text-white" />
                </button>
                <button
                  onClick={() => setShowCall(false)}
                  className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-lg transition-all active:scale-95"
                >
                  <Phone className="w-8 h-8 text-white" />
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FakeCallButton;
