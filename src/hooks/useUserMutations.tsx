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

// UPDATE ASSET
export const useUpdateUser = (): UseMutationResult<
  User,
  Error,
  User,
  unknown
> => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: async (assetData: any) => {
      console.log(assetData);
      const res = await fetch(
        `${API}/api/sunday-school/users/${assetData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(assetData.updates),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message);
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(t("assetForm.assetUpdated"));
    },
    onError: (error: Error) => {
      toast.error(`Failed to update asset: ${error.message}`);
    },
  });
};

// DELETE ASSET
export const useDeleteUser = (): UseMutationResult<
  void,
  Error,
  string,
  unknown
> => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`${API}/api/sunday-school/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message);
      }

      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(t("assetForm.assetDeleted"));
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete asset: ${error.message}`);
    },
  });
};

export const useUserMutation = () => {
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  return {
    createUser,
    updateUser,
    deleteUser,
    isPending: createUser.isPending,
    isUpdating: updateUser.isPending,
    isDeleting: deleteUser.isPending,
  };
};
