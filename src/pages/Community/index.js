import React, { useState, useEffect, useCallback } from "react";
import { baseAPI } from "../../apis/instance";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import MKPagination from "components/MKPagination";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

// Images
import bgImage from "assets/images/bg-about-us.jpg";

// CSS
import "../Community.css";
import "./CommonTable.css"

// 카테고리
const categoryMap = {
  ALOPECIA_AREATA: "원형탈모",
  HAIR_TRANSPLANT: "모발이식",
  HAIR_MEDICINE: "탈모약",
  HOSPITAL_QUESTION: "병원질문",
  FREE_TALK: "자유수다",
};

// 성별
const genderMap = {
  MALE: "남자",
  FEMALE: "여자",
};


// 모발이식량
const transplantMap = {
  1000: { label: "1000모", goe: 1000, loe: 2000 },
  2000: { label: "2000모", goe: 2000, loe: 3000 },
  3000: { label: "3000모", goe: 3000, loe: 4000 },
  4000: { label: "4000모", goe: 4000, loe: 5000 },
};

const transplantOptions = Object.entries(transplantMap).map(
  ([value, { label }]) => ({ value, label })
);
// —————————————————————————————————————————————————

function Community() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") ?? "0", 10);
  const initialCategory = searchParams.get("category") ?? "";
  const initialGender = searchParams.get("gender") ?? "";
  const initialTransplantCount = searchParams.get("transplantCount") ?? "";
  const initialSort = searchParams.get("sort") ?? "createdDate,desc";

  // ── 드롭다운 anchor 관리 (카테고리, 성별, 모량)
  const [catAnchor, setCatAnchor] = useState(null);
  const [genderAnchor, setGenderAnchor] = useState(null);
  const [amountAnchor, setAmountAnchor] = useState(null);
  const openCat = ({ currentTarget }) => setCatAnchor(currentTarget);
  const closeCat = () => setCatAnchor(null);
  const openGender = ({ currentTarget }) => setGenderAnchor(currentTarget);
  const closeGender = () => setGenderAnchor(null);
  const openAmount = ({ currentTarget }) => setAmountAnchor(currentTarget);
  const closeAmount = () => setAmountAnchor(null);

  // ── 아이콘 회전 스타일 (드롭다운 화살표 애니메이션)
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

  // ── 상태 정의
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(initialCategory);
  const [gender, setGender] = useState(initialGender); 
  const [transplantCount, setTransplantCount] = useState(initialTransplantCount);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [allPosts, setAllPosts] = useState([]); 
  const [pageSize, setPageSize] = useState(10);

  const [sort, setSort] = useState(initialSort);
  const activeTab = sort === "likesCount,desc" ? 1 : 0;

  // ── 탭 변경 시: 정렬 기준(sort)만 바꾸고 페이지 넘버는 0으로 초기화
  const handleTabChange = (e, v) => {
    setSort(v === 0 ? "createdDate,desc" : "likesCount,desc");
    setPage(0);
  };

  // ── 글 목록을 서버에서 가져오는 함수 (페이징, 필터, 정렬 모두 API에 위임)
  const fetchPosts = useCallback(async () => {
    try {
      // 1) 필터·페이징·정렬 파라미터 준비
      const params = {
        ...(category && { category: categoryMap[category] }),
        ...(gender   && { gender:   genderMap[gender]   }),
        page,
        size: pageSize,
        sort,
      };
  
      if (transplantCount) {
        const base = Number(transplantCount);
        params.goe = base;
        params.loe = base + 1000;
      }
  
      // 2) 서버 호출
      const res = await baseAPI.get("/community/posts", { params });
      const content = res.data.result?.content || [];
      const total = res.data.result?.totalPages || 1;
  
      // 3) 화면용 데이터 매핑
      const data = content.map((p) => ({
        postId:  p.postId,
        category: categoryMap[p.category] || p.category,
        title:    p.title,
        username: p.username,
        date:     p.date,
        likes:    p.likes,
      }));
  
      // 4) 상태 업데이트
      setPosts(data);
      setTotalPages(total);
  
    } catch (err) {
      console.error("게시글 목록 불러오기 실패", err);
    }
  }, [category, gender, transplantCount, page, sort, pageSize]);
  
  
  // allPosts가 바뀌거나 page가 바뀔 때마다
  useEffect(() => {
    const start = page * pageSize;
    const slice = allPosts.slice(start, start + pageSize);
    setPosts(slice);
  }, [allPosts, page, pageSize]);




  // ── 컴포넌트 마운트 혹은 의존값 변경 시 글 목록 재요청
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const params= { page: String(page) };
    if (category)         params.category       = category;
    if (gender)           params.gender         = gender;
    if (transplantCount)  params.transplantCount = transplantCount;
    if (sort)             params.sort           = sort;
    setSearchParams(params);
  }, [page, category, gender, transplantCount, sort, setSearchParams]);

  const handleSearch = () => {
    setPage(0);
    fetchPosts();
  };

  return (
    <>
      {/* ── 네비게이션 */}
      <DefaultNavbar
        routes={routes}
        action={{
          type: "external",
          route: "/authentication/sign-in",
          label: "로그인",
          color: "default",
        }}
        transparent
        light
      />

      {/* ── 배너 */}
      <MKBox
        minHeight="50vh"
        width="100%"
        sx={{
          backgroundImage: ({
            functions: { linearGradient, rgba },
            palette: { gradients },
          }) =>
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${bgImage})`,
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
            <MKTypography variant="h1" color="white">
              Community
            </MKTypography>
            <MKTypography
              variant="body1"
              color="white"
              opacity={0.8}
              mt={1}
              mb={3}
            >
              서로의 정보를 공유하고 원하는 정보를 찾아보세요!
            </MKTypography>
          </Grid>
        </Container>
      </MKBox>

      {/* ── Community 영역을 빈 카드 틀 안에 삽입 ── */}
      <Card
        sx={{
          p: 8,
          mx: { xs: 2, lg: 3 },
          mt: -8,
          mb: 4,
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
          minHeight: "auto",
          display: "block",
        }}
      >
        {/* ===== 필터 드롭다운 버튼 그룹 ===== */}
        <MKButton
          variant="outlined"
          onClick={openCat}
          sx={{
            color: "rgba(0,0,0,0.87)",
            borderColor: "rgba(0,0,0,0.54)",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.04)",
              borderColor: "rgba(0,0,0,0.87)",
            },
          }}
        >
          {/* 현재 선택된 category 값에 매핑된 라벨을 보여주거나, 선택 안 됐으면 “카테고리” */}
          {category ? categoryMap[category] : "카테고리"}
        </MKButton>
        <Menu
          anchorEl={catAnchor}
          open={Boolean(catAnchor)}
          onClose={closeCat}
          PaperProps={{ sx: { color: "rgba(0,0,0,0.87)" } }}
        >
          <MenuItem onClick={() => { setCategory(""); closeCat(); }} sx={{ color: "rgba(0,0,0,0.87)" }}>
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
            color: "rgba(0,0,0,0.87)",
            borderColor: "rgba(0,0,0,0.54)",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.04)",
              borderColor: "rgba(0,0,0,0.87)",
            },
          }}
        >
          {/* 현재 선택된 category 값에 매핑된 라벨을 보여주거나, 선택 안 됐으면 “카테고리” */}
          {gender ? genderMap[gender] : "성별"}
        </MKButton>
        <Menu
          anchorEl={genderAnchor}
          open={Boolean(genderAnchor)}
          onClose={closeGender}
          PaperProps={{ sx: { color: "rgba(0,0,0,0.87)" } }}
        >
          <MenuItem onClick={() => { setGender(""); closeGender(); }} sx={{ color: "rgba(0,0,0,0.87)" }}>
            전체
          </MenuItem>
          {Object.entries(genderMap).map(([key, label]) => (
            <MenuItem
              key={key}
              onClick={() => { setGender(key); closeGender(); }}
              sx={{ color: "rgba(0,0,0,0.87)" }}
            >
              {label}
            </MenuItem>
          ))}
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
            },
          }}
        >
          {/* 현재 선택된 transplantCount 값에 매핑된 label을 보여주거나, 선택 안 됐으면 “모발이식량” */}
          {transplantOptions.find(o => o.value === transplantCount)?.label || "모발이식량"}
        </MKButton>
        <Menu
          anchorEl={amountAnchor}
          open={Boolean(amountAnchor)}
          onClose={closeAmount}
          PaperProps={{ sx: { color: "rgba(0,0,0,0.87)" } }}
        >
        <MenuItem
          onClick={() => { setTransplantCount(""); closeAmount(); }}
          sx={{ color: "rgba(0,0,0,0.87)" }}
        >
        전체
        </MenuItem>
          {transplantOptions.map(({ value, label }) => (
            <MenuItem
              key={value}
              onClick={() => { setTransplantCount(value); closeAmount(); }}
              sx={{ color: "rgba(0,0,0,0.87)" }}
            >
              {label}
            </MenuItem>
          ))}
        </Menu>

        <MKButton variant="gradient" color="info" sx={{ ml: 2 }} onClick={handleSearch}>
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

        {/* ── 게시글 목록 테이블 ── */}
        <div style={{ marginTop: 24, width: "100%" }}>
        <table className="common-table">
          <thead>
            <tr>
              <th style={{ width: "5%" }}>번호</th>
              <th style={{ width: "15%" }}>카테고리</th>
              <th style={{ width: "45%", textAlign: "left" }}>제목</th>
              <th style={{ width: "15%" }}>작성자</th>
              <th style={{ width: "10%" }}>작성일</th>
              <th style={{ width: "10%" }}>좋아요</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  게시글이 없습니다.
                </td>
              </tr>
            ) : (
              posts.map((post, idx) => (
                <tr
                  key={post.postId}
                  onClick={() =>
                    navigate(
                      {
                        pathname: `/community/${post.postId}`,
                        search: location.search,
                      },
                      {
                      state: { date: post.date },
                    })
                  }
                >
                  <td style={{ width: "10%" }}>{idx + 1}</td>
                  <td style={{ width: "20%" }}>{post.category}</td>
                  <td style={{ width: "20%", textAlign: "left" }}>
                    <Link
                      to={{pathname: `/community/${post.postId}`,
                      search: location.search,
                      }}
                      state={{ date: post.date }}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td style={{ width: "15%" }}>{post.username}</td>
                  <td style={{ width: "20%" }}>
                    {new Date(post.date).toLocaleDateString()}
                  </td>
                  <td style={{ width: "15%" }}>{post.likes}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>




        {/* ── 페이징 네비게이터 ── */}
        <Container sx={{ mt: 4 }}>
          <Grid container justifyContent="center">
            <MKPagination>
              <MKPagination
                item
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
              >
                <ChevronLeftIcon />
              </MKPagination>
              {[...Array(totalPages)].map((_, i) => (
                <MKPagination key={i} item active={i === page} onClick={() => setPage(i)}>
                  {i + 1}
                </MKPagination>
              ))}
              <MKPagination
                item
                disabled={page + 1 === totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              >
                <ChevronRightIcon />
              </MKPagination>
            </MKPagination>
          </Grid>
        </Container>

        {/* ── 글쓰기 버튼 ── */}
        <div className="write-post-btn">
          <Link to="/community/write">
            <button>글쓰기</button>
          </Link>
        </div>
      </Card>

      {/* ── 푸터 ── */}
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default Community;