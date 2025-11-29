import { Asset, User } from "@/types";
import { toast } from "sonner";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";

const API = import.meta.env.VITE_API_URL;
// Create user mutation
export const useCreateAsset = (): UseMutationResult<
  Asset,
  Error,
  Omit<Asset, "id">,
  unknown
> => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: async (assetData: Omit<Asset, "id">) => {
      const res = await fetch(`${API}/api/sunday-school/assets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",

        body: JSON.stringify(assetData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message);
      }

      return await res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast.success(t("assetForm.assetCreated"));
    },
    onError: (error: Error) => {
      toast.error(`Failed to create asset: ${error.message}`);
    },
  });
};

// UPDATE ASSET
export const useUpdateAsset = (): UseMutationResult<
  Asset,
  Error,
  Asset,
  unknown
> => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: async (assetData: Asset) => {
      console.log(assetData);
      const res = await fetch(
        `${API}/api/sunday-school/assets/${assetData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",

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
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast.success(t("assetForm.assetUpdated"));
    },
    onError: (error: Error) => {
      toast.error(`Failed to update asset: ${error.message}`);
    },
  });
};

// DELETE ASSET
export const useDeleteAsset = (): UseMutationResult<
  void,
  Error,
  string,
  unknown
> => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: async (assetId: string) => {
      const res = await fetch(`${API}/api/sunday-school/assets/${assetId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message);
      }

      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast.success(t("assetForm.assetDeleted"));
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete asset: ${error.message}`);
    },
  });
};

// Combined hook
export const useAssetMutations = () => {
  const createAsset = useCreateAsset();
  const updateAsset = useUpdateAsset();
  const deleteAsset = useDeleteAsset();

  return {
    createAsset,
    updateAsset,
    deleteAsset,
    isCreating: createAsset.isPending,
    isUpdating: updateAsset.isPending,
    isDeleting: deleteAsset.isPending,
  };
};
