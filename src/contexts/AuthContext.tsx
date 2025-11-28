// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types";
import { useAuthMutations } from "@/hooks/useAuthMutations";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: User & { password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_URL;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<{
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
  }>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isInitialized: false,
  });

  const queryClient = useQueryClient();
  const authMutations = useAuthMutations();

  // Add state to track if we should fetch user data
  const [shouldFetchUser, setShouldFetchUser] = useState(false);

  // Fetch current user - ONLY when shouldFetchUser is true or on initial load
  const {
    data: user,
    isLoading: queryLoading,
    error,
    isError,
    isSuccess,
    isFetching,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async (): Promise<User | null> => {
      try {
        console.log("🔍 [AuthContext] Fetching user data from /me endpoint");
        const response = await fetch(`${API_BASE}/api/sunday-school/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.log("🔐 [AuthContext] User not authenticated");
            return null;
          }
          throw new Error(`Failed to fetch user: ${response.status}`);
        }

        const data = await response.json();
        console.log(
          "✅ [AuthContext] User data fetched successfully:",
          data.data.user.email
        );
        return data.data.user;
      } catch (error) {
        console.error("❌ [AuthContext] Error fetching user:", error);
        return null;
      }
    },
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (cache time)
    enabled: shouldFetchUser || authState.isInitialized, // Only fetch when enabled
  });

  // Initial load - enable fetching once
  useEffect(() => {
    if (!authState.isInitialized) {
      setShouldFetchUser(true);
    }
  }, [authState.isInitialized]);

  // Update authentication state with better logic
  useEffect(() => {
    console.log("🔄 [AuthContext] Auth state update:", {
      user: user?.email,
      queryLoading,
      isError,
      isSuccess,
      isFetching,
    });

    // If query is finished loading (success or error) and we have user data
    if (!queryLoading && !isFetching) {
      const authenticated = !!user;

      setAuthState({
        user,
        isAuthenticated: authenticated,
        isLoading: false,
        isInitialized: true,
      });

      console.log("✅ [AuthContext] Auth state finalized:", {
        authenticated,
        user: user?.email,
        isInitialized: true,
      });
    } else {
      // Still loading
      setAuthState((prev) => ({
        ...prev,
        isLoading: true,
      }));
    }
  }, [user, queryLoading, isError, isSuccess, isFetching]);

  const login = async (email: string, password: string): Promise<void> => {
    console.log("🔑 [AuthContext] Login initiated");
    try {
      // Clear any existing user data first
      queryClient.setQueryData(["currentUser"], null);
      setShouldFetchUser(false); // Disable fetching during login

      // Perform login mutation
      await authMutations.login.mutateAsync({ email, password });
      console.log("✅ [AuthContext] Login mutation completed");

      // Wait longer to ensure cookies are properly set by the browser
      console.log("⏳ [AuthContext] Waiting for cookies to be set...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Enable fetching and trigger refetch
      setShouldFetchUser(true);
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      // Force refetch user data with retry logic
      let retries = 0;
      const maxRetries = 3;

      while (retries < maxRetries) {
        try {
          console.log(
            `🔄 [AuthContext] Refetching user data (attempt ${retries + 1})`
          );
          await queryClient.refetchQueries({
            queryKey: ["currentUser"],
            exact: true,
          });

          // Check if we have user data now
          const userData = queryClient.getQueryData(["currentUser"]);
          if (userData) {
            console.log(
              "🎉 [AuthContext] User data successfully retrieved after login"
            );
            break;
          } else {
            console.log("⚠️ [AuthContext] No user data yet, retrying...");
            retries++;
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
        } catch (refetchError) {
          console.error(
            `❌ [AuthContext] Refetch attempt ${retries + 1} failed:`,
            refetchError
          );
          retries++;
          if (retries >= maxRetries) {
            throw new Error(
              "Failed to verify login status after multiple attempts"
            );
          }
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }
    } catch (error) {
      console.error("❌ [AuthContext] Login failed:", error);
      // Reset fetching state on failure
      setShouldFetchUser(true);
      queryClient.setQueryData(["currentUser"], null);
      throw error;
    }
  };

  const register = async (userData: User): Promise<void> => {
    try {
      setShouldFetchUser(false);
      await authMutations.register.mutateAsync(userData);
      // After registration, enable fetching to get user data
      setShouldFetchUser(true);
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    } catch (error) {
      setShouldFetchUser(true);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    console.log("🚪 [AuthContext] Logout initiated");
    try {
      setShouldFetchUser(false);
      await authMutations.logout.mutateAsync();
    } finally {
      // Immediately update local state and disable fetching
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
      queryClient.setQueryData(["currentUser"], null);
      setShouldFetchUser(true); // Re-enable for future logins
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    console.log("🔄 [AuthContext] Calling updateProfile with:", userData);
    try {
      await authMutations.updateProfile.mutateAsync(userData);
      console.log("✅ [AuthContext] updateProfile mutation completed");
    } catch (error) {
      console.error("❌ [AuthContext] updateProfile error:", error);
      throw error;
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    await authMutations.changePassword.mutateAsync({
      currentPassword,
      newPassword,
    });
  };

  const value: AuthContextType = {
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
