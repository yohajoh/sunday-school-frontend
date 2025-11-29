import React, { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Post } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

interface PostFormProps {
  post?: any;
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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const API = import.meta.env.VITE_API_URL;

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Post>({
    defaultValues: {
      title: "",
      content: "",
      category: "announcement",
      status: "draft",
      publishDate: new Date().toISOString().split("T")[0],
      tags: [],
      targetAudience: "all",
      isPinned: false,
      image: "",
      imagePublicId: "",
    },
  });

  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageData, setUploadedImageData] = useState<{
    imageUrl: string;
    publicId: string;
  } | null>(null);

  // React Query Mutations - UPDATED with better logging
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API}/api/sunday-school/upload/image`, {
        method: "POST",
        credentials: "include",

        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    },
    onSuccess: (data) => {
      // Check the actual structure of the response
      const imageUrl = data.imageUrl || data.secure_url || data.url;
      const publicId = data.publicId || data.public_id;

      if (!imageUrl) {
        console.error("❌ No image URL found in response:", data);
        toast.error("Upload failed: No image URL received");
        return;
      }

      // Store the uploaded image data in state
      const newImageData = {
        imageUrl: imageUrl,
        publicId: publicId || "", // publicId might be optional
      };

      setUploadedImageData(newImageData);

      // Also set the form values
      setValue("image", imageUrl);
      setValue("imagePublicId", publicId || "");
      setIsUploading(false);
      toast.success("Image uploaded successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload image: ${error.message}`);
      setIsUploading(false);
      setImagePreview("");
      setUploadedImageData(null);
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      const response = await fetch(`${API}/api/sunday-school/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",

        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create post");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success(t("postForm.postCreated"), {
        description: t("postForm.postPublished"),
      });
      onSave?.(data.data);
    },
    onError: (error: Error) => {
      console.error("❌ Create post error:", error);
      toast.error(t("postForm.saveError"), {
        description: error.message || "Please try again later.",
      });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({
      postId,
      postData,
    }: {
      postId: string;
      postData: any;
    }) => {
      const response = await fetch(`${API}/api/sunday-school/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",

        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update post");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (post?.id) {
        queryClient.invalidateQueries({ queryKey: ["post", post.id] });
      }
      toast.success(t("postForm.postUpdated"), {
        description: t("postForm.postChangesSaved"),
      });
      onSave?.(data.data);
    },
    onError: (error: Error) => {
      console.error("❌ Update post error:", error);
      toast.error(t("postForm.saveError"), {
        description: error.message || "Please try again later.",
      });
    },
  });

  useEffect(() => {
    if (post) {
      Object.keys(post).forEach((key) => {
        setValue(key as keyof Post, post[key as keyof Post]);
      });
      if (post.image) {
        setImagePreview(post.image);
        setUploadedImageData({
          imageUrl: post.image,
          publicId: post.imagePublicId || "",
        });
      }
    }
  }, [post, setValue]);

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = watch("tags") || [];
      if (!currentTags.includes(tagInput.trim())) {
        setValue("tags", [...currentTags, tagInput.trim()]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = watch("tags") || [];
    setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  // Upload image to backend API using React Query
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, WEBP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadedImageData(null); // Reset previous upload data

    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Use React Query mutation for upload
      uploadImageMutation.mutate(file);
    } catch (error) {
      console.error("❌ Upload error:", error);
      toast.error(`Failed to upload image: ${error.message}`);
      setIsUploading(false);
      setImagePreview("");
      setUploadedImageData(null);
    }
  };

  const removeImage = () => {
    setImagePreview("");
    setValue("image", "");
    setValue("imagePublicId", "");
    setUploadedImageData(null);
    // Revoke the object URL to avoid memory leaks
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const onSubmitForm = async (data: Post) => {
    try {
      // Validation
      if (!data.title || !data.content) {
        toast.error(t("postForm.requiredFields"));
        return;
      }

      if (!user) {
        toast.error(t("postForm.loginRequired"));
        return;
      }

      // Check if image is still uploading
      if (isUploading || uploadImageMutation.isPending) {
        toast.error("Please wait for image upload to complete");
        return;
      }

      // Determine which image data to use
      let finalImageUrl = "";
      let finalPublicId = "";

      if (uploadedImageData) {
        // Use the newly uploaded image
        finalImageUrl = uploadedImageData.imageUrl;
        finalPublicId = uploadedImageData.publicId;
      } else if (data.image) {
        // Use existing image from form (for edits)
        finalImageUrl = data.image;
        finalPublicId = data.imagePublicId || "";
      }

      const postData = {
        title: data.title,
        content: data.content,
        author: `${user?.firstName} ${user?.middleName}`,
        authorId: user?._id, // You might want to use currentUser.id here
        category: data.category,
        status: data.status,
        publishDate: data.publishDate,
        expiryDate: data.expiryDate,
        tags: data.tags || [],
        image: finalImageUrl,
        imagePublicId: finalPublicId,
        isPinned: data.isPinned,
        targetAudience: data.targetAudience,
      };

      if (mode === "create") {
        createPostMutation.mutate(postData);
      } else {
        updatePostMutation.mutate({
          postId: post?._id!,
          postData,
        });
      }
    } catch (error) {
      toast.error(t("postForm.saveError"), {
        description: error.message || "Please try again later.",
      });
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

  // Combined loading state from all mutations
  const isLoading =
    isSubmitting ||
    uploadImageMutation.isPending ||
    createPostMutation.isPending ||
    updatePostMutation.isPending;

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

        <form onSubmit={handleSubmit(onSubmitForm)}>
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
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: "Title is required" }}
                  render={({ field }) => (
                    <div className="space-y-2 sm:space-y-3">
                      <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {t("postForm.title")} *
                      </Label>
                      <Input
                        {...field}
                        required
                        className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 shadow-sm text-sm sm:text-lg"
                        placeholder={t("postForm.title")}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm">
                          {errors.title.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="content"
                  control={control}
                  rules={{ required: "Content is required" }}
                  render={({ field }) => (
                    <div className="space-y-2 sm:space-y-3">
                      <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {t("postForm.content")} *
                      </Label>
                      <Textarea
                        {...field}
                        required
                        rows={8}
                        className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all duration-300 shadow-sm min-h-[200px] sm:min-h-[300px] text-sm sm:text-base"
                        placeholder={t("postForm.content")}
                      />
                      {errors.content && (
                        <p className="text-red-500 text-sm">
                          {errors.content.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* Image Upload Section */}
                <div className="space-y-2 sm:space-y-3">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 sm:gap-2">
                    <Image className="h-3 w-3 sm:h-4 sm:w-4" />
                    {t("postForm.featuredImage")}
                  </Label>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative mb-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full max-w-md h-48 object-cover rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* File Upload Input */}
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/jpeg, image/jpg, image/png, image/gif, image/webp"
                        onChange={handleImageUpload}
                        disabled={isUploading || uploadImageMutation.isPending}
                        className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 shadow-sm text-sm sm:text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      />
                    </div>

                    {(isUploading || uploadImageMutation.isPending) && (
                      <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        Uploading to Cloudinary...
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Supported formats: JPG, PNG, GIF, WEBP. Max size: 5MB
                  </p>
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
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("postForm.category")} *
                        </Label>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
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
                        {errors.category && (
                          <p className="text-red-500 text-sm">
                            {errors.category.message}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    name="targetAudience"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("postForm.targetAudience")}
                        </Label>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
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
                    )}
                  />

                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("postForm.status")}
                        </Label>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 shadow-sm text-sm sm:text-base">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusTypes.map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
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
                  <Controller
                    name="publishDate"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("postForm.publishDate")}
                        </Label>
                        <Input
                          type="date"
                          {...field}
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="expiryDate"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("postForm.expiryDate")}
                        </Label>
                        <Input
                          type="date"
                          {...field}
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="isPinned"
                    control={control}
                    render={({ field }) => (
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
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )}
                  />
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
                  {watch("tags")?.map((tag) => (
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
              disabled={isLoading || isUploading}
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
