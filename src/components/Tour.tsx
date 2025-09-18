import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { getHotspots, submitScore, Hotspot, HotspotOptions, getUserScores } from '../integrations/supabase/api';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Play, Eye, Lightbulb, CheckCircle, XCircle, ChevronLeft, Star, Trophy, MapPin, Users, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'pannellum/build/pannellum.css';
import 'pannellum/build/pannellum.js';

// Componente para el tour virtual
const Tour = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();

  const [currentScene, setCurrentScene] = useState('recepcion');
  const [isHotspotModalOpen, setIsHotspotModalOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<'success' | 'failure' | null>(null);
  const [viewer, setViewer] = useState(null);
  const [showProgressPanel, setShowProgressPanel] = useState(false);
  const [visitedScenes, setVisitedScenes] = useState<Set<string>>(new Set(['recepcion']));
  const [completedHotspots, setCompletedHotspots] = useState<Set<string>>(new Set());

  const { data: hotspots, isLoading, isError } = useQuery<Hotspot[]>({
    queryKey: ["hotspots"],
    queryFn: getHotspots,
  });

  const { data: userScores } = useQuery({
    queryKey: ["userScores", userId],
    queryFn: () => getUserScores(userId!),
    enabled: !!userId,
  });

  const scenes = {
    recepcion: {
      title: "Recepción Principal",
      description: "Punto de entrada al edificio corporativo",
      image: "https://fvqbzjiwaftlsbbikuin.supabase.co/storage/v1/object/public/scene-images/20250316_170423_829.jpg"
    },
    oficina: {
      title: "Área de Trabajo",
      description: "Espacio colaborativo y moderno",
      image: "https://fvqbzjiwaftlsbbikuin.supabase.co/storage/v1/object/public/scene-images/20250316_171037_423.jpg"
    },
    sala_reuniones: {
      title: "Sala de Reuniones",
      description: "Espacio para conferencias y presentaciones",
      image: "https://fvqbzjiwaftlsbbikuin.supabase.co/storage/v1/object/public/scene-images/20250316_171119_677.jpg"
    },
    cafeteria: {
      title: "Exposición cocina",
      description: "Área de descanso y socialización",
      image: "https://fvqbzjiwaftlsbbikuin.supabase.co/storage/v1/object/public/scene-images/20250316_171434_722.jpg"
    }
  };

  const tourConfig = {
    "default": {
      "firstScene": "recepcion",
      "author": "Virtual Quest Explorer",
      "autoLoad": true,
      "showControls": true,
      "compass": true,
    },
    "scenes": Object.fromEntries(
      Object.entries(scenes).map(([key, scene]) => [
        key,
        {
          "title": scene.title,
          "type": "equirectangular",
          "panorama": scene.image,
          "hotSpots": hotspots?.filter(h => h.scene === key).map(h => ({
            "pitch": h.pitch,
            "yaw": h.yaw,
            "type": "info",
            "text": h.titulo,
            "clickHandlerFunc": () => handleHotspotClick(h),
          })) || [],
        }
      ])
    )
  };

  useEffect(() => {
    if (hotspots && !viewer) {
      setViewer(window.pannellum.viewer('vr-tour-container', tourConfig as any));
    }
    if (viewer) {
      viewer.loadScene(currentScene);
    }
  }, [hotspots, currentScene, viewer]);

  const handleSceneChange = (sceneName: string) => {
    setCurrentScene(sceneName);
    setVisitedScenes(prev => new Set([...prev, sceneName]));
  };

  const handleHotspotClick = (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot);
    setIsHotspotModalOpen(true);
    setQuizAnswer(null);
    setQuizResult(null);
  };

  const handleQuizSubmit = async () => {
    if (!selectedHotspot || !quizAnswer || !userId) return;

    const opciones = selectedHotspot.opciones as HotspotOptions;
    const correct = opciones?.correcta === quizAnswer;
    setQuizResult(correct ? 'success' : 'failure');

    if (correct && selectedHotspot.puntos) {
      await submitScore(userId, selectedHotspot.id, selectedHotspot.puntos);
      setCompletedHotspots(prev => new Set([...prev, selectedHotspot.id]));
    }
  };

  const handleCollectPoints = async () => {
    if (!selectedHotspot || !userId) return;
    await submitScore(userId, selectedHotspot.id, selectedHotspot.puntos || 0);
    setCompletedHotspots(prev => new Set([...prev, selectedHotspot.id]));
    setIsHotspotModalOpen(false);
  };

  const totalHotspots = hotspots?.length || 0;
  const totalScenes = Object.keys(scenes).length;
  const progressPercentage = ((visitedScenes.size / totalScenes) * 50) + ((completedHotspots.size / totalHotspots) * 50);
  const totalPoints = userScores?.reduce((sum, score) => sum + score.puntos, 0) || 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
        Cargando tour virtual...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-destructive">
        Error al cargar el tour.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Header con estadísticas */}
      <div className="absolute top-20 left-0 right-0 z-40 bg-background/90 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">{scenes[currentScene as keyof typeof scenes]?.title}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">{totalPoints} pts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24">
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <span className="text-sm text-muted-foreground">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProgressPanel(!showProgressPanel)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <main className="relative pt-32 h-screen w-full">
        <div id="vr-tour-container" className="absolute inset-0 h-full w-full" />
        
        {/* Hotspot modal */}
        <Dialog open={isHotspotModalOpen} onOpenChange={setIsHotspotModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedHotspot?.tipo === 'info' && <Lightbulb />}
                {selectedHotspot?.tipo === 'quiz' && <Play />}
                {selectedHotspot?.tipo === 'coleccionable' && <Eye />}
                {selectedHotspot?.titulo}
              </DialogTitle>
              <DialogDescription>
                {selectedHotspot?.contenido}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {selectedHotspot?.tipo === 'quiz' && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Pregunta:</h3>
                  <p>{(selectedHotspot.opciones as HotspotOptions)?.pregunta}</p>
                  <div className="mt-4 space-y-2">
                    {(selectedHotspot.opciones as HotspotOptions)?.opciones?.map((opcion) => (
                      <Button
                        key={opcion}
                        variant={quizAnswer === opcion ? (quizResult === 'success' ? 'default' : 'destructive') : 'outline'}
                        className="w-full justify-start"
                        onClick={() => setQuizAnswer(opcion)}
                        disabled={!!quizResult}
                      >
                        {opcion}
                      </Button>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <Button onClick={handleQuizSubmit} disabled={!quizAnswer || !!quizResult}>
                      Responder
                    </Button>
                    {quizResult === 'success' && <CheckCircle className="h-6 w-6 text-green-500" />}
                    {quizResult === 'failure' && <XCircle className="h-6 w-6 text-red-500" />}
                  </div>
                </div>
              )}
            </div>
            {selectedHotspot?.tipo === 'coleccionable' && selectedHotspot.puntos && (
              <div className="mt-4">
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span className="font-semibold">Puntos: {selectedHotspot.puntos}</span>
                    </div>
                    <Button onClick={handleCollectPoints}>
                      Recolectar
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
            <div className="flex justify-between mt-4">
              <Button onClick={() => setIsHotspotModalOpen(false)}>Cerrar</Button>
              {(selectedHotspot?.opciones as HotspotOptions)?.escena_siguiente && (
                <Button onClick={() => {
                  const opciones = selectedHotspot.opciones as HotspotOptions;
                  handleSceneChange(opciones.escena_siguiente!);
                  setIsHotspotModalOpen(false);
                }}>
                  Ir a {(selectedHotspot.opciones as HotspotOptions)?.escena_siguiente}
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Panel de progreso lateral */}
        {showProgressPanel && (
          <div className="fixed top-32 right-6 z-50 w-80 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Progreso del Tour
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progreso Total</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} />
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Escenas Visitadas ({visitedScenes.size}/{totalScenes})</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(scenes).map(([key, scene]) => (
                      <div key={key} className="flex items-center gap-2">
                        <Badge 
                          variant={visitedScenes.has(key) ? "default" : "outline"}
                          className="text-xs"
                        >
                          {visitedScenes.has(key) ? "✓" : "○"}
                        </Badge>
                        <span className="text-sm">{scene.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Puntos Totales</h4>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-lg font-bold">{totalPoints}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Hotspots Completados</h4>
                  <span className="text-sm text-muted-foreground">
                    {completedHotspots.size} de {totalHotspots} interacciones
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navegación de escenas mejorada */}
        <div className="fixed bottom-6 right-6 flex flex-col space-y-2 z-40">
          {Object.entries(scenes).map(([key, scene]) => (
            <Button
              key={key}
              onClick={() => handleSceneChange(key)}
              variant={currentScene === key ? 'default' : 'outline'}
              size="sm"
              className="min-w-[140px] justify-start"
            >
              <div className="flex items-center gap-2">
                {visitedScenes.has(key) && <CheckCircle className="h-3 w-3" />}
                <MapPin className="h-3 w-3" />
                <span className="text-xs">{scene.title}</span>
              </div>
            </Button>
          ))}
        </div>

        {/* Minimap o información de escena */}
        <div className="fixed bottom-6 left-6 z-40">
          <Card className="bg-background/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-sm">
                <div className="font-medium">{scenes[currentScene as keyof typeof scenes]?.title}</div>
                <div className="text-muted-foreground text-xs">
                  {scenes[currentScene as keyof typeof scenes]?.description}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Eye className="h-3 w-3" />
                  <span className="text-xs">
                    {hotspots?.filter(h => h.scene === currentScene).length || 0} puntos de interés
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Tour;
