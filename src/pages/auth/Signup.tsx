import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { UserForm } from "@/components/forms/UserForm";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Church,
  ArrowLeft,
  Users,
  Star,
  Shield,
  BookOpen,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUserMutation } from "@/hooks/useUserMutations";

export const Signup: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { createUser } = useUserMutation();
  const { setLoggedOut } = useAuth();

  const handleSubmit = async (userData: User) => {
    createUser.mutate(userData, {
      onSuccess: () => {
        toast.success("Welcome to Sunday School!", {
          description: "Your account has been created successfully.",
        });
        setLoggedOut("kjkljk");
        navigate("/");
      },
    });
  };

  const handleCancel = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-rose-50/50 dark:from-slate-900 dark:via-amber-950/20 dark:to-rose-950/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl shadow-2xl">
              <Church className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-4">
            {t("signup.title")}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t("signup.subtitle")}
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Left Side - Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                    <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  {t("signup.spiritualBenefits")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-800 dark:text-white">
                    {t("signup.bibleLearning")}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t("signup.bibleLearningDesc")}
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-800 dark:text-white">
                    {t("signup.faithCommunity")}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t("signup.faithCommunityDesc")}
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-800 dark:text-white">
                    {t("signup.personalGrowth")}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t("signup.personalGrowthDesc")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-2xl rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold">
                    {t("signup.communitySupport")}
                  </h3>
                </div>
                <ul className="space-y-3 text-amber-100">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>{t("signup.prayerGroups")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>{t("signup.familyEvents")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>{t("signup.mentorshipPrograms")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>{t("signup.spiritualGuidance")}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                    <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  {t("signup.safeEnvironment")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t("signup.safeEnvironmentDesc")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Registration Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
              <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    {t("signup.studentRegistration")}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    onClick={handleCancel}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t("signup.backToLogin")}
                  </Button>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  {t("signup.registrationDesc")}
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <UserForm
                  mode="create"
                  onSave={handleSubmit}
                  onCancel={handleCancel}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
