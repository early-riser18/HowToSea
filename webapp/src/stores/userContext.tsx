"use client";
import { getTestUser } from "@/api/auth/auth.service";
import React, { createContext, useState, useEffect, useContext } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface BearerTokens {
  access: string;
  refresh: string | null;
}

interface UserContextProps {
  user: User | null;
  tokens: BearerTokens | null;
  setTokens: React.Dispatch<React.SetStateAction<BearerTokens | null>>;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  tokens: null,
  setTokens: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<BearerTokens | null>(null);

  // Initialize tokens from localStorage on mount
  useEffect(() => {
    const storageBearerTokens = localStorage.getItem("bearerTokens");
    if (storageBearerTokens) {
      try {
        const parsedTokens = JSON.parse(storageBearerTokens);
        setTokens(parsedTokens); // Only set tokens if valid
      } catch (error) {
        console.error("Failed to parse bearer tokens:", error);
      }
    }
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    const getUserData = async () => {
      getTestUser()
        .then((s) => {
          setUser({
            id: s.id,
            name: `${s.first_name} ${s.last_name}`,
            email: s.email,
          });
        })
        .catch((e) => {
          console.log("Failed to get user data.");
        });
    };

    // TODO: add check expiry date first
    if (tokens) {
      getUserData();
    }
  }, [tokens]);
  return (
    <UserContext.Provider value={{ user, tokens, setTokens }}>
      {children}
    </UserContext.Provider>
  );
};

// Export a custom hook for convenience
export const useUser = () => useContext(UserContext);
