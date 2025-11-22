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
  IdCard,
  Church,
  Users,
  Heart,
  Save,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface UserFormProps {
  user?: User;
  onSave?: (user: User) => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
}

export const UserForm: React.FC<UserFormProps> = ({
  user,
  onSave,
  onCancel,
  mode = "create",
}) => {
  const { t } = useLanguage();
  const { addUser, updateUser, currentUser } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<User>>({
    studentId: "",
    email: "",
    role: "user",
    firstName: "",
    middleName: "",
    lastName: "",
    sex: "male",
    phoneNumber: "",
    disability: false,
    disabilityType: "",
    dateOfBirth: "",
    country: "Ethiopia",
    region: "",
    zone: "",
    woreda: "",
    church: "",
    occupation: "",
    marriageStatus: "single",
    parentStatus: "both",
    parentFullName: "",
    parentEmail: "",
    parentPhoneNumber: "",
    nationalId: "",
    status: "active",
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!formData.studentId || !formData.firstName || !formData.email) {
        toast.error(t("userForm.requiredFields"));
        return;
      }

      const userData: User = {
        id: user?.id || Date.now().toString(),
        studentId: formData.studentId!,
        email: formData.email!,
        role: formData.role!,
        firstName: formData.firstName!,
        middleName: formData.middleName!,
        lastName: formData.lastName!,
        sex: formData.sex!,
        phoneNumber: formData.phoneNumber!,
        disability: formData.disability!,
        disabilityType: formData.disabilityType!,
        dateOfBirth: formData.dateOfBirth!,
        country: formData.country!,
        region: formData.region!,
        zone: formData.zone!,
        woreda: formData.woreda!,
        church: formData.church!,
        occupation: formData.occupation!,
        marriageStatus: formData.marriageStatus!,
        parentStatus: formData.parentStatus!,
        parentFullName: formData.parentFullName!,
        parentEmail: formData.parentEmail!,
        parentPhoneNumber: formData.parentPhoneNumber!,
        nationalId: formData.nationalId!,
        joinDate: user?.joinDate || new Date().toISOString().split("T")[0],
        status: formData.status!,
        lastLogin: user?.lastLogin,
      };

      if (mode === "create") {
        addUser(userData);
        toast.success("User created successfully!", {
          description: `${userData.firstName} ${userData.lastName} has been added to the system.`,
        });
      } else {
        updateUser(userData.id, userData);
        toast.success("User updated successfully!", {
          description: "User information has been updated.",
        });
      }

      onSave?.(userData);
    } catch (error) {
      toast.error("Failed to save user", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isEditingOwnProfile = user?.id === currentUser?.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/50 dark:from-slate-900 dark:via-blue-950/20 dark:to-emerald-950/10 ">
      <div className="max-w-7xl mx-auto">
        {/* Premium Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl shadow-lg">
              <UserIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {mode === "create"
                  ? t("userForm.createTitle")
                  : t("userForm.editTitle")}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg mt-2">
                {mode === "create"
                  ? t("userForm.createSubtitle")
                  : t("userForm.editSubtitle")}
              </p>
            </div>
          </div>

          {isEditingOwnProfile && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
              <Heart className="h-3 w-3 mr-1" />
              {t("userForm.editingOwnProfile")}
            </Badge>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Personal Information */}
            <Card className="lg:col-span-2 border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
              <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
                <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white text-xl">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl shadow-lg">
                    <UserIcon className="h-5 w-5 text-white" />
                  </div>
                  {t("userForm.personalInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <IdCard className="h-4 w-4" />
                      {t("userForm.studentId")} *
                    </Label>
                    <Input
                      value={formData.studentId}
                      onChange={(e) => updateField("studentId", e.target.value)}
                      required
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                      placeholder="SS001"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {t("userForm.firstName")} *
                    </Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      required
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                      placeholder="John"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {t("userForm.middleName")}
                    </Label>
                    <Input
                      value={formData.middleName}
                      onChange={(e) =>
                        updateField("middleName", e.target.value)
                      }
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                      placeholder="Michael"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {t("userForm.lastName")} *
                    </Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      required
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                      placeholder="Doe"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {t("userForm.sex")} *
                    </Label>
                    <Select
                      value={formData.sex}
                      onValueChange={(value: "male" | "female") =>
                        updateField("sex", value)
                      }
                    >
                      <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm">
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
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {t("userForm.email")} *
                    </Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      required
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {t("userForm.phone")} *
                    </Label>
                    <Input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        updateField("phoneNumber", e.target.value)
                      }
                      required
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                      placeholder="+251911223344"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {t("userForm.dateOfBirth")} *
                    </Label>
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        updateField("dateOfBirth", e.target.value)
                      }
                      required
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {t("userForm.nationalId")} *
                    </Label>
                    <Input
                      value={formData.nationalId}
                      onChange={(e) =>
                        updateField("nationalId", e.target.value)
                      }
                      required
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                      placeholder="1234567890"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {t("userForm.occupation")}
                    </Label>
                    <Input
                      value={formData.occupation}
                      onChange={(e) =>
                        updateField("occupation", e.target.value)
                      }
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                      placeholder="Student / Teacher / Professional"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {t("userForm.marriageStatus")}
                    </Label>
                    <Select
                      value={formData.marriageStatus}
                      onValueChange={(value: any) =>
                        updateField("marriageStatus", value)
                      }
                    >
                      <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">
                          {t("userForm.single")}
                        </SelectItem>
                        <SelectItem value="married">
                          {t("userForm.married")}
                        </SelectItem>
                        <SelectItem value="divorced">
                          {t("userForm.divorced")}
                        </SelectItem>
                        <SelectItem value="widowed">
                          {t("userForm.widowed")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sidebar Cards */}
            <div className="space-y-6">
              {/* Disability Information */}
              <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-slate-800 dark:text-white">
                    {t("userForm.disabilityInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {t("userForm.hasDisability")}
                    </Label>
                    <Switch
                      checked={formData.disability}
                      onCheckedChange={(checked) =>
                        updateField("disability", checked)
                      }
                    />
                  </div>

                  {formData.disability && (
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {t("userForm.disabilityType")}
                      </Label>
                      <Input
                        value={formData.disabilityType}
                        onChange={(e) =>
                          updateField("disabilityType", e.target.value)
                        }
                        className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                        placeholder={t("userForm.disabilityType")}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Location Information */}
              <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white text-lg">
                    <MapPin className="h-5 w-5" />
                    {t("userForm.locationInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {t("userForm.country")}
                    </Label>
                    <Input
                      value={formData.country}
                      onChange={(e) => updateField("country", e.target.value)}
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                    />
                  </div>

                  <div className="grid gap-4 grid-cols-2">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {t("userForm.region")}
                      </Label>
                      <Input
                        value={formData.region}
                        onChange={(e) => updateField("region", e.target.value)}
                        className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {t("userForm.zone")}
                      </Label>
                      <Input
                        value={formData.zone}
                        onChange={(e) => updateField("zone", e.target.value)}
                        className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 grid-cols-2">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {t("userForm.woreda")}
                      </Label>
                      <Input
                        value={formData.woreda}
                        onChange={(e) => updateField("woreda", e.target.value)}
                        className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {t("userForm.church")}
                      </Label>
                      <Input
                        value={formData.church}
                        onChange={(e) => updateField("church", e.target.value)}
                        className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                        placeholder="St. George Cathedral"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Parent/Guardian Information */}
              <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white text-lg">
                    <Users className="h-5 w-5" />
                    {t("userForm.parentInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {t("userForm.parentStatus")}
                    </Label>
                    <Select
                      value={formData.parentStatus}
                      onValueChange={(value: any) =>
                        updateField("parentStatus", value)
                      }
                    >
                      <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="both">
                          {t("userForm.bothParents")}
                        </SelectItem>
                        <SelectItem value="mother">
                          {t("userForm.motherOnly")}
                        </SelectItem>
                        <SelectItem value="father">
                          {t("userForm.fatherOnly")}
                        </SelectItem>
                        <SelectItem value="guardian">
                          {t("userForm.guardian")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {t("userForm.parentFullName")}
                    </Label>
                    <Input
                      value={formData.parentFullName}
                      onChange={(e) =>
                        updateField("parentFullName", e.target.value)
                      }
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                      placeholder={t("userForm.parentFullName")}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {t("userForm.parentEmail")}
                    </Label>
                    <Input
                      type="email"
                      value={formData.parentEmail}
                      onChange={(e) =>
                        updateField("parentEmail", e.target.value)
                      }
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                      placeholder="parent@example.com"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {t("userForm.parentPhone")}
                    </Label>
                    <Input
                      type="tel"
                      value={formData.parentPhoneNumber}
                      onChange={(e) =>
                        updateField("parentPhoneNumber", e.target.value)
                      }
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                      placeholder="+251922334455"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all duration-300"
              >
                {t("userForm.cancel")}
              </Button>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white shadow-lg hover:shadow-xl rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("userForm.saving")}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {mode === "create"
                    ? t("userForm.createStudent")
                    : t("userForm.updateProfile")}
                  <Sparkles className="h-4 w-4" />
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
