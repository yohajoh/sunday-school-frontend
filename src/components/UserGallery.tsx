import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  ZoomIn,
  Heart,
  Share2,
  Image as ImageIcon,
  AlertCircle,
  Grid3X3,
  List,
  Sparkles,
  Calendar,
  User,
  Tag,
  ArrowDown,
  Play,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImagePreviewModal } from "./ImagePreviewModal";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

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
  uploadedBy: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

const API = import.meta.env.VITE_API_URL;

// React Query hooks - Get ALL galleries
const useUserGalleries = (searchTerm: string, category: string) => {
  return useQuery({
    queryKey: ["user-galleries", searchTerm, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (category !== "all") params.append("category", category);

      // Remove any limits to get ALL images
      const response = await fetch(
        `${API}/api/sunday-school/user/gallery?${params}`,
        { credentials: "include" }
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

const useUserCategories = () => {
  return useQuery({
    queryKey: ["user-gallery-categories"],
    queryFn: async () => {
      const response = await fetch(
        `${API}/api/sunday-school/user/gallery/categories`,
        { credentials: "include" }
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch categories");
      }

      return data.categories;
    },
  });
};

export const UserGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<Gallery | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const {
    data: galleriesData,
    isLoading,
    error,
  } = useUserGalleries(searchTerm, category);
  const { data: categories = ["all"] } = useUserCategories();

  // Get ALL galleries - no pagination
  const galleries = galleriesData?.galleries || [];

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
      toast.error("Failed to download image");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Sort ALL galleries
  const sortedGalleries = [...galleries].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-amber-50/30 dark:from-slate-900 dark:via-orange-950/10 dark:to-amber-950/5">
      <div className="space-y-6">
        {/* Premium Hero Section - Mobile Optimized */}
        <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-br from-slate-800 via-orange-900 to-amber-900 p-6 sm:p-8 text-white border border-orange-500/20 lg:mx-0">
          <div className="relative z-10 text-center flex justify-between">
            <h1 className="text-2xl lg:text-5xl font-bold mb-3 lg:mb-4 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent px-2">
              Memory Gallery
            </h1>

            <div>
              {/* Quick Stats - Mobile Responsive */}
              <div className="flex justify-center gap-4 lg:gap-8 mt-6 lg:mt-8">
                <div className="text-center">
                  <div className="text-xl lg:text-3xl font-bold text-white">
                    {galleries.length}
                  </div>
                  <div className="text-emerald-200 text-xs lg:text-base">
                    Total Photos
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl lg:text-3xl font-bold text-white">
                    {[...new Set(galleries.map((g) => g.category))].length}
                  </div>
                  <div className="text-blue-200 text-xs lg:text-base">
                    Categories
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl lg:text-3xl font-bold text-white">
                    {Math.round(
                      galleries.reduce((acc, g) => acc + g.bytes, 0) /
                        (1024 * 1024)
                    )}
                  </div>
                  <div className="text-purple-200 text-xs lg:text-base">
                    MB Total
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-48 h-48 lg:w-96 lg:h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 lg:w-80 lg:h-80 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        {/* Advanced Controls - Mobile Optimized */}
        <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-2xl rounded-2xl lg:rounded-3xl border border-slate-200/50 dark:border-slate-700/50 mx-2 lg:mx-0">
          <CardContent className="p-6 lg:p-4">
            <div className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-4">
              {/* Search - Full width on mobile */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 lg:h-5 lg:w-5 text-slate-400" />
                <Input
                  placeholder="Search memories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 lg:pl-12 h-12 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 rounded-xl text-base lg:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 w-full"
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
              </div>

              {/* Desktop Filters & Controls */}
              <div className="hidden lg:flex lg:items-center lg:gap-3">
                {/* Category Filter */}
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 min-w-32"
                >
                  {categories.map((cat: string) => (
                    <option key={cat} value={cat}>
                      {cat === "all"
                        ? "All Categories"
                        : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>

                {/* Sort Filter */}
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "newest" | "oldest")
                  }
                  className="px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 min-w-32"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
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
                    onClick={() => setViewMode("masonry")}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === "masonry"
                        ? "bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <List className="h-4 w-4 lg:h-5 lg:w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Filters Dropdown */}
            {showMobileFilters && (
              <div className="lg:hidden mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {categories.map((cat: string) => (
                    <option key={cat} value={cat}>
                      {cat === "all"
                        ? "All Categories"
                        : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "newest" | "oldest")
                  }
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
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
                    onClick={() => setViewMode("masonry")}
                    className={`flex-1 py-2 rounded-md transition-all duration-300 text-sm ${
                      viewMode === "masonry"
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

        {/* Gallery Content - Display ALL galleries */}
        <div className="px-2 lg:px-0">
          {!isLoading && galleries.length === 0 ? (
            <Card className="text-center py-12 lg:py-20 border-dashed border-2 border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 rounded-2xl lg:rounded-3xl">
              <CardContent className="p-6 lg:p-8">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-2xl">
                  <ImageIcon className="h-8 w-8 lg:h-12 lg:w-12 text-white" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2 lg:mb-3">
                  {error ? "Gallery Unavailable" : "No Memories Yet"}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-lg max-w-md mx-auto">
                  {error
                    ? "We encountered an issue loading the gallery. Please try again later."
                    : "Check back soon for new photos and memories from our activities."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div
              className={`grid grid-cols-1 ${
                viewMode === "grid"
                  ? "sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 lg:gap-6"
                  : "gap-3 lg:gap-6"
              }`}
            >
              {isLoading
                ? // Loading Skeleton
                  [...Array(6)].map((_, i) => (
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
                  sortedGalleries.map((gallery: Gallery) => (
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

                          {/* Mobile Overlay */}
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
                                  onClick={() => setSelectedImage(gallery)}
                                  className="bg-emerald-500/95 hover:bg-emerald-500 text-white shadow-lg text-xs h-8 px-3"
                                >
                                  <ZoomIn className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Desktop Overlay */}
                          <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                            <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                              <h3 className="font-bold text-white text-sm lg:text-lg mb-2 line-clamp-1">
                                {gallery.title}
                              </h3>

                              {gallery.description && (
                                <p className="text-slate-200 text-xs lg:text-sm mb-3 lg:mb-4 line-clamp-2">
                                  {gallery.description}
                                </p>
                              )}

                              <div className="flex justify-center gap-2 lg:gap-3">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleDownload(
                                      gallery.imageUrl,
                                      gallery.title
                                    )
                                  }
                                  className="bg-white/95 hover:bg-white text-slate-900 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 text-xs lg:text-sm"
                                >
                                  <Download className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                                  Download
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => setSelectedImage(gallery)}
                                  className="bg-emerald-500/95 hover:bg-emerald-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 text-xs lg:text-sm"
                                >
                                  <ZoomIn className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                                  View
                                </Button>
                              </div>
                            </div>

                            {/* Top Info */}
                            <div className="absolute top-3 lg:top-4 left-3 lg:left-4 right-3 lg:right-4 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                              <div className="flex justify-between items-start">
                                <Badge className="bg-emerald-500/90 text-white border-0 text-xs">
                                  {gallery.category}
                                </Badge>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 lg:h-8 lg:w-8 bg-black/50 hover:bg-black/70 text-white p-0 rounded-lg"
                                  >
                                    <Heart className="h-3 w-3 lg:h-4 lg:w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 lg:h-8 lg:w-8 bg-black/50 hover:bg-black/70 text-white p-0 rounded-lg"
                                  >
                                    <Share2 className="h-3 w-3 lg:h-4 lg:w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Info Footer */}
                        <div className="p-3 lg:p-4">
                          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-1 lg:gap-2">
                              <Calendar className="h-3 w-3" />
                              <span className="truncate">
                                {new Date(
                                  gallery.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              <span className="truncate">
                                {gallery.format.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        gallery={selectedImage}
        onDownload={handleDownload}
      />
    </div>
  );
};
