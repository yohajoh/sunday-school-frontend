import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Church,
  X,
  User,
  ImageIcon,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed,
  onToggle,
  isMobile = false,
  onClose,
}) => {
  const { t } = useLanguage();
  const { currentUser } = useApp();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      to: "/admin/dashboard",
      icon: LayoutDashboard,
      label: t("nav.dashboard"),
      adminOnly: false,
    },
    {
      to: "/admin/users",
      icon: Users,
      label: t("nav.users"),
      adminOnly: true,
    },
    {
      to: "/admin/assets",
      icon: Package,
      label: t("nav.assets"),
      adminOnly: true,
    },
    {
      to: "/admin/posts",
      icon: FileText,
      label: t("nav.posts"),
      adminOnly: true,
    },
    {
      to: "/admin/gallery",
      icon: ImageIcon, // Make sure to import ImageIcon from lucide-react
      label: "Gallery",
      adminOnly: true,
    },
    {
      to: "/admin/profile",
      icon: User,
      label: t("nav.profile"),
      adminOnly: false,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const isActiveLink = (path: string) => {
    if (path === "/admin/dashboard") {
      return (
        location.pathname === "/admin/dashboard" ||
        location.pathname === "/admin"
      );
    }
    return location.pathname.startsWith(path);
  };

  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || currentUser?.role === "admin"
  );

  return (
    <aside
      className={cn(
        "flex flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out shadow-xl z-20 h-full",
        isMobile ? "w-full" : collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
        {(!collapsed || isMobile) && (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl shadow-lg">
              <Church className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-slate-800 dark:text-white text-lg leading-tight">
                Sunday School
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Admin Portal
              </p>
            </div>
          </div>
        )}
        {collapsed && !isMobile && (
          <div className="p-2 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl shadow-lg mx-auto">
            <Church className="h-6 w-6 text-white" />
          </div>
        )}

        {/* Close button for mobile, toggle for desktop */}
        {isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 hover:bg-white dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 shadow-sm rounded-xl"
          >
            <X className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 hover:bg-white dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 shadow-sm rounded-xl"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            )}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredNavItems.map((item) => {
          const isActive = isActiveLink(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={(e) => {
                if (isMobile) {
                  e.preventDefault();
                  handleNavigation(item.to);
                }
              }}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 border-2 group relative",
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 shadow-lg"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white hover:shadow-md"
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-lg transition-all duration-200 shadow-sm",
                  isActive
                    ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 shadow-md"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-300 group-hover:shadow-md"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
              </div>
              {(!collapsed || isMobile) && (
                <span className="text-sm font-medium transition-all duration-200">
                  {item.label}
                </span>
              )}
              {isActive && (!collapsed || isMobile) && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-sm" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start gap-3 text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 border border-transparent hover:border-red-200 dark:hover:border-red-800 hover:shadow-md transition-all duration-200",
            collapsed && !isMobile && "justify-center"
          )}
        >
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 group-hover:bg-red-100 dark:group-hover:bg-red-800 group-hover:text-red-600 dark:group-hover:text-red-300 shadow-sm group-hover:shadow-md transition-all duration-200">
            <LogOut className="h-4 w-4 flex-shrink-0" />
          </div>
          {(!collapsed || isMobile) && (
            <span className="text-sm font-medium">Logout</span>
          )}
        </Button>

        {(!collapsed || isMobile) && (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 mt-3">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Sunday School v1.0
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
