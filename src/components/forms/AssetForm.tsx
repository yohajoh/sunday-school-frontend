import React, { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Asset, User } from "@/types";
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
import {
  Package,
  DollarSign,
  MapPin,
  Calendar,
  Barcode,
  Truck,
  Save,
  Sparkles,
  Image,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

interface AssetFormProps {
  asset?: Asset;
  onSave?: (asset: Asset) => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
}

export const AssetForm: React.FC<AssetFormProps> = ({
  asset,
  onSave,
  onCancel,
  mode = "create",
}) => {
  const { t } = useLanguage();

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Asset>({
    defaultValues: {
      code: "",
      name: "",
      description: "",
      category: "",
      status: "available",
      assignedTo: "",
      purchaseDate: new Date().toISOString().split("T")[0],
      purchasePrice: 0,
      location: "",
      condition: "good",
      supplier: "",
      serialNumber: "",
      warrantyExpiry: "",
      tags: [],
      images: [],
    },
  });

  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (asset) {
      Object.keys(asset).forEach((key) => {
        setValue(key as keyof Asset, asset[key as keyof Asset]);
      });
    }
  }, [asset, setValue]);

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

  const API = import.meta.env.VITE_API_URL;
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async function fetchUsers() {
      try {
        const res = await fetch(`${API}/api/sunday-school/users`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        return data.data.data; // Ensure we always return an array
      } catch (err) {
        console.error("Error fetching users:", err);
        toast.error("Failed to load users");
        return []; // Return empty array on error
      }
    },
    staleTime: 1000 * 60 + 5,
    gcTime: 1000 * 60 * 60,
  });

  const onSubmitForm = async (data: Asset) => {
    try {
      // Validation
      if (!data.code || !data.name || !data.category) {
        toast.error(t("assetForm.requiredFields"));
        return;
      }
      const assetData: Asset = {
        id: asset?.id,
        code: data.code!,
        name: data.name!,
        description: data.description!,
        category: data.category!,
        status: data.status!,
        assignedTo: data.assignedTo,
        purchaseDate: data.purchaseDate!,
        purchasePrice: data.purchasePrice!,
        location: data.location!,
        condition: data.condition!,
        supplier: data.supplier!,
        serialNumber: data.serialNumber,
        warrantyExpiry: data.warrantyExpiry,
        tags: data.tags || [],
        images: data.images || [],
        createdAt: asset?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastMaintenanceDate: data.lastMaintenanceDate,
        nextMaintenanceDate: data.nextMaintenanceDate,
      };

      // if (mode === "create") {
      //   addAsset(assetData);
      //   toast.success(t("assetForm.assetCreated"), {
      //     description: `${assetData.name} ${t("assetForm.assetAdded")}`,
      //   });
      // } else {
      //   updateAsset(assetData.id, assetData);
      //   toast.success(t("assetForm.assetUpdated"), {
      //     description: t("assetForm.assetChangesSaved"),
      //   });
      // }
      onSave?.(assetData);
    } catch (error) {
      toast.error(t("assetForm.saveError"), {
        description: "Please try again later.",
      });
    }
  };

  const assetCategories = [
    "Books",
    "Furniture",
    "Electronics",
    "Musical Instruments",
    "Teaching Materials",
    "Sports Equipment",
    "Kitchen Supplies",
    "Cleaning Supplies",
    "Office Supplies",
    "Religious Items",
    "Audio Visual",
    "Computers",
    "Vehicles",
    "Other",
  ];

  const statusTypes = [
    { value: "available", label: t("assetForm.statuses.available") },
    { value: "assigned", label: t("assetForm.statuses.assigned") },
    { value: "maintenance", label: t("assetForm.statuses.maintenance") },
    { value: "retired", label: t("assetForm.statuses.retired") },
  ];

  const conditionTypes = [
    { value: "excellent", label: t("assetForm.conditions.excellent") },
    { value: "good", label: t("assetForm.conditions.good") },
    { value: "fair", label: t("assetForm.conditions.fair") },
    { value: "poor", label: t("assetForm.conditions.poor") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/50 dark:from-slate-900 dark:via-amber-950/20 dark:to-orange-950/10 ">
      <div className="max-w-6xl mx-auto">
        {/* Premium Header - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg self-start sm:self-auto">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {mode === "create"
                  ? t("assetForm.createTitle")
                  : t("assetForm.editTitle")}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-lg mt-1 sm:mt-2">
                {mode === "create"
                  ? t("assetForm.createSubtitle")
                  : t("assetForm.editSubtitle")}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Basic Information */}
            <Card className="lg:col-span-2 border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
              <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-slate-800 dark:text-white text-lg sm:text-xl">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg sm:rounded-xl shadow-lg">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  {t("assetForm.basicInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                  <Controller
                    name="code"
                    control={control}
                    rules={{ required: "Asset code is required" }}
                    render={({ field }) => (
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 sm:gap-2">
                          <Barcode className="h-3 w-3 sm:h-4 sm:w-4" />
                          {t("assetForm.assetCode")} *
                        </Label>
                        <Input
                          {...field}
                          required
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                          placeholder="AST-001"
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Asset name is required" }}
                    render={({ field }) => (
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("assetForm.assetName")} *
                        </Label>
                        <Input
                          {...field}
                          required
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                          placeholder={t("assetForm.assetName")}
                        />
                      </div>
                    )}
                  />
                </div>

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2 sm:space-y-3">
                      <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {t("assetForm.description")}
                      </Label>
                      <Textarea
                        {...field}
                        rows={3}
                        className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none transition-all duration-300 shadow-sm text-sm sm:text-base"
                        placeholder={t("assetForm.description")}
                      />
                    </div>
                  )}
                />

                <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("assetForm.category")} *
                        </Label>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 shadow-sm text-sm sm:text-base">
                            <SelectValue
                              placeholder={t("assetForm.category")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {assetCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {t(`assetForm.categories.${category}`)}
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
                          {t("assetForm.status")} *
                        </Label>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 shadow-sm text-sm sm:text-base">
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
                </div>

                <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                  <Controller
                    name="assignedTo"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("assetForm.assignedTo")}
                        </Label>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 shadow-sm text-sm sm:text-base">
                            <SelectValue
                              placeholder={t("assetForm.assignedTo")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not-assigned">
                              {t("assetForm.assignedTo")}
                            </SelectItem>
                            {/* Uncomment when users data is available */}
                            {users?.map((user) => (
                              <SelectItem key={user._id} value={user._id}>
                                {user.firstName} {user.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />

                  <Controller
                    name="condition"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("assetForm.condition")}
                        </Label>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 shadow-sm text-sm sm:text-base">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {conditionTypes.map((condition) => (
                              <SelectItem
                                key={condition.value}
                                value={condition.value}
                              >
                                {condition.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sidebar Cards - Mobile Responsive */}
            <div className="space-y-4 sm:space-y-6">
              {/* Purchase Information */}
              <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white text-base sm:text-lg">
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
                    {t("assetForm.purchaseDetails")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <Controller
                    name="purchaseDate"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("assetForm.purchaseDate")}
                        </Label>
                        <Input
                          type="date"
                          {...field}
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="purchasePrice"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("assetForm.purchasePrice")} (ETB)
                        </Label>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                          placeholder="0.00"
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="supplier"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 sm:gap-2">
                          <Truck className="h-3 w-3 sm:h-4 sm:w-4" />
                          {t("assetForm.supplier")}
                        </Label>
                        <Input
                          {...field}
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                          placeholder={t("assetForm.supplier")}
                        />
                      </div>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Location & Identification */}
              <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white text-base sm:text-lg">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                    {t("assetForm.locationId")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("assetForm.location")}
                        </Label>
                        <Input
                          {...field}
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                          placeholder={t("assetForm.location")}
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="serialNumber"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("assetForm.serialNumber")}
                        </Label>
                        <Input
                          {...field}
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                          placeholder="SN123456789"
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="warrantyExpiry"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 sm:gap-2">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                          {t("assetForm.warrantyExpiry")}
                        </Label>
                        <Input
                          type="date"
                          {...field}
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                        />
                      </div>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white text-base sm:text-lg">
                    <Tag className="h-4 w-4 sm:h-5 sm:w-5" />
                    {t("assetForm.tags")}
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
                      className="flex-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                      placeholder={t("assetForm.addTag")}
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg sm:rounded-xl text-sm sm:text-base px-3 sm:px-4"
                    >
                      {t("assetForm.add")}
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {watch("tags")?.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-md sm:rounded-lg px-2 sm:px-3 py-1 flex items-center gap-1 text-xs sm:text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-amber-900 dark:hover:text-amber-100 text-sm"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
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
                {t("assetForm.cancel")}
              </Button>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base px-4 sm:px-6 py-2 order-1 sm:order-2"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("assetForm.saving")}
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                  {mode === "create"
                    ? t("assetForm.createAsset")
                    : t("assetForm.updateAsset")}
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
