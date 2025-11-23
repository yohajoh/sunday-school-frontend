import React, { createContext, useContext, useReducer } from "react";
import { User } from "@/types";
import { toast } from "sonner";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "./LanguageContext";

const API = import.meta.env.VITE_API_URL;

interface UserContextType {
  users: User[];
  currentUser: User | null;
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  setCurrentUser: (user: User | null) => void;
  createUserMutation: UseMutationResult<User, Error, Omit<User, "id">, unknown>;
}

type UserAction =
  | { type: "SET_CURRENT_USER"; payload: User | null }
  | { type: "ADD_USER"; payload: User }
  | { type: "UPDATE_USER"; payload: { id: string; updates: Partial<User> } }
  | { type: "DELETE_USER"; payload: string };

const UserContext = createContext<UserContextType | undefined>(undefined);

const userReducer = (
  state: { users: User[]; currentUser: User | null },
  action: UserAction
) => {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload };

    case "ADD_USER":
      return { ...state, users: [...state.users, action.payload] };

    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id
            ? { ...user, ...action.payload.updates }
            : user
        ),
        currentUser:
          state.currentUser?.id === action.payload.id
            ? { ...state.currentUser, ...action.payload.updates }
            : state.currentUser,
      };

    case "DELETE_USER":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
        currentUser:
          state.currentUser?.id === action.payload ? null : state.currentUser,
      };

    default:
      return state;
  }
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(userReducer, {
    users: [],
    currentUser: null,
  });

  const addUser = (user: User) => {
    dispatch({ type: "ADD_USER", payload: user });
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    dispatch({ type: "UPDATE_USER", payload: { id, updates } });
  };

  const deleteUser = (id: string) => {
    dispatch({ type: "DELETE_USER", payload: id });
  };

  const setCurrentUser = (user: User | null) => {
    dispatch({ type: "SET_CURRENT_USER", payload: user });
  };

  const queryClient = useQueryClient();
  const { t } = useLanguage();
  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: Omit<User, "id">) => {
      const res = await fetch(`${API}/api/sunday-school/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        throw new Error(`Failed to create user: ${res.statusText}`);
      }

      return await res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(t("userForm.userCreated"));
    },
    onError: (error: Error) => {
      toast.error(`Failed to create user: ${error.message}`);
    },
  });

  const value: UserContextType = {
    users: state.users,
    currentUser: state.currentUser,
    addUser,
    updateUser,
    deleteUser,
    setCurrentUser,
    createUserMutation,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};
