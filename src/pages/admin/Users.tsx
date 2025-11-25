import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import exportUsers from "@/lib/userPdfExports";

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
  Filter,
  Users as UsersIcon,
  Sparkles,
  Shield,
  Zap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User as UserIcon,
  Eye,
  Download,
  ChevronDown,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UserForm } from "@/components/forms/UserForm";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/shared/Spinner";
import { useUserMutation } from "@/hooks/useUserMutations";

export const Users: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: "asc" | "desc";
  } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { createUser } = useUserMutation();

  const API = import.meta.env.VITE_API_URL;
  const {
    data: userData,
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

  // Safe data access - ensure userData is always an array
  const safeUserData = React.useMemo(() => {
    return Array.isArray(userData) ? userData : [];
  }, [userData]);

  const handleSort = (key: keyof User) => {
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

  const sortedUsers = React.useMemo(() => {
    if (!sortConfig) return safeUserData;

    return [...safeUserData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === "asc" ? -1 : 1;
      if (bValue == null) return sortConfig.direction === "asc" ? 1 : -1;

      // Handle string comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Handle number comparison
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [safeUserData, sortConfig]);

  const filteredUsers = React.useMemo(() => {
    return sortedUsers.filter((user) => {
      if (!user || typeof user !== "object") return false;

      const matchesSearch =
        user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.phoneNumber?.includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [sortedUsers, searchTerm, statusFilter, roleFilter]);

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id).filter(Boolean));
    }
  };

  const toggleSelectUser = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleUserSave = (user: User) => {
    createUser.mutate(user, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
      },
    });
    // setEditUser(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-gradient-to-r from-green-500 to-emerald-500";
      case "inactive":
        return "bg-gradient-to-r from-slate-500 to-slate-600";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-blue-500 to-violet-500";
      case "user":
        return "bg-gradient-to-r from-slate-500 to-slate-600";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">
            Failed to load users
          </div>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ">
      {/* Premium Header Section */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800 via-blue-900 to-violet-900 p-6 sm:p-8 text-white border border-blue-500/20">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="p-2 sm:p-3 bg-blue-500/20 rounded-xl sm:rounded-2xl border border-blue-400/30 flex-shrink-0">
                  <UsersIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-200 to-violet-200 bg-clip-text text-transparent break-words">
                    {t("users.manage")}
                  </h1>
                  <p className="text-blue-100 text-sm sm:text-lg mt-1 sm:mt-2 break-words">
                    {t("users.viewManage")}
                  </p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="overflow-x-auto">
                <div className="flex gap-3 sm:gap-6 mt-4 sm:mt-6 min-w-max pb-2">
                  <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 min-w-0 flex-shrink-0">
                    <Shield className="h-4 w-4 sm:h-6 sm:w-6 text-blue-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-lg sm:text-2xl font-bold truncate">
                        {isLoading ? "-" : safeUserData.length || 0}
                      </p>
                      <p className="text-xs text-blue-200 truncate">
                        {t("dashboard.totalUsers")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 min-w-0 flex-shrink-0">
                    <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-violet-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-lg sm:text-2xl font-bold truncate">
                        {isLoading
                          ? "-"
                          : safeUserData.filter(
                              (u: User) => u.status === "active"
                            ).length || 0}
                      </p>
                      <p className="text-xs text-violet-200 truncate">
                        {t("common.active")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 min-w-0 flex-shrink-0">
                    <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-lg sm:text-2xl font-bold truncate">
                        {isLoading
                          ? "-"
                          : safeUserData.filter((u: User) => u.role === "admin")
                              .length || 0}
                      </p>
                      <p className="text-xs text-emerald-200 truncate">
                        {t("users.admins")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tr from-violet-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Header Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <Input
                placeholder={t("users.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl transition-all duration-300 w-full"
              />
            </div>

            {/* Mobile Filter Toggle */}
            <div className="sm:hidden">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center gap-2 border-slate-300 dark:border-slate-600"
              >
                <Filter className="h-4 w-4" />
                {t("common.filter")}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </div>
          </div>

          <div className="hidden sm:flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm"
            >
              <option value="all">{t("users.allStatus")}</option>
              <option value="active">{t("common.active")}</option>
              <option value="inactive">{t("common.inactive")}</option>
            </select>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm"
            >
              <option value="all">{t("users.allRoles")}</option>
              <option value="admin">{t("auth.admin")}</option>
              <option value="user">{t("users.user")}</option>
            </select>
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="sm:hidden grid grid-cols-1 gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm"
            >
              <option value="all">{t("users.allStatus")}</option>
              <option value="active">{t("common.active")}</option>
              <option value="inactive">{t("common.inactive")}</option>
            </select>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm"
            >
              <option value="all">{t("users.allRoles")}</option>
              <option value="admin">{t("auth.admin")}</option>
              <option value="user">{t("users.user")}</option>
            </select>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => exportUsers(filteredUsers || [])}
              className="flex items-center gap-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex-1 sm:flex-none"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">{t("users.exportUsers")}</span>
            </Button>

            {selectedUsers.length > 0 && (
              <Button
                variant="destructive"
                // onClick={handleDeleteSelected}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex-1 sm:flex-none"
              >
                <Trash2 className="h-4 w-4" />
                <span>
                  {t("common.delete")} ({selectedUsers.length})
                </span>
              </Button>
            )}
          </div>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex-1 sm:flex-none">
                <Plus className="h-4 w-4" />
                {t("nav.addUser")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  {t("userForm.createTitle")}
                </DialogTitle>
              </DialogHeader>
              <UserForm
                mode="create"
                onSave={handleUserSave}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Premium Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border-0 shadow-xl sm:shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50">
              <TableRow className="border-b border-slate-200 dark:border-slate-700">
                <TableHead className="w-12 bg-transparent px-2 sm:px-4">
                  <Checkbox
                    checked={
                      selectedUsers.length === filteredUsers.length &&
                      filteredUsers.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
                    className="border-slate-300 dark:border-slate-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                </TableHead>
                <TableHead
                  className="cursor-pointer bg-transparent text-slate-800 dark:text-white font-semibold py-4 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-300 px-2 sm:px-4 min-w-[120px]"
                  onClick={() => handleSort("studentId")}
                >
                  {t("user.studentId")}
                </TableHead>
                <TableHead
                  className="cursor-pointer bg-transparent text-slate-800 dark:text-white font-semibold py-4 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-300 px-2 sm:px-4 min-w-[200px]"
                  onClick={() => handleSort("firstName")}
                >
                  {t("users.user")}
                </TableHead>
                <TableHead className="hidden md:table-cell bg-transparent text-slate-800 dark:text-white font-semibold py-4 px-2 sm:px-4 min-w-[200px]">
                  {t("auth.email")}
                </TableHead>
                <TableHead className="hidden lg:table-cell bg-transparent text-slate-800 dark:text-white font-semibold py-4 px-2 sm:px-4 min-w-[150px]">
                  {t("user.phoneNumber")}
                </TableHead>
                <TableHead
                  className="cursor-pointer bg-transparent text-slate-800 dark:text-white font-semibold py-4 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-300 px-2 sm:px-4 min-w-[100px]"
                  onClick={() => handleSort("role")}
                >
                  {t("common.role")}
                </TableHead>
                <TableHead className="bg-transparent text-slate-800 dark:text-white font-semibold py-4 px-2 sm:px-4 min-w-[100px]">
                  {t("common.status")}
                </TableHead>
                <TableHead className="text-right bg-transparent text-slate-800 dark:text-white font-semibold py-4 px-2 sm:px-4 min-w-[140px]">
                  {t("common.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>

            {isLoading ? (
              <TableBody>
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={8}
                    className="h-64 text-center bg-white dark:bg-slate-800"
                  >
                    <div className="flex flex-col items-center justify-center h-full w-full space-y-3">
                      <Spinner className="h-8 w-8 text-indigo-600" />
                      <p className="text-base font-medium text-muted-foreground">
                        Loading data...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id || user.email}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-300 group"
                  >
                    <TableCell className="py-4 px-2 sm:px-4">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleSelectUser(user.id)}
                        className="border-slate-300 dark:border-slate-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                      />
                    </TableCell>
                    <TableCell className="py-4 font-mono font-semibold text-slate-800 dark:text-white text-sm px-2 sm:px-4">
                      <div className="min-w-0">
                        <span className="truncate block">{user.studentId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-2 sm:px-4">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-slate-200 dark:border-slate-600 shadow-sm flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white font-semibold text-xs sm:text-sm shadow-md">
                            {user.firstName?.[0]}
                            {user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 truncate hidden sm:block">
                            {user.church}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell py-4 text-slate-700 dark:text-slate-300 px-2 sm:px-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 flex-shrink-0" />
                        <span className="text-sm truncate min-w-0">
                          {user.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell py-4 text-slate-700 dark:text-slate-300 px-2 sm:px-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 flex-shrink-0" />
                        <span className="text-sm truncate">
                          {user.phoneNumber}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-2 sm:px-4">
                      <div className="min-w-0">
                        <Badge
                          className={`rounded-lg font-medium shadow-sm text-white text-xs truncate ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role?.toUpperCase()}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-2 sm:px-4">
                      <div className="min-w-0">
                        <Badge
                          className={`rounded-lg font-medium shadow-sm text-white text-xs truncate ${getStatusColor(
                            user.status
                          )}`}
                        >
                          {user.status === "active"
                            ? t("common.active")
                            : t("common.inactive")}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-right px-2 sm:px-4">
                      <div className="flex justify-end gap-1 sm:gap-2 min-w-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewUser(user)}
                          className="h-8 w-8 sm:h-9 sm:w-9 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-0 flex-shrink-0"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditUser(user)}
                          className="h-8 w-8 sm:h-9 sm:w-9 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-0 flex-shrink-0"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          // onClick={() => handleDeleteUser(user)}
                          // disabled={user.id === currentUser?.id}
                          className="h-8 w-8 sm:h-9 sm:w-9 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-0 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </div>

        {/* Premium Empty State */}
        {filteredUsers.length === 0 && !isLoading && (
          <div className="text-center py-12 sm:py-16">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-2xl w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <UsersIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium mb-2">
              {t("users.noUsersFound")}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-500">
              {searchTerm
                ? t("users.tryAdjustingSearch")
                : t("users.noUsersAvailable")}
            </div>
          </div>
        )}
      </div>

      {/* User Detail Dialog */}
      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-2xl rounded-2xl sm:rounded-3xl mx-4 overflow-hidden">
          {viewUser && (
            <>
              <DialogHeader className="border-b border-slate-200 dark:border-slate-700 pb-4">
                <DialogTitle className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2 sm:gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg sm:rounded-xl">
                    <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  {t("users.userDetails")}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 sm:space-y-6 py-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-white dark:border-slate-800 shadow-lg flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white font-semibold text-base sm:text-lg">
                      {viewUser.firstName?.[0]}
                      {viewUser.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white truncate">
                      {viewUser.firstName} {viewUser.lastName}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base truncate">
                      {viewUser.studentId} • {viewUser.role?.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="min-w-0">
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {t("auth.email")}
                    </Label>
                    <p className="text-sm sm:text-base text-slate-800 dark:text-white font-semibold truncate">
                      {viewUser.email}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {t("user.phoneNumber")}
                    </Label>
                    <p className="text-sm sm:text-base text-slate-800 dark:text-white font-semibold truncate">
                      {viewUser.phoneNumber}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="min-w-0">
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {t("user.church")}
                    </Label>
                    <p className="text-sm sm:text-base text-slate-800 dark:text-white font-semibold truncate">
                      {viewUser.church}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {t("profile.joined")}
                    </Label>
                    <p className="text-sm sm:text-base text-slate-800 dark:text-white font-semibold truncate">
                      {viewUser.joinDate
                        ? new Date(viewUser.joinDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 sm:gap-4 flex-wrap">
                  <Badge
                    className={`text-xs truncate ${getStatusColor(
                      viewUser.status
                    )}`}
                  >
                    {viewUser.status?.toUpperCase()}
                  </Badge>
                  <Badge
                    className={`text-xs truncate ${getRoleColor(
                      viewUser.role
                    )}`}
                  >
                    {viewUser.role?.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              {t("userForm.editTitle")}
            </DialogTitle>
          </DialogHeader>
          {editUser && (
            <UserForm
              user={editUser}
              mode="edit"
              onSave={handleUserSave}
              onCancel={() => setEditUser(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
