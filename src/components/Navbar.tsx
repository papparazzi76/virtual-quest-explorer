import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Headphones, Menu, Trophy, Play, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center vr-glow">
              <Headphones className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">VR Tour</h1>
              <p className="text-xs text-muted-foreground">Gamificado</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Button variant="ghost" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Recorrido
            </Button>
            <Button variant="ghost" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Ranking
            </Button>
            <Button variant="ghost" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Perfil
            </Button>
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Hola, {user.email}
                </span>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Salir
                </Button>
              </div>
            ) : (
              <Button 
                variant="vr" 
                size="sm"
                onClick={() => navigate('/auth')}
              >
                Iniciar Sesión
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-2">
              <Button variant="ghost" className="justify-start">
                <Play className="w-4 h-4 mr-2" />
                Recorrido
              </Button>
              <Button variant="ghost" className="justify-start">
                <Trophy className="w-4 h-4 mr-2" />
                Ranking
              </Button>
              <Button variant="ghost" className="justify-start">
                <User className="w-4 h-4 mr-2" />
                Perfil
              </Button>
              {user ? (
                <div className="flex flex-col space-y-2 mt-4">
                  <span className="text-sm text-muted-foreground">
                    {user.email}
                  </span>
                  <Button variant="outline" onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="vr" 
                  className="mt-2"
                  onClick={() => {
                    navigate('/auth');
                    setIsMenuOpen(false);
                  }}
                >
                  Iniciar Sesión
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;