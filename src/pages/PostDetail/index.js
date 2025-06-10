import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLoaderData, useLocation, useSearchParams } from "react-router-dom";
import { baseAPI } from "../../apis/instance";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Slide from "@mui/material/Slide";
import Divider from "@mui/material/Divider";

// @mui icons
import CloseIcon from "@mui/icons-material/Close";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// 네비게이션 컴포넌트
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

// 배경 이미지
import bgImage from "assets/images/bg-about-us.jpg";

import MKButton from "components/MKButton";

// CSS
import "../PostDetail.css";

function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [commentText, setNewComment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const uploadBase = process.env.REACT_APP_BASE_URL || "http://localhost:8080";
  const location = useLocation();
  const [searchParams] = useSearchParams();
  // 상세 정보 + 댓글 + 해시태그 + 이미지 조회
  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await baseAPI.get(`/community/posts/${postId}`);
        console.log("▶️ detail response:", res.data.result);
        setPost(res.data.result);
        setShowModal(true);
      } catch (err) {
        console.error("상세 조회 실패", err);
      }
    }
    fetchDetail();
  }, [postId]);


  // 모달 닫기 → Community 목록으로 돌아가기
  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => {
      navigate(`/community${location.search}`);
    }, 300);
  };

  // 좋아요
  const handleLike = async () => {
    try {
      const res = await baseAPI.post(
        `/community/${postId}/like`,
        {},
        { requiresAuth: true }
      );
      setPost((prev) => ({
        ...prev,
        likeCount: res.data.result.likeCount,
      }));
    } catch (err) {
      console.error("좋아요 실패", err);
    }
  };

  // 댓글 등록
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await baseAPI.post(
        `/community/${postId}/comment`,
        { content: commentText },
        { requiresAuth: true }
      );
      setPost((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), res.data.result],
      }));
      setNewComment("");
    } catch (err) {
      console.error("댓글 등록 실패", err);
    }
  };

  if (!post) {
    return <div className="post-detail">로딩 중…</div>;
  }

  const listDate = location.state?.date;
  const displayDate = post.date ?? post.createdDate ?? post.createdAt ?? listDate;


  return (
    <>
      {/* 0. 네비게이션 (상단바) */}
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

      {/* 1. 배너 (배경 + 텍스트) */}
      <MKBox
        minHeight="45vh"
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
          </Grid>
        </Container>
      </MKBox>

      {/* 2. 모달처럼 슬라이드 애니메이션을 주는 카드 */}
      <Modal
        open={showModal}
        onClose={handleClose}
        sx={{ display: "grid", placeItems: "center" }}
      >
        <Slide direction="down" in={showModal} timeout={300}>
          <MKBox
            position="relative"
            width={{ xs: "90%", sm: "800px" }}
            maxHeight="90vh"
            display="flex"
            flexDirection="column"
            borderRadius="xl"
            bgColor="white"
            shadow="xl"
            sx={{ overflowY: "auto" }}
          >
            {/* ── 모달 헤더 (타이틀 + 닫기 버튼) ── */}
            <MKBox
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={3}
            >
              <MKBox>
                <MKTypography variant="h2" fontWeight="bold">
                  {post.title}
                </MKTypography>
                <MKTypography
                  variant="body2"
                  color="text"
                  sx={{ mt: 0.5 }}
                >
                  {displayDate
                   ? new Date(displayDate).toLocaleString()
                   : ""}
                </MKTypography>
              </MKBox>

              <CloseIcon
                fontSize="medium"
                sx={{ cursor: "pointer" }}
                onClick={handleClose}
              />
            </MKBox>

            <Divider sx={{ my: 0 }} />

            <MKBox 
             component="section"
             px={2} 
             py={1} 
             sx={{ 
               display: "flex", 
               flexDirection: "column", 
               gap: 2, 
               width: "100%" 
             }}
           >

            {/* ── 모달 바디: 실제 게시글 컨텐츠 ── */}
              {/* 2-2. 메타 정보 (카테고리, 성별, 경과, 이식량, 만족도) */}
              <MKBox
                display="flex"
                flexWrap="wrap"
                gap={1}
                mb={2}
              >
                <MKTypography
                  variant="button"
                  fontWeight="medium"
                  sx={{ bgcolor: "#f5f5f5", px: 1, py: 0.5, borderRadius: 1 }}
                >
                  카테고리: {post.category}
                </MKTypography>
                <MKTypography
                  variant="button"
                  fontWeight="medium"
                  sx={{ bgcolor: "#f5f5f5", px: 1, py: 0.5, borderRadius: 1 }}
                >
                  성별: {post.gender}
                </MKTypography>
                <MKTypography
                  variant="button"
                  fontWeight="medium"
                  sx={{ bgcolor: "#f5f5f5", px: 1, py: 0.5, borderRadius: 1 }}
                >
                  경과: {post.sergeryProgress}
                </MKTypography>
                <MKTypography
                  variant="button"
                  fontWeight="medium"
                  sx={{ bgcolor: "#f5f5f5", px: 1, py: 0.5, borderRadius: 1 }}
                >
                  이식량: {post.transplantAmount}모
                </MKTypography>
                <MKBox
                  display="flex"
                  alignItems="center"
                  sx={{
                    bgcolor: "#f5f5f5",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  <MKTypography variant="button" fontWeight="medium">
                    만족도:&nbsp;
                  </MKTypography>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <MKTypography
                      key={n}
                      variant="body2"
                      component="span"
                      sx={{
                        color:
                          n <= post.satisfactionLevel ? "#FFC107" : "#e0e0e0",
                        fontSize: "1.25rem",
                        lineHeight: 1,
                      }}
                    >
                      ★
                    </MKTypography>
                  ))}
                </MKBox>
              </MKBox>

              {/* 2-3. 본문 + 이미지 */}
              <MKBox mb={6}>
                {post.content.split("\n").map((line, idx) => (
                  <MKTypography 
                    key={idx} 
                    variant="body1" 
                    sx={{ mb: 1, whiteSpace: "pre-wrap" }}
                  >
                    {line}
                  </MKTypography>
                ))}

                {/* fileNames (fallback) */}
                {(post.fileNames || []).map((filename, idx) => (
                  <img
                    key={`fileName-${idx}`}
                    src={`${uploadBase}/uploads/${filename}`}
                    alt={filename}
                    style={{
                      width: "100%",
                      maxWidth: 350,
                      marginTop: 8,
                      borderRadius: 4,
                    }}
                  />
                ))}

                {/* postImages */}
                {(post.postImages || []).map((img, idx) => (
                  <img
                    key={`postImage-${idx}`}
                    src={`${uploadBase}/uploads/${img.uuidFilename}`}
                    alt={img.originalFilename}
                    style={{
                      width: "100%",
                      maxWidth: 400,
                      marginTop: 8,
                      borderRadius: 4,
                    }}
                  />
                ))}
              </MKBox>

              {/* 2-4. 좋아요 버튼 */}
              <MKBox mb={1}>
                <MKButton
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={handleLike}
                  sx={{ fontWeight: 600 }}
                >
                  ❤️ 좋아요 {post.likeCount}
                </MKButton>
              </MKBox>

              <Divider sx={{ my: 0.5 }} />

              {/* 2-5. 해시태그 */}
              {post.hashTags?.length > 0 && (
                <MKBox mb={1} display="flex" gap={1} flexWrap="wrap">
                  {post.hashTags.map((tag) => (
                    <MKTypography
                      key={tag}
                      variant="caption"
                      sx={{
                        bgcolor: "#e0f7fa",
                        color: "#00796b",
                        px: 2,
                        py: 1,
                        fontSize: "1.1rem",
                        borderRadius: 1,
                        fontWeight: 600,
                      }}
                    >
                      #{tag}
                    </MKTypography>
                  ))}
                </MKBox>
              )}

              <Divider sx={{ my: 0.5 }} />

              {/* 2-6. 댓글 섹션 */}
              <MKBox>
                <MKTypography variant="h6" fontWeight="bold" mb={1}>
                  댓글 ({post.comments?.length || 0})
                </MKTypography>
                <MKBox>
                  {post.comments?.map((c, idx) => (
                    <MKBox
                      key={idx}
                      display="flex"
                      alignItems="flex-start"
                      mb={2}
                    >
                      {/* 댓글 작성자 아바타(첫 글자) */}
                      <MKBox
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: "#cfd8dc",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 1,
                          fontWeight: 600,
                          color: "#455a64",
                        }}
                      >
                        {c.username.charAt(0).toUpperCase()}
                      </MKBox>
                      <MKBox>
                        <MKBox display="flex" alignItems="center" gap={1}>
                          <MKTypography
                            variant="subtitle2"
                            fontWeight="bold"
                          >
                            {c.username}
                          </MKTypography>
                          <MKTypography
                            variant="caption"
                            color="text"
                          >
                            {new Date(
                              c.createdDate || c.createdAt
                            ).toLocaleString()}
                          </MKTypography>
                        </MKBox>
                        <MKTypography variant="body2"
                        sx={{
                          fontSize: "1rem",
                          fontWeight: 400,
                        }}>
                          {c.content}
                        </MKTypography>
                      </MKBox>
                    </MKBox>
                  ))}
                </MKBox>

                {/* 댓글 입력 폼 */}
                <MKBox
                  component="form"
                  onSubmit={handleCommentSubmit}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  mt={2}
                >
                  <MKBox flexGrow={1}>
                    <MKTypography
                      component="input"
                      type="text"
                      placeholder="댓글을 입력하세요"
                      value={commentText}
                      onChange={(e) => setNewComment(e.target.value)}
                      sx={{
                        width: "100%",
                        border: "1px solid #b0bec5",
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        fontSize: "1rem",
                      }}
                    />
                  </MKBox>
                  <MKButton type="submit" variant="gradient" color="info">
                    등록
                  </MKButton>
                </MKBox>
              </MKBox>
              </MKBox>
            </MKBox>
        </Slide>
      </Modal>

      {/* 3. 푸터 */}
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default PostDetail;