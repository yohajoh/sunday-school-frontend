import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PostCard } from "@/components/shared/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Bell,
  Sparkles,
  Zap,
  Shield,
  Calendar,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const WhatsNew: React.FC = () => {
  const { t } = useLanguage();
  const API = import.meta.env.VITE_API_URL;
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>(
    {}
  );
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Mock current user for demo
  const currentUser = {
    id: "demo-user-123",
    firstName: "Current",
    lastName: "User",
    email: "user@example.com",
  };

  // Fetch posts using React Query
  const {
    data: posts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch(`${API}/api/sunday-school/posts`);
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const result = await response.json();
      console.log("Fetched posts:", result.data);
      return result.data;
    },
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async ({
      postId,
      comment,
    }: {
      postId: string;
      comment: any;
    }) => {
      const response = await fetch(
        `${API}/api/sunday-school/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(comment),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add comment");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Comment posted successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to post comment", {
        description: error.message,
      });
    },
  });

  // Like post mutation
  const likePostMutation = useMutation({
    mutationFn: async ({
      postId,
      userId,
    }: {
      postId: string;
      userId: string;
    }) => {
      const response = await fetch(
        `${API}/api/sunday-school/posts/${postId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
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
      toast.success("Post liked!");
    },
    onError: (error: Error) => {
      toast.error("Failed to like post", {
        description: error.message,
      });
    },
  });

  // Unlike post mutation
  const unlikePostMutation = useMutation({
    mutationFn: async ({
      postId,
      userId,
    }: {
      postId: string;
      userId: string;
    }) => {
      const response = await fetch(
        `${API}/api/sunday-school/posts/${postId}/unlike`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to unlike post");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post unliked!");
    },
    onError: (error: Error) => {
      toast.error("Failed to unlike post", {
        description: error.message,
      });
    },
  });

  // Filter posts for user audience (only published posts for students/all)
  const userPosts = posts.filter(
    (post: any) =>
      post.status === "published" &&
      (post.targetAudience === "all" || post.targetAudience === "students")
  );

  const filteredPosts = userPosts.filter((post: any) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.tags &&
        post.tags.some((tag: string) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    const matchesCategory =
      categoryFilter === "all" || post.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(userPosts.map((post: any) => post.category))];
  const pinnedPosts = filteredPosts.filter((post: any) => post.isPinned);
  const regularPosts = filteredPosts.filter((post: any) => !post.isPinned);

  const handleCommentSubmit = async (postId: string) => {
    const commentText = commentInputs[postId]?.trim();

    if (!commentText) {
      toast.error("Please write a comment");
      return;
    }

    const newComment = {
      id: Date.now().toString(),
      postId: postId,
      author: `${currentUser.firstName} ${currentUser.lastName}`,
      authorId: currentUser.id,
      text: commentText,
      likes: [],
      replies: [],
      createdAt: new Date().toISOString(),
    };

    addCommentMutation.mutate({ postId, comment: newComment });

    // Clear input
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleLikePost = (postId: string, isCurrentlyLiked: boolean) => {
    if (isCurrentlyLiked) {
      unlikePostMutation.mutate({ postId, userId: currentUser.id });
    } else {
      likePostMutation.mutate({ postId, userId: currentUser.id });
    }
  };

  const toggleComments = (postId: string) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentChange = (postId: string, value: string) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6 sm:p-6">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800 via-purple-900 to-pink-900 p-6 sm:p-8 text-white border border-purple-500/20">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-purple-200">Loading posts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6 sm:p-6">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800 via-red-900 to-pink-900 p-6 sm:p-8 text-white border border-red-500/20">
          <div className="text-center py-12">
            <div className="p-4 bg-red-500/20 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Bell className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Failed to load posts</h3>
            <p className="text-red-200 mb-4">{error.message}</p>
            <Button
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["posts"] })
              }
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:p-6">
      {/* Premium Header Section */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800 via-purple-900 to-pink-900 p-6 sm:p-8 text-white border border-purple-500/20">
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-400/30">
                  <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                    {t("whatsNew.title") || "What's New"}
                  </h1>
                  <p className="text-purple-100 text-sm sm:text-lg mt-2">
                    {t("whatsNew.subtitle") ||
                      "Stay updated with the latest announcements and posts"}
                  </p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/20 min-w-0 flex-1 sm:flex-none">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                  <div className="min-w-0">
                    <p className="text-lg sm:text-2xl font-bold truncate">
                      {userPosts.length}
                    </p>
                    <p className="text-xs text-purple-200 truncate">
                      {t("whatsNew.totalPosts") || "Total Posts"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/20 min-w-0 flex-1 sm:flex-none">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-pink-400" />
                  <div className="min-w-0">
                    <p className="text-lg sm:text-2xl font-bold truncate">
                      {pinnedPosts.length}
                    </p>
                    <p className="text-xs text-pink-200 truncate">
                      {t("whatsNew.pinned") || "Pinned"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/20 min-w-0 flex-1 sm:flex-none">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
                  <div className="min-w-0">
                    <p className="text-lg sm:text-2xl font-bold truncate">
                      {
                        userPosts.filter(
                          (p: any) => p.category === "announcement"
                        ).length
                      }
                    </p>
                    <p className="text-xs text-emerald-200 truncate">
                      {t("whatsNew.announcements") || "Announcements"}
                    </p>
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

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
            <Input
              placeholder={t("whatsNew.searchPlaceholder") || "Search posts..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl transition-all duration-300 w-full sm:w-80"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 w-full sm:w-auto"
          >
            <option value="all">
              {t("whatsNew.allCategories") || "All Categories"}
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {typeof category === "string"
                  ? category.charAt(0).toUpperCase() + category.slice(1)
                  : category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl shadow-lg w-full sm:w-auto">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500 dark:text-slate-400" />
            <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Pinned Posts */}
      {pinnedPosts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
              {t("whatsNew.pinnedAnnouncements") || "Pinned Announcements"}
            </h2>
          </div>

          <div className="space-y-6">
            {pinnedPosts.map((post: any) => (
              <PostCard
                key={post._id || post.id}
                post={post}
                currentUser={currentUser}
                onUpdate={() => {}} // Empty function for user view
                showActions={true} // Show like/comment buttons for users
                onToggleComments={() => toggleComments(post._id || post.id)}
                showComments={showComments[post._id || post.id]}
                commentInput={commentInputs[post._id || post.id] || ""}
                onCommentChange={(value) =>
                  handleCommentChange(post._id || post.id, value)
                }
                onCommentSubmit={() => handleCommentSubmit(post._id || post.id)}
                onLikePost={(isLiked) =>
                  handleLikePost(post._id || post.id, isLiked)
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* All Posts */}
      <div className="space-y-6">
        {pinnedPosts.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
              {t("whatsNew.allCommunityPosts") || "All Community Posts"}
            </h2>
          </div>
        )}

        {regularPosts.length > 0 ? (
          <div className="space-y-6">
            {regularPosts.map((post: any) => (
              <PostCard
                key={post._id || post.id}
                post={post}
                currentUser={currentUser}
                onUpdate={() => {}} // Empty function for user view
                showActions={true} // Show like/comment buttons for users
                onToggleComments={() => toggleComments(post._id || post.id)}
                showComments={showComments[post._id || post.id]}
                commentInput={commentInputs[post._id || post.id] || ""}
                onCommentChange={(value) =>
                  handleCommentChange(post._id || post.id, value)
                }
                onCommentSubmit={() => handleCommentSubmit(post._id || post.id)}
                onLikePost={(isLiked) =>
                  handleLikePost(post._id || post.id, isLiked)
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 flex items-center justify-center">
              <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium mb-2">
              {t("whatsNew.noPostsFound") || "No posts found"}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-500">
              {searchTerm
                ? t("whatsNew.tryAdjustingSearch") ||
                  "Try adjusting your search terms"
                : t("whatsNew.noPostsAvailable") ||
                  "No posts available at the moment"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
