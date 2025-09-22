import { supabase } from "./client";
import { toast } from "@/hooks/use-toast";
import type { Tables } from "./types";

// Tipos de datos personalizados
export type Hotspot = Tables<'hotspots'>;
export type Score = Tables<'scores'>;
export type LeaderboardEntry = Tables<'leaderboard'>;
export type UserProfile = Tables<'users'>;
export type Tour = Tables<'tours'>;
export type DailyContent = Tables<'daily_content'>;
export type DailyUserProgress = Tables<'daily_user_progress'>;

// Tipos para las opciones de hotspots
export interface HotspotOptions {
  pregunta?: string;
  opciones?: string[];
  correcta?: string;
  escena_siguiente?: string;
}

/**
 * Obtiene todos los tours disponibles.
 */
export const getTours = async (): Promise<Tour[] | null> => {
  const { data, error } = await supabase.from('tours').select('*').eq('activo', true);
  if (error) {
    console.error("Error fetching tours:", error);
    toast({
      title: "Error al cargar tours",
      description: "No se pudieron obtener los datos de los tours.",
      variant: "destructive",
    });
    return null;
  }
  return data;
};

/**
 * Obtiene todos los hotspots de la base de datos para un tour específico.
 */
export const getHotspots = async (tourId?: string): Promise<Hotspot[] | null> => {
  let query = supabase.from('hotspots').select('*');
  
  if (tourId) {
    query = query.eq('tour_id', tourId);
  }
  
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching hotspots:", error);
    toast({
      title: "Error al cargar hotspots",
      description: "No se pudieron obtener los datos de los hotspots.",
      variant: "destructive",
    });
    return null;
  }
  return data;
};

/**
 * Obtiene el ranking global de usuarios.
 */
export const getLeaderboard = async (): Promise<LeaderboardEntry[] | null> => {
  const { data, error } = await supabase.from('leaderboard').select('*').order('total_puntos', { ascending: false });
  if (error) {
    console.error("Error fetching leaderboard:", error);
    toast({
      title: "Error al cargar ranking",
      description: "No se pudo obtener el ranking global.",
      variant: "destructive",
    });
    return null;
  }
  return data;
};

/**
 * Obtiene los datos del perfil de un usuario por su ID.
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
  if (error) {
    console.error("Error fetching user profile:", error);
    toast({
      title: "Error al cargar perfil",
      description: "No se pudo obtener la información del usuario.",
      variant: "destructive",
    });
    return null;
  }
  return data;
};

/**
 * Obtiene el historial de puntuaciones de un usuario.
 */
export const getUserScores = async (userId: string): Promise<Score[] | null> => {
  const { data, error } = await supabase.from('scores').select('*, hotspots(*)').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) {
    console.error("Error fetching user scores:", error);
    toast({
      title: "Error al cargar puntuaciones",
      description: "No se pudo obtener el historial de puntuaciones.",
      variant: "destructive",
    });
    return null;
  }
  return data;
};

/**
 * Registra una nueva puntuación para un hotspot.
 */
export const submitScore = async (userId: string, hotspotId: string, puntos: number): Promise<{ error: any }> => {
  const { error } = await supabase.from('scores').insert({
    user_id: userId,
    hotspot_id: hotspotId,
    puntos: puntos,
  });

  if (error) {
    toast({
      title: "Error al registrar puntuación",
      description: error.message,
      variant: "destructive",
    });
    return { error };
  } else {
    toast({
      title: "¡Puntuación registrada!",
      description: `Has ganado ${puntos} puntos.`,
      variant: "default",
    });
    return { error: null };
  }
};

/**
 * Obtiene el contenido diario de POIs para un tour específico.
 */
export const getDailyContent = async (tourId: string, date?: string): Promise<DailyContent[] | null> => {
  const queryDate = date || new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('daily_content')
    .select('*')
    .eq('tour_id', tourId)
    .eq('date', queryDate)
    .order('poi_position', { ascending: true });

  if (error) {
    console.error("Error fetching daily content:", error);
    toast({
      title: "Error al cargar contenido diario",
      description: "No se pudieron obtener los POIs del día.",
      variant: "destructive",
    });
    return null;
  }
  return data;
};

/**
 * Obtiene el progreso diario del usuario.
 */
export const getUserDailyProgress = async (userId: string, date?: string): Promise<DailyUserProgress[] | null> => {
  const queryDate = date || new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('daily_user_progress')
    .select('*, daily_content(*)')
    .eq('user_id', userId)
    .eq('daily_content.date', queryDate);

  if (error) {
    console.error("Error fetching user daily progress:", error);
    return null;
  }
  return data;
};

/**
 * Registra el progreso del usuario en un POI diario.
 */
export const submitDailyProgress = async (
  userId: string, 
  dailyContentId: string, 
  pointsEarned: number,
  interactionData?: any
): Promise<{ error: any }> => {
  const { error } = await supabase.from('daily_user_progress').insert({
    user_id: userId,
    daily_content_id: dailyContentId,
    points_earned: pointsEarned,
    interaction_data: interactionData,
  });

  if (error) {
    toast({
      title: "Error al registrar progreso",
      description: error.message,
      variant: "destructive",
    });
    return { error };
  } else {
    toast({
      title: "¡Progreso registrado!",
      description: `Has ganado ${pointsEarned} puntos.`,
      variant: "default",
    });
    return { error: null };
  }
};
