import { User } from "@/types";
import { toast } from "sonner";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";

const API = import.meta.env.VITE_API_URL;
// Create user mutation
export const useCreateUser = (): UseMutationResult<
  User,
  Error,
  Omit<User, "id">,
  unknown
> => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: async (userData: Omit<User, "id">) => {
      const res = await fetch(`${API}/api/sunday-school/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message);
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
};

export const useUserMutation = () => {
  const createUser = useCreateUser();

  return { createUser, isPending: createUser.isPending };
};
