import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useLanguage } from "@/contexts/LanguageContext";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Users,
  Save,
  Sparkles,
  Lock,
} from "lucide-react";

interface UserFormProps {
  user: User;
  onSave: (user: User) => void;
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

  const {
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    control,
    setValue,
  } = useForm<User>();

  const disibilityValue = watch("disability");

  useEffect(() => {
    if (user) {
      Object.keys(user).forEach((key) => {
        setValue(key as keyof User, user[key as keyof User]);
      });
    }
  }, [user, setValue]);

  const onSubmitForm: SubmitHandler<User> = (data) => {
    onSave(data);
    console.log("submit data: ", data);
  };

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
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)}>
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
                  <Controller
                    name="studentId"
                    control={control}
                    rules={{ required: "StudentId must be filled!" }}
                    render={({ field }) => (
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <IdCard className="h-4 w-4" />
                          {t("userForm.studentId")} *
                        </Label>
                        <Input
                          {...field}
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                          placeholder="SS001"
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: "The firstName field must be filled!" }}
                    render={({ field }) => (
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("userForm.firstName")} *
                        </Label>
                        <Input
                          {...field}
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                          placeholder="John"
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="middleName"
                    control={control}
                    rules={{ required: "The middleName field must be filled!" }}
                    render={({ field }) => (
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("userForm.middleName")}
                        </Label>
                        <Input
                          {...field}
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                          placeholder="Michael"
                        />
                      </div>
                    )}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Controller
                    name="lastName"
                    control={control}
                    rules={{ required: "The lastName field must be filled!" }}
                    render={({ field }) => (
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("userForm.lastName")} *
                        </Label>
                        <Input
                          {...field}
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                          placeholder="Doe"
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="sex"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("userForm.sex")} *
                        </Label>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
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
                    )}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Controller
                    name="email"
                    control={control}
                    rules={{ required: "Email must be provided!" }}
                    render={({ field }) => (
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {t("userForm.email")} *
                        </Label>
                        <Input
                          {...field}
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                          placeholder="john@example.com"
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="phoneNumber"
                    control={control}
                    rules={{ required: "phoneNumber must be provided!" }}
                    render={({ field }) => (
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {t("userForm.phone")} *
                        </Label>
                        <Input
                          type="tel"
                          {...field}
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                          placeholder="+251911223344"
                        />
                      </div>
                    )}
                  />
                </div>

                {/* Add Password Field - Only for create mode */}
                {mode === "create" && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <Controller
                      name="password"
                      control={control}
                      rules={{
                        required: "Password is required!",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      }}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            {t("userForm.password")} *
                          </Label>
                          <Input
                            type="password"
                            {...field}
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                            placeholder="Enter password"
                          />
                        </div>
                      )}
                    />
                    <div></div> {/* Empty div for grid alignment */}
                  </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {t("userForm.dateOfBirth")} *
                        </Label>
                        <Input
                          type="date"
                          {...field}
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="nationalId"
                    control={control}
                    rules={{ required: "NationalId must be filled" }}
                    render={({ field }) => (
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("userForm.nationalId")} *
                        </Label>
                        <Input
                          {...field}
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                          placeholder="1234567890"
                        />
                      </div>
                    )}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Controller
                    name="occupation"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("userForm.occupation")}
                        </Label>
                        <Input
                          {...field}
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                          placeholder="Student / Teacher / Professional"
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="marriageStatus"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("userForm.marriageStatus")}
                        </Label>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
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
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sidebar Cards - No changes */}
            <div className="space-y-6">
              {/* Disability Information */}
              <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-slate-800 dark:text-white">
                    {t("userForm.disabilityInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Controller
                    name="disability"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("userForm.hasDisability")}
                        </Label>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )}
                  />

                  {disibilityValue && (
                    <Controller
                      name="disabilityType"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {t("userForm.disabilityType")}
                          </Label>
                          <Input
                            {...field}
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                            placeholder={t("userForm.disabilityType")}
                          />
                        </div>
                      )}
                    />
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
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("userForm.country")}
                        </Label>
                        <Input
                          {...field}
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                        />
                      </div>
                    )}
                  />

                  <div className="grid gap-4 grid-cols-2">
                    <Controller
                      name="region"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {t("userForm.region")}
                          </Label>
                          <Input
                            {...field}
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                          />
                        </div>
                      )}
                    />

                    <Controller
                      name="zone"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {t("userForm.zone")}
                          </Label>
                          <Input
                            {...field}
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                          />
                        </div>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 grid-cols-2">
                    <Controller
                      name="woreda"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {t("userForm.woreda")}
                          </Label>
                          <Input
                            {...field}
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                          />
                        </div>
                      )}
                    />

                    <Controller
                      name="church"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {t("userForm.church")}
                          </Label>
                          <Input
                            {...field}
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                            placeholder="St. George Cathedral"
                          />
                        </div>
                      )}
                    />
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
                  <Controller
                    name="parentStatus"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("userForm.parentStatus")}
                        </Label>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
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
                    )}
                  />

                  <Controller
                    name="parentFullName"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("userForm.parentFullName")}
                        </Label>
                        <Input
                          {...field}
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                          placeholder={t("userForm.parentFullName")}
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="parentEmail"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("userForm.parentEmail")}
                        </Label>
                        <Input
                          type="email"
                          {...field}
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                          placeholder="parent@example.com"
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="parentPhoneNumber"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("userForm.parentPhone")}
                        </Label>
                        <Input
                          type="tel"
                          {...field}
                          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                          placeholder="+251922334455"
                        />
                      </div>
                    )}
                  />
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
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white shadow-lg hover:shadow-xl rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
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
