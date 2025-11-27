import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
  Download,
  Filter,
  Grid3X3,
  List,
  Shield,
  Zap,
  Sparkles,
  Users,
  FolderOpen,
  Eye,
  EyeOff,
  MoreVertical,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { GalleryUploadModal } from "./GalleryUploadModal";
import { GalleryEditModal } from "./GalleryEditModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

const API = import.meta.env.VITE_API_URL;

// React Query hooks - Get ALL galleries
const useGalleries = (searchTerm: string, category: string) => {
  return useQuery({
    queryKey: ["galleries", searchTerm, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (category !== "all") params.append("category", category);

      // Remove any limits to get ALL images
      const response = await fetch(
        `${API}/api/sunday-school/admin/gallery?${params}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch galleries: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch galleries");
      }

      return data;
    },
    retry: 1,
  });
};

const useCategories = () => {
  return useQuery({
    queryKey: ["gallery-categories"],
    queryFn: async () => {
      const response = await fetch(
        `${API}/api/sunday-school/admin/gallery/categories/all`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch categories");
      }

      return data.categories;
    },
  });
};

const useDeleteGallery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (galleryId: string) => {
      const response = await fetch(
        `${API}/api/sunday-school/admin/gallery/${galleryId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to delete: ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to delete image");
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Image deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const GalleryManagement: React.FC = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const {
    data: galleriesData,
    isLoading,
    error,
  } = useGalleries(searchTerm, category);
  const { data: categories = ["all"] } = useCategories();
  const deleteMutation = useDeleteGallery();

  // Get ALL galleries - no pagination
  const galleries = galleriesData?.galleries || [];

  const handleDelete = async (galleryId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this image? This action cannot be undone."
      )
    )
      return;
    deleteMutation.mutate(galleryId);
  };

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

  const getTotalStats = () => {
    return {
      total: galleries.length,
      published: galleries.filter((g) => g.isPublished).length,
      draft: galleries.filter((g) => !g.isPublished).length,
      totalSize: galleries.reduce((acc, g) => acc + g.bytes, 0),
    };
  };

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-900 dark:via-blue-950/20 dark:to-purple-950/10">
      <div className="space-y-6">
        {/* Premium Header Section - Mobile Optimized */}
        <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-br from-slate-800 via-blue-900 to-purple-900 p-4 lg:p-8 text-white border border-blue-500/20 shadow-2xl mx-2 lg:mx-0">
          <div className="relative z-10">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 lg:gap-4">
                <div className="p-2 lg:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl lg:rounded-2xl border border-blue-400/30 shadow-lg flex-shrink-0">
                  <ImageIcon className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent break-words">
                    Gallery Management
                  </h1>
                  <p className="text-blue-100 text-sm lg:text-lg mt-1 lg:mt-2 break-words">
                    Professional media library with advanced management tools
                  </p>
                </div>
              </div>

              {/* Stats Grid - Mobile Responsive */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-white/20">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="p-1 lg:p-2 bg-blue-500/20 rounded-lg lg:rounded-xl">
                      <FolderOpen className="h-4 w-4 lg:h-5 lg:w-5 text-blue-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg lg:text-2xl font-bold text-white truncate">
                        {stats.total}
                      </p>
                      <p className="text-blue-200 text-xs lg:text-sm truncate">
                        Total Images
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-white/20">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="p-1 lg:p-2 bg-green-500/20 rounded-lg lg:rounded-xl">
                      <Eye className="h-4 w-4 lg:h-5 lg:w-5 text-green-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg lg:text-2xl font-bold text-white truncate">
                        {stats.published}
                      </p>
                      <p className="text-green-200 text-xs lg:text-sm truncate">
                        Published
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-white/20">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="p-1 lg:p-2 bg-amber-500/20 rounded-lg lg:rounded-xl">
                      <EyeOff className="h-4 w-4 lg:h-5 lg:w-5 text-amber-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg lg:text-2xl font-bold text-white truncate">
                        {stats.draft}
                      </p>
                      <p className="text-amber-200 text-xs lg:text-sm truncate">
                        Drafts
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-white/20">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="p-1 lg:p-2 bg-purple-500/20 rounded-lg lg:rounded-xl">
                      <Zap className="h-4 w-4 lg:h-5 lg:w-5 text-purple-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg lg:text-2xl font-bold text-white truncate">
                        {formatFileSize(stats.totalSize).split(" ")[0]}
                      </p>
                      <p className="text-purple-200 text-xs lg:text-sm truncate">
                        {formatFileSize(stats.totalSize).split(" ")[1]} Total
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Images Info */}
              <div className="text-center text-blue-200 text-sm">
                Displaying all {galleries.length} images
              </div>
            </div>
          </div>

          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 lg:w-64 lg:h-64 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 lg:w-48 lg:h-48 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
        </div>

        {/* Advanced Controls - Mobile Optimized */}
        <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-2xl rounded-2xl lg:rounded-3xl border border-slate-200/50 dark:border-slate-700/50 mx-2 lg:mx-0">
          <CardContent className="p-4 lg:p-6">
            <div className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-4">
              {/* Search - Full width on mobile */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 lg:h-5 lg:w-5 text-slate-400" />
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 lg:pl-12 h-12 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 rounded-xl text-base lg:text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 w-full"
                />
              </div>

              {/* Mobile Filter Toggle */}
              <div className="lg:hidden flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="flex-1 h-12 border-slate-300 dark:border-slate-600"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  <ChevronDown
                    className={`h-4 w-4 ml-2 transition-transform ${
                      showMobileFilters ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                {/* Upload Button - Mobile */}
                <Button
                  onClick={() => setUploadModalOpen(true)}
                  className="h-12 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="h-5 w-5" />
                  <span className="sr-only lg:not-sr-only lg:ml-2">Upload</span>
                </Button>
              </div>

              {/* Desktop Filters & Controls */}
              <div className="hidden lg:flex lg:items-center lg:gap-3">
                {/* Category Filter */}
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-w-32"
                >
                  {categories.map((cat: string) => (
                    <option key={cat} value={cat}>
                      {cat === "all"
                        ? "All Categories"
                        : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>

                {/* View Toggle */}
                <div className="flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === "grid"
                        ? "bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4 lg:h-5 lg:w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === "list"
                        ? "bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <List className="h-4 w-4 lg:h-5 lg:w-5" />
                  </button>
                </div>

                {/* Upload Button - Desktop */}
                <Button
                  onClick={() => setUploadModalOpen(true)}
                  className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Upload Image
                </Button>
              </div>
            </div>

            {/* Mobile Filters Dropdown */}
            {showMobileFilters && (
              <div className="lg:hidden mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((cat: string) => (
                    <option key={cat} value={cat}>
                      {cat === "all"
                        ? "All Categories"
                        : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>

                <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex-1 py-2 rounded-md transition-all duration-300 text-sm ${
                      viewMode === "grid"
                        ? "bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex-1 py-2 rounded-md transition-all duration-300 text-sm ${
                      viewMode === "list"
                        ? "bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <List className="h-4 w-4 mx-auto" />
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert
            variant="destructive"
            className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 rounded-2xl mx-2 lg:mx-0"
          >
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              {error.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Content Area - Display ALL galleries */}
        <div className="px-2 lg:px-0">
          {viewMode === "grid" ? (
            /* Grid View - Mobile Responsive */
            <div className="space-y-4 lg:space-y-6">
              {!isLoading && galleries.length === 0 ? (
                <Card className="text-center py-12 lg:py-20 border-dashed border-2 border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 rounded-2xl lg:rounded-3xl">
                  <CardContent className="p-6 lg:p-8">
                    <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-2xl">
                      <ImageIcon className="h-8 w-8 lg:h-12 lg:w-12 text-white" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2 lg:mb-3">
                      {error ? "Gallery Unavailable" : "No Images Found"}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-lg mb-6 lg:mb-8 max-w-md mx-auto">
                      {error
                        ? "Unable to load gallery. Please check your connection."
                        : searchTerm || category !== "all"
                        ? "No images match your search criteria."
                        : "Start building your gallery by uploading your first image."}
                    </p>
                    <Button
                      onClick={() => setUploadModalOpen(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6 lg:px-8 py-3 text-base lg:text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Plus className="h-5 w-5 lg:h-6 lg:w-6 mr-2" />
                      Upload First Image
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
                  {isLoading
                    ? // Loading Skeleton
                      [...Array(8)].map((_, i) => (
                        <Card
                          key={i}
                          className="animate-pulse bg-slate-100 dark:bg-slate-800 border-0 rounded-2xl lg:rounded-3xl overflow-hidden"
                        >
                          <div className="aspect-square bg-slate-200 dark:bg-slate-700" />
                          <div className="p-4 lg:p-6 space-y-3 lg:space-y-4">
                            <div className="h-4 lg:h-5 bg-slate-200 dark:bg-slate-700 rounded" />
                            <div className="h-3 lg:h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                            <div className="flex justify-between">
                              <div className="h-3 lg:h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                              <div className="h-3 lg:h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                            </div>
                          </div>
                        </Card>
                      ))
                    : // ALL Gallery Items - NO PAGINATION
                      galleries.map((gallery: Gallery) => (
                        <Card
                          key={gallery._id}
                          className="group relative overflow-hidden bg-white dark:bg-slate-800 border-0 shadow-lg hover:shadow-2xl lg:hover:shadow-3xl transition-all duration-500 ease-out hover:-translate-y-2 lg:hover:-translate-y-3 rounded-2xl lg:rounded-3xl"
                        >
                          <CardContent className="p-0">
                            {/* Image Container */}
                            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                              <div className="w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-110">
                                <img
                                  src={gallery.imageUrl}
                                  alt={gallery.title}
                                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />
                              </div>

                              {/* Status Badge */}
                              {!gallery.isPublished && (
                                <Badge
                                  variant="secondary"
                                  className="absolute top-2 left-2 bg-yellow-500 text-white text-xs"
                                >
                                  Draft
                                </Badge>
                              )}

                              {/* Mobile Overlay Actions */}
                              <div className="lg:hidden absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <div className="absolute bottom-3 left-3 right-3">
                                  <div className="flex justify-center gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleDownload(
                                          gallery.imageUrl,
                                          gallery.title
                                        )
                                      }
                                      className="bg-white/95 hover:bg-white text-slate-900 shadow-lg text-xs h-8 px-3"
                                    >
                                      <Download className="h-3 w-3 mr-1" />
                                      Download
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        setSelectedGallery(gallery);
                                        setEditModalOpen(true);
                                      }}
                                      className="bg-white/95 hover:bg-white text-slate-900 shadow-lg text-xs h-8 px-3"
                                    >
                                      <Edit className="h-3 w-3 mr-1" />
                                      Edit
                                    </Button>

                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(gallery._id);
                                      }}
                                      disabled={deleteMutation.isPending}
                                      className="h-8 w-8 lg:h-9 lg:w-9 bg-red-500/95 hover:bg-red-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 p-0"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              {/* Desktop Overlay Actions */}
                              <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                  <div className="flex justify-center gap-2 lg:gap-3">
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleDownload(
                                          gallery.imageUrl,
                                          gallery.title
                                        )
                                      }
                                      className="bg-white/95 hover:bg-white text-slate-900 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 px-3 lg:px-4 text-xs lg:text-sm"
                                    >
                                      <Download className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                                      Download
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        setSelectedGallery(gallery);
                                        setEditModalOpen(true);
                                      }}
                                      className="bg-white/95 hover:bg-white text-slate-900 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 px-3 lg:px-4 text-xs lg:text-sm"
                                    >
                                      <Edit className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                                      Edit
                                    </Button>

                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(gallery._id);
                                      }}
                                      disabled={deleteMutation.isPending}
                                      className="h-8 w-8 lg:h-9 lg:w-9 bg-red-500/95 hover:bg-red-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 p-0"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Info Section */}
                            <div className="p-3 lg:p-4 xl:p-6 transition-all duration-500 group-hover:bg-slate-50 dark:group-hover:bg-slate-700/50">
                              <div className="flex items-start justify-between mb-2 lg:mb-3">
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm lg:text-base xl:text-lg leading-tight flex-1 pr-2 line-clamp-2">
                                  {gallery.title}
                                </h3>
                                <Badge
                                  variant="secondary"
                                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 shrink-0 text-xs"
                                >
                                  {gallery.category}
                                </Badge>
                              </div>

                              {gallery.description && (
                                <p className="text-slate-600 dark:text-slate-400 text-xs lg:text-sm leading-relaxed mb-3 lg:mb-4 line-clamp-2">
                                  {gallery.description}
                                </p>
                              )}

                              {/* Meta Information */}
                              <div className="space-y-2 lg:space-y-3">
                                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                                  <span className="truncate">
                                    {formatFileSize(gallery.bytes)}
                                  </span>
                                  <span className="truncate">
                                    {gallery.width}×{gallery.height}
                                  </span>
                                  <span className="truncate">
                                    {gallery.format.toUpperCase()}
                                  </span>
                                </div>

                                <div className="flex justify-between items-center pt-2 lg:pt-3 border-t border-slate-200 dark:border-slate-700">
                                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                    {new Date(
                                      gallery.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                    By {gallery.uploadedBy.firstName}
                                  </span>
                                </div>
                              </div>

                              {/* Mobile Quick Actions */}
                              <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDownload(
                                      gallery.imageUrl,
                                      gallery.title
                                    )
                                  }
                                  className="w-full text-xs border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 h-8"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Quick Download
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                </div>
              )}
            </div>
          ) : (
            /* List View - Mobile Responsive - Display ALL */
            <div className="space-y-3 lg:space-y-4">
              {galleries.map((gallery: Gallery) => (
                <Card
                  key={gallery._id}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-3 lg:p-4">
                    <div className="flex items-center gap-3 lg:gap-4">
                      {/* Thumbnail */}
                      <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-lg lg:rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={gallery.imageUrl}
                          alt={gallery.title}
                          className="w-full h-full object-cover"
                        />
                        {!gallery.isPublished && (
                          <Badge
                            variant="secondary"
                            className="absolute top-1 left-1 bg-amber-500 text-white text-xs px-1"
                          >
                            Draft
                          </Badge>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1 lg:mb-2">
                          <h3 className="font-semibold text-slate-900 dark:text-white text-sm lg:text-base truncate">
                            {gallery.title}
                          </h3>
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 ml-2 text-xs"
                          >
                            {gallery.category}
                          </Badge>
                        </div>

                        {gallery.description && (
                          <p className="text-slate-600 dark:text-slate-400 text-xs lg:text-sm mb-1 lg:mb-2 line-clamp-1">
                            {gallery.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 lg:gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                          <span className="truncate">
                            {formatFileSize(gallery.bytes)}
                          </span>
                          <span className="truncate">
                            {gallery.width}×{gallery.height}
                          </span>
                          <span className="truncate">
                            {gallery.format.toUpperCase()}
                          </span>
                          <span className="truncate">
                            {new Date(gallery.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Actions - Stack on mobile */}
                      <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDownload(gallery.imageUrl, gallery.title)
                          }
                          className="h-8 lg:h-9 px-2 lg:px-3 border-slate-300 dark:border-slate-600"
                        >
                          <Download className="h-3 w-3 lg:h-4 lg:w-4" />
                          <span className="sr-only lg:not-sr-only lg:ml-1">
                            Download
                          </span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedGallery(gallery);
                            setEditModalOpen(true);
                          }}
                          className="h-8 lg:h-9 px-2 lg:px-3 border-slate-300 dark:border-slate-600"
                        >
                          <Edit className="h-3 w-3 lg:h-4 lg:w-4" />
                          <span className="sr-only lg:not-sr-only lg:ml-1">
                            Edit
                          </span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(gallery._id)}
                          className="h-8 lg:h-9 px-2 lg:px-3 border-red-300 dark:border-red-600 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
                          <span className="sr-only lg:not-sr-only lg:ml-1">
                            Delete
                          </span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <GalleryUploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={() => {
          setUploadModalOpen(false);
        }}
      />

      <GalleryEditModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedGallery(null);
        }}
        onSuccess={() => {
          setEditModalOpen(false);
          setSelectedGallery(null);
        }}
        gallery={selectedGallery}
      />
    </div>
  );
};
