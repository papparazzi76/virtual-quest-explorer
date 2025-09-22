import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Star, Play, Image, Speaker, ExternalLink, Package } from 'lucide-react';
import { DailyContent } from '@/integrations/supabase/api';

interface DailyPOIModalProps {
  isOpen: boolean;
  onClose: () => void;
  poi: DailyContent | null;
  onSubmitAnswer: (answer: string) => void;
  onCompleteInteraction: (interactionData?: any) => void;
  isCompleted: boolean;
  quizResult?: 'success' | 'failure' | null;
}

const DailyPOIModal: React.FC<DailyPOIModalProps> = ({
  isOpen,
  onClose,
  poi,
  onSubmitAnswer,
  onCompleteInteraction,
  isCompleted,
  quizResult
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  if (!poi) return null;

  const content = poi.content as any;
  const positionData = poi.position_data as any;

  const getIcon = () => {
    switch (poi.poi_type) {
      case 'question': return <Play className="h-5 w-5" />;
      case 'multimedia': return <Image className="h-5 w-5" />;
      case 'google_review': return <ExternalLink className="h-5 w-5" />;
      case 'product': return <Package className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  const renderContent = () => {
    switch (poi.poi_type) {
      case 'question':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Pregunta:</h3>
              <p className="text-foreground">{content.question}</p>
            </div>
            
            <div className="space-y-2">
              {content.options?.map((option: string, index: number) => (
                <Button
                  key={index}
                  variant={
                    selectedAnswer === option 
                      ? (quizResult === 'success' ? 'default' : quizResult === 'failure' ? 'destructive' : 'secondary')
                      : 'outline'
                  }
                  className="w-full justify-start"
                  onClick={() => setSelectedAnswer(option)}
                  disabled={!!quizResult || isCompleted}
                >
                  {option}
                  {quizResult && selectedAnswer === option && (
                    <span className="ml-auto">
                      {quizResult === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    </span>
                  )}
                </Button>
              ))}
            </div>
            
            {quizResult === 'failure' && content.explanation && (
              <Card className="bg-destructive/10 border-destructive/20">
                <CardContent className="p-4">
                  <p className="text-sm">{content.explanation}</p>
                </CardContent>
              </Card>
            )}
            
            <div className="flex justify-between items-center">
              <Button 
                onClick={() => onSubmitAnswer(selectedAnswer)} 
                disabled={!selectedAnswer || !!quizResult || isCompleted}
              >
                Responder
              </Button>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{poi.points} pts</span>
              </div>
            </div>
          </div>
        );

      case 'multimedia':
        return (
          <div className="space-y-4">
            {content.type === 'video' && (
              <div className="aspect-video">
                <iframe
                  src={content.url}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
            
            {content.type === 'image_gallery' && (
              <div className="grid grid-cols-2 gap-2">
                {content.images?.map((img: string, index: number) => (
                  <img 
                    key={index}
                    src={img} 
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
            
            {content.type === 'audio' && (
              <div className="flex items-center justify-center p-8 bg-muted rounded-lg">
                <div className="text-center">
                  <Speaker className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <audio controls className="mb-4">
                    <source src={content.url} type="audio/mpeg" />
                    Tu navegador no soporta audio.
                  </audio>
                </div>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground">{content.description}</p>
            
            <div className="flex justify-between items-center">
              <Button 
                onClick={() => onCompleteInteraction({ viewed: true })}
                disabled={isCompleted}
              >
                {isCompleted ? 'Completado' : 'Marcar como visto'}
              </Button>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{poi.points} pts</span>
              </div>
            </div>
          </div>
        );

      case 'google_review':
        return (
          <div className="space-y-4">
            <p className="text-foreground">{content.message}</p>
            
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Deja tu reseña en Google</h4>
                    <p className="text-sm text-muted-foreground">Tu opinión es muy valiosa</p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button asChild>
                  <a href={content.google_review_url} target="_blank" rel="noopener noreferrer">
                    Ir a Google
                  </a>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => onCompleteInteraction({ reviewed: true })}
                  disabled={isCompleted}
                >
                  {isCompleted ? 'Completado' : 'Marcar completado'}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{poi.points} pts</span>
              </div>
            </div>
          </div>
        );

      case 'product':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{content.product_name}</h3>
              <p className="text-muted-foreground">{content.description}</p>
            </div>
            
            {content.benefits && (
              <div>
                <h4 className="font-medium mb-2">Beneficios:</h4>
                <div className="space-y-1">
                  {content.benefits.map((benefit: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {content.contact_info && (
              <Card className="bg-secondary/20">
                <CardContent className="p-4">
                  <p className="text-sm">
                    <strong>Contacto:</strong> {content.contact_info}
                  </p>
                </CardContent>
              </Card>
            )}
            
            <div className="flex justify-between items-center">
              <Button 
                onClick={() => onCompleteInteraction({ product_viewed: true })}
                disabled={isCompleted}
              >
                {isCompleted ? 'Completado' : 'Producto encontrado'}
              </Button>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{poi.points} pts</span>
              </div>
            </div>
          </div>
        );

      default:
        return <p>Tipo de contenido no reconocido</p>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {poi.title}
            {isCompleted && <Badge variant="secondary">Completado</Badge>}
          </DialogTitle>
          <DialogDescription>
            {poi.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {renderContent()}
        </div>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyPOIModal;