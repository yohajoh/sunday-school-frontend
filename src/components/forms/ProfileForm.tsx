import React, { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface ProfileFormProps {
  user: User;
  onSave?: (user: User) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ user, onSave }) => {
  const { t } = useLanguage();
  const { updateUser, currentUser } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<Partial<User>>({
    ...user,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updatePasswordField = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedUser: User = {
        ...user,
        ...formData,
      };

      updateUser(user.id, updatedUser);
      onSave?.(updatedUser);
      toast.success(t("profile.profileUpdated"), {
        description: t("profile.changesSaved"),
      });
    } catch (error) {
      toast.error(t("profile.updateError"), {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t("profile.passwordsNoMatch"));
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error(t("profile.passwordTooShort"));
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, you would verify current password and update it
      toast.success(t("profile.passwordUpdated"), {
        description: t("profile.passwordChangeSuccess"),
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(t("profile.passwordChangeError"), {
        description: t("profile.passwordCheckError"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("profile.fileTooLarge"), {
          description: t("profile.fileSizeError"),
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        updateField("avatar", reader.result as string);
        toast.success(t("profile.profilePictureUpdated"), {
          description: t("profile.photoSaved"),
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/50 dark:from-slate-900 dark:via-blue-950/20 dark:to-emerald-950/10 ">
      <div className="max-w-7xl mx-auto">
        {/* Premium Header - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl shadow-lg self-start sm:self-auto">
              <UserIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {t("profile.title")}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-lg mt-1 sm:mt-2">
                {t("profile.subtitle")}
              </p>
            </div>
          </div>

          {isOwnProfile && (
            <Badge className="bg-gradient-to-r from-blue-500 to-violet-500 text-white border-0 shadow-lg text-xs sm:text-sm">
              <Star className="h-3 w-3 mr-1" />
              {t("profile.editingProfile")}
            </Badge>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Premium Sidebar Profile Card - Mobile Responsive */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
              <CardContent className="p-4 sm:p-6">
                <div className="text-center space-y-4 sm:space-y-6">
                  {/* Premium Avatar Section */}
                  <div className="relative inline-block">
                    <div className="relative">
                      <Avatar className="h-20 w-20 sm:h-28 sm:w-28 border-4 border-white dark:border-slate-800 shadow-2xl mx-auto">
                        <AvatarImage src={formData.avatar} />
                        <AvatarFallback className="text-lg sm:text-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white font-semibold">
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-emerald-500 rounded-full p-1 shadow-lg border-2 border-white dark:border-slate-800">
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
                      {user.occupation || t("profile.sundaySchoolMember")}
                    </p>
                  </div>

                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg text-xs">
                    <Target className="h-3 w-3 mr-1" />
                    {user.role.toUpperCase()}
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
                        {t("profile.joined")}{" "}
                        {new Date(user.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Stats Card */}
            <Card className="border-0 bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-500 text-white shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-4 sm:p-6 relative">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white/5 rounded-full translate-y-8 sm:translate-y-12 -translate-x-8 sm:-translate-x-12"></div>

                <div className="relative z-10">
                  <h3 className="font-semibold mb-4 sm:mb-6 flex items-center gap-2 text-sm sm:text-base">
                    <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                    {t("profile.memberStats")}
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center p-2 sm:p-3 bg-white/10 rounded-xl sm:rounded-2xl backdrop-blur-sm">
                      <span className="text-emerald-100 text-xs sm:text-sm">
                        {t("profile.attendance")}
                      </span>
                      <span className="font-bold text-base sm:text-lg">
                        95%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 sm:p-3 bg-white/10 rounded-xl sm:rounded-2xl backdrop-blur-sm">
                      <span className="text-cyan-100 text-xs sm:text-sm">
                        {t("profile.activities")}
                      </span>
                      <span className="font-bold text-base sm:text-lg">24</span>
                    </div>
                    <div className="flex justify-between items-center p-2 sm:p-3 bg-white/10 rounded-xl sm:rounded-2xl backdrop-blur-sm">
                      <span className="text-blue-100 text-xs sm:text-sm">
                        {t("profile.memberSince")}
                      </span>
                      <span className="font-bold text-base sm:text-lg">
                        {new Date().getFullYear() -
                          new Date(user.joinDate).getFullYear()}
                        y
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Premium Main Content Area - Mobile Responsive */}
          <div className="lg:col-span-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4 sm:space-y-6"
            >
              <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 p-1 rounded-xl sm:rounded-2xl shadow-lg">
                <TabsTrigger
                  value="personal"
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-lg sm:rounded-xl transition-all duration-300 data-[state=active]:shadow-lg text-xs sm:text-sm px-2 sm:px-4 py-2"
                >
                  <UserIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">
                    {t("profile.personalInfo")}
                  </span>
                  <span className="xs:hidden">{t("common.personal")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="location"
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg sm:rounded-xl transition-all duration-300 data-[state=active]:shadow-lg text-xs sm:text-sm px-2 sm:px-4 py-2"
                >
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">
                    {t("profile.locationInfo")}
                  </span>
                  <span className="xs:hidden">{t("common.location")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg sm:rounded-xl transition-all duration-300 data-[state=active]:shadow-lg text-xs sm:text-sm px-2 sm:px-4 py-2"
                >
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">
                    {t("profile.accountSecurity")}
                  </span>
                  <span className="xs:hidden">{t("common.security")}</span>
                </TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="personal">
                <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 sm:gap-3 text-slate-800 dark:text-white text-lg sm:text-xl">
                      <div className="p-1.5 sm:p-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg sm:rounded-xl shadow-lg">
                        <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      {t("profile.personalInfo")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {t("user.firstName")} *
                          </Label>
                          <Input
                            value={formData.firstName}
                            onChange={(e) =>
                              updateField("firstName", e.target.value)
                            }
                            required
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                          />
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {t("user.lastName")} *
                          </Label>
                          <Input
                            value={formData.lastName}
                            onChange={(e) =>
                              updateField("lastName", e.target.value)
                            }
                            required
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 sm:gap-2">
                            <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                            {t("auth.email")} *
                          </Label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              updateField("email", e.target.value)
                            }
                            required
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                          />
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 sm:gap-2">
                            <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                            {t("user.phoneNumber")} *
                          </Label>
                          <Input
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) =>
                              updateField("phoneNumber", e.target.value)
                            }
                            required
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {t("user.studentId")} *
                          </Label>
                          <Input
                            value={formData.studentId}
                            onChange={(e) =>
                              updateField("studentId", e.target.value)
                            }
                            required
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                          />
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {t("user.nationalId")} *
                          </Label>
                          <Input
                            value={formData.nationalId}
                            onChange={(e) =>
                              updateField("nationalId", e.target.value)
                            }
                            required
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {t("user.sex")} *
                          </Label>
                          <Select
                            value={formData.sex}
                            onValueChange={(value: "male" | "female") =>
                              updateField("sex", value)
                            }
                          >
                            <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-sm text-sm sm:text-base">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">
                                {t("userForm.male")}
                              </SelectItem>
                              <SelectItem value="female">
                                {t("userForm.female")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 sm:gap-2">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            {t("user.dateOfBirth")} *
                          </Label>
                          <Input
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) =>
                              updateField("dateOfBirth", e.target.value)
                            }
                            required
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-700">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base px-4 sm:px-6 py-2"
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              {t("profile.saving")}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                              {t("profile.saveChanges")}
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
                      {t("profile.locationInfo")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("user.church")} *
                        </Label>
                        <Input
                          value={formData.church}
                          onChange={(e) =>
                            updateField("church", e.target.value)
                          }
                          required
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                        />
                      </div>

                      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {t("user.country")} *
                          </Label>
                          <Input
                            value={formData.country}
                            onChange={(e) =>
                              updateField("country", e.target.value)
                            }
                            required
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                          />
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {t("user.region")} *
                          </Label>
                          <Input
                            value={formData.region}
                            onChange={(e) =>
                              updateField("region", e.target.value)
                            }
                            required
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {t("user.zone")}
                          </Label>
                          <Input
                            value={formData.zone}
                            onChange={(e) =>
                              updateField("zone", e.target.value)
                            }
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                          />
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {t("user.woreda")}
                          </Label>
                          <Input
                            value={formData.woreda}
                            onChange={(e) =>
                              updateField("woreda", e.target.value)
                            }
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-700">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base px-4 sm:px-6 py-2"
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              {t("profile.saving")}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                              {t("profile.saveChanges")}
                              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 sm:gap-3 text-slate-800 dark:text-white text-lg sm:text-xl">
                      <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg sm:rounded-xl shadow-lg">
                        <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      {t("profile.accountSecurity")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                    <form onSubmit={handlePasswordChange}>
                      <div className="space-y-3 sm:space-y-4">
                        <h4 className="font-semibold text-slate-800 dark:text-white flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                          <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                          {t("profile.changePassword")}
                        </h4>

                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {t("profile.currentPassword")}
                          </Label>
                          <div className="relative">
                            <Input
                              type={showCurrentPassword ? "text" : "password"}
                              value={passwordData.currentPassword}
                              onChange={(e) =>
                                updatePasswordField(
                                  "currentPassword",
                                  e.target.value
                                )
                              }
                              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 shadow-sm pr-10 text-sm sm:text-base"
                              placeholder={t("profile.currentPassword")}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all duration-300"
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                              ) : (
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {t("profile.newPassword")}
                          </Label>
                          <div className="relative">
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={(e) =>
                                updatePasswordField(
                                  "newPassword",
                                  e.target.value
                                )
                              }
                              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 shadow-sm pr-10 text-sm sm:text-base"
                              placeholder={t("profile.newPassword")}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all duration-300"
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                              ) : (
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {t("profile.confirmPassword")}
                          </Label>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              value={passwordData.confirmPassword}
                              onChange={(e) =>
                                updatePasswordField(
                                  "confirmPassword",
                                  e.target.value
                                )
                              }
                              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 shadow-sm pr-10 text-sm sm:text-base"
                              placeholder={t("profile.confirmPassword")}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all duration-300"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                              ) : (
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-lg sm:rounded-xl mt-4 sm:mt-6">
                        <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                          {t("profile.passwordRequirements")}
                        </h4>
                        <ul className="text-xs sm:text-sm text-amber-700 dark:text-amber-400 space-y-0.5 sm:space-y-1">
                          <li>• {t("profile.passwordRequirement1")}</li>
                          <li>• {t("profile.passwordRequirement2")}</li>
                          <li>• {t("profile.passwordRequirement3")}</li>
                          <li>• {t("profile.passwordRequirement4")}</li>
                        </ul>
                      </div>

                      <div className="flex justify-end gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-700">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base px-4 sm:px-6 py-2"
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              {t("profile.updating")}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
                              {t("profile.changePassword")}
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
