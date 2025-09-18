import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { getHotspots, submitScore, Hotspot, HotspotOptions } from '../integrations/supabase/api';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Card, CardContent } from '../components/ui/card';
import { Play, Eye, Lightbulb, CheckCircle, XCircle, ChevronLeft, Star } from 'lucide-react';
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

  const { data: hotspots, isLoading, isError } = useQuery<Hotspot[]>({
    queryKey: ["hotspots"],
    queryFn: getHotspots,
  });

  const tourConfig = {
    "default": {
      "firstScene": "recepcion",
      "author": "Virtual Quest Explorer",
      "autoLoad": true,
      "showControls": true,
      "compass": true,
    },
    "scenes": {
      "recepcion": {
        "title": "Recepción",
        "type": "equirectangular",
        "panorama": "https://images.unsplash.com/photo-1629904853716-95166b270776?q=80&w=1974&auto=format&fit=crop",
        "hotSpots": hotspots?.filter(h => h.scene === 'recepcion').map(h => ({
          "pitch": h.pitch,
          "yaw": h.yaw,
          "type": "info",
          "text": h.titulo,
          "clickHandlerFunc": () => handleHotspotClick(h),
        })) || [],
      },
      "oficina": {
        "title": "Oficina Abierta",
        "type": "equirectangular",
        "panorama": "https://images.unsplash.com/photo-1596556534568-d01c0e35220c?q=80&w=2070&auto=format&fit=crop",
        "hotSpots": hotspots?.filter(h => h.scene === 'oficina').map(h => ({
          "pitch": h.pitch,
          "yaw": h.yaw,
          "type": "info",
          "text": h.titulo,
          "clickHandlerFunc": () => handleHotspotClick(h),
        })) || [],
      }
    }
  };

  useEffect(() => {
    if (hotspots && !viewer) {
      setViewer(window.pannellum.viewer('vr-tour-container', tourConfig as any));
    }
    if (viewer) {
      viewer.loadScene(currentScene);
    }
  }, [hotspots, currentScene, viewer]);

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
    }
  };

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
      <main className="relative pt-20 h-screen w-full">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="absolute top-24 left-6 z-50 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </Button>
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
                    <Button onClick={() => submitScore(userId!, selectedHotspot.id, selectedHotspot.puntos)}>
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
                  setCurrentScene(opciones.escena_siguiente!);
                  setIsHotspotModalOpen(false);
                }}>
                  Ir a {(selectedHotspot.opciones as HotspotOptions)?.escena_siguiente}
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Scene navigation buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col space-y-4">
          <Button onClick={() => setCurrentScene('recepcion')} variant={currentScene === 'recepcion' ? 'hero' : 'vr'}>
            Ir a Recepción
          </Button>
          <Button onClick={() => setCurrentScene('oficina')} variant={currentScene === 'oficina' ? 'hero' : 'vr'}>
            Ir a Oficina
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Tour;
