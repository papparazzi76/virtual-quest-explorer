import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { getDailyContent, submitDailyProgress, getUserDailyProgress, DailyContent, getUserScores } from '../integrations/supabase/api';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { CheckCircle, ChevronLeft, Star, Trophy, MapPin, Settings, Calendar, Eye } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import DailyPOIModal from './DailyPOIModal';
import 'pannellum/build/pannellum.css';
import 'pannellum/build/pannellum.js';

// Componente para el tour virtual
const Tour = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();
  const { tourId } = useParams<{ tourId: string }>();

  const [currentScene, setCurrentScene] = useState('recepcion');
  const [isPOIModalOpen, setIsPOIModalOpen] = useState(false);
  const [selectedPOI, setSelectedPOI] = useState<DailyContent | null>(null);
  const [quizResult, setQuizResult] = useState<'success' | 'failure' | null>(null);
  const [viewer, setViewer] = useState(null);
  const [showProgressPanel, setShowProgressPanel] = useState(false);
  const [visitedScenes, setVisitedScenes] = useState<Set<string>>(new Set(['recepcion']));
  const [completedPOIs, setCompletedPOIs] = useState<Set<string>>(new Set());

  const { data: dailyPOIs, isLoading, isError } = useQuery<DailyContent[]>({
    queryKey: ["dailyContent", tourId],
    queryFn: () => getDailyContent(tourId!),
    enabled: !!tourId,
  });

  const { data: userProgress } = useQuery({
    queryKey: ["userProgress", userId],
    queryFn: () => getUserDailyProgress(userId!),
    enabled: !!userId,
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
          "hotSpots": dailyPOIs?.filter(poi => {
            const posData = poi.position_data as any;
            return posData.scene === key;
          }).map(poi => {
            const posData = poi.position_data as any;
            return {
              "pitch": posData.pitch,
              "yaw": posData.yaw,
              "type": "info",
              "text": poi.title,
              "clickHandlerFunc": () => handlePOIClick(poi),
            };
          }) || [],
        }
      ])
    )
  };

  useEffect(() => {
    if (dailyPOIs && !viewer) {
      setViewer(window.pannellum.viewer('vr-tour-container', tourConfig as any));
    }
    if (viewer) {
      viewer.loadScene(currentScene);
    }
  }, [dailyPOIs, currentScene, viewer]);

  useEffect(() => {
    if (userProgress) {
      const completedIds = new Set(userProgress.map(p => p.daily_content_id));
      setCompletedPOIs(completedIds);
    }
  }, [userProgress]);

  const handleSceneChange = (sceneName: string) => {
    setCurrentScene(sceneName);
    setVisitedScenes(prev => new Set([...prev, sceneName]));
  };

  const handlePOIClick = (poi: DailyContent) => {
    setSelectedPOI(poi);
    setIsPOIModalOpen(true);
    setQuizResult(null);
  };

  const handleQuizSubmit = async (answer: string) => {
    if (!selectedPOI || !userId) return;

    const content = selectedPOI.content as any;
    const correct = content.correct_answer === answer;
    setQuizResult(correct ? 'success' : 'failure');

    if (correct) {
      await submitDailyProgress(userId, selectedPOI.id, selectedPOI.points, { 
        answer, 
        correct: true 
      });
      setCompletedPOIs(prev => new Set([...prev, selectedPOI.id]));
    } else {
      await submitDailyProgress(userId, selectedPOI.id, 0, { 
        answer, 
        correct: false 
      });
    }
  };

  const handleCompleteInteraction = async (interactionData?: any) => {
    if (!selectedPOI || !userId) return;
    
    await submitDailyProgress(userId, selectedPOI.id, selectedPOI.points, interactionData);
    setCompletedPOIs(prev => new Set([...prev, selectedPOI.id]));
    setIsPOIModalOpen(false);
  };

  const totalPOIs = dailyPOIs?.length || 0;
  const totalScenes = Object.keys(scenes).length;
  const progressPercentage = ((visitedScenes.size / totalScenes) * 50) + ((completedPOIs.size / totalPOIs) * 50);
  const totalPoints = userProgress?.reduce((sum, progress) => sum + progress.points_earned, 0) || 0;

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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">{scenes[currentScene as keyof typeof scenes]?.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('es-ES')}
                </span>
              </div>
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
        
        {/* Daily POI modal */}
        <DailyPOIModal
          isOpen={isPOIModalOpen}
          onClose={() => setIsPOIModalOpen(false)}
          poi={selectedPOI}
          onSubmitAnswer={handleQuizSubmit}
          onCompleteInteraction={handleCompleteInteraction}
          isCompleted={selectedPOI ? completedPOIs.has(selectedPOI.id) : false}
          quizResult={quizResult}
        />

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
                  <h4 className="font-medium mb-2">POIs Completados</h4>
                  <span className="text-sm text-muted-foreground">
                    {completedPOIs.size} de {totalPOIs} POIs diarios
                  </span>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Progreso Diario</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Preguntas: {dailyPOIs?.filter(p => p.poi_type === 'question' && completedPOIs.has(p.id)).length || 0}/5</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Multimedia: {dailyPOIs?.filter(p => p.poi_type === 'multimedia' && completedPOIs.has(p.id)).length || 0}/3</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Reseña: {dailyPOIs?.filter(p => p.poi_type === 'google_review' && completedPOIs.has(p.id)).length || 0}/1</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Producto: {dailyPOIs?.filter(p => p.poi_type === 'product' && completedPOIs.has(p.id)).length || 0}/1</span>
                    </div>
                  </div>
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
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs">
                    {dailyPOIs?.filter(poi => {
                      const posData = poi.position_data as any;
                      return posData.scene === currentScene;
                    }).length || 0} POIs disponibles
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
