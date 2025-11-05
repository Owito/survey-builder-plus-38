import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext({});

/**
 * AuthProvider Component
 * Maneja el estado de autenticación global de la aplicación
 * Proporciona funciones para login, registro, logout y verificación de sesión
 * Ahora incluye gestión de roles de usuario (Administrador, Encuestador, Respondiente)
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  /**
   * Cargar perfil y rol del usuario
   */
  const loadUserData = async (userId) => {
    try {
      // Cargar perfil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      setProfile(profileData);

      // Cargar rol
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      setRole(roleData?.role || null);
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    }
  };

  useEffect(() => {
    // Configurar el listener de cambios de autenticación PRIMERO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Cargar perfil y rol del usuario si está autenticado
        if (session?.user) {
          setTimeout(() => {
            loadUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setRole(null);
        }
      }
    );

    // LUEGO verificar si hay una sesión existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadUserData(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Registro de nuevo usuario
   * @param {Object} userData - Datos del usuario (email, password, fullName, role)
   */
  const signUp = async ({ email, password, fullName, role: userRole }) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: userRole
          }
        }
      });

      if (error) throw error;

      toast({
        title: "¡Registro exitoso!",
        description: "Ya puedes iniciar sesión con tu cuenta.",
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error en registro:', error);
      toast({
        title: "Error al registrarse",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  /**
   * Inicio de sesión con redirección basada en rol
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   */
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Obtener rol del usuario para redirigir
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      const userRole = roleData?.role;

      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente.",
      });

      // Redirigir según rol
      if (userRole === 'administrador') {
        navigate('/admin/dashboard');
      } else if (userRole === 'encuestador') {
        navigate('/surveys/dashboard');
      } else {
        navigate('/encuestas');
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error en login:', error);
      toast({
        title: "Error al iniciar sesión",
        description: error.message === 'Invalid login credentials' 
          ? 'Credenciales inválidas. Verifica tu email y contraseña.' 
          : error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  /**
   * Cierre de sesión
   */
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
      setProfile(null);
      setRole(null);
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      });

      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión.",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    session,
    profile,
    role,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
