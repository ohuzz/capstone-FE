// src/App.js
import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

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

// ★ Author 페이지 컴포넌트 import (경로를 실제 위치에 맞춰서 변경하세요)
import Author from "./pages/LandingPages/Author/index";
import ContactUs from "./pages/LandingPages/ContactUs/index"

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

  // 스크롤을 매 페이지 전환 시 최상단으로 초기화
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // 어떤 경로에서 커스텀 Navbar(=Sidebar 형) vs DefaultNavbar(=Landing 페이지 용)를 쓸지 결정
  // 내부 페이지라면 Navbar 컴포넌트, 아닌 경우 DefaultNavbar 노출
  const internalPaths = [
    "/community",
    "/login",
    "/writepost",
    "/wp_index",
    "/posts",     // /posts/:postId 도 /posts 로 시작하므로 포함
    "/author",    // ★ Author 페이지도 내부 네비게이션으로 간주(필요에 따라 빼도 됩니다)
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
          action={{
            type: "internal",
            route: "/login",
            label: "로그인",
            color: "info",
          }}
          transparent
        />
      )}

      <main>
        <Routes>
          {/* 1) Custom app routes */}
          <Route path="/community" element={<Community />} />
          <Route path="/login" element={<Login />} />
          <Route path="/writepost" element={<WritePost />} />
          <Route path="/wp_index" element={<WritePost />} />
          <Route path="/posts/:postId" element={<ContactUs />} />
          <Route path="/contact-us" element={<ContactUs />} />

          {/* ★ Author 페이지를 위한 새로운 Route */}
          <Route path="/author" element={<Author />} />

          {/* 2) 동적으로 생성된 Material Kit 2 React routes */}
          {getRoutes(routes)}

          {/* 3) Presentation 페이지 */}
          <Route path="/presentation" element={<Presentation />} />

          {/* 4) 그 외 모든 경로는 /presentation으로 Redirect */}
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
