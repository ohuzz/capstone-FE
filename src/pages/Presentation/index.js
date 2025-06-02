// src/pages/Presentation/index.js

import React from "react";
import { Link } from "react-router-dom";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Presentation page sections (필요 없으면 지워도 됩니다)
import Counters from "pages/Presentation/sections/Counters";
import Information from "pages/Presentation/sections/Information";
import DesignBlocks from "pages/Presentation/sections/DesignBlocks";
import Pages from "pages/Presentation/sections/Pages";
import Testimonials from "pages/Presentation/sections/Testimonials";
import Download from "pages/Presentation/sections/Download";

// Presentation page components (필요 없으면 지워도 됩니다)
import BuiltByDevelopers from "pages/Presentation/components/BuiltByDevelopers";

// Routes
import routes from "../../routes";
import footerRoutes from "../../footer.routes";

// Images
import bgImage from "assets/images/mainimg.jpg";

// Context
import { useAuth } from "context/AuthContext";

function Presentation() {
  const { isLoggedIn } = useAuth();
  return (
    <>
      <DefaultNavbar
        routes={routes}
        action={{
          type: "internal",
          route: "/authentication/sign-in",
          label: !isLoggedIn ? "sign-in" : "profile",
          color: "info",
        }}
        sticky
      />

      {/* ── 헤더 배너 영역 ── */}
      <MKBox
        minHeight="75vh"
        width="100%"
        sx={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Container>
          {/* 외부 Grid: container 속성으로 자식 아이템들을 중앙 정렬 */}
          <Grid container justifyContent="center">
            {/* 내부 Grid: xs=12, lg=7, textAlign="center"으로 텍스트 중앙 정렬 */}
            <Grid item xs={12} lg={7} sx={{ textAlign: "center" }}>
              <MKTypography
                variant="h1"
                // color="info"
                mt={-6}
                mb={1}
                sx={({ breakpoints, typography: { size } }) => ({
                  [breakpoints.down("md")]: {
                    fontSize: size["3xl"],
                  },
                })}
              >
                MODAC
              </MKTypography>

              <MKTypography
                variant="h4"
                component="p"
                // color="info"
                mt={1}
                sx={{
                  mx: { xs: 2, lg: 0 },
                }}
              >
                “모발 이식, 이젠 데이터를 믿으세요.”
              </MKTypography>

              <MKTypography
                variant="h6"
                component="p"
                // color="info"
                mt={2}
                sx={{
                  mx: { xs: 2, lg: 0 },
                }}
              >
                MODAC은 빅데이터 기반 예측 엔진과 사용자의 실제 후기를 결합한 탈모 커뮤니티입니다.  
                가상 시뮬레이션으로 나에게 딱 맞는 이식 계획을 세워보고,  
                수많은 시술 경험담을 통해 믿을 만한 정보를 찾아보세요.
              </MKTypography>
            </Grid>
          </Grid>
        </Container>
      </MKBox>

      {/* ── Card 영역 (AI 체험 + 추천 영상) ── */}
      <Card
        sx={{
          p: 2,
          mx: { xs: 2, lg: 3 },
          mt: -10,
          mb: 4,
          backgroundColor: ({ palette: { white }, functions: { rgba } }) =>
            rgba(white.main, 0.8),
          backdropFilter: "saturate(200%) blur(30px)",
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
        }}
      >
        {/* 1) AI 모발 이식 체험 섹션 */}
        <MKBox textAlign="center" py={4}>
          <MKTypography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            AI 모발 이식 체험
          </MKTypography>
          <MKTypography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
            AI 기반 시뮬레이션으로 시술 후 모습을 미리 확인해보세요.
          </MKTypography>
          <MKButton
            component={Link}
            to="/ai-predict"
            variant="gradient"
            color="info"
            size="large"
          >
            AI 체험하기
          </MKButton>
        </MKBox>

        {/* 2) 추천 유튜브 영상 섹션 */}
        <MKBox pt={4} pb={2}>
          <MKTypography variant="h5" sx={{ fontWeight: 700, textAlign: "center", mb: 3 }}>
            추천 영상
          </MKTypography>
          <Grid container spacing={2} justifyContent="center">
            {/* 첫 번째 영상 */}
            <Grid item xs={12} sm={6} md={4}>
              {/* Wrap in a flex column to center both image and text */}
              <MKBox sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <MKBox
                  component="a"
                  href="https://youtu.be/keekX8r5apQ?si=yuFXQ1G5wpMxt0o4"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textDecoration: "none", width: "60%" }}
                >
                  <MKBox
                    component="img"
                    src="https://img.youtube.com/vi/keekX8r5apQ/sddefault.jpg"
                    alt="모발 이식 과정"
                    sx={{
                      width: "100%",
                      borderRadius: 2,
                      boxShadow: ({ boxShadows: { md } }) => md,
                    }}
                  />
                </MKBox>
                <MKTypography variant="subtitle1" sx={{ mt: 1, textAlign: "center" }}>
                  모발 이식 과정
                </MKTypography>
              </MKBox>
            </Grid>

            {/* 두 번째 영상 */}
            <Grid item xs={12} sm={6} md={4}>
              <MKBox sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <MKBox
                  component="a"
                  href="https://youtu.be/kXl6KvbAzD4?si=N_k6tD-24OPjXUPr"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textDecoration: "none", width: "60%" }}
                >
                  <MKBox
                    component="img"
                    src="https://img.youtube.com/vi/kXl6KvbAzD4/sddefault.jpg"
                    alt="시술 전후 비교"
                    sx={{
                      width: "100%",
                      borderRadius: 2,
                      boxShadow: ({ boxShadows: { md } }) => md,
                    }}
                  />
                </MKBox>
                <MKTypography variant="subtitle1" sx={{ mt: 1, textAlign: "center" }}>
                  시술 전후 비교
                </MKTypography>
              </MKBox>
            </Grid>

            {/* 세 번째 영상 */}
            <Grid item xs={12} sm={6} md={4}>
              <MKBox sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <MKBox
                  component="a"
                  href="https://youtu.be/p-EjqCxNGXk?si=0y0SRkrO2q1huigc"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textDecoration: "none", width: "60%" }}
                >
                  <MKBox
                    component="img"
                    src="https://img.youtube.com/vi/p-EjqCxNGXk/sddefault.jpg"
                    alt="전문가 인터뷰"
                    sx={{
                      width: "100%",
                      borderRadius: 2,
                      boxShadow: ({ boxShadows: { md } }) => md,
                    }}
                  />
                </MKBox>
                <MKTypography variant="subtitle1" sx={{ mt: 1, textAlign: "center" }}>
                  전문가 인터뷰
                </MKTypography>
              </MKBox>
            </Grid>
          </Grid>
        </MKBox>
      </Card>

      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default Presentation;
