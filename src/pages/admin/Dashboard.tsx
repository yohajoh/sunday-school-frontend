import React, { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Package,
  FileText,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Eye,
  Download,
  Calendar,
  Sparkles,
  Zap,
  Shield,
  Home,
  UserPlus,
  Activity,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageLoading } from "@/components/ui/loading-placeholders";

export const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { userrs, assets, posts } = useApp();
  const navigate = useNavigate();
  // Demo loading state - shows loading for 5 seconds
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state
  if (isLoading) {
    return <PageLoading type="dashboard" />;
  }
  const stats = [
    {
      title: t("dashboard.totalUsers"),
      value: userrs.length.toString(),
      icon: Users,
      trend: "+12%",
      trendDirection: "up",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      iconBg: "bg-gradient-to-br from-emerald-500 to-green-500",
      description: t("dashboard.usersDescription"),
    },
    {
      title: t("dashboard.totalAssets"),
      value: assets.length.toString(),
      icon: Package,
      trend: "+5%",
      trendDirection: "up",
      color: "text-violet-600",
      bgColor: "bg-violet-50 dark:bg-violet-900/20",
      iconBg: "bg-gradient-to-br from-violet-500 to-purple-500",
      description: t("dashboard.assetsDescription"),
    },
    {
      title: t("dashboard.activePosts"),
      value: posts.filter((p) => p.status === "published").length.toString(),
      icon: FileText,
      trend: "+8%",
      trendDirection: "up",
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
      description: t("dashboard.postsDescription"),
    },
    {
      title: t("dashboard.engagement"),
      value: "87%",
      icon: TrendingUp,
      trend: "+3%",
      trendDirection: "up",
      color: "text-rose-600",
      bgColor: "bg-rose-50 dark:bg-rose-900/20",
      iconBg: "bg-gradient-to-br from-rose-500 to-pink-500",
      description: t("dashboard.engagementDescription"),
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: t("dashboard.newUserRegistered"),
      user: "John Doe",
      email: "john@church.org",
      time: t("dashboard.hoursAgo"),
      type: "user",
      icon: UserPlus,
      color: "text-emerald-600",
    },
    {
      id: 2,
      action: t("dashboard.assetUpdated"),
      user: "Admin",
      email: "admin@church.org",
      time: t("dashboard.hoursAgo"),
      type: "asset",
      icon: Package,
      color: "text-violet-600",
    },
    {
      id: 3,
      action: t("dashboard.newPostPublished"),
      user: "Admin",
      email: "admin@church.org",
      time: t("dashboard.daysAgo"),
      type: "post",
      icon: FileText,
      color: "text-amber-600",
    },
    {
      id: 4,
      action: t("dashboard.userProfileUpdated"),
      user: "Sarah Smith",
      email: "sarah@church.org",
      time: t("dashboard.daysAgo"),
      type: "user",
      icon: Users,
      color: "text-blue-600",
    },
  ];

  const getTrendIcon = (direction: string) => {
    return direction === "up" ? (
      <ArrowUp className="h-4 w-4 text-emerald-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-red-600" />
    );
  };

  const quickActions = [
    {
      title: t("dashboard.quickActions.addUser"),
      description: t("dashboard.quickActions.addUserDesc"),
      icon: UserPlus,
      color: "from-emerald-500 to-green-500",
      action: () => navigate("/admin/users/new"),
    },
    {
      title: t("dashboard.quickActions.manageAssets"),
      description: t("dashboard.quickActions.manageAssetsDesc"),
      icon: Package,
      color: "from-violet-500 to-purple-500",
      action: () => navigate("/admin/assets"),
    },
    {
      title: t("dashboard.quickActions.createPost"),
      description: t("dashboard.quickActions.createPostDesc"),
      icon: FileText,
      color: "from-amber-500 to-orange-500",
      action: () => navigate("/admin/posts/new"),
    },
    {
      title: t("dashboard.quickActions.viewReports"),
      description: t("dashboard.quickActions.viewReportsDesc"),
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      action: () => navigate("/admin/reports"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Premium Header Section */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800 via-emerald-900 to-violet-900 p-6 sm:p-8 text-white border border-emerald-500/20">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="p-2 sm:p-3 bg-emerald-500/20 rounded-xl sm:rounded-2xl border border-emerald-400/30 flex-shrink-0">
                  <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-200 to-violet-200 bg-clip-text text-transparent break-words">
                    {t("nav.dashboard")}
                  </h1>
                  <p className="text-emerald-100 text-sm sm:text-lg mt-1 sm:mt-2 break-words">
                    {t("dashboard.welcomeMessage")}
                  </p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="overflow-x-auto">
                <div className="flex gap-3 sm:gap-6 mt-4 sm:mt-6 min-w-max pb-2">
                  <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 min-w-0 flex-shrink-0">
                    <Shield className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-lg sm:text-2xl font-bold truncate">
                        {userrs.filter((u) => u.status === "active").length}
                      </p>
                      <p className="text-xs text-emerald-200 truncate">
                        {t("dashboard.activeUsers")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 min-w-0 flex-shrink-0">
                    <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-amber-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-lg sm:text-2xl font-bold truncate">
                        {posts.filter((p) => p.status === "published").length}
                      </p>
                      <p className="text-xs text-amber-200 truncate">
                        {t("dashboard.livePosts")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 min-w-0 flex-shrink-0">
                    <Home className="h-4 w-4 sm:h-6 sm:w-6 text-violet-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-lg sm:text-2xl font-bold truncate">
                        {assets.filter((a) => a.status === "available").length}
                      </p>
                      <p className="text-xs text-violet-200 truncate">
                        {t("dashboard.availableAssets")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tr from-violet-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl shadow-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500 dark:text-slate-400" />
            <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-xs sm:text-sm"
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">
              {t("dashboard.exportReport")}
            </span>
          </Button>
          <Button
            onClick={() => navigate("/admin/users")}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{t("dashboard.viewAll")}</span>
          </Button>
        </div>
      </div>

      {/* Premium Stats Grid */}
      <div className="overflow-x-auto">
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 min-w-max">
          {stats.map((stat, index) => (
            <Card
              key={stat.title}
              className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-500 group rounded-2xl sm:rounded-3xl cursor-pointer min-w-[280px] sm:min-w-0"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4 px-4 sm:px-6">
                <CardTitle className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 truncate">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${stat.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                >
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="text-xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  {getTrendIcon(stat.trendDirection)}
                  <span
                    className={`text-xs sm:text-sm font-semibold ${
                      stat.trendDirection === "up"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.trend}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {stat.description}
                  </span>
                </div>
              </CardContent>

              {/* Animated Progress Bar */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700">
                <div
                  className={`h-full bg-gradient-to-r ${
                    stat.trendDirection === "up"
                      ? "from-emerald-500 to-green-500"
                      : "from-red-500 to-orange-500"
                  } transition-all duration-1000`}
                  style={{ width: "75%" }}
                ></div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl"></div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Quick Actions */}
        <Card className="border-0 bg-white dark:bg-slate-800 shadow-lg sm:shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
          <CardHeader className="pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-slate-800 dark:text-white text-lg sm:text-2xl">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl">
                <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0">
                <div className="truncate">
                  {t("dashboard.quickActions.title")}
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-lg truncate">
                  {t("dashboard.quickActions.subtitle")}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {quickActions.map((action, index) => (
                <button
                  key={action.title}
                  onClick={action.action}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 group hover:shadow-lg w-full"
                >
                  <div
                    className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r ${action.color} shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                  >
                    <action.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h4 className="font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm sm:text-base truncate">
                      {action.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">
                      {action.description}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 bg-white dark:bg-slate-800 shadow-lg sm:shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
          <CardHeader className="pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-slate-800 dark:text-white text-lg sm:text-2xl">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl sm:rounded-2xl">
                <Activity className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0">
                <div className="truncate">{t("dashboard.recentActivity")}</div>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-lg truncate">
                  {t("dashboard.recentActivitySubtitle")}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 sm:gap-4 py-3 sm:py-5 px-4 sm:px-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-all duration-300 group"
                >
                  <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-700 shadow-lg flex-shrink-0">
                    <activity.icon
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${activity.color}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {activity.action}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                      {activity.user} • {activity.email}
                    </p>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {activity.time}
                    </span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium hidden sm:block">
                      {t("dashboard.viewDetails")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Overview */}
      <Card className="border-0 bg-white dark:bg-slate-800 shadow-lg sm:shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
        <CardHeader className="pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-slate-800 dark:text-white text-lg sm:text-2xl">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl sm:rounded-2xl">
              <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="truncate">{t("dashboard.systemOverview")}</div>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-lg truncate">
                {t("dashboard.systemOverviewSubtitle")}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 min-w-max">
              <div className="text-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-700/30 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-600 min-w-[200px]">
                <div className="text-xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1 sm:mb-2">
                  98%
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t("dashboard.systemUptime")}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t("dashboard.last30Days")}
                </div>
              </div>

              <div className="text-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-700/30 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-600 min-w-[200px]">
                <div className="text-xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2">
                  24/7
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t("dashboard.activeMonitoring")}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t("dashboard.realTimeUpdates")}
                </div>
              </div>

              <div className="text-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-700/30 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-600 min-w-[200px]">
                <div className="text-xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1 sm:mb-2">
                  99.9%
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t("dashboard.dataAccuracy")}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t("dashboard.verifiedInformation")}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
