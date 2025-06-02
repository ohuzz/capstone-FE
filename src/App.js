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
import DefaultNavbar from "./examples/Navbars/DefaultNavbar";

// Pages (폴더 단위로 index.js를 가져옵니다)
import Community from "./pages/Community";       // → pages/Community/index.js
import WritePost from "./pages/WritePost";       // → pages/WritePost/index.js
import PostDetail from "./pages/PostDetail";     // → pages/PostDetail/index.js
import Login from "./pages/Login";               // pages/Login.js (변경 없음)
import Presentation from "./pages/Presentation"; // pages/Presentation.js (변경 없음)

// LandingPages 내부 컴포넌트
import Author from "./pages/LandingPages/Author";
import ContactUs from "./pages/LandingPages/ContactUs";

// Material Kit 2 React 의 동적 라우트
import routes from "./routes";
import footerRoutes from "./footer.routes";

// Helper: routes.js 에 정의된 객체를 기반으로 <Route> 생성
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

function AppContent() {
  const { pathname } = useLocation();

  // 페이지 전환 시 스크롤을 최상단으로
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // 내부 페이지용 Navbar / DefaultNavbar 구분
  const internalPaths = [
    "/community",
    "/login",
    "/writepost",
    "/posts",    // /posts/:postId 로 시작
    "/author",
  ];
  const useCustomNav = internalPaths.some((p) =>
    pathname.startsWith(p)
  );

  return (
    <>
      <main>
        <Routes>
          {/* 1) Custom App Routes */}
          {/* └─ Community 메인(목록) */}
          <Route path="/community" element={<Community />} />

          {/* └─ 글쓰기 페이지 */}
          {/*    → /community/write 혹은 /writepost 로도 연결할 수 있습니다. */}
          <Route path="/community/write" element={<WritePost />} />
          <Route path="/writepost" element={<WritePost />} />

          {/* └─ 게시글 상세보기 (/community/:postId 로도 가능) */}
          {/*    기존에 "/posts/:postId" 로 연결하셨는데, */}
          {/*    폴더 구조를 “PostDetail”로 바꿨으므로 여기를 PostDetail로 연결 */}
          <Route path="/community/:postId" element={<PostDetail />} />
          <Route path="/posts/:postId" element={<PostDetail />} />

          {/* └─ 로그인, Presentation 등 */}
          <Route path="/login" element={<Login />} />
          <Route path="/presentation" element={<Presentation />} />

          {/* LandingPages 예시 */}
          <Route path="/author" element={<Author />} />
          <Route path="/contact-us" element={<ContactUs />} />

          {/* 2) Material Kit 2 React 동적 라우트 */}
          {getRoutes(routes)}

          {/* 3) Catch-all: 그 외 모든 경로는 /presentation 으로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/presentation" replace />} />
        </Routes>
      </main>
    </>
  );
}

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
