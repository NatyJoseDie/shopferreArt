import { supabase } from './supabaseClient';

export interface User {
  id: string;
  username: string;
  email?: string;
  user_type: 'vendedora' | 'cliente';
  created_at: string;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

// Función para registrar un nuevo usuario
export async function registerUser(
  username: string,
  email: string,
  password: string,
  userType: 'vendedora' | 'cliente'
): Promise<AuthResponse> {
  try {
    // Primero registrar en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return { user: null, error: authError.message };
    }

    if (!authData.user) {
      return { user: null, error: 'Error al crear el usuario' };
    }

    // Luego insertar en nuestra tabla users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          username,
          email,
          user_type: userType,
        },
      ])
      .select()
      .single();

    if (userError) {
      return { user: null, error: userError.message };
    }

    return { user: userData, error: null };
  } catch (error) {
    return { user: null, error: 'Error inesperado al registrar usuario' };
  }
}

// Función para iniciar sesión
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return { user: null, error: authError.message };
    }

    if (!authData.user) {
      return { user: null, error: 'Error al iniciar sesión' };
    }

    // Obtener datos del usuario de nuestra tabla
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      return { user: null, error: userError.message };
    }

    return { user: userData, error: null };
  } catch (error) {
    return { user: null, error: 'Error inesperado al iniciar sesión' };
  }
}

// Función para cerrar sesión
export async function logoutUser(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message || null };
  } catch (error) {
    return { error: 'Error inesperado al cerrar sesión' };
  }
}

// Función para obtener el usuario actual
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: authData } = await supabase.auth.getUser();
    
    if (!authData.user) {
      return null;
    }

    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (error) {
      console.error('Error al obtener datos del usuario:', error);
      return null;
    }

    return userData;
  } catch (error) {
    console.error('Error inesperado al obtener usuario actual:', error);
    return null;
  }
}

// Función para verificar si el usuario está autenticado
export async function isAuthenticated(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  } catch (error) {
    return false;
  }
}

