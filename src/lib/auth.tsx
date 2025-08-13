import { createContext, useContext, useEffect, useState } from 'react';

// Tipos para simular User e Session
interface User {
  id: string;
  email: string;
  created_at: string;
}

interface Session {
  user: User;
  access_token: string;
  expires_at: number;
}

interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Chaves para localStorage
const STORAGE_KEYS = {
  SESSION: 'auth_session',
  USERS: 'users_db',
  PROFILES: 'profiles_db'
};

// Funções utilitárias para localStorage
const getStorageItem = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

const setStorageItem = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

const generateId = () => {
  return 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

const generateToken = () => {
  return 'token_' + Math.random().toString(36).substr(2, 15) + Date.now().toString(36);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar sessão inicial do localStorage
    const savedSession = getStorageItem(STORAGE_KEYS.SESSION);

    if (savedSession && savedSession.expires_at > Date.now()) {
      setSession(savedSession);
      setUser(savedSession.user);
      loadProfile(savedSession.user.id);
    } else {
      // Remover sessão expirada
      if (savedSession) {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
      }
      setLoading(false);
    }
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const profiles = getStorageItem(STORAGE_KEYS.PROFILES) || {};
      const userProfile = profiles[userId];

      if (userProfile) {
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    // Verificar se o usuário já existe
    const users = getStorageItem(STORAGE_KEYS.USERS) || {};

    if (users[email]) {
      throw new Error('Usuário já existe com este email');
    }

    // Criar novo usuário
    const userId = generateId();
    const now = new Date().toISOString();

    const newUser: User = {
      id: userId,
      email,
      created_at: now
    };

    // Salvar usuário
    users[email] = {
      ...newUser,
      password // Em produção, você criptografaria a senha
    };
    setStorageItem(STORAGE_KEYS.USERS, users);

    // Criar perfil
    const profiles = getStorageItem(STORAGE_KEYS.PROFILES) || {};
    const newProfile: Profile = {
      id: userId,
      email,
      full_name: fullName,
      created_at: now,
      updated_at: now
    };

    profiles[userId] = newProfile;
    setStorageItem(STORAGE_KEYS.PROFILES, profiles);

    // Criar sessão
    const newSession: Session = {
      user: newUser,
      access_token: generateToken(),
      expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 dias
    };

    setStorageItem(STORAGE_KEYS.SESSION, newSession);
    setSession(newSession);
    setUser(newUser);
    setProfile(newProfile);
  };

  const signIn = async (email: string, password: string) => {
    const users = getStorageItem(STORAGE_KEYS.USERS) || {};
    const user = users[email];

    if (!user || user.password !== password) {
      throw new Error('Email ou senha incorretos');
    }

    // Criar nova sessão
    const newSession: Session = {
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      },
      access_token: generateToken(),
      expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 dias
    };

    setStorageItem(STORAGE_KEYS.SESSION, newSession);
    setSession(newSession);
    setUser(newSession.user);

    // Carregar perfil
    await loadProfile(user.id);
  };

  const signOut = async () => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      throw new Error('Nenhum usuário logado');
    }

    const profiles = getStorageItem(STORAGE_KEYS.PROFILES) || {};
    const currentProfile = profiles[user.id];

    if (!currentProfile) {
      throw new Error('Perfil não encontrado');
    }

    const updatedProfile = {
      ...currentProfile,
      ...updates,
      updated_at: new Date().toISOString()
    };

    profiles[user.id] = updatedProfile;
    setStorageItem(STORAGE_KEYS.PROFILES, profiles);
    setProfile(updatedProfile);
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};