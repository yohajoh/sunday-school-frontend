import React from "react";
import { useApp } from "@/contexts/AppContext";
import { ProfileForm } from "@/components/forms/ProfileForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Shield, Crown, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const Profile: React.FC = () => {
  const { currentUser, updateUser } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  const handleSaveProfile = (updatedUser: any) => {
    updateUser(updatedUser.id, updatedUser);
  };

  const handleBack = () => {
    if (isAdminRoute) {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50/20 to-amber-50/30 dark:from-slate-900 dark:via-orange-950/10 dark:to-amber-950/5">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-amber-50/30 dark:from-slate-900 dark:via-orange-950/10 dark:to-amber-950/5 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Premium Header Section */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800 via-orange-900 to-amber-900 p-6 sm:p-8 text-white border border-orange-500/20 mb-6 sm:mb-8">
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <div className="p-2 sm:p-3 bg-orange-500/20 rounded-xl sm:rounded-2xl border border-orange-400/30 flex-shrink-0">
                    {isAdminRoute ? (
                      <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400" />
                    ) : (
                      <User className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <div>
                        <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-orange-200 to-amber-200 bg-clip-text text-transparent">
                          {t("profile.title")}
                        </h1>
                        <p className="text-orange-100 text-sm sm:text-lg mt-1 sm:mt-2">
                          {isAdminRoute
                            ? "Administrative Profile Management"
                            : t("profile.subtitle")}
                        </p>
                      </div>
                      <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 shadow-lg text-sm px-3 py-1">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {currentUser.role?.toUpperCase() || "USER"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex gap-3 sm:gap-6 mt-4 sm:mt-6">
                  <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
                    <Shield className="h-4 w-4 sm:h-6 sm:w-6 text-orange-400 flex-shrink-0" />
                    <div>
                      <p className="text-lg sm:text-2xl font-bold">
                        {isAdminRoute ? "Admin" : "Member"}
                      </p>
                      <p className="text-xs text-orange-200">Account Type</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
                    <User className="h-4 w-4 sm:h-6 sm:w-6 text-amber-400 flex-shrink-0" />
                    <div>
                      <p className="text-lg sm:text-2xl font-bold">
                        {currentUser.firstName} {currentUser.lastName}
                      </p>
                      <p className="text-xs text-amber-200">Profile</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tr from-amber-500/10 to-transparent rounded-full blur-3xl"></div>
        </div>

        {/* Navigation and Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-80 flex-shrink-0">
            <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="w-full justify-start gap-3 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all duration-300"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to {isAdminRoute ? "Dashboard" : "Home"}
                  </Button>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-800 dark:text-white text-sm uppercase tracking-wide flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-orange-500" />
                      Quick Actions
                    </h3>
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg text-sm"
                        onClick={() =>
                          document.getElementById("personal-tab")?.click()
                        }
                      >
                        Personal Info
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg text-sm"
                        onClick={() =>
                          document.getElementById("location-tab")?.click()
                        }
                      >
                        Location
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg text-sm"
                        onClick={() =>
                          document.getElementById("security-tab")?.click()
                        }
                      >
                        Security
                      </Button>
                    </div>
                  </div>

                  {/* Status Info */}
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Profile Status
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {isAdminRoute
                        ? "Administrative account with full system access"
                        : "Active member account"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-orange-900/10 dark:to-amber-900/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                      Profile Management
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Update your personal information and account settings
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {isAdminRoute ? "Admin Mode" : "User Mode"}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-0">
                <ProfileForm user={currentUser} onSave={handleSaveProfile} />
              </CardContent>
            </Card>

            {/* Additional Info Card */}
            <Card className="border-0 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 text-white shadow-2xl rounded-3xl overflow-hidden mt-6">
              <CardContent className="p-6 relative">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white/5 rounded-full translate-y-8 sm:translate-y-12 -translate-x-8 sm:-translate-x-12"></div>

                <div className="relative z-10">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Profile Completion
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-orange-100 text-sm">
                        Information Completeness
                      </span>
                      <span className="font-bold">85%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full transition-all duration-500"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                    <p className="text-orange-100 text-xs">
                      Complete your profile to unlock all features
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
