import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Post, Comment } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Edit,
  Trash2,
  Plus,
  Filter,
  FileText,
  Sparkles,
  Shield,
  Zap,
  Calendar,
  User,
  Eye,
  Download,
  Pin,
  MessageSquare,
  Heart,
  Share2,
  ChevronDown,
  Image as ImageIcon,
  BarChart3,
  Send,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { PostForm } from "@/components/forms/PostForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  ShimmerPostsTable,
  ShimmerPostsCards,
  ShimmerPostsHeader,
  LoadingPulse,
} from "@/components/ui/loading-placeholders";

export const Posts: React.FC = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const API = import.meta.env.VITE_API_URL;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [audienceFilter, setAudienceFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Post;
    direction: "asc" | "desc";
  } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();

  const [viewPost, setViewPost] = useState<Post | null>(null);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [commentText, setCommentText] = useState<{ [postId: string]: string }>(
    {}
  );
  const [showCommentSection, setShowCommentSection] = useState<{
    [postId: string]: boolean;
  }>({});

  // Current user ID
  const currentUserId = user?._id;

  // Fetch posts using React Query
  const {
    data: posts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch(`${API}/api/sunday-school/posts`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const result = await response.json();
      return result.data;
    },
  });

  // Fetch ALL comments for each post during initial page load
  const fetchCommentsForPost = async (postId: string) => {
    const response = await fetch(
      `${API}/api/sunday-school/comments/post/${postId}`,
      { credentials: "include" }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }
    const result = await response.json();
    return result.data;
  };

  // Fetch comments for all posts in parallel
  const { data: allCommentsMap = {}, isLoading: commentsLoading } = useQuery({
    queryKey: ["all-comments", posts.map((post) => post._id || post.id)],
    queryFn: async () => {
      if (!posts.length) return {};

      // Fetch comments for all posts in parallel
      const commentsPromises = posts.map(async (post) => {
        const postId = post._id || post.id;
        try {
          const comments = await fetchCommentsForPost(postId);
          return { postId, comments };
        } catch (error) {
          console.error(`Failed to fetch comments for post ${postId}:`, error);
          return { postId, comments: [] };
        }
      });

      const commentsResults = await Promise.all(commentsPromises);

      // Convert to a map for easy access
      const commentsMap: { [postId: string]: Comment[] } = {};
      commentsResults.forEach(({ postId, comments }) => {
        commentsMap[postId] = comments;
      });

      return commentsMap;
    },
    enabled: posts.length > 0, // Only run when we have posts
  });

  // Get comments for a specific post
  const getCommentsForPost = (postId: string) => {
    return allCommentsMap[postId] || [];
  };

  // Calculate total comments count for statistics
  const totalCommentsCount = Object.values(allCommentsMap).reduce(
    (total, comments) => total + comments.length,
    0
  );

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async ({ postId, text }: { postId: string; text: string }) => {
      const response = await fetch(`${API}/api/sunday-school/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",

        body: JSON.stringify({
          postId,
          text,
          author: user?.firstName,
          authorId: currentUserId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add comment");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate the comments query to refetch
      queryClient.invalidateQueries({ queryKey: ["all-comments"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setCommentText((prev) => ({ ...prev, [variables.postId]: "" }));
      toast.success("Comment added successfully");
    },
    onError: (error: Error) => {
      console.error("❌ Add comment error:", error);
      toast.error("Failed to add comment", {
        description: error.message,
      });
    },
  });

  // Like post mutation
  const likePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(
        `${API}/api/sunday-school/posts/${postId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",

          body: JSON.stringify({ userId: currentUserId }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to like post");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: Error) => {
      console.error("❌ Like post error:", error);
      toast.error("Failed to like post", {
        description: error.message,
      });
    },
  });

  // Like comment mutation
  const likeCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await fetch(
        `${API}/api/sunday-school/comments/${commentId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",

          body: JSON.stringify({ userId: currentUserId }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to like comment");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-comments"] });
    },
    onError: (error: Error) => {
      console.error("❌ Like comment error:", error);
      toast.error("Failed to like comment", {
        description: error.message,
      });
    },
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`${API}/api/sunday-school/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete post");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["all-comments"] });
      toast.success("Post deleted successfully");
      setSelectedPosts([]);
    },
    onError: (error: Error) => {
      console.error("❌ Delete post error:", error);
      toast.error("Failed to delete post", {
        description: error.message,
      });
    },
  });

  // Calculate statistics with comments data
  const statistics = {
    totalPosts: posts.length,
    publishedPosts: posts.filter((p) => p.status === "published").length,
    draftPosts: posts.filter((p) => p.status === "draft").length,
    archivedPosts: posts.filter((p) => p.status === "archived").length,
    pinnedPosts: posts.filter((p) => p.isPinned).length,
    totalLikes: posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0),
    totalComments: totalCommentsCount, // Use actual comments count from fetched data
    totalShares: posts.reduce((sum, post) => sum + (post.shares || 0), 0),
    categories: posts.reduce((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    audiences: posts.reduce((acc, post) => {
      acc[post.targetAudience] = (acc[post.targetAudience] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  // Check if user liked a post
  const isPostLiked = (post: Post) => {
    return post.likes?.includes(currentUserId);
  };

  // Check if user liked a comment
  const isCommentLiked = (comment: Comment) => {
    return comment.likes?.includes(currentUserId);
  };

  const handleSort = (key: keyof Post) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredPosts = sortedPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.author &&
        post.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (post.tags &&
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || post.category === categoryFilter;
    const matchesAudience =
      audienceFilter === "all" || post.targetAudience === audienceFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesAudience;
  });

  const toggleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map((p) => p._id || p.id));
    }
  };

  const toggleSelectPost = (id: string) => {
    setSelectedPosts((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedPosts.length === 0) {
      toast.error("No posts selected");
      return;
    }

    selectedPosts.forEach((id) => deletePostMutation.mutate(id));
  };

  const handleDeletePost = (post: Post) => {
    deletePostMutation.mutate(post._id || post.id);
  };

  const handlePostSave = (post: Post) => {
    setEditPost(null);
    setIsCreateDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    queryClient.invalidateQueries({ queryKey: ["all-comments"] });
    toast.success(
      post._id ? "Post updated successfully" : "Post created successfully"
    );
  };

  const handleAddComment = (postId: string) => {
    const text = commentText[postId]?.trim();
    if (!text) {
      toast.error("Comment cannot be empty");
      return;
    }

    addCommentMutation.mutate({ postId, text });
  };

  const handleLikePost = (postId: string) => {
    likePostMutation.mutate(postId);
  };

  const handleLikeComment = (commentId: string) => {
    likeCommentMutation.mutate(commentId);
  };

  const toggleCommentSection = (postId: string) => {
    setShowCommentSection((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-gradient-to-r from-green-500 to-emerald-500";
      case "draft":
        return "bg-gradient-to-r from-amber-500 to-orange-500";
      case "archived":
        return "bg-gradient-to-r from-slate-500 to-slate-600";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "announcement":
        return "bg-blue-500";
      case "lesson":
        return "bg-green-500";
      case "event":
        return "bg-purple-500";
      case "general":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case "all":
        return "bg-green-500";
      case "students":
        return "bg-amber-500";
      case "teachers":
        return "bg-indigo-500";
      case "parents":
        return "bg-pink-500";
      default:
        return "bg-gray-500";
    }
  };

  const exportPosts = () => {
    const data = filteredPosts.map((post) => ({
      Title: post.title,
      Author: post.author,
      Category: post.category,
      Status: post.status,
      "Publish Date": post.publishDate,
      Likes: post.likes?.length || 0,
      Comments: getCommentsForPost(post._id || post.id).length,
      Shares: post.shares || 0,
      Audience: post.targetAudience,
    }));

    console.log("Exporting posts:", data);
    toast.success("Posts exported successfully");
  };

  const categories = [...new Set(posts.map((post) => post.category))];
  const audiences = [...new Set(posts.map((post) => post.targetAudience))];
  const statuses = [...new Set(posts.map((post) => post.status))];

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getTranslatedCategory = (category: string) => {
    const categoryMap: Record<string, string> = {
      announcement: "Announcement",
      lesson: "Lesson",
      event: "Event",
      general: "General",
    };
    return categoryMap[category] || category;
  };

  const getTranslatedAudience = (audience: string) => {
    const audienceMap: Record<string, string> = {
      all: "All",
      students: "Students",
      teachers: "Teachers",
      parents: "Parents",
    };
    return audienceMap[audience] || audience;
  };

  const getTranslatedStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      draft: "Draft",
      published: "Published",
      archived: "Archived",
    };
    return statusMap[status] || status;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-full overflow-x-hidden">
        <ShimmerPostsHeader />

        {/* Statistics Section Loading */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LoadingPulse className="h-5 w-5 rounded" />
                <LoadingPulse className="h-6 w-32" />
              </div>
              <LoadingPulse className="h-9 w-24 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Header Controls Loading */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <LoadingPulse className="h-10 w-full sm:max-w-sm rounded-xl" />
              <LoadingPulse className="h-10 w-24 rounded-xl sm:hidden" />
            </div>
            <div className="hidden sm:flex gap-2">
              <LoadingPulse className="h-9 w-24 rounded-xl" />
              <LoadingPulse className="h-9 w-28 rounded-xl" />
              <LoadingPulse className="h-9 w-32 rounded-xl" />
              <LoadingPulse className="h-9 w-32 rounded-xl" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-3">
              <LoadingPulse className="h-9 w-32 rounded-xl" />
              <LoadingPulse className="h-9 w-40 rounded-xl" />
            </div>
            <LoadingPulse className="h-9 w-40 rounded-xl" />
          </div>
        </div>

        {/* Posts Content Loading */}
        <ShimmerPostsTable />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FileText className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
            Failed to load posts
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {error.message}
          </p>
          <Button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["posts"] })
            }
            className="bg-purple-500 hover:bg-purple-600"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Premium Header Section */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800 via-purple-900 to-pink-900 p-6 sm:p-8 text-white border border-purple-500/20 max-w-full">
        <div className="relative z-10 max-w-full">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 max-w-full">
            <div className="flex-1 min-w-0 max-w-full">
              <div className="flex items-start gap-3 sm:gap-4 mb-4 max-w-full">
                <div className="p-2 sm:p-3 bg-purple-500/20 rounded-xl sm:rounded-2xl border border-purple-400/30 flex-shrink-0">
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0 max-w-full">
                  <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent break-words max-w-full">
                    Manage Posts
                  </h1>
                  <p className="text-purple-100 text-sm sm:text-lg mt-1 sm:mt-2 break-words max-w-full">
                    Create, manage, and monitor your Sunday school posts
                  </p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="overflow-x-auto max-w-full">
                <div className="flex gap-3 sm:gap-6 mt-4 sm:mt-6 min-w-max pb-2 max-w-full">
                  <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 min-w-0 flex-shrink-0 max-w-full">
                    <Shield className="h-4 w-4 sm:h-6 sm:w-6 text-purple-400 flex-shrink-0" />
                    <div className="min-w-0 max-w-full">
                      <p className="text-lg sm:text-2xl font-bold truncate max-w-full">
                        {posts.length}
                      </p>
                      <p className="text-xs text-purple-200 truncate max-w-full">
                        Total Posts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 min-w-0 flex-shrink-0 max-w-full">
                    <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-pink-400 flex-shrink-0" />
                    <div className="min-w-0 max-w-full">
                      <p className="text-lg sm:text-2xl font-bold truncate max-w-full">
                        {posts.filter((p) => p.status === "published").length}
                      </p>
                      <p className="text-xs text-pink-200 truncate max-w-full">
                        Published
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 min-w-0 flex-shrink-0 max-w-full">
                    <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-400 flex-shrink-0" />
                    <div className="min-w-0 max-w-full">
                      <p className="text-lg sm:text-2xl font-bold truncate max-w-full">
                        {posts.filter((p) => p.isPinned).length}
                      </p>
                      <p className="text-xs text-emerald-200 truncate max-w-full">
                        Pinned
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden max-w-full">
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              Statistics
            </h2>
            <Button
              variant="outline"
              onClick={() => setShowStatistics(!showStatistics)}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              {showStatistics ? "Hide Stats" : "Show Stats"}
            </Button>
          </div>
        </div>

        {showStatistics && (
          <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-slate-800 dark:text-white">
                {statistics.totalPosts}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Total Posts
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {statistics.publishedPosts}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Published
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {statistics.draftPosts}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Drafts
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                {statistics.archivedPosts}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Archived
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {statistics.totalLikes}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Total Likes
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {statistics.totalComments}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Total Comments
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                {statistics.totalShares}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Total Shares
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {statistics.pinnedPosts}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Pinned
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Header Controls */}
      <div className="flex flex-col gap-4 max-w-full overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 max-w-full">
          <div className="flex-1 flex flex-col sm:flex-row gap-3 max-w-full">
            <div className="relative flex-1 sm:max-w-sm max-w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl transition-all duration-300 w-full max-w-full"
              />
            </div>

            {/* Mobile Filter Toggle */}
            <div className="sm:hidden max-w-full">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center gap-2 border-slate-300 dark:border-slate-600 max-w-full"
              >
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 max-w-full overflow-x-auto">
            <div className="hidden sm:flex gap-2 max-w-full">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm max-w-full"
              >
                <option value="all">All Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {getTranslatedStatus(status)}
                  </option>
                ))}
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm max-w-full"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {getTranslatedCategory(category)}
                  </option>
                ))}
              </select>

              <select
                value={audienceFilter}
                onChange={(e) => setAudienceFilter(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm max-w-full"
              >
                <option value="all">All Audiences</option>
                {audiences.map((audience) => (
                  <option key={audience} value={audience}>
                    {getTranslatedAudience(audience)}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle Buttons */}
            <div className="flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1 max-w-full">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-2 rounded-lg transition-all duration-300 text-sm flex items-center gap-2 ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span className="hidden sm:inline">Table View</span>
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`px-3 py-2 rounded-lg transition-all duration-300 text-sm flex items-center gap-2 ${
                  viewMode === "card"
                    ? "bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                <span className="hidden sm:inline">Card View</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="sm:hidden grid grid-cols-1 gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 max-w-full overflow-x-hidden">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm w-full max-w-full"
            >
              <option value="all">All Status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {getTranslatedStatus(status)}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm w-full max-w-full"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {getTranslatedCategory(category)}
                </option>
              ))}
            </select>

            <select
              value={audienceFilter}
              onChange={(e) => setAudienceFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm w-full max-w-full"
            >
              <option value="all">All Audiences</option>
              {audiences.map((audience) => (
                <option key={audience} value={audience}>
                  {getTranslatedAudience(audience)}
                </option>
              ))}
            </select>

            {/* Mobile View Mode Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode("table")}
                className={`flex-1 px-3 py-2 rounded-lg transition-all duration-300 text-sm flex items-center justify-center gap-2 ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Table</span>
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`flex-1 px-3 py-2 rounded-lg transition-all duration-300 text-sm flex items-center justify-center gap-2 ${
                  viewMode === "card"
                    ? "bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                <span>Cards</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 max-w-full overflow-x-hidden">
          <div className="flex gap-3 max-w-full overflow-x-auto">
            <Button
              variant="outline"
              onClick={exportPosts}
              className="flex items-center gap-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex-1 sm:flex-none max-w-full"
            >
              <Download className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline truncate">Export Posts</span>
              <span className="sm:hidden truncate">Export</span>
            </Button>

            {selectedPosts.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex-1 sm:flex-none max-w-full"
              >
                <Trash2 className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                  Delete ({selectedPosts.length})
                </span>
              </Button>
            )}
          </div>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex-1 sm:flex-none max-w-full">
                <Plus className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Create New Post</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] mx-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 max-w-full">
                  <FileText className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">Create New Post</span>
                </DialogTitle>
              </DialogHeader>
              <PostForm
                mode="create"
                onSave={handlePostSave}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Posts Display */}
      {viewMode === "table" ? (
        /* Table View */
        <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border-0 shadow-xl sm:shadow-2xl overflow-hidden max-w-full">
          <div className="overflow-x-auto max-w-full">
            <Table className="max-w-full">
              <TableHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 max-w-full">
                <TableRow className="border-b border-slate-200 dark:border-slate-700 max-w-full">
                  <TableHead className="w-12 bg-transparent px-2 sm:px-4 max-w-full">
                    <Checkbox
                      checked={
                        selectedPosts.length === filteredPosts.length &&
                        filteredPosts.length > 0
                      }
                      onCheckedChange={toggleSelectAll}
                      className="border-slate-300 dark:border-slate-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer bg-transparent text-slate-800 dark:text-white font-semibold py-4 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-300 px-2 sm:px-4 min-w-[200px] max-w-full"
                    onClick={() => handleSort("title")}
                  >
                    <span className="truncate block">Title</span>
                  </TableHead>
                  <TableHead className="hidden sm:table-cell bg-transparent text-slate-800 dark:text-white font-semibold py-4 px-2 sm:px-4 min-w-[150px] max-w-full">
                    <span className="truncate block">Author</span>
                  </TableHead>
                  <TableHead className="hidden md:table-cell bg-transparent text-slate-800 dark:text-white font-semibold py-4 px-2 sm:px-4 min-w-[120px] max-w-full">
                    <span className="truncate block">Category</span>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell bg-transparent text-slate-800 dark:text-white font-semibold py-4 px-2 sm:px-4 min-w-[120px] max-w-full">
                    <span className="truncate block">Audience</span>
                  </TableHead>
                  <TableHead className="hidden xl:table-cell bg-transparent text-slate-800 dark:text-white font-semibold py-4 px-2 sm:px-4 min-w-[140px] max-w-full">
                    <span className="truncate block">Engagement</span>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer bg-transparent text-slate-800 dark:text-white font-semibold py-4 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-300 px-2 sm:px-4 min-w-[100px] max-w-full"
                    onClick={() => handleSort("publishDate")}
                  >
                    <span className="truncate block">Date</span>
                  </TableHead>
                  <TableHead className="bg-transparent text-slate-800 dark:text-white font-semibold py-4 px-2 sm:px-4 min-w-[100px] max-w-full">
                    <span className="truncate block">Status</span>
                  </TableHead>
                  <TableHead className="text-right bg-transparent text-slate-800 dark:text-white font-semibold py-4 px-2 sm:px-4 min-w-[120px] max-w-full">
                    <span className="truncate block">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="max-w-full">
                {filteredPosts.map((post) => {
                  const postComments = getCommentsForPost(post._id || post.id);
                  return (
                    <TableRow
                      key={post._id || post.id}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-300 group max-w-full"
                    >
                      <TableCell className="py-4 px-2 sm:px-4 max-w-full">
                        <Checkbox
                          checked={selectedPosts.includes(post._id || post.id)}
                          onCheckedChange={() =>
                            toggleSelectPost(post._id || post.id)
                          }
                          className="border-slate-300 dark:border-slate-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                        />
                      </TableCell>
                      <TableCell className="py-4 px-2 sm:px-4 max-w-full">
                        <div className="flex items-center gap-2 sm:gap-3 max-w-full">
                          {post.isPinned && (
                            <Pin className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500 flex-shrink-0" />
                          )}
                          {post.image && (
                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                              <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                  e.currentTarget.nextElementSibling?.classList.remove(
                                    "hidden"
                                  );
                                }}
                              />
                              <div className="hidden w-full h-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                <ImageIcon className="h-4 w-4 text-slate-400" />
                              </div>
                            </div>
                          )}
                          <div className="min-w-0 flex-1 max-w-full">
                            <p className="font-semibold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors text-sm sm:text-base truncate max-w-full">
                              {post.title}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 hidden sm:block truncate max-w-full">
                              {post.content?.substring(0, 60)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell py-4 px-2 sm:px-4 max-w-full">
                        <div className="flex items-center gap-2 max-w-full">
                          <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                              {post.author
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-slate-700 dark:text-slate-300 text-sm truncate min-w-0 max-w-full">
                            {post.authorId?.firstName || "Unknown Author"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell py-4 px-2 sm:px-4 max-w-full">
                        <div className="min-w-0 max-w-full">
                          <Badge
                            className={`rounded-lg font-medium shadow-sm text-white text-xs truncate max-w-full ${getCategoryColor(
                              post.category
                            )}`}
                          >
                            {getTranslatedCategory(post.category)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell py-4 px-2 sm:px-4 max-w-full">
                        <div className="min-w-0 max-w-full">
                          <Badge
                            variant="outline"
                            className={`rounded-lg font-medium text-xs truncate max-w-full ${getAudienceColor(
                              post.targetAudience
                            )} text-white border-0`}
                          >
                            {getTranslatedAudience(post.targetAudience)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell py-4 px-2 sm:px-4 max-w-full">
                        <div className="flex items-center gap-2 sm:gap-4 text-xs text-slate-600 dark:text-slate-400 max-w-full">
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleLikePost(post._id || post.id)
                              }
                              className={`h-6 w-6 p-0 hover:bg-orange-50 dark:hover:bg-orange-900/20 ${
                                isPostLiked(post)
                                  ? "text-orange-500"
                                  : "text-slate-400"
                              }`}
                            >
                              <Heart
                                className={`h-3 w-3 flex-shrink-0 ${
                                  isPostLiked(post) ? "fill-current" : ""
                                }`}
                              />
                            </Button>
                            <span className="truncate">
                              {post.likes?.length || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <MessageSquare className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">
                              {postComments.length}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Share2 className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{post.shares || 0}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-slate-700 dark:text-slate-300 text-sm px-2 sm:px-4 max-w-full">
                        <span className="truncate block max-w-full">
                          {getTimeAgo(post.publishDate)}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-2 sm:px-4 max-w-full">
                        <div className="min-w-0 max-w-full">
                          <Badge
                            className={`rounded-lg font-medium shadow-sm text-white text-xs truncate max-w-full ${getStatusColor(
                              post.status
                            )}`}
                          >
                            {getTranslatedStatus(post.status)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-right px-2 sm:px-4 max-w-full">
                        <div className="flex justify-end gap-1 sm:gap-2 max-w-full">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewPost(post)}
                            className="h-8 w-8 sm:h-9 sm:w-9 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-0 flex-shrink-0"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditPost(post);
                            }}
                            className="h-8 w-8 sm:h-9 sm:w-9 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-0 flex-shrink-0"
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePost(post)}
                            className="h-8 w-8 sm:h-9 sm:w-9 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-0 flex-shrink-0"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Premium Empty State */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12 sm:py-16 max-w-full overflow-x-hidden">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium mb-2 max-w-full">
                No posts found
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-500 max-w-full">
                {searchTerm
                  ? "Try adjusting your search or filters"
                  : "No posts available"}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Card View */
        <div className="space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
          {filteredPosts.map((post) => {
            const postComments = getCommentsForPost(post._id || post.id);
            return (
              <div
                key={post._id || post.id}
                className="max-w-full overflow-x-hidden"
              >
                <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Card Header */}
                  <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm">
                            {post.author
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base">
                            {post.author || "Unknown Author"}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {getTimeAgo(post.publishDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {post.isPinned && (
                          <Pin className="h-4 w-4 text-amber-500" />
                        )}
                        <Badge
                          className={`text-xs ${getStatusColor(
                            post.status
                          )} text-white`}
                        >
                          {getTranslatedStatus(post.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge
                        className={`text-xs ${getCategoryColor(
                          post.category
                        )} text-white`}
                      >
                        {getTranslatedCategory(post.category)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getAudienceColor(
                          post.targetAudience
                        )} text-white border-0`}
                      >
                        {getTranslatedAudience(post.targetAudience)}
                      </Badge>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-3">
                      {post.title}
                    </h2>

                    {post.image && (
                      <div className="mb-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 sm:h-64 object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base line-clamp-3 mb-4">
                      {post.content}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{post.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Engagement Stats */}
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikePost(post._id || post.id)}
                          className={`flex items-center gap-1 h-8 ${
                            isPostLiked(post)
                              ? "text-orange-500"
                              : "text-slate-500"
                          }`}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              isPostLiked(post) ? "fill-current" : ""
                            }`}
                          />
                          <span>{post.likes?.length || 0}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            toggleCommentSection(post._id || post.id)
                          }
                          className="flex items-center gap-1 h-8 text-slate-500"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>{postComments.length}</span>
                        </Button>
                        <div className="flex items-center gap-1">
                          <Share2 className="h-4 w-4" />
                          <span>{post.shares || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewPost(post)}
                          className="h-8 text-xs"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditPost(post)}
                          className="h-8 text-xs"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePost(post)}
                          className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>

                    {/* Comment Section - Only shown when toggled */}
                    {showCommentSection[post._id || post.id] && (
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <h4 className="font-semibold text-slate-800 dark:text-white mb-3">
                          Comments ({postComments.length})
                        </h4>

                        {/* Comments List - Display ALL comments with scroll */}
                        <div className="max-h-48 overflow-y-auto space-y-3 mb-4">
                          {commentsLoading ? (
                            <div className="text-center py-4">
                              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            </div>
                          ) : postComments.length > 0 ? (
                            postComments.map((comment: Comment) => (
                              <div
                                key={comment._id}
                                className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                              >
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs">
                                    {comment.authorId?.firstName?.[0] ||
                                      comment.author?.[0] ||
                                      "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-slate-800 dark:text-white text-sm truncate">
                                      {comment.authorId?.firstName &&
                                      comment.authorId?.middleName
                                        ? `${comment.authorId?.firstName} ${comment.authorId?.middleName}`
                                        : comment.author || "Unknown User"}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                      {getTimeAgo(comment.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-slate-600 dark:text-slate-400 text-sm break-words">
                                    {comment.text}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-slate-500 dark:text-slate-400 text-center py-4 text-sm">
                              No comments yet. Be the first to comment!
                            </p>
                          )}
                        </div>

                        {/* Comment Input */}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a comment..."
                            value={commentText[post._id || post.id] || ""}
                            onChange={(e) =>
                              setCommentText((prev) => ({
                                ...prev,
                                [post._id || post.id]: e.target.value,
                              }))
                            }
                            className="flex-1"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleAddComment(post._id || post.id);
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() =>
                              handleAddComment(post._id || post.id)
                            }
                            disabled={addCommentMutation.isPending}
                            className="bg-purple-500 hover:bg-purple-600"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredPosts.length === 0 && (
            <div className="text-center py-12 sm:py-16 bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden max-w-full">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium mb-2 max-w-full">
                No posts found
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-500 max-w-full">
                {searchTerm
                  ? "Try adjusting your search or filters"
                  : "No posts available"}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Post Detail Dialog */}
      <Dialog open={!!viewPost} onOpenChange={() => setViewPost(null)}>
        <DialogHeader>
          <DialogTitle>
            <div></div>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-2xl rounded-2xl sm:rounded-3xl mx-4 w-[95vw]">
          {viewPost && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      {viewPost.author
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white">
                      {viewPost.author || "Unknown Author"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {getTimeAgo(viewPost.publishDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {viewPost.isPinned && (
                    <Pin className="h-5 w-5 text-amber-500" />
                  )}
                  <Badge className={getStatusColor(viewPost.status)}>
                    {getTranslatedStatus(viewPost.status)}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Badge className={getCategoryColor(viewPost.category)}>
                  {getTranslatedCategory(viewPost.category)}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    getAudienceColor(viewPost.targetAudience) +
                    " text-white border-0"
                  }
                >
                  {getTranslatedAudience(viewPost.targetAudience)}
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-4">
                {viewPost.title}
              </h1>

              {viewPost.image && (
                <div className="mb-6 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img
                    src={viewPost.image}
                    alt={viewPost.title}
                    className="w-full h-64 sm:h-96 object-cover"
                  />
                </div>
              )}

              <div className="prose dark:prose-invert max-w-none mb-8">
                <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                  {viewPost.content}
                </p>
              </div>

              {viewPost.tags && viewPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {viewPost.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Engagement Actions */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <Button
                  variant="ghost"
                  onClick={() => handleLikePost(viewPost._id || viewPost.id)}
                  className={`flex items-center gap-2 ${
                    isPostLiked(viewPost)
                      ? "text-orange-500"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isPostLiked(viewPost) ? "fill-current" : ""
                    }`}
                  />
                  <span>{viewPost.likes?.length || 0} Likes</span>
                </Button>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <MessageSquare className="h-5 w-5" />
                  <span>
                    {getCommentsForPost(viewPost._id || viewPost.id).length}{" "}
                    Comments
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Share2 className="h-5 w-5" />
                  <span>{viewPost.shares || 0} Shares</span>
                </div>
              </div>

              {/* Comments Section in Detail View */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Comments (
                  {getCommentsForPost(viewPost._id || viewPost.id).length})
                </h3>

                {/* Comments List - Display ALL comments with scroll */}
                <div className="max-h-80 overflow-y-auto space-y-4 mb-6">
                  {commentsLoading ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Loading comments...
                      </p>
                    </div>
                  ) : getCommentsForPost(viewPost._id || viewPost.id).length >
                    0 ? (
                    getCommentsForPost(viewPost._id || viewPost.id).map(
                      (comment: Comment) => (
                        <div
                          key={comment._id}
                          className="flex gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
                        >
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                              {comment.authorId?.firstName?.[0] ||
                                comment.author?.[0] ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-slate-800 dark:text-white">
                                {comment.authorId?.firstName &&
                                comment.authorId?.middleName
                                  ? `${comment.authorId?.firstName} ${comment.authorId?.middleName}`
                                  : comment.author || "Unknown User"}
                              </span>
                              <span className="text-sm text-slate-500 dark:text-slate-400">
                                {getTimeAgo(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 mb-3 break-words">
                              {comment.text}
                            </p>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </div>

                {/* Add Comment */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={commentText[viewPost._id || viewPost.id] || ""}
                    onChange={(e) =>
                      setCommentText((prev) => ({
                        ...prev,
                        [viewPost._id || viewPost.id]: e.target.value,
                      }))
                    }
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddComment(viewPost._id || viewPost.id);
                      }
                    }}
                  />
                  <Button
                    onClick={() =>
                      handleAddComment(viewPost._id || viewPost.id)
                    }
                    disabled={addCommentMutation.isPending}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Post Dialog */}
      <Dialog open={!!editPost} onOpenChange={() => setEditPost(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4 w-[95vw]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 max-w-full">
              <Edit className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">Edit Post</span>
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {editPost && (
            <PostForm
              post={editPost}
              mode="edit"
              onSave={handlePostSave}
              onCancel={() => setEditPost(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
