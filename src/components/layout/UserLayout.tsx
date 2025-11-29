import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  Home,
  User,
  Bell,
  LogOut,
  Menu,
  Sun,
  Moon,
  Church,
  ImageIcon,
  X,
  ChevronRight,
  Settings,
} from "lucide-react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

export const UserLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigation = [
    { name: t("nav.dashboard"), href: "/", icon: Home },
    { name: t("nav.whatsNew"), href: "/whats-new", icon: Bell },
    { name: "Gallery", href: "/gallery", icon: ImageIcon },
    { name: t("nav.profile"), href: "/profile", icon: User },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl 
        border-r border-gray-200/60 dark:border-gray-800/60 shadow-2xl
        transform transition-all duration-500 ease-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        lg:w-80
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header with close button for mobile */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-800 dark:to-gray-600 rounded-2xl shadow-2xl ring-2 ring-gray-900/10 dark:ring-gray-100/10">
                <Church className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Sunday School
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {t("nav.userPortal")}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-gray-600 dark:from-gray-700 dark:to-gray-500 rounded-2xl flex items-center justify-center text-white font-semibold text-lg shadow-2xl ring-2 ring-gray-900/10 dark:ring-gray-100/10">
                  {user?.firstName?.[0]}
                  {user?.middleName?.[0]}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900 shadow-lg"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 dark:text-white truncate text-base">
                  {user?.firstName} {user?.middleName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium truncate">
                  {user?.studentId}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 truncate mt-1">
                  {user?.church}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    setSidebarOpen(false);
                  }}
                  className={`
                    group w-full flex items-center justify-between px-4 py-4 rounded-2xl text-left transition-all duration-500
                    ${
                      active
                        ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-2xl ring-2 ring-gray-900/20 dark:ring-gray-100/20"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white hover:shadow-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`
                      p-2 rounded-xl transition-all duration-500
                      ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                      }
                    `}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-base">{item.name}</span>
                  </div>
                  <ChevronRight
                    className={`
                    h-4 w-4 transition-all duration-500
                    ${
                      active
                        ? "text-white"
                        : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                    }
                    ${
                      active
                        ? "translate-x-0"
                        : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    }
                  `}
                  />
                </button>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-xl">
                <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Interface theme
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                )}
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={logout}
              className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 rounded-2xl py-4 font-semibold transition-all duration-300"
            >
              <LogOut className="h-5 w-5 mr-3" />
              {t("auth.logout")}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-80 min-h-screen flex flex-col">
        {/* Top header */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border-b border-gray-200/60 dark:border-gray-800/60 sticky top-0 z-30 flex-shrink-0 shadow-sm">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105"
              >
                <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {navigation.find((item) => isActive(item.href))?.name ||
                    "Dashboard"}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">
                  Welcome back, {user?.firstName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Church Info */}
              <div className="hidden md:flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-emerald-200 dark:ring-emerald-900"></div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 max-w-40 truncate">
                  {user?.church}
                </span>
              </div>

              {/* Language Switcher */}
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl px-4 py-3 font-semibold transition-all duration-300 hover:scale-105"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <span className="ml-2 hidden lg:inline">
                  {theme === "dark" ? "Light" : "Dark"}
                </span>
              </Button>

              {/* User Avatar for header (mobile) */}
              <div className="lg:hidden flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-600 rounded-2xl flex items-center justify-center text-white font-semibold text-base shadow-lg">
                  {user?.firstName?.[0]}
                  {user?.middleName?.[0]}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content - Use Outlet for nested routes */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
