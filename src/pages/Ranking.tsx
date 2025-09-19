// src/pages/Ranking.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLeaderboard, LeaderboardEntry } from '@/integrations/supabase/api';
import Navbar from '@/components/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Ranking = () => {
  const { data: leaderboard, isLoading, isError } = useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center min-h-[50vh] text-foreground">
          Cargando ranking...
        </div>
      </div>
    );
  }

  if (isError || !leaderboard) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center min-h-[50vh] text-destructive">
          Error al cargar el ranking.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Ranking Global 🏆
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubre quiénes son los mejores exploradores virtuales y el total de puntos que han conseguido.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto neon-border">
          <CardHeader>
            <CardTitle>Clasificación de Exploradores</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Posición</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead className="text-right">Puntos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry, index) => (
                  <TableRow key={entry.user_id}>
                    <TableCell className="font-medium">
                      <Badge variant={index < 3 ? "default" : "secondary"}>
                        {entry.posicion}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {entry.username ? entry.username[0] : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span>{entry.username}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{entry.total_puntos}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Ranking;
