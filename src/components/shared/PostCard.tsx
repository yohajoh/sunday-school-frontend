// components/PostCard.tsx
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Post } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  User,
  Pin,
  Send,
} from "lucide-react";
import { toast } from "sonner";

interface PostCardProps {
  post: Post;
  comments?: any[]; // Comments passed from parent component
  onUpdate?: (post: Post) => void;
  showActions?: boolean;
  user?: any;
  onToggleComments?: () => void;
  showComments?: boolean;
  commentInput?: string;
  onCommentChange?: (value: string) => void;
  onCommentSubmit?: () => void;
  onLikePost?: (isLiked: boolean) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  comments = [], // Default to empty array
  onUpdate,
  showActions = true,
  user,
  onToggleComments,
  showComments = false,
  commentInput = "",
  onCommentChange,
  onCommentSubmit,
  onLikePost,
}) => {
  const { t } = useLanguage();
  const [localCommentText, setLocalCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if current user has liked this post
  const isLiked = user
    ? (post.likes || []).some(
        (like: any) => like._id === user.id || like === user.id
      )
    : false;

  // Use external comment state or local state
  const commentText =
    commentInput !== undefined ? commentInput : localCommentText;

  const handleLike = () => {
    if (!user) {
      toast.error("Please login to like posts");
      return;
    }

    if (onLikePost) {
      onLikePost(isLiked);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      toast.error("Please login to comment");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      if (onCommentSubmit) {
        onCommentSubmit();
      }
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentChange = (value: string) => {
    if (onCommentChange) {
      onCommentChange(value);
    } else {
      setLocalCommentText(value);
    }
  };

  const handleCommentSubmit = () => {
    if (onCommentSubmit) {
      onCommentSubmit();
    } else {
      handleAddComment();
    }
  };

  const handleToggleComments = () => {
    if (onToggleComments) {
      onToggleComments();
    }
  };

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "announcement":
        return "bg-blue-500";
      case "lesson":
        return "bg-green-500";
      case "event":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "announcement":
        return "Announcement";
      case "lesson":
        return "Lesson";
      case "event":
        return "Event";
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  const getAudienceBadge = (audience: string) => {
    switch (audience) {
      case "students":
        return { label: "Students", color: "bg-amber-500" };
      case "teachers":
        return { label: "Teachers", color: "bg-indigo-500" };
      case "parents":
        return { label: "Parents", color: "bg-pink-500" };
      default:
        return { label: "Everyone", color: "bg-green-500" };
    }
  };

  const audienceInfo = getAudienceBadge(post.targetAudience);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white dark:border-slate-800 shadow-lg flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white font-semibold text-xs sm:text-sm">
                {post.author
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <h3 className="font-semibold text-slate-800 dark:text-white text-base sm:text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                  {post.title}
                </h3>
                {post.isPinned && (
                  <Badge className="bg-amber-500 text-white border-0 shadow-sm text-xs w-fit">
                    <Pin className="h-3 w-3 mr-1" />
                    Pinned
                  </Badge>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>By {post.author || "Admin"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{getTimeAgo(post.publishDate)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
            <Badge
              className={`${getCategoryColor(
                post.category
              )} text-white border-0 shadow-sm text-xs`}
            >
              {getCategoryLabel(post.category)}
            </Badge>
            <Badge
              className={`${audienceInfo.color} text-white border-0 shadow-sm text-xs`}
            >
              {audienceInfo.label}
            </Badge>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base sm:text-lg whitespace-pre-wrap break-words">
            {post.content}
          </p>
        </div>

        {post.image && (
          <div className="mt-4 sm:mt-6 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto max-h-96 object-contain bg-slate-100 dark:bg-slate-900"
            />
          </div>
        )}

        {/* Stats - Now showing actual counts */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex-wrap">
          <span className="font-semibold">
            {(post.likes || []).length} Likes
          </span>
          <span>•</span>
          <span className="font-semibold">{comments.length} Comments</span>
          <span>•</span>
          <span className="font-semibold">{post.shares || 0} Shares</span>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <>
          <div className="px-4 sm:px-6 pb-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`gap-2 sm:gap-3 flex-1 rounded-xl transition-all duration-300 text-xs sm:text-sm ${
                  isLiked
                    ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`}
              >
                <Heart
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${
                    isLiked ? "fill-red-600 dark:fill-red-400" : ""
                  }`}
                />
                <span className="hidden sm:inline">
                  {isLiked ? "Liked" : "Like"}
                </span>
                <span>({(post.likes || []).length})</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleComments}
                className={`gap-2 sm:gap-3 flex-1 rounded-xl transition-all duration-300 text-xs sm:text-sm ${
                  showComments
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`}
              >
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Comment</span>
                <span>({comments.length})</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="gap-2 sm:gap-3 flex-1 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-300 text-xs sm:text-sm"
              >
                <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Share</span>
                <span>({post.shares || 0})</span>
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-slate-50 dark:bg-slate-700/30 rounded-b-2xl sm:rounded-b-3xl">
              {/* Comments List - Displayed ABOVE the comment input */}
              {comments.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="font-semibold text-slate-800 dark:text-white text-base sm:text-lg">
                    Comments ({comments.length})
                  </h4>

                  {/* Scrollable comments container */}
                  <div
                    className={`space-y-3 sm:space-y-4 ${
                      comments.length > 3
                        ? "max-h-64 sm:max-h-80 overflow-y-auto pr-2"
                        : ""
                    }`}
                  >
                    {comments.map((comment: any) => (
                      <div
                        key={comment._id}
                        className="flex gap-3 sm:gap-4 group"
                      >
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 shadow-md">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm">
                            {/* Use actual comment author's initials */}
                            {comment.author
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-white dark:bg-slate-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-600 group-hover:border-slate-300 dark:group-hover:border-slate-500 transition-all duration-300 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                              <p className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base truncate">
                                {/* Display the ACTUAL comment author name from fetched data */}
                                {comment.author || "User"}
                              </p>
                              <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
                                {getTimeAgo(comment.createdAt)}
                              </span>
                            </div>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base break-words">
                            {comment.text}
                          </p>

                          {/* Show if this comment is from the current user */}
                          {user && comment.authorId === user.id && (
                            <div className="mt-2">
                              <Badge
                                variant="outline"
                                className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                              >
                                Your comment
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Show message if there are more than 3 comments */}
                  {comments.length > 3 && (
                    <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-600">
                      Scroll to see {comments.length - 3} more comment
                      {comments.length - 3 > 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 text-slate-500 dark:text-slate-400">
                  No comments yet. Be the first to comment!
                </div>
              )}

              {/* Add Comment - Displayed BELOW the comments list */}
              {user && (
                <div className="flex gap-3 sm:gap-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white font-semibold text-xs sm:text-sm">
                      {user
                        ? `${user.firstName?.[0]}${user.middleName?.[0]}`
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex gap-2 sm:gap-3 min-w-0">
                    <Textarea
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => handleCommentChange(e.target.value)}
                      className="min-h-[60px] sm:min-h-[80px] bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none rounded-xl transition-all duration-300 flex-1 text-sm sm:text-base"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleCommentSubmit();
                        }
                      }}
                    />
                    <Button
                      onClick={handleCommentSubmit}
                      disabled={isSubmitting || !commentText.trim()}
                      className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white self-end rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed h-10 w-10 sm:h-auto sm:w-auto sm:px-4"
                    >
                      <Send className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">
                        {isSubmitting ? "Posting..." : "Post"}
                      </span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
