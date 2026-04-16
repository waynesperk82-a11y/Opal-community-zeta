import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useUser as useClerkUser } from "@clerk/react";
import { useUpsertCurrentUser } from "@workspace/api-client-react";
import { User } from "@workspace/api-client-react/src/generated/api.schemas";

interface UserContextType {
  user: User | null;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  const { user: clerkUser, isLoaded, isSignedIn } = useClerkUser();
  const upsertCurrentUser = useUpsertCurrentUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !clerkUser) {
      setUser(null);
      setIsReady(true);
      return;
    }

    const email = clerkUser.primaryEmailAddress?.emailAddress ?? null;
    const username = clerkUser.username || email?.split("@")[0] || clerkUser.id;
    const displayName = clerkUser.fullName || clerkUser.firstName || username;

    upsertCurrentUser.mutate(
      {
        data: {
          username,
          displayName,
          email,
          avatarUrl: clerkUser.imageUrl || null,
        },
      },
      {
        onSuccess: (newUser) => {
          setUser(newUser);
          setIsReady(true);
        },
        onError: () => {
          setUser(null);
          setIsReady(true);
        },
      },
    );
  }, [isLoaded, isSignedIn, clerkUser?.id]);

  const logout = () => {
    setUser(null);
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md p-8 rounded-2xl bg-card border shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-opal-gradient opacity-10 pointer-events-none" />
          <h1 className="text-3xl font-display font-bold text-center mb-2">Opening Opal Zeta</h1>
          <p className="text-muted-foreground text-center">Preparing your community session.</p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
