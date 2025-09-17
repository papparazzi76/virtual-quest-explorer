import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Trophy, Star, Medal, Gamepad2, Eye } from "lucide-react";
import leaderboardImage from "@/assets/leaderboard-preview.jpg";
import hotspotImage from "@/assets/hotspot-icon.jpg";

const FeaturePreview = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold gradient-text mb-6">
            Experiencia Completa VR
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubre un mundo virtual lleno de desafíos, puntos y competencia global
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Hotspots Feature */}
          <div>
            <Badge variant="secondary" className="mb-4">
              <Target className="w-4 h-4 mr-2" />
              Hotspots Interactivos
            </Badge>
            <h3 className="text-3xl font-bold mb-4 text-foreground">
              Descubre Información Oculta
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              Interactúa con hotspots distribuidos por el espacio virtual. Cada uno 
              contiene información única, quizzes interactivos o coleccionables especiales 
              que te darán puntos extra.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary vr-pulse" />
                <span className="text-muted-foreground">Información contextual</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent vr-pulse" />
                <span className="text-muted-foreground">Quizzes interactivos</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary vr-pulse" />
                <span className="text-muted-foreground">Coleccionables únicos</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden neon-border">
              <img 
                src={hotspotImage} 
                alt="Hotspot Interactivo VR" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center vr-float">
              <Eye className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Leaderboard Feature */}
          <div className="order-2 lg:order-1 relative">
            <div className="aspect-video rounded-2xl overflow-hidden neon-border">
              <img 
                src={leaderboardImage} 
                alt="Ranking Global VR Tour" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center vr-float">
              <Trophy className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <Badge variant="secondary" className="mb-4">
              <Medal className="w-4 h-4 mr-2" />
              Ranking Global
            </Badge>
            <h3 className="text-3xl font-bold mb-4 text-foreground">
              Compite Globalmente
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              Cada interacción te otorga puntos que se reflejan en tiempo real 
              en el ranking global. Compite con usuarios de todo el mundo y 
              alcanza la cima del leaderboard.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="p-4 bg-card/50 neon-border">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Puntos</span>
                </div>
                <p className="text-sm text-muted-foreground">Por cada hotspot</p>
              </Card>
              
              <Card className="p-4 bg-card/50 neon-border">
                <div className="flex items-center gap-2 mb-2">
                  <Gamepad2 className="w-5 h-5 text-accent" />
                  <span className="font-semibold">Logros</span>
                </div>
                <p className="text-sm text-muted-foreground">Desbloquea especiales</p>
              </Card>
            </div>

            <Button variant="game" size="lg">
              <Trophy className="w-5 h-5 mr-2" />
              Ver Ranking Actual
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturePreview;