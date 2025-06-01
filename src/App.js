import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Context & Theme
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./assets/theme";

// Navbar components
import Navbar from "./components/Navbar";
import DefaultNavbar from "./examples/Navbars/DefaultNavbar";

// Routes and pages
import routes from "./routes";
import Community from "./pages/Community";
import Login from "./pages/Login";
import WritePost from "./pages/WritePost";
import PostDetail from "./pages/PostDetail";
import Presentation from "./pages/Presentation";

// Helper to render dynamic Material Kit routes
function getRoutes(allRoutes) {
  return allRoutes.flatMap((route) => {
    if (route.collapse) return getRoutes(route.collapse);
    if (route.route && route.component) {
      return (
        <Route
          key={route.route}
          path={route.route}
          element={route.component}
        />
      );
    }
    return [];
  });
}

// Main application content inside Router
function AppContent() {
  const { pathname } = useLocation();

  // Reset scroll on route change
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Determine which navbar to show
  const internalPaths = [
    "/community",
    "/login",
    "/writepost",
    "/posts",
  ];
  const useCustomNav = internalPaths.some((p) => pathname.startsWith(p));

  return (
    <>
      {useCustomNav ? (
        <Navbar />
      ) : (
        <DefaultNavbar
          brand="modac"
          routes={routes}
          action={{ type: "internal", route: "/login", label: "로그인", color: "info" }}
          transparent
        />
      )}
      <main>
        <Routes>
          {/* Custom app routes */}
          <Route path="/community" element={<Community />} />
          <Route path="/login" element={<Login />} />
          <Route path="/writepost" element={<WritePost />} />
          <Route path="/wp_index" element={<WritePost />} />
          <Route path="/posts/:postId" element={<PostDetail />} />

          {/* Dynamic Material Kit routes */}
          {getRoutes(routes)}

          {/* Presentation page */}
          <Route path="/presentation" element={<Presentation />} />

          {/* Default fallback to home */}
          <Route path="*" element={<Navigate to="/presentation" replace />} />
        </Routes>
      </main>
    </>
  );
}

// Root App component wrapping providers and router
export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
