import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Save,
  Camera,
  Star,
  Award,
  Target,
  Sparkles,
  Eye,
  EyeOff,
  Lock,
  Users,
  Heart,
  Church,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ProfileFormProps {
  user: User;
  onSave?: (user: User) => void;
}

interface ProfileFormData {
  // Personal Information
  studentId: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  sex: "male" | "female";
  phoneNumber: string;

  // Disability Information
  disability: boolean;
  disabilityType?: string;

  // Personal Details
  dateOfBirth: string;
  nationalId: string;
  occupation?: string;
  marriageStatus: "single" | "married" | "divorced" | "widowed";

  // Location Information
  country: string;
  region: string;
  zone?: string;
  woreda?: string;
  church: string;

  // Parent/Guardian Information
  parentStatus: "both" | "mother" | "father" | "guardian";
  parentFullName: string;
  parentEmail?: string;
  parentPhoneNumber: string;

  // Account
  avatar?: string;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ user, onSave }) => {
  const { t } = useLanguage();
  const { currentUser } = useApp();
  const queryClient = useQueryClient();
  const API = import.meta.env.VITE_API_URL;

  const [activeTab, setActiveTab] = useState("personal");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ProfileFormData>({
    defaultValues: {
      studentId: user.studentId || "",
      email: user.email || "",
      firstName: user.firstName || "",
      middleName: user.middleName || "",
      lastName: user.lastName || "",
      sex: user.sex || "male",
      phoneNumber: user.phoneNumber || "",
      disability: user.disability || false,
      disabilityType: user.disabilityType || "",
      dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",
      nationalId: user.nationalId || "",
      occupation: user.occupation || "",
      marriageStatus: user.marriageStatus || "single",
      country: user.country || "Ethiopia",
      region: user.region || "",
      zone: user.zone || "",
      woreda: user.woreda || "",
      church: user.church || "",
      parentStatus: user.parentStatus || "both",
      parentFullName: user.parentFullName || "",
      parentEmail: user.parentEmail || "",
      parentPhoneNumber: user.parentPhoneNumber || "",
      avatar: user.avatar || "",
    },
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const watchDisability = watch("disability");

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (userData: ProfileFormData) => {
      const response = await fetch(
        `${API}/api/sunday-school/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update user");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSave?.(data.data);
      toast.success("Profile updated successfully!", {
        description: "Your changes have been saved.",
      });
    },
    onError: (error: Error) => {
      console.error("❌ Update user error:", error);
      toast.error("Failed to update profile", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    await updateUserMutation.mutateAsync(data);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      // Password change API call would go here
      toast.success("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Failed to update password");
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Please select an image smaller than 5MB",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // In a real app, you would upload this to your server
        toast.success("Profile picture updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const updatePasswordField = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/50 dark:from-slate-900 dark:via-orange-950/20 dark:to-amber-950/10">
      <div className="max-w-7xl mx-auto">
        {/* Premium Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg self-start sm:self-auto">
              <UserIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Profile Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-lg mt-1 sm:mt-2">
                Update your personal information and account details
              </p>
            </div>
          </div>

          {isOwnProfile && (
            <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 shadow-lg text-xs sm:text-sm">
              <Star className="h-3 w-3 mr-1" />
              Editing Your Profile
            </Badge>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar Profile Card */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
              <CardContent className="p-4 sm:p-6">
                <div className="text-center space-y-4 sm:space-y-6">
                  {/* Avatar Section */}
                  <div className="relative inline-block">
                    <div className="relative">
                      <Avatar className="h-20 w-20 sm:h-28 sm:w-28 border-4 border-white dark:border-slate-800 shadow-2xl mx-auto">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-lg sm:text-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white font-semibold">
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-amber-500 rounded-full p-1 shadow-lg border-2 border-white dark:border-slate-800">
                        <Award className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      </div>
                    </div>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 cursor-pointer"
                    >
                      <div className="p-1.5 sm:p-2 bg-slate-900 dark:bg-slate-100 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 border-2 border-white dark:border-slate-800">
                        <Camera className="h-3 w-3 sm:h-4 sm:w-4 text-white dark:text-slate-900" />
                      </div>
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                      {user.occupation || "Sunday School Member"}
                    </p>
                  </div>

                  <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 shadow-lg text-xs">
                    <Target className="h-3 w-3 mr-1" />
                    {user.role?.toUpperCase()}
                  </Badge>

                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{user.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs">
                        Joined {new Date(user.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4 sm:space-y-6"
            >
              <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 p-1 rounded-xl sm:rounded-2xl shadow-lg">
                <TabsTrigger
                  value="personal"
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-lg sm:rounded-xl transition-all duration-300 data-[state=active]:shadow-lg text-xs sm:text-sm px-2 sm:px-4 py-2"
                >
                  <UserIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Personal</span>
                </TabsTrigger>
                <TabsTrigger
                  value="location"
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg sm:rounded-xl transition-all duration-300 data-[state=active]:shadow-lg text-xs sm:text-sm px-2 sm:px-4 py-2"
                >
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Location</span>
                </TabsTrigger>
                <TabsTrigger
                  value="parents"
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-lg sm:rounded-xl transition-all duration-300 data-[state=active]:shadow-lg text-xs sm:text-sm px-2 sm:px-4 py-2"
                >
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Parents</span>
                </TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="personal">
                <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 sm:gap-3 text-slate-800 dark:text-white text-lg sm:text-xl">
                      <div className="p-1.5 sm:p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg sm:rounded-xl shadow-lg">
                        <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Student ID *
                          </Label>
                          <Controller
                            name="studentId"
                            control={control}
                            rules={{ required: "Student ID is required" }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                required
                                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                              />
                            )}
                          />
                          {errors.studentId && (
                            <p className="text-red-500 text-sm">
                              {errors.studentId.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 sm:gap-2">
                            <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                            Email *
                          </Label>
                          <Controller
                            name="email"
                            control={control}
                            rules={{
                              required: "Email is required",
                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address",
                              },
                            }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="email"
                                required
                                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                              />
                            )}
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            First Name *
                          </Label>
                          <Controller
                            name="firstName"
                            control={control}
                            rules={{ required: "First name is required" }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                required
                                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                              />
                            )}
                          />
                          {errors.firstName && (
                            <p className="text-red-500 text-sm">
                              {errors.firstName.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Middle Name
                          </Label>
                          <Controller
                            name="middleName"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                              />
                            )}
                          />
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Last Name *
                          </Label>
                          <Controller
                            name="lastName"
                            control={control}
                            rules={{ required: "Last name is required" }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                required
                                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                              />
                            )}
                          />
                          {errors.lastName && (
                            <p className="text-red-500 text-sm">
                              {errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Sex *
                          </Label>
                          <Controller
                            name="sex"
                            control={control}
                            rules={{ required: "Sex is required" }}
                            render={({ field }) => (
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm text-sm sm:text-base">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.sex && (
                            <p className="text-red-500 text-sm">
                              {errors.sex.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 sm:gap-2">
                            <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                            Phone Number *
                          </Label>
                          <Controller
                            name="phoneNumber"
                            control={control}
                            rules={{ required: "Phone number is required" }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="tel"
                                required
                                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                              />
                            )}
                          />
                          {errors.phoneNumber && (
                            <p className="text-red-500 text-sm">
                              {errors.phoneNumber.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 sm:gap-2">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            Date of Birth *
                          </Label>
                          <Controller
                            name="dateOfBirth"
                            control={control}
                            rules={{ required: "Date of birth is required" }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="date"
                                required
                                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                              />
                            )}
                          />
                          {errors.dateOfBirth && (
                            <p className="text-red-500 text-sm">
                              {errors.dateOfBirth.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            National ID *
                          </Label>
                          <Controller
                            name="nationalId"
                            control={control}
                            rules={{ required: "National ID is required" }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                required
                                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                              />
                            )}
                          />
                          {errors.nationalId && (
                            <p className="text-red-500 text-sm">
                              {errors.nationalId.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Occupation
                          </Label>
                          <Controller
                            name="occupation"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                              />
                            )}
                          />
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Marital Status *
                          </Label>
                          <Controller
                            name="marriageStatus"
                            control={control}
                            rules={{ required: "Marital status is required" }}
                            render={({ field }) => (
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm text-sm sm:text-base">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="single">Single</SelectItem>
                                  <SelectItem value="married">
                                    Married
                                  </SelectItem>
                                  <SelectItem value="divorced">
                                    Divorced
                                  </SelectItem>
                                  <SelectItem value="widowed">
                                    Widowed
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.marriageStatus && (
                            <p className="text-red-500 text-sm">
                              {errors.marriageStatus.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4 sm:space-y-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <Controller
                            name="disability"
                            control={control}
                            render={({ field }) => (
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                              />
                            )}
                          />
                          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Heart className="h-4 w-4 text-orange-500" />
                            Do you have any disability?
                          </Label>
                        </div>

                        {watchDisability && (
                          <div className="space-y-2 sm:space-y-3">
                            <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                              Disability Type
                            </Label>
                            <Controller
                              name="disabilityType"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="Specify the type of disability"
                                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                                />
                              )}
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-700">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base px-4 sm:px-6 py-2"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Saving...
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                              Save Changes
                              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Location Information Tab */}
              <TabsContent value="location">
                <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 sm:gap-3 text-slate-800 dark:text-white text-lg sm:text-xl">
                      <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg sm:rounded-xl shadow-lg">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      Location Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 sm:gap-2">
                          <Church className="h-3 w-3 sm:h-4 sm:w-4" />
                          Church *
                        </Label>
                        <Controller
                          name="church"
                          control={control}
                          rules={{ required: "Church is required" }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              required
                              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                            />
                          )}
                        />
                        {errors.church && (
                          <p className="text-red-500 text-sm">
                            {errors.church.message}
                          </p>
                        )}
                      </div>

                      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Country *
                          </Label>
                          <Controller
                            name="country"
                            control={control}
                            rules={{ required: "Country is required" }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                required
                                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                              />
                            )}
                          />
                          {errors.country && (
                            <p className="text-red-500 text-sm">
                              {errors.country.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Region *
                          </Label>
                          <Controller
                            name="region"
                            control={control}
                            rules={{ required: "Region is required" }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                required
                                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                              />
                            )}
                          />
                          {errors.region && (
                            <p className="text-red-500 text-sm">
                              {errors.region.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Zone
                          </Label>
                          <Controller
                            name="zone"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                              />
                            )}
                          />
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Woreda
                          </Label>
                          <Controller
                            name="woreda"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-700">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base px-4 sm:px-6 py-2"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Saving...
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                              Save Location Info
                              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Parents Information Tab */}
              <TabsContent value="parents">
                <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 sm:gap-3 text-slate-800 dark:text-white text-lg sm:text-xl">
                      <div className="p-1.5 sm:p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg sm:rounded-xl shadow-lg">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      Parent/Guardian Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Parent Status *
                        </Label>
                        <Controller
                          name="parentStatus"
                          control={control}
                          rules={{ required: "Parent status is required" }}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 shadow-sm text-sm sm:text-base">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="both">
                                  Both Parents
                                </SelectItem>
                                <SelectItem value="mother">
                                  Mother Only
                                </SelectItem>
                                <SelectItem value="father">
                                  Father Only
                                </SelectItem>
                                <SelectItem value="guardian">
                                  Guardian
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.parentStatus && (
                          <p className="text-red-500 text-sm">
                            {errors.parentStatus.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Parent/Guardian Full Name *
                        </Label>
                        <Controller
                          name="parentFullName"
                          control={control}
                          rules={{
                            required: "Parent/Guardian name is required",
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              required
                              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                            />
                          )}
                        />
                        {errors.parentFullName && (
                          <p className="text-red-500 text-sm">
                            {errors.parentFullName.message}
                          </p>
                        )}
                      </div>

                      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Parent Email
                          </Label>
                          <Controller
                            name="parentEmail"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="email"
                                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                              />
                            )}
                          />
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 sm:gap-2">
                            <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                            Parent Phone *
                          </Label>
                          <Controller
                            name="parentPhoneNumber"
                            control={control}
                            rules={{
                              required: "Parent phone number is required",
                            }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="tel"
                                required
                                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                              />
                            )}
                          />
                          {errors.parentPhoneNumber && (
                            <p className="text-red-500 text-sm">
                              {errors.parentPhoneNumber.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-700">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base px-4 sm:px-6 py-2"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Saving...
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                              Save Parent Info
                              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
