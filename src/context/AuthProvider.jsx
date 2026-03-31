import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = async (authUser) => {
    if (!authUser) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();

    if (error) {
      console.error("Could not load user profile:", error.message);
      setProfile(null);
      return;
    }

    if (!data) {
      setProfile({
        id: authUser.id,
        email: authUser.email,
        full_name: authUser.user_metadata?.full_name?.trim() || null,
      });
      return;
    }

    setProfile(data);
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrapSession = async () => {
      const {
        data: { session: activeSession },
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      setSession(activeSession);
      await loadProfile(activeSession?.user ?? null);

      if (isMounted) {
        setIsLoading(false);
      }
    };

    bootstrapSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);

      Promise.resolve(loadProfile(nextSession?.user ?? null)).finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async ({ email, password, fullName }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw error;
    }

    return data;
  };

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
