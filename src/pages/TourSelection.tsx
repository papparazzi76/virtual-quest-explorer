import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getTours, Tour } from '@/integrations/supabase/api';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Play, Building, Users, Star } from 'lucide-react';

const TourSelection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: tours, isLoading, isError } = useQuery<Tour[]>({
    queryKey: ["tours"],
    queryFn: getTours,
  });

  const handleStartTour = (tourId: string) => {
    navigate(`/tour/${tourId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center min-h-[50vh] text-foreground">
          Cargando tours virtuales...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center min-h-[50vh] text-destructive">
          Error al cargar los tours disponibles.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Selecciona tu Tour Virtual
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explora nuestras oficinas en diferentes ciudades de Castilla y León. 
            Cada una ofrece una experiencia única e inmersiva.
          </p>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {tours?.map((tour) => (
            <Card key={tour.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img
                  src={tour.imagen_portada || '/placeholder.svg'}
                  alt={tour.nombre}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    <MapPin className="w-3 h-3 mr-1" />
                    {tour.ciudad}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  {tour.nombre}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {tour.descripcion}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Interactivo</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>Puntos</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleStartTour(tour.id)}
                    className="group-hover:scale-105 transition-transform"
                    disabled={!user}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar Tour
                  </Button>
                </div>
                
                {!user && (
                  <div className="text-sm text-muted-foreground text-center p-2 bg-muted/50 rounded">
                    Inicia sesión para comenzar el tour
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        {!user && (
          <div className="text-center mt-12">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">¿Listo para explorar?</h3>
                <p className="text-muted-foreground mb-4">
                  Crea tu cuenta para acceder a todos los tours virtuales y ganar puntos.
                </p>
                <Button onClick={() => navigate('/auth')} className="w-full">
                  Crear cuenta gratuita
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default TourSelection;