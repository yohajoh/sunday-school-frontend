import React, { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Post } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  FileText,
  Calendar,
  Tag,
  Users,
  Pin,
  Save,
  Sparkles,
  Image,
} from "lucide-react";
import { toast } from "sonner";

interface PostFormProps {
  post?: Post;
  onSave?: (post: Post) => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
}

export const PostForm: React.FC<PostFormProps> = ({
  post,
  onSave,
  onCancel,
  mode = "create",
}) => {
  const { t } = useLanguage();
  const { addPost, updatePost, currentUser } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<Post>>({
    title: "",
    content: "",
    category: "announcement",
    status: "draft",
    publishDate: new Date().toISOString().split("T")[0],
    tags: [],
    targetAudience: "all",
    isPinned: false,
  });

  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (post) {
      setFormData(post);
    }
  }, [post]);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      updateField("tags", [...(formData.tags || []), tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateField(
      "tags",
      formData.tags?.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!formData.title || !formData.content) {
        toast.error(t("postForm.requiredFields"));
        return;
      }

      if (!currentUser) {
        toast.error(t("postForm.loginRequired"));
        return;
      }

      const postData: Post = {
        id: post?.id || Date.now().toString(),
        title: formData.title!,
        content: formData.content!,
        author: `${currentUser.firstName} ${currentUser.lastName}`,
        authorId: currentUser.id,
        category: formData.category!,
        status: formData.status!,
        publishDate: formData.publishDate!,
        expiryDate: formData.expiryDate,
        tags: formData.tags || [],
        likes: post?.likes || [],
        comments: post?.comments || [],
        shares: post?.shares || 0,
        image: formData.image,
        isPinned: formData.isPinned!,
        targetAudience: formData.targetAudience!,
        createdAt: post?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (mode === "create") {
        addPost(postData);
        toast.success(t("postForm.postCreated"), {
          description: t("postForm.postPublished"),
        });
      } else {
        updatePost(postData.id, postData);
        toast.success(t("postForm.postUpdated"), {
          description: t("postForm.postChangesSaved"),
        });
      }

      onSave?.(postData);
    } catch (error) {
      toast.error(t("postForm.saveError"), {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const postCategories = [
    { value: "announcement", label: t("postForm.categories.announcement") },
    { value: "lesson", label: t("postForm.categories.lesson") },
    { value: "event", label: t("postForm.categories.event") },
    { value: "general", label: t("postForm.categories.general") },
  ];

  const audienceTypes = [
    { value: "all", label: t("postForm.audience.all") },
    { value: "students", label: t("postForm.audience.students") },
    { value: "teachers", label: t("postForm.audience.teachers") },
    { value: "parents", label: t("postForm.audience.parents") },
  ];

  const statusTypes = [
    { value: "draft", label: t("postForm.statuses.draft") },
    { value: "published", label: t("postForm.statuses.published") },
    { value: "archived", label: t("postForm.statuses.archived") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/50 dark:from-slate-900 dark:via-purple-950/20 dark:to-pink-950/10">
      <div className="max-w-4xl mx-auto">
        {/* Premium Header - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg self-start sm:self-auto">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {mode === "create"
                  ? t("postForm.createTitle")
                  : t("postForm.editTitle")}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-lg mt-1 sm:mt-2">
                {mode === "create"
                  ? t("postForm.createSubtitle")
                  : t("postForm.editSubtitle")}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:gap-6 lg:gap-8">
            {/* Post Content */}
            <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
              <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-slate-800 dark:text-white text-lg sm:text-xl">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg sm:rounded-xl shadow-lg">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  {t("postForm.postContent")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="space-y-2 sm:space-y-3">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {t("postForm.title")} *
                  </Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    required
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 shadow-sm text-sm sm:text-lg"
                    placeholder={t("postForm.title")}
                  />
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {t("postForm.content")} *
                  </Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => updateField("content", e.target.value)}
                    required
                    rows={8}
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all duration-300 shadow-sm min-h-[200px] sm:min-h-[300px] text-sm sm:text-base"
                    placeholder={t("postForm.content")}
                  />
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 sm:gap-2">
                    <Image className="h-3 w-3 sm:h-4 sm:w-4" />
                    {t("postForm.featuredImage")}
                  </Label>
                  <Input
                    value={formData.image}
                    onChange={(e) => updateField("image", e.target.value)}
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                    placeholder={t("postForm.featuredImage")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Post Settings - Mobile Responsive Grid */}
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Categories & Settings */}
              <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white text-base sm:text-lg">
                    <Tag className="h-4 w-4 sm:h-5 sm:w-5" />
                    {t("postForm.categoriesSettings")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="space-y-2 sm:space-y-3">
                    <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {t("postForm.category")} *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: any) =>
                        updateField("category", value)
                      }
                    >
                      <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 shadow-sm text-sm sm:text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {postCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {t("postForm.targetAudience")}
                    </Label>
                    <Select
                      value={formData.targetAudience}
                      onValueChange={(value: any) =>
                        updateField("targetAudience", value)
                      }
                    >
                      <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 shadow-sm text-sm sm:text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {audienceTypes.map((audience) => (
                          <SelectItem
                            key={audience.value}
                            value={audience.value}
                          >
                            {audience.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {t("postForm.status")}
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: any) =>
                        updateField("status", value)
                      }
                    >
                      <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 shadow-sm text-sm sm:text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusTypes.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Schedule & Options */}
              <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white text-base sm:text-lg">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                    {t("postForm.scheduleOptions")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="space-y-2 sm:space-y-3">
                    <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {t("postForm.publishDate")}
                    </Label>
                    <Input
                      type="date"
                      value={formData.publishDate}
                      onChange={(e) =>
                        updateField("publishDate", e.target.value)
                      }
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {t("postForm.expiryDate")}
                    </Label>
                    <Input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) =>
                        updateField("expiryDate", e.target.value)
                      }
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="space-y-1">
                      <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 sm:gap-2">
                        <Pin className="h-3 w-3 sm:h-4 sm:w-4" />
                        {t("postForm.pinToTop")}
                      </Label>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                        {t("postForm.pinDescription")}
                      </p>
                    </div>
                    <Switch
                      checked={formData.isPinned}
                      onCheckedChange={(checked) =>
                        updateField("isPinned", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tags */}
            <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white text-base sm:text-lg">
                  <Tag className="h-4 w-4 sm:h-5 sm:w-5" />
                  {t("postForm.tags")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    className="flex-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                    placeholder={t("postForm.addTag")}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg sm:rounded-xl text-sm sm:text-base px-3 sm:px-4"
                  >
                    {t("postForm.add")}
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md sm:rounded-lg px-2 sm:px-3 py-1 flex items-center gap-1 text-xs sm:text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-purple-900 dark:hover:text-purple-100 text-sm"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons - Mobile Responsive */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-800">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base order-2 sm:order-1"
              >
                {t("postForm.cancel")}
              </Button>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base px-4 sm:px-6 py-2 order-1 sm:order-2"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("postForm.saving")}
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                  {mode === "create"
                    ? t("postForm.publishPost")
                    : t("postForm.updatePost")}
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
