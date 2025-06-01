/*
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================
...
*/

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";


// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

// Images
import bgImage from "assets/images/bg-about-us.jpg";

// 드롭다운 - 검색창
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MKButton from "components/MKButton";

// tabs - 정렬
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";

// @mui material components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";


// === Community 로직에 필요한 import ===
import React, { useState, useEffect, useCallback } from "react";
import { baseAPI } from "../../../apis/instance"; // 경로 확인
import { Link, useNavigate } from "react-router-dom";
import "../../Community.css";
import MKPagination from "components/MKPagination";
import { MarginOutlined } from "@mui/icons-material";

// =======================================

const categoryMap = {
  ALOPECIA_AREATA: "원형탈모",
  HAIR_TRANSPLANT: "모발이식",
  HAIR_MEDICINE: "탈모약",
  HOSPITAL_QUESTION: "병원질문",
  FREE_TALK: "자유수다",
};

function AboutUs() {
  // 필터용 드롭다운 anchor
  const [catAnchor, setCatAnchor] = useState(null);
  const [genderAnchor, setGenderAnchor] = useState(null);
  const [amountAnchor, setAmountAnchor] = useState(null);

  const openCat = ({ currentTarget }) => setCatAnchor(currentTarget);
  const closeCat = () => setCatAnchor(null);
  const openGender = ({ currentTarget }) => setGenderAnchor(currentTarget);
  const closeGender = () => setGenderAnchor(null);

  const openAmount = ({ currentTarget }) => setAmountAnchor(currentTarget);
  const closeAmount = () => setAmountAnchor(null);


  // === icon rotate 스타일 ===
  const iconStyles = {
    ml: 1,
    fontWeight: "bold",
    transition: "transform 200ms ease-in-out",
  };
  const catIconStyles = {
    transform: catAnchor ? "rotate(180deg)" : "rotate(0)",
    ...iconStyles,
  };
  const genderIconStyles = {
    transform: genderAnchor ? "rotate(180deg)" : "rotate(0)",
    ...iconStyles,
  };
  const amountIconStyles = {
    transform: amountAnchor ? "rotate(180deg)" : "rotate(0)",
    ...iconStyles,
  };
  
  // === Community 훅 & 로직 시작 ===
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [transplantCount, setTransplantCount] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("createdDate.desc");
  const activeTab = sort === "likesCount.desc" ? 1 : 0;

  const handleTabChange = (event, newValue) => {
    setSort(newValue === 0 ? "createdDate.desc" : "likesCount.desc");
    setPage(0);
  };

  const fetchPosts = useCallback(async () => {
    try {
      const params = {
        category: category || undefined,
        gender: gender || undefined,
        page,
        order: sort,
      };
      if (transplantCount) {
        const base = Number(transplantCount);
        params.goe = base;
        params.loe = base + 1000;
      }
      const res = await baseAPI.get("/community/posts", { params });
      let data = (res.data.result?.content || []).map((p) => ({
        postId: p.postId,
        category: categoryMap[p.category] || p.category,
        title: p.title,
        username: p.username,
        date: p.date,
        likes: p.likes,
      }));
      if (sort === "likesCount.desc") {
        data.sort((a, b) => b.likes - a.likes);
      } else {
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
      setPosts(data);
      setTotalPages(res.data.result?.totalPages ?? 1);
    } catch (err) {
      console.error("게시글 목록 불러오기 실패", err);
    }
  }, [category, gender, transplantCount, page, sort]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = () => setPage(0);
  // === Community 로직 끝 ===

  return (
    <>
      {/* 네비게이션 */}
      <DefaultNavbar
        routes={routes}
        action={{
          type: "external",
          route: "https://www.creative-tim.com/product/material-kit-react",
          label: "sign-in",
          color: "default",
        }}
        transparent
        light
      />

      {/* 배너 */}
      <MKBox
        minHeight="50vh"
        width="100%"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(rgba(gradients.dark.main, 0.6), rgba(gradients.dark.state, 0.6))}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Container>
          <Grid
            container
            item
            xs={12}
            lg={8}
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            sx={{ mx: "auto", textAlign: "center" }}
          >
            <MKTypography variant="h1" color="white">Community</MKTypography>
            <MKTypography variant="body1" color="white" opacity={0.8} mt={1} mb={3}>
              서로의 정보를 공유하고 원하는 정보를 찾아보세요!
            </MKTypography>
          </Grid>
        </Container>
      </MKBox>

      {/* Community 영역을 빈 카드 틀 안에 삽입 */}
      <Card
        sx={{
          p: 8,
          mx: { xs: 2, lg: 3 },
          mt: -8,
          mb: 4,
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
          minHeight: "auto",
          display: "block",
        }}>

        {/* ===== 필터 드롭다운 버튼 그룹 ===== */}
        <MKButton 
          variant="outlined" 
          onClick={openCat}
          sx={{
            color: "rgba(0,0,0,0.87)",       // 텍스트 색
            borderColor: "rgba(0,0,0,0.54)", // 테두리 색
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.04)",
              borderColor: "rgba(0,0,0,0.87)",
            }
          }}
          >
            {category ? categoryMap[category] : "카테고리"}
          </MKButton>
          <Menu 
            anchorEl={catAnchor} 
            open={Boolean(catAnchor)} 
            onClose={closeCat}
            PaperProps={{
              sx: { color: "rgba(39, 129, 39, 0.1)" } // 메뉴 안 글씨 색
            }}
          >
            <MenuItem 
            onClick={() => { setCategory(""); closeCat(); }}
            sx={{ color: "rgba(0,0,0,0.87)" }}   // 개별 아이템 색
            >
              전체
            </MenuItem>
            {Object.entries(categoryMap).map(([key, label]) => (
              <MenuItem 
                key={key} 
                onClick={() => { setCategory(key); closeCat(); }}
                sx={{ color: "rgba(0,0,0,0.87)" }}
              >
              {label}
            </MenuItem>
          ))}
        </Menu>

        <MKButton 
          variant="outlined" 
          onClick={openGender} 
          sx={{ 
            ml: 2,
            color: "rgba(0,0,0,0.87)",        // 버튼 텍스트 색
            borderColor: "rgba(0,0,0,0.54)",  // 버튼 테두리 색
            "&:hover": {
            backgroundColor: "rgba(0,0,0,0.04)",
            borderColor: "rgba(0,0,0,0.87)",
          }
        }}
      >
        {gender || "성별"}
        </MKButton>

        <Menu 
          anchorEl={genderAnchor} 
          open={Boolean(genderAnchor)} 
          onClose={closeGender}
          PaperProps={{
            sx: { color: "rgba(0,0,0,0.87)" }  // 메뉴 전체 글씨 색
          }}
          >
          <MenuItem 
            onClick={() => { setGender(""); closeGender(); }}
            sx={{ color: "rgba(0,0,0,0.87)" }}
          >
            전체
          </MenuItem>
          <MenuItem 
            onClick={() => { setGender("남성"); closeGender(); }}
            sx={{ color: "rgba(0,0,0,0.87)" }}
          >
            남성
          </MenuItem>
          <MenuItem 
            onClick={() => { setGender("여성"); closeGender(); }}
            sx={{ color: "rgba(0,0,0,0.87)" }}
          >
            여성
          </MenuItem>
        </Menu>

        <MKButton
          variant="outlined" 
          onClick={openAmount} 
          sx={{ 
            ml: 2,
            color: "rgba(0,0,0,0.87)",
            borderColor: "rgba(0,0,0,0.54)",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.04)",
              borderColor: "rgba(0,0,0,0.87)",
            }
          }}
        >
          {transplantCount ? `${transplantCount}모` : "모발이식량"}
        </MKButton>

        <Menu 
          anchorEl={amountAnchor} 
          open={Boolean(amountAnchor)} 
          onClose={closeAmount}
          PaperProps={{
            sx: { color: "rgba(0,0,0,0.87)" }
          }}
        >
          <MenuItem 
            onClick={() => { setTransplantCount(""); closeAmount(); }}
            sx={{ color: "rgba(0,0,0,0.87)" }}
          >
            전체
          </MenuItem>
          {[1000,2000,3000,4000].map(n => (
            <MenuItem 
              key={n} 
              onClick={() => { setTransplantCount(String(n)); closeAmount(); }}
              sx={{ color: "rgba(0,0,0,0.87)" }}
            >
              {n}모
            </MenuItem>
          ))}
        </Menu>

        <MKButton
          variant="gradient"
          color="info"
          sx={{ ml: 2 }}
          onClick={handleSearch}
        >
          검색
        </MKButton>
        {/* ===== 정렬용 Tabs ===== */}
        <Grid container justifyContent="flex-end" sx={{ mt: 2, pl: 2 }}>
          <Grid item xs={12} lg={2}>
            <AppBar position="static" color="transparent" elevation={0}>
              <Tabs
              value={activeTab}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              centered
              >
                <Tab label="최신순" />
                <Tab label="추천순" />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>

        {/* 게시글 목록 */}
        <MKBox sx={{ mt: 3, width: "100%" }}>
          <Table
            sx={{
              width: "100%", // 카드 내 전체 너비 사용
            }}
          >
            <TableHead>
            <TableRow>
              <TableCell sx={{ width: "5%" }}>
                번호
                </TableCell>
                <TableCell sx={{ width: "15%" }}>
                  카테고리
                  </TableCell>
                  <TableCell sx={{ width: "45%" }}>
                    제목
                    </TableCell>
                    <TableCell sx={{ width: "15%" }}>
                      작성자
                      </TableCell>
                      <TableCell sx={{ width: "10%" }}>
                        작성일
                        </TableCell>
                        <TableCell sx={{ width: "10%" }}>
                          좋아요
                          </TableCell>
                          </TableRow>
                          </TableHead>
                          <TableBody>
                            {posts.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={6} align="center">
                                  게시글이 없습니다.
                                  </TableCell>
                                  </TableRow>
                                  ) : (
                                    posts.map((post, idx) => (
                                    <TableRow
                                    key={post.postId}
                                    hover
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => navigate(`/posts/${post.postId}`)}
                                    >
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>
                      <Link to={`/posts/${post.postId}`}>{post.title}</Link>
                    </TableCell>
                    <TableCell>{post.username}</TableCell>
                    <TableCell>
                      {new Date(post.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{post.likes}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </MKBox>


        {/* 페이징 네비게이터 */}
        <Container sx={{ mt: 4 }}>
          <Grid container justifyContent="center">
            <MKPagination>
              {/* 이전 화살표 */}
              <MKPagination
                item
                disables={page === 0}
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
              >
                <Icon>keyboard_arrow_left</Icon>
              </MKPagination>

              {/* 페이지 번호 */}
              {[...Array(totalPages)].map((_, i) => (
                <MKPagination
                  item
                  key={i}
                  active={i === page}
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </MKPagination>
              ))}

              {/* 다음 화살표 */}
              <MKPagination
              item
              disabled={page + 1 === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              >
              <Icon>keyboard_arrow_right</Icon>
              </MKPagination>
              </MKPagination>
            </Grid>
          </Container>

        {/* 글쓰기 버튼 */}
        <div className="write-post-btn">
            <Link to="/author">
              <button>글쓰기</button>
            </Link>
        </div>
      </Card>

      {/* 푸터 */}
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default AboutUs;
