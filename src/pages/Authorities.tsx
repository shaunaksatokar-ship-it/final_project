import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Phone } from "lucide-react";

const emergencyNumbers = [
  { name: "Police", number: "100", description: "For immediate police assistance" },
  { name: "Women Helpline", number: "1091", description: "National helpline for women in distress" },
  { name: "Ambulance", number: "102", description: "Emergency medical services" },
  { name: "Women Helpline (Domestic Abuse)", number: "181", description: "For domestic violence and abuse" },
];

const Authorities = () => {
  const navigate = useNavigate();

  const makeCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <div className="p-4 flex items-center border-b border-border bg-card/50 backdrop-blur">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold ml-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Contact Authorities
        </h1>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-md space-y-4">
        {emergencyNumbers.map((item) => (
          <Card key={item.number} className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{item.description}</p>
              <Button
                onClick={() => makeCall(item.number)}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white h-12"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call {item.number}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Authorities;
