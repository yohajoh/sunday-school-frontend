import React, { useState, useEffect } from "react";
import { Save, Download, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Gallery {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  publicId: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
  category: string;
  tags: string[];
  isPublished: boolean;
  uploadedBy: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
}

interface GalleryEditModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  gallery: Gallery | null;
}

const API = import.meta.env.VITE_API_URL;

const useUpdateGallery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(
        `${API}/api/sunday-school/admin/gallery/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Update failed: ${response.status}`
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to update image");
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Image updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const GalleryEditModal: React.FC<GalleryEditModalProps> = ({
  open,
  onClose,
  onSuccess,
  gallery,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    tags: "",
    isPublished: true,
  });

  const updateMutation = useUpdateGallery();

  const handleDownload = async (imageUrl: string, title: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const fileExtension = imageUrl.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${title
        .replace(/\s+/g, "-")
        .toLowerCase()}.${fileExtension}`;

      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download image. Please try again.");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  useEffect(() => {
    if (gallery) {
      setFormData({
        title: gallery.title,
        description: gallery.description || "",
        category: gallery.category,
        tags: gallery.tags.join(", "),
        isPublished: gallery.isPublished,
      });
    }
  }, [gallery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gallery) return;

    if (!formData.title.trim()) {
      toast.error("Please enter a title for the image");
      return;
    }

    const submitData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      tags: formData.tags,
      isPublished: formData.isPublished,
    };

    updateMutation.mutate(
      { id: gallery._id, data: submitData },
      {
        onSuccess: () => {
          onSuccess();
        },
      }
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFormData({
        title: "",
        description: "",
        category: "general",
        tags: "",
        isPublished: true,
      });
      onClose();
    }
  };

  if (!gallery) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden p-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-2xl">
        {/* Custom Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-green-50 to-blue-50 dark:from-slate-800 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl shadow-lg">
              <Save className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                Edit Image
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Update image details and metadata
              </DialogDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload(gallery.imageUrl, gallery.title)}
            className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white border-0"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          {/* Image Preview */}
          <div>
            <Label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Image Preview
            </Label>
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
              <img
                src={gallery.imageUrl}
                alt={gallery.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Image Details */}
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="font-semibold text-slate-600 dark:text-slate-400">
                  Size
                </div>
                <div className="text-slate-900 dark:text-white">
                  {formatFileSize(gallery.bytes)}
                </div>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="font-semibold text-slate-600 dark:text-slate-400">
                  Dimensions
                </div>
                <div className="text-slate-900 dark:text-white">
                  {gallery.width}×{gallery.height}
                </div>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="font-semibold text-slate-600 dark:text-slate-400">
                  Format
                </div>
                <div className="text-slate-900 dark:text-white">
                  {gallery.format.toUpperCase()}
                </div>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="font-semibold text-slate-600 dark:text-slate-400">
                  Uploaded
                </div>
                <div className="text-slate-900 dark:text-white">
                  {new Date(gallery.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <Label
              htmlFor="edit-title"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Title *
            </Label>
            <Input
              id="edit-title"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter image title"
              required
              disabled={updateMutation.isPending}
              className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Description */}
          <div>
            <Label
              htmlFor="edit-description"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Description
            </Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter image description (optional)"
              rows={3}
              disabled={updateMutation.isPending}
              className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <Label
              htmlFor="edit-category"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Category
            </Label>
            <select
              id="edit-category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              disabled={updateMutation.isPending}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="general">General</option>
              <option value="events">Events</option>
              <option value="activities">Activities</option>
              <option value="classes">Classes</option>
              <option value="celebrations">Celebrations</option>
              <option value="sports">Sports</option>
              <option value="arts">Arts & Crafts</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <Label
              htmlFor="edit-tags"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Tags
            </Label>
            <Input
              id="edit-tags"
              type="text"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="Enter tags separated by commas (e.g., summer, outdoor, kids)"
              disabled={updateMutation.isPending}
              className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Published Status */}
          <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="space-y-0.5">
              <Label
                htmlFor="published"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Published
              </Label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formData.isPublished
                  ? "Image is visible to users"
                  : "Image is hidden from users"}
              </p>
            </div>
            <Switch
              id="published"
              checked={formData.isPublished}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isPublished: checked })
              }
              disabled={updateMutation.isPending}
              className="data-[state=checked]:bg-green-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={updateMutation.isPending}
              className="flex-1 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.title.trim() || updateMutation.isPending}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
