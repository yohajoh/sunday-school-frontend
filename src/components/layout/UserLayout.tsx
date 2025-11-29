// import React from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { useTheme } from "@/contexts/ThemeContext";
// import { Button } from "@/components/ui/button";
// import {
//   Home,
//   User,
//   Bell,
//   LogOut,
//   Menu,
//   Sun,
//   Moon,
//   Church,
//   ImageIcon,
//   X,
// } from "lucide-react";
// import { useNavigate, useLocation, Outlet } from "react-router-dom";
// import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

// export const UserLayout: React.FC = () => {
//   const { user, logout } = useAuth();
//   const { t } = useLanguage();
//   const { theme, toggleTheme } = useTheme();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [sidebarOpen, setSidebarOpen] = React.useState(false);

//   const navigation = [
//     { name: t("nav.dashboard"), href: "/", icon: Home },
//     { name: t("nav.whatsNew"), href: "/whats-new", icon: Bell },
//     { name: "Gallery", href: "/gallery", icon: ImageIcon },
//     { name: t("nav.profile"), href: "/profile", icon: User },
//   ];

//   const isActive = (path: string) => {
//     if (path === "/") return location.pathname === "/";
//     return location.pathname.startsWith(path);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-gray-950">
//       {/* Mobile sidebar backdrop */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`
//         fixed inset-y-0 left-0 z-50 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl
//         border-r border-slate-200/50 dark:border-slate-800/50 shadow-2xl
//         transform transition-transform duration-300 ease-in-out
//         ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
//         lg:w-64
//       `}
//       >
//         <div className="flex flex-col h-full">
//           {/* Header with close button for mobile */}
//           <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 lg:p-6">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl shadow-lg">
//                 <Church className="h-6 w-6 text-white" />
//               </div>
//               <div className="hidden lg:block">
//                 <h1 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
//                   Sunday School
//                 </h1>
//                 <p className="text-xs text-slate-600 dark:text-slate-400">
//                   {t("nav.userPortal")}
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={() => setSidebarOpen(false)}
//               className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
//             >
//               <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
//             </button>
//           </div>

//           {/* User Info */}
//           <div className="p-4 border-b border-slate-200 dark:border-slate-700 lg:p-6">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm lg:text-lg shadow-lg">
//                 {user?.firstName?.[0]}
//                 {user?.middleName?.[0]}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="font-semibold text-slate-800 dark:text-white truncate text-sm lg:text-base">
//                   {user?.firstName} {user?.middleName}
//                 </p>
//                 <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
//                   {user?.studentId}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
//             {navigation.map((item) => {
//               const Icon = item.icon;
//               const active = isActive(item.href);
//               return (
//                 <button
//                   key={item.name}
//                   onClick={() => {
//                     navigate(item.href);
//                     setSidebarOpen(false);
//                   }}
//                   className={`
//                     w-full flex items-center gap-3 px-3 py-3 lg:px-4 rounded-2xl text-left transition-all duration-300 text-sm lg:text-base
//                     ${
//                       active
//                         ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg"
//                         : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
//                     }
//                   `}
//                 >
//                   <Icon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
//                   <span className="font-medium truncate">{item.name}</span>
//                 </button>
//               );
//             })}
//           </nav>

//           {/* Footer Actions - Only Logout remains in sidebar */}
//           <div className="p-4 border-t border-slate-200 dark:border-slate-700">
//             <Button
//               variant="outline"
//               onClick={logout}
//               className="w-full border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-sm"
//             >
//               <LogOut className="h-4 w-4 mr-2" />
//               {t("auth.logout")}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="lg:ml-64 min-h-screen flex flex-col">
//         {/* Top header */}
//         <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-30 flex-shrink-0">
//           <div className="flex items-center justify-between p-4">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => setSidebarOpen(true)}
//                 className="lg:hidden p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
//               >
//                 <Menu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
//               </button>
//               <h1 className="text-xl font-bold text-slate-800 dark:text-white truncate">
//                 {navigation.find((item) => isActive(item.href))?.name ||
//                   "Dashboard"}
//               </h1>
//             </div>

//             <div className="flex items-center gap-3">
//               {/* Church Info */}
//               <div className="hidden xs:flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
//                 <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
//                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-32">
//                   {user?.church}
//                 </span>
//               </div>

//               {/* Language Switcher */}
//               <LanguageSwitcher />

//               {/* Theme Toggle */}
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={toggleTheme}
//                 className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl min-w-0 p-2"
//               >
//                 {theme === "dark" ? (
//                   <Sun className="h-4 w-4" />
//                 ) : (
//                   <Moon className="h-4 w-4" />
//                 )}
//                 <span className="sr-only lg:not-sr-only lg:ml-2 lg:inline">
//                   {theme === "dark" ? "Light" : "Dark"}
//                 </span>
//               </Button>

