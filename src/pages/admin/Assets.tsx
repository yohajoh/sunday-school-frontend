import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Asset } from "@/types";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Edit,
  Trash2,
  Plus,
  Package,
  Sparkles,
  Shield,
  Zap,
  MapPin,
  Calendar,
  DollarSign,
  Eye,
  Download,
  Barcode,
  MoreVertical,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AssetForm } from "@/components/forms/AssetForm";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { useAssetMutations } from "@/hooks/useAssetMutation";
import exportAssets from "@/lib/exportAssets";

export const Assets: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Asset;
    direction: "asc" | "desc";
  } | null>(null);

  const [viewAsset, setViewAsset] = useState<Asset | null>(null);
  const [editAsset, setEditAsset] = useState<Asset | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { createAsset, updateAsset, deleteAsset } = useAssetMutations();

  const API = import.meta.env.VITE_API_URL;
  const {
    data: assetData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["assets"],
    queryFn: async function () {
      try {
        const res = await fetch(`${API}/api/sunday-school/assets`, {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        return data.data.data;
      } catch (err) {
        toast.error("Faild to fetched Assets data!");
        return [];
      }
    },
  });

  const handleSort = (key: keyof Asset) => {
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

  const assetsList = Array.isArray(assetData) ? assetData : [];

  const sortedAssets = [...assetsList].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    // if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    // if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredAssets = sortedAssets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || asset.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || asset.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const toggleSelectAll = () => {
    if (selectedAssets.length === filteredAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(filteredAssets.map((a) => a.id));
    }
  };

  const toggleSelectAsset = (id: string) => {
    setSelectedAssets((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedAssets.length === 0) {
      toast.error("No assets selected");
      return;
    }

    selectedAssets.forEach((id) => deleteAsset.mutate(id));
    setSelectedAssets([]);
    toast.success(`${selectedAssets.length} asset(s) deleted successfully`);
  };

  const handleDeleteAsset = (asset: any) => {
    console.log(asset);
    deleteAsset.mutate(asset._id);
    toast.success("Asset deleted successfully");
  };

  const handleAssetSave = (asset: Asset) => {
    createAsset.mutate(asset, {
      onSuccess: () => {
        setEditAsset(null);
        setIsCreateDialogOpen(false);
      },
    });
  };

  const handleAssetEdit = (asset: Asset) => {
    updateAsset.mutate(
      { id: editAsset?._id, updates: asset },
      {
        onSuccess: () => {
          setEditAsset(null);
          toast.success("Asset updated");
        },
        onError: (err) => {
          toast.error(err.message);
        },
      }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-gradient-to-r from-green-500 to-emerald-500";
      case "assigned":
        return "bg-gradient-to-r from-blue-500 to-violet-500";
      case "maintenance":
        return "bg-gradient-to-r from-amber-500 to-orange-500";
      case "retired":
        return "bg-gradient-to-r from-slate-500 to-slate-600";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "text-green-600 dark:text-green-400";
      case "good":
        return "text-blue-600 dark:text-blue-400";
      case "fair":
        return "text-amber-600 dark:text-amber-400";
      case "poor":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  // const getAssignedUserName = (userId?: string) => {
  //   if (!userId) return t("assets.notAssigned");
  //   const user = users.find((u: Asset) => u.id === userId);
  //   return user
  //     ? `${user.firstName} ${user.lastName}`
  //     : t("assets.unknownUser");
  // };

  const handleExportAssets = () => {
    exportAssets(filteredAssets);
  };

  const categories = [
    ...new Set(assetData?.map((asset: Asset) => asset.category)),
  ];

  return (
    <div className="space-y-6">
      {/* Premium Header Section - Mobile Responsive */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800 via-amber-900 to-orange-900 p-6 sm:p-8 text-white border border-amber-500/20">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-400/30 self-start sm:self-auto">
                  <Package className="h-6 w-6 sm:h-8 sm:w-8 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                    {t("assets.manage")}
                  </h1>
                  <p className="text-amber-100 text-sm sm:text-lg mt-1 sm:mt-2">
                    {t("assets.overview")}
                  </p>
                </div>
              </div>

              {/* Stats Row - Mobile Responsive */}
              <div className="flex flex-wrap gap-3 sm:gap-6 mt-4 sm:mt-6">
                <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 min-w-0 flex-1 sm:flex-none">
                  <Shield className="h-4 w-4 sm:h-6 sm:w-6 text-amber-400" />
                  <div className="min-w-0">
                    <p className="text-lg sm:text-2xl font-bold truncate">
                      {assetData?.length}
                    </p>
                    <p className="text-xs text-amber-200">
                      {t("assets.totalAssets")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 min-w-0 flex-1 sm:flex-none">
                  <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-orange-400" />
                  <div className="min-w-0">
                    <p className="text-lg sm:text-2xl font-bold truncate">
                      {
                        assetData?.filter(
                          (a: Asset) => a.status === "available"
                        ).length
                      }
                    </p>
                    <p className="text-xs text-orange-200">
                      {t("assets.available")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 min-w-0 flex-1 sm:flex-none">
                  <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-400" />
                  <div className="min-w-0">
                    <p className="text-lg sm:text-2xl font-bold truncate">
                      {
                        assetData?.filter((a: Asset) => a.status === "assigned")
                          .length
                      }
                    </p>
                    <p className="text-xs text-emerald-200">
                      {t("assets.assigned")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Header Controls - Mobile Responsive */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
            <Input
              placeholder={t("common.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 rounded-xl transition-all duration-300 w-full"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 text-sm flex-1"
            >
              <option value="all">{t("assets.allStatus")}</option>
              <option value="available">{t("assets.available")}</option>
              <option value="assigned">{t("assets.assigned")}</option>
              <option value="maintenance">
                {t("assetForm.statuses.maintenance")}
              </option>
              <option value="retired">{t("assetForm.statuses.retired")}</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 text-sm flex-1"
            >
              <option value="all">{t("assets.allCategories")}</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleExportAssets}
            className="flex items-center gap-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-sm sm:text-base order-2 sm:order-1"
          >
            <Download className="h-4 w-4" />
            <span className="hidden xs:inline">{t("assets.exportAssets")}</span>
            <span className="xs:hidden">{t("common.export")}</span>
          </Button>

          {selectedAssets.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base order-1 sm:order-2"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">
                {t("assets.deleteSelected")}
              </span>
              <span className="sm:hidden">
                Delete ({selectedAssets.length})
              </span>
            </Button>
          )}

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base order-3">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {t("assets.registerNewAsset")}
                </span>
                <span className="sm:hidden">{t("assets.addNew")}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Package className="h-5 w-5" />
                  {t("assets.registerNewAsset")}
                </DialogTitle>
              </DialogHeader>
              <AssetForm
                mode="create"
                onSave={handleAssetSave}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Premium Assets Table - Mobile Responsive with Horizontal Scroll */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border-0 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {" "}
            {/* Minimum width to ensure table doesn't break */}
            <Table>
              <TableHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50">
                <TableRow className="border-b border-slate-200 dark:border-slate-700">
                  <TableHead className="w-12 bg-transparent px-2 sm:px-4 sticky left-0 bg-inherit z-10">
                    <Checkbox
                      checked={
                        selectedAssets.length === filteredAssets.length &&
                        filteredAssets.length > 0
                      }
                      onCheckedChange={toggleSelectAll}
                      className="border-slate-300 dark:border-slate-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer bg-transparent text-slate-800 dark:text-white font-semibold py-3 sm:py-4 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-300 text-xs sm:text-sm min-w-[120px]"
                    onClick={() => handleSort("code")}
                  >
                    {t("assets.code")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer bg-transparent text-slate-800 dark:text-white font-semibold py-3 sm:py-4 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-300 text-xs sm:text-sm min-w-[200px]"
                    onClick={() => handleSort("name")}
                  >
                    {t("assets.name")}
                  </TableHead>
                  <TableHead className="hidden sm:table-cell bg-transparent text-slate-800 dark:text-white font-semibold py-3 sm:py-4 text-xs sm:text-sm min-w-[150px]">
                    {t("assets.category")}
                  </TableHead>
                  <TableHead className="hidden md:table-cell bg-transparent text-slate-800 dark:text-white font-semibold py-3 sm:py-4 text-xs sm:text-sm min-w-[120px]">
                    {t("assets.condition")}
                  </TableHead>
                  <TableHead className="bg-transparent text-slate-800 dark:text-white font-semibold py-3 sm:py-4 text-xs sm:text-sm min-w-[100px]">
                    {t("common.status")}
                  </TableHead>
                  <TableHead className="text-right bg-transparent text-slate-800 dark:text-white font-semibold py-3 sm:py-4 text-xs sm:text-sm min-w-[120px] sticky right-0 bg-inherit z-10">
                    {t("common.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow
                    key={asset._id}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-300 group"
                  >
                    <TableCell className="py-3 sm:py-4 px-2 sm:px-4 sticky left-0 bg-inherit z-10">
                      <Checkbox
                        checked={selectedAssets.includes(asset.id)}
                        onCheckedChange={() => toggleSelectAsset(asset.id)}
                        className="border-slate-300 dark:border-slate-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                      />
                    </TableCell>
                    <TableCell className="py-3 sm:py-4 font-mono font-semibold text-slate-800 dark:text-white text-xs sm:text-sm min-w-[120px]">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Barcode className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
                        <span className="truncate">{asset.code}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 sm:py-4 text-slate-700 dark:text-slate-300 min-w-[200px]">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg flex-shrink-0">
                          <Package className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">
                            {asset.name}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 truncate hidden sm:block">
                            {asset.description}
                          </p>
                          <div className="sm:hidden flex items-center gap-2 mt-1">
                            <Badge
                              variant="secondary"
                              className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs"
                            >
                              {asset.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell py-3 sm:py-4 min-w-[150px]">
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg shadow-sm text-xs"
                      >
                        {asset.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell py-3 sm:py-4 min-w-[120px]">
                      <Badge
                        variant="outline"
                        className={`rounded-lg font-medium border-0 text-xs ${getConditionColor(
                          asset.condition
                        )}`}
                      >
                        {asset.condition.charAt(0).toUpperCase() +
                          asset.condition.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 sm:py-4 min-w-[100px]">
                      <Badge
                        className={`rounded-lg font-medium shadow-sm ${getStatusColor(
                          asset.status
                        )} text-white text-xs`}
                      >
                        <span className="hidden xs:inline">
                          {asset.status.charAt(0).toUpperCase() +
                            asset.status.slice(1)}
                        </span>
                        <span className="xs:hidden">
                          {asset.status.charAt(0).toUpperCase()}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 sm:py-4 text-right min-w-[120px] sticky right-0 bg-inherit z-10">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        {/* Mobile Dropdown Menu */}
                        <div className="sm:hidden">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 border-slate-300 dark:border-slate-600"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setViewAsset(asset)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setEditAsset(asset)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteAsset(asset)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Desktop Action Buttons */}
                        <div className="hidden sm:flex gap-1 sm:gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewAsset(asset)}
                            className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditAsset(asset)}
                            className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAsset(asset)}
                            className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Premium Empty State */}
        {filteredAssets.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium mb-2">
              {t("assets.noAssetsFound")}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-500">
              {searchTerm
                ? t("assets.tryAdjustingSearch")
                : t("assets.noAssetsAvailable")}
            </div>
          </div>
        )}
      </div>

      {/* Asset Detail Dialog - Mobile Responsive with Proper Overflow */}
      <Dialog open={!!viewAsset} onOpenChange={() => setViewAsset(null)}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-2xl rounded-2xl sm:rounded-3xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
          {viewAsset && (
            <>
              <DialogHeader className="border-b border-slate-200 dark:border-slate-700 pb-4 flex-shrink-0">
                <DialogTitle className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg sm:rounded-xl">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  {t("assets.assetDetails")}
                </DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 py-4 px-1">
                <div className="flex items-center gap-3 sm:gap-4 px-3">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0">
                    <Package className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white truncate">
                      {viewAsset.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 font-mono text-sm sm:text-base truncate">
                      {viewAsset.code}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-3">
                  <div className="break-words">
                    <Label className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1 sm:gap-2">
                      <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                      {t("assets.category")}
                    </Label>
                    <p className="text-sm sm:text-base text-slate-800 dark:text-white font-semibold break-all">
                      {viewAsset.category}
                    </p>
                  </div>
                  <div className="break-words">
                    <Label className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1 sm:gap-2">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                      {t("assets.location")}
                    </Label>
                    <p className="text-sm sm:text-base text-slate-800 dark:text-white font-semibold break-all">
                      {viewAsset.location}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-3">
                  <div className="break-words">
                    <Label className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1 sm:gap-2">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      {t("assets.purchaseDate")}
                    </Label>
                    <p className="text-sm sm:text-base text-slate-800 dark:text-white font-semibold">
                      {new Date(viewAsset.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="break-words">
                    <Label className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1 sm:gap-2">
                      <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                      {t("assets.purchasePrice")}
                    </Label>
                    <p className="text-sm sm:text-base text-slate-800 dark:text-white font-semibold">
                      ETB {viewAsset.purchasePrice.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="px-3">
                  <Label className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                    {t("assets.description")}
                  </Label>
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed break-words">
                    {viewAsset.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-4 px-3">
                  <Badge
                    className={`text-xs sm:text-sm ${getStatusColor(
                      viewAsset.status
                    )}`}
                  >
                    {viewAsset.status.toUpperCase()}
                  </Badge>
                  <Badge
                    className={`text-xs sm:text-sm ${getConditionColor(
                      viewAsset.condition
                    )} border-0`}
                  >
                    {t("assets.condition")}: {viewAsset.condition.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Asset Dialog */}
      <Dialog open={!!editAsset} onOpenChange={() => setEditAsset(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Edit className="h-5 w-5" />
              {t("assets.editAsset")}
            </DialogTitle>
          </DialogHeader>
          {editAsset && (
            <AssetForm
              asset={editAsset}
              mode="edit"
              onSave={handleAssetEdit}
              onCancel={() => setEditAsset(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
