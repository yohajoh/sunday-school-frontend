import React, { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/shared/PostCard";
import {
  Users,
  Package,
  FileText,
  TrendingUp,
  Calendar,
  Sparkles,
  Zap,
  Home,
  MessageSquare,
  Heart,
  Share2,
  Bell,
  Church,
  Target,
  Award,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoading } from "@/components/ui/loading-placeholders";

export const UserDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { posts, assets } = useApp();
  const navigate = useNavigate();
  const { user } = useAuth();
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

  // Get user-specific data
  const userPosts = posts.filter(
    (post) =>
      post.status === "published" &&
      (post.targetAudience === "all" || post.targetAudience === "students")
  );

  const recentPosts = userPosts.slice(0, 3);
  const userAssets = assets.filter((asset) => asset.assignedTo === user?._id);

  const stats = [
    {
      title: t("userDashboard.myClasses"),
      value: "3",
      icon: Users,
      trend: "+1",
      color: "text-blue-600",
      description: t("userDashboard.activeEnrollments"),
    },
    {
      title: t("userDashboard.assignedAssets"),
      value: userAssets.length.toString(),
      icon: Package,
      trend: "+2",
      color: "text-emerald-600",
      description: t("userDashboard.resourcesAssigned"),
    },
    {
      title: t("userDashboard.attendance"),
      value: "95%",
      icon: TrendingUp,
      trend: "+5%",
      color: "text-amber-600",
      description: t("userDashboard.thisMonth"),
    },
    {
      title: t("userDashboard.activities"),
      value: "24",
      icon: Target,
      trend: "+8",
      color: "text-purple-600",
      description: t("userDashboard.completedThisYear"),
    },
  ];

  const quickActions = [
    {
      title: t("userDashboard.viewAnnouncements"),
      description: t("userDashboard.checkLatestNews"),
      icon: Bell,
      color: "from-blue-500 to-cyan-500",
      action: () => navigate("/whats-new"),
    },
    {
      title: t("userDashboard.updateProfile"),
      description: t("userDashboard.keepInformationCurrent"),
      icon: Users,
      color: "from-emerald-500 to-green-500",
      action: () => navigate("/profile"),
    },
    {
      title: t("userDashboard.myResources"),
      description: t("userDashboard.viewAssignedBooks"),
      icon: Package,
      color: "from-amber-500 to-orange-500",
      action: () => navigate("/resources"),
    },
    {
      title: t("userDashboard.classSchedule"),
      description: t("userDashboard.viewTimetable"),
      icon: Calendar,
      color: "from-purple-500 to-pink-500",
      action: () => navigate("/schedule"),
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: t("userDashboard.bibleStudySession"),
      date: "2024-02-15",
      time: "10:00 AM",
      location: t("userDashboard.mainHall"),
      type: "class",
    },
    {
      id: 2,
      title: t("userDashboard.youthFellowship"),
      date: "2024-02-17",
      time: "2:00 PM",
      location: t("userDashboard.youthCenter"),
      type: "event",
    },
    {
      id: 3,
      title: t("userDashboard.sundayService"),
      date: "2024-02-18",
      time: "9:00 AM",
      location: t("userDashboard.mainChurch"),
      type: "service",
    },
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case "class":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "event":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "service":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getEventTypeText = (type: string) => {
    switch (type) {
      case "class":
        return t("userDashboard.class");
      case "event":
        return t("userDashboard.event");
      case "service":
        return t("userDashboard.service");
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6 sm:p-6">
      {/* Premium Header Section */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800 via-blue-900 to-emerald-900 p-6 sm:p-8 text-white border border-blue-500/20">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-400/30">
                  <Home className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-200 to-emerald-200 bg-clip-text text-transparent">
                    {t("userDashboard.welcomeBack")} {user?.firstName}
                  </h1>
                  <p className="text-blue-100 text-sm sm:text-lg mt-2">
                    {t("userDashboard.welcomeMessage")}
                  </p>
                </div>
              </div>

              {/* User Stats Row */}
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/20 min-w-0 flex-1 sm:flex-none">
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                  <div className="min-w-0">
                    <p className="text-lg sm:text-2xl font-bold truncate">
                      Level 3
                    </p>
                    <p className="text-xs text-blue-200 truncate">
                      {t("userDashboard.currentGrade")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/20 min-w-0 flex-1 sm:flex-none">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
                  <div className="min-w-0">
                    <p className="text-lg sm:text-2xl font-bold truncate">12</p>
                    <p className="text-xs text-emerald-200 truncate">
                      {t("userDashboard.streakDays")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/20 min-w-0 flex-1 sm:flex-none">
                  <Church className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400" />
                  <div className="min-w-0">
                    <p className="text-lg sm:text-2xl font-bold truncate">
                      {user?.church}
                    </p>
                    <p className="text-xs text-amber-200 truncate">
                      {t("userDashboard.yourChurch")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Avatar */}
            <div className="flex-shrink-0 self-center sm:self-auto">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-white/20 shadow-2xl">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-emerald-500 text-white text-xl sm:text-2xl font-bold">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-xl hover:shadow-2xl transition-all duration-500 group rounded-2xl sm:rounded-3xl cursor-pointer min-w-0"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-4 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 truncate">
                {stat.title}
              </CardTitle>
              <div
                className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
              >
                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-2 truncate">
                {stat.value}
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`text-xs sm:text-sm font-semibold ${stat.color} truncate`}
                >
                  {stat.trend}
                </span>
                <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                  {stat.description}
                </span>
              </div>
            </CardContent>

            {/* Animated Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-1000"
                style={{ width: "85%" }}
              ></div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-0 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700 p-4 sm:p-6">
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white text-lg sm:text-xl">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                {t("userDashboard.quickActions")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {quickActions.map((action, index) => (
                  <button
                    key={action.title}
                    onClick={action.action}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 group hover:shadow-lg w-full text-left min-w-0"
                  >
                    <div
                      className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r ${action.color} shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                    >
                      <action.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {action.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">
                        {action.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="border-0 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700 p-4 sm:p-6">
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white text-lg sm:text-xl">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                {t("userDashboard.upcomingEvents")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 group min-w-0"
                  >
                    <div className="flex-shrink-0 text-center p-2 sm:p-3 bg-slate-100 dark:bg-slate-600 rounded-lg sm:rounded-xl">
                      <div className="font-bold text-slate-800 dark:text-white text-base sm:text-lg">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 uppercase">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                        })}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-800 dark:text-white text-sm mb-1 truncate">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 flex-wrap">
                        <span>{event.time}</span>
                        <span>•</span>
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                    <Badge
                      className={`text-xs ${getEventColor(
                        event.type
                      )} flex-shrink-0`}
                    >
                      {getEventTypeText(event.type)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Posts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Announcements */}
          <Card className="border-0 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700 p-4 sm:p-6">
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white text-lg sm:text-xl">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                {t("userDashboard.recentAnnouncements")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {recentPosts.length > 0 ? (
                  recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 group cursor-pointer min-w-0"
                      onClick={() => navigate("/whats-new")}
                    >
                      <div className="flex-shrink-0 p-2 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-2 truncate">
                          {post.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-2 sm:gap-4 text-xs text-slate-500 dark:text-slate-500 flex-wrap">
                          <span className="truncate">By {post.author}</span>
                          <span>•</span>
                          <span className="truncate">
                            {new Date(post.publishDate).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            <span>{post.likes.length}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>{post.comments.length}</span>
                          </div>
                        </div>
                      </div>
                      {post.isPinned && (
                        <Badge className="bg-amber-500 text-white border-0 flex-shrink-0 text-xs">
                          Pinned
                        </Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-slate-400 dark:text-slate-600 mx-auto mb-3 sm:mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                      {t("userDashboard.noAnnouncements")}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500 mt-1">
                      {t("userDashboard.checkBackLater")}
                    </p>
                  </div>
                )}
              </div>

              {recentPosts.length > 0 && (
                <div className="mt-4 sm:mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/whats-new")}
                    className="w-full border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-sm sm:text-base"
                  >
                    {t("userDashboard.viewAllAnnouncements")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card className="border-0 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700 p-4 sm:p-6">
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white text-lg sm:text-xl">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                {t("userDashboard.learningProgress")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                {/* Current Level */}
                <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-600">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base truncate">
                      {t("userDashboard.currentLevel")}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">
                      {t("userDashboard.gradeIntermediate")}
                    </p>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs sm:text-sm flex-shrink-0">
                    {t("userDashboard.level")} 3
                  </Badge>
                </div>

                {/* Progress Bars */}
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-2">
                      <span>{t("userDashboard.bibleKnowledge")}</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-2">
                      <span>{t("userDashboard.prayerWorship")}</span>
                      <span>78%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: "78%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-2">
                      <span>{t("userDashboard.churchHistory")}</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  <div className="text-center p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:rounded-xl border border-blue-200 dark:border-blue-800">
                    <Award className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400 mx-auto mb-1 sm:mb-2" />
                    <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                      5
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">
                      {t("userDashboard.badges")}
                    </div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg sm:rounded-xl border border-green-200 dark:border-green-800">
                    <Target className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400 mx-auto mb-1 sm:mb-2" />
                    <div className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
                      12
                    </div>
                    <div className="text-xs text-green-700 dark:text-green-300">
                      {t("userDashboard.goalsMet")}
                    </div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg sm:rounded-xl border border-purple-200 dark:border-purple-800">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400 mx-auto mb-1 sm:mb-2" />
                    <div className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
                      45
                    </div>
                    <div className="text-xs text-purple-700 dark:text-purple-300">
                      {t("userDashboard.sessions")}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