//               {/* User Avatar for header (mobile) */}
//               <div className="lg:hidden flex items-center gap-2">
//                 <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
//                   {user?.firstName?.[0]}
//                   {user?.middleName?.[0]}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Page content - Use Outlet for nested routes */}
//         <main className="flex-1 overflow-auto">
//           <div className="p-3 lg:p-6">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

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
  PanelLeftClose,
  PanelLeftOpen,
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
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const navigation = [
    { name: t("nav.dashboard"), href: "/", icon: Home },
    { name: t("nav.whatsNew"), href: "/whats-new", icon: Bell },
    { name: "Gallery", href: "/gallery", icon: ImageIcon },
    { name: t("nav.profile"), href: "/profile", icon: User },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
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
        fixed inset-y-0 left-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl 
        border-r border-gray-200/60 dark:border-gray-800/60 shadow-2xl
        transform transition-all duration-300 ease-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${sidebarCollapsed ? "w-16" : "w-64"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header with close button for mobile */}
          <div
            className={`flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 ${
              sidebarCollapsed ? "flex-col gap-4 py-6" : ""
            }`}
          >
            <div
              className={`flex items-center gap-3 ${
                sidebarCollapsed ? "flex-col" : ""
              }`}
            >
              <div className="p-2 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-800 dark:to-gray-600 rounded-xl shadow-lg ring-1 ring-gray-900/10 dark:ring-gray-100/10">
                <Church className="h-5 w-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="font-sans">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Sunday School
                  </h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {t("nav.userPortal")}
                  </p>
                </div>
              )}
            </div>
            {/* Close button - Mobile only */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* User Info */}
          {!sidebarCollapsed && (
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-600 dark:from-gray-700 dark:to-gray-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-lg ring-1 ring-gray-900/10 dark:ring-gray-100/10">
                    {user?.firstName?.[0]}
                    {user?.middleName?.[0]}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900 shadow-sm"></div>
                </div>
                <div className="flex-1 min-w-0 font-sans">
                  <p className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                    {user?.firstName} {user?.middleName}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {user?.studentId}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
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
                    group w-full flex items-center rounded-xl text-left transition-all duration-300
                    ${
                      active
                        ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg ring-1 ring-gray-900/20 dark:ring-gray-100/20"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white hover:shadow-md"
                    }
                    ${
                      sidebarCollapsed
                        ? "justify-center p-3"
                        : "justify-start px-3 py-3 gap-3"
                    }
                  `}
                >
                  <div
                    className={`
                    transition-all duration-300
                    ${
                      active
                        ? "text-white"
                        : "text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                    }
                  `}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  {!sidebarCollapsed && (
                    <span className="font-medium text-base font-sans">
                      {item.name}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
            {/* Language Switcher - Mobile visible in sidebar */}
            {/* <div className="sm:hidden">
              <LanguageSwitcher variant="full" />
            </div> */}

            {/* Logout Button */}
            {!sidebarCollapsed && (
              <Button
                variant="outline"
                onClick={logout}
                className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 rounded-xl py-2.5 text-sm font-medium transition-all duration-300 font-sans"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t("auth.logout")}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`min-h-screen flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        {/* Top header */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border-b border-gray-200/60 dark:border-gray-800/60 sticky top-0 z-30 flex-shrink-0 shadow-sm">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Menu className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>

              {/* Collapse Toggle - Desktop only */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
              >
                {sidebarCollapsed ? (
                  <PanelLeftOpen className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                ) : (
                  <PanelLeftClose className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                )}
              </button>

              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white font-sans">
                  {navigation.find((item) => isActive(item.href))?.name ||
                    "Dashboard"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Church Info */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-emerald-200 dark:ring-emerald-900"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-32 truncate font-sans">
                  {user?.church}
                </span>
              </div>

              {/* Language Switcher - Desktop only */}
              <div className="hidden sm:block">
                <LanguageSwitcher variant="full" />
              </div>

              <div className="sm:hidden">
                <LanguageSwitcher variant="full" />
              </div>

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl p-2 transition-all duration-300 hover:scale-105"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {/* User Avatar for header (mobile) */}
              <div className="lg:hidden flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-600 rounded-xl flex items-center justify-center text-white font-semibold text-xs shadow-lg">
                  {user?.firstName?.[0]}
                  {user?.middleName?.[0]}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content - Use Outlet for nested routes */}
        <main className="flex-1 overflow-auto">
          <div className="p-3">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
