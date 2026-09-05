"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dataProvider } from "@/lib/dataProvider";
import { supabase } from "@/lib/supabase";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export interface AuthContextType {
  role: string | null;
  name: string | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  role: null,
  name: null,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export function RefineProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
