import { supabase } from "./client";
import { toast } from "@/hooks/use-toast";
import type { Tables } from "./types";

// Tipos de datos personalizados
export type Hotspot = Tables<'hotspots'>;
export type Score = Tables<'scores'>;
export type LeaderboardEntry = Tables<'leaderboard'>;
export type UserProfile = Tables<'users'>;

// Tipos para las opciones de hotspots
export interface HotspotOptions {
  pregunta?: string;
  opciones?: string[];
  correcta?: string;
  escena_siguiente?: string;
}

/**
 * Obtiene todos los hotspots de la base de datos.
 */
export const getHotspots = async (): Promise<Hotspot[] | null> => {
  const { data, error } = await supabase.from('hotspots').select('*');
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
