import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Auth Pages
import { Login } from "@/pages/auth/Login";
import { Signup } from "@/pages/auth/Signup";

// Admin Pages
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { Users } from "@/pages/admin/Users";
import { Assets } from "@/pages/admin/Assets";
import { Posts } from "@/pages/admin/Posts";

// User Pages
import { UserDashboard } from "@/pages/user/Dashboard";
import { Profile } from "@/pages/user/Profile";
import { WhatsNew } from "@/pages/user/WhatsNew";

// Shared Pages
import { NotFound } from "@/pages/shared/NotFound";

// Layout Components
import { AdminLayout } from "@/components/layout/AdminLayout";
import { UserLayout } from "@/components/layout/UserLayout";

// Toast component
import { Toaster } from "sonner";
import { UserForm } from "./components/forms/UserForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppProvider>
          <LanguageProvider>
            <AuthProvider>
              <Router>
                <div className="App">
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      className:
                        "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 text-slate-800 dark:text-white",
                    }}
                  />
                  <Routes>
                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="users" element={<Users />} />
                      <Route path="users/new" element={<UserForm />} />
                      <Route path="assets" element={<Assets />} />
                      <Route path="posts" element={<Posts />} />
                      <Route path="profile" element={<Profile />} />
                    </Route>

                    {/* User Routes */}
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <UserLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<UserDashboard />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="whats-new" element={<WhatsNew />} />
                    </Route>

                    {/* Fallback Routes */}
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
                </div>
              </Router>
            </AuthProvider>
          </LanguageProvider>
        </AppProvider>
      </ThemeProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
