import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AuthSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Si ya está autenticado, mostrar sección de bienvenida
  if (user) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">
              ¡Bienvenido al Tour VR!
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tu cuenta está lista. Explora, interactúa y gana puntos en nuestro recorrido virtual.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-primary/20">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Cuenta Verificada</h3>
                <p className="text-sm text-muted-foreground">
                  Tu perfil está activo y listo para el tour
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Comunidad</h3>
                <p className="text-sm text-muted-foreground">
                  Compite con otros usuarios en el ranking
                </p>
              </CardContent>
            </Card>

            <Card className="border-secondary/20">
              <CardContent className="p-6 text-center">
                <Trophy className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Gamificación</h3>
                <p className="text-sm text-muted-foreground">
                  Gana puntos por cada interacción completada
                </p>
              </CardContent>
            </Card>
          </div>

          <Button 
            size="lg" 
            variant="vr" 
            className="text-lg px-8"
            onClick={() => navigate('/tour')}
          >
            Comenzar Tour VR
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    );
  }

  // Si no está autenticado, mostrar call-to-action
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Únete a la Experiencia
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Crea tu cuenta para desbloquear el tour completo, ganar puntos y competir en el ranking.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-primary/20">
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Acceso Completo</h3>
              <p className="text-sm text-muted-foreground">
                Desbloquea todas las funciones del tour
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-accent mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Puntos y Rankings</h3>
              <p className="text-sm text-muted-foreground">
                Gana puntos y compite con otros usuarios
              </p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-secondary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Comunidad</h3>
              <p className="text-sm text-muted-foreground">
                Únete a otros exploradores VR
              </p>
            </CardContent>
          </Card>
        </div>

        <Button 
          size="lg" 
          variant="vr" 
          className="text-lg px-8"
          onClick={() => navigate('/auth')}
        >
          Crear Cuenta Gratis
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
};

export default AuthSection;
