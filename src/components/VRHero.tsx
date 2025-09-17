import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Trophy, Zap, Users, Headphones } from "lucide-react";
import heroImage from "@/assets/vr-office-hero.jpg";

const VRHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(34, 34, 85, 0.7), rgba(34, 34, 85, 0.8)), url(${heroImage})`
        }}
      />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full vr-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Title */}
          <div className="mb-8 vr-float">
            <Headphones className="w-20 h-20 mx-auto mb-6 text-accent" />
            <h1 className="text-6xl md:text-8xl font-bold mb-6 gradient-text">
              VR Tour
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Gamificado
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explora espacios virtuales en 360°, interactúa con hotspots, 
              completa desafíos y compite por el primer lugar en el ranking global.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              <Play className="w-5 h-5 mr-2" />
              Iniciar Recorrido
            </Button>
            <Button variant="vr" size="lg" className="text-lg px-8 py-4">
              <Trophy className="w-5 h-5 mr-2" />
              Ver Ranking
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 bg-card/50 backdrop-blur-sm neon-border hover:scale-105 transition-transform duration-300">
              <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-foreground">Recorrido 360°</h3>
              <p className="text-muted-foreground">
                Navega por espacios virtuales inmersivos con hotspots interactivos
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm neon-border hover:scale-105 transition-transform duration-300">
              <Trophy className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-foreground">Gamificación</h3>
              <p className="text-muted-foreground">
                Gana puntos por cada interacción y desbloquea logros únicos
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm neon-border hover:scale-105 transition-transform duration-300">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-foreground">Competencia Global</h3>
              <p className="text-muted-foreground">
                Compite con usuarios de todo el mundo en el ranking oficial
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VRHero;