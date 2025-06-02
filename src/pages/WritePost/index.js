import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseAPI } from "../../apis/instance";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";

// Material Kit 2 React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

// Images
import bgImage from "assets/images/bg-about-us.jpg";

// CSS
import "../WritePost.css";

const categoryMap = {
  ALOPECIA_AREATA: "원형탈모",
  HAIR_TRANSPLANT: "모발이식",
  HAIR_MEDICINE: "탈모약",
  HOSPITAL_QUESTION: "병원질문",
  FREE_TALK: "자유수다",
};

function WritePost() {
  const navigate = useNavigate();

  // ——— form state 정의 ———
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [period, setPeriod] = useState("");
  const [amount, setAmount] = useState("");
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // 파일 첨부 후 미리보기 생성
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    const previewUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews(previewUrls);
  };

  // 언마운트 시, 또는 previews 변경 시 URL 해제
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  // 태그 입력 후 엔터키 누르면 태그 추가
  const handleTagKeyDown = (e) => {
    if (e.key !== "Enter") return;
    if (e.nativeEvent.isComposing) return;

    e.preventDefault();
    const val = tagInput.trim();
    if (!val) return;

    setTags((prev) => [...prev, val]);
    setTagInput("");
  };

  const removeTag = (idx) =>
    setTags((prev) => prev.filter((_, i) => i !== idx));

  // 별점 클릭
  const handleStarClick = (value) => setRating(value);

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert("약관에 동의하셔야 글 작성이 가능합니다.");
      return;
    }

    // multipart/form-data로 파일 + 데이터를 함께 전송
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("imageFiles", file);
    });
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("gender", gender);
    formData.append("surgeryProgress", period);
    formData.append("transplantCount", amount);
    formData.append("satisfactionScore", rating);
    tags.forEach((tag) => formData.append("hashtags", tag));

    // (디버깅용) formData 안에 잘 담겼는지 콘솔에 확인
    for (let [key, val] of formData.entries()) {
      console.log(key, val);
    }

    try {
      const response = await baseAPI.post(
        "/v2/community/posts",
        formData,
        {
          requiresAuth: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("게시글 작성 성공:", response.data);
      navigate("/community");
    } catch (error) {
      console.error("게시글 작성 실패:", error);
      alert("글 쓰기에 실패했습니다. 로그인 상태를 확인해주세요.");
    }
  };

  return (
    <>
      {/* 0. 네비게이션 */}
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

      {/* 2. 카드(틀) 안에 폼을 삽입 */}
      <Container maxWidth="md">
        <MKBox component="section" py={6}>
          <Card
            sx={{
              p: 3,
              boxShadow: ({ boxShadows: { xxl } }) => xxl,
              minHeight: "auto",
            }}
          >
            {/* ===== Form Simple 스타일 폼 시작 ===== */}
            <MKBox component="form" role="form" onSubmit={handleSubmit} autoComplete="off">
              <MKBox p={3}>
                <Grid container spacing={5}>
                  {/* 파일 업로드 */}
                  <Grid item xs={12}>
                    <MKTypography variant="h4">
                      파일첨부
                    </MKTypography>
                    <input
                      type="file"
                      name="imageFiles"
                      multiple
                      onChange={handleFileChange}
                      style={{ marginTop: 4 }}
                    />
                    <MKBox mt={2}>
                      {files.length > 0 ? (
                        files.map((f, i) => (
                          <MKTypography variant="caption" key={i} mr={1}>
                            {f.name}
                          </MKTypography>
                        ))
                      ) : (
                        <MKTypography variant="caption" color="text">
                          첨부된 파일 없음
                        </MKTypography>
                      )}
                    </MKBox>
                  </Grid>

                  {/* 선택한 이미지 미리보기 */}
                  {previews.length > 0 && (
                    <Grid item xs={12}>
                      <MKBox
                        sx={{
                          display: "flex",
                          gap: 1,
                          overflowX: "auto",
                          py: 1,
                        }}
                      >
                        {previews.map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            alt={`preview-${i}`}
                            style={{
                              width: 250,
                              height: 250,
                              objectFit: "cover",
                              borderRadius: 4,
                            }}
                          />
                        ))}
                      </MKBox>
                    </Grid>
                  )}

                  {/* 카테고리 */}
                  <Grid item xs={12} sm={4}>
                    <MKInput
                      variant="standard"
                      select
                      fullWidth
                      sx={{
                        "& .MuiInputBase-input": { fontSize: "1.5rem", fontWeight: 650 }
                      }}
                      SelectProps={{ native: true }}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">카테고리</option>
                      {Object.entries(categoryMap).map(([key, label]) => (
                        <option value={key} key={key}>
                          {label}
                        </option>
                      ))}
                    </MKInput>
                  </Grid>

                  {/* 성별 */}
                  <Grid item xs={12} sm={4}>
                    <MKInput
                      variant="standard"
                      select
                      fullWidth
                      sx={{
                        "& .MuiInputBase-input": { fontSize: "1.5rem", fontWeight: 650 }
                      }}
                      SelectProps={{ native: true }}
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">성별</option>
                      <option value="MALE">남성</option>
                      <option value="FEMALE">여성</option>
                    </MKInput>
                  </Grid>

                  {/* 수술경과 */}
                  <Grid item xs={12} sm={4}>
                    <MKInput
                      variant="standard"
                      select
                      fullWidth
                      sx={{
                        "& .MuiInputBase-input": { fontSize: "1.5rem", fontWeight: 650 }
                      }}
                      SelectProps={{ native: true }}
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                    >
                      <option value="">수술경과</option>
                      <option value="ONE_WEEK">1주</option>
                      <option value="TWO_WEEKS">2주</option>
                      <option value="ONE_MONTH">1달</option>
                      <option value="THREE_MONTHS">3달</option>
                      <option value="SIX_MONTHS">6달</option>
                      <option value="ONE_YEAR">1년</option>
                    </MKInput>
                  </Grid>

                  {/* 모발이식량 */}
                 <Grid item xs={12} container spacing={2}>
                    {/* 모발이식량 */}
                    <Grid item xs={12} sm={6}>
                      <MKTypography variant="h4" fontWeight="bold">
                        모발이식량
                      </MKTypography>
                      <MKInput
                        variant="standard"
                        type="number"
                        fullWidth
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        sx={{
                          mt: 1,
                          "& .MuiInputBase-input": { fontSize: "1.5rem", fontWeight: 600 },
                          "& .MuiInput-underline:before": { borderBottomWidth: 1.5 },
                        }}
                        inputProps={{ style: { fontSize: "1.5rem", fontWeight: 600 } }}
                      />
                    </Grid>

                    {/* 만족도 (별점) */}
                    <Grid item xs={12} sm={6}>
                      <MKTypography variant="h4" fontWeight="bold">
                        만족도
                      </MKTypography>
                      <MKBox sx={{ display: "flex", gap: 1, mt: 1 }}>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <MKTypography
                            key={n}
                            variant="h4"
                            component="span"
                            sx={{
                              cursor: "pointer",
                              color: n <= rating ? "#FFC107" : "#e0e0e0",
                            }}
                            onClick={() => handleStarClick(n)}
                          >
                            ★
                          </MKTypography>
                        ))}
                      </MKBox>
                    </Grid>
                  </Grid>

                  {/* 제목 */}
                  <Grid item xs={12}>
                    <MKTypography variant="h4" fontWeight="bold">
                        제목
                      </MKTypography>
                    <MKInput
                      fullWidth
                      sx={{
                          mt: 1,
                          "& .MuiInputBase-input": { fontSize: "1.2rem", fontWeight: 600 },
                          "& .MuiInput-underline:before": { borderBottomWidth: 1.5 },
                        }}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Grid>

                  {/* 내용 */}
                  <Grid item xs={12}>
                    <MKTypography variant="h4" fontWeight="bold">
                      내용
                    </MKTypography>
                    <MKInput
                      variant="standard"
                      multiline
                      fullWidth
                      sx={{
                          mt: 1,
                          "& .MuiInputBase-input": { fontSize: "1.1rem", fontWeight: 600 },
                          "& .MuiInput-underline:before": { borderBottomWidth: 1.5 },
                        }}
                      rows={6}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </Grid>

                  {/* 태그 입력 */}
                  <Grid item xs={12}>
                    <MKTypography variant="h4" fontWeight="bold">
                      태그를 입력해주세요 (Enter → 자동생성)
                    </MKTypography>
                    <MKInput
                      variant="standard"
                      sx={{
                          mt: 1,
                          "& .MuiInputBase-input": { fontSize: "1.2rem", fontWeight: 600 },
                          "& .MuiInput-underline:before": { borderBottomWidth: 1.5 },
                        }}
                      fullWidth
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                    />
                    <MKBox sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {tags.map((t, i) => (
                        <MKTypography
                          key={i}
                          variant="caption"
                          sx={{
                            px: 1,
                            py: 0.25,
                            bgcolor: "#f0f0f0",
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {t}
                          <MKButton
                            size="small"
                            variant="text"
                            sx={{ ml: 0.5, minWidth: 0 }}
                            onClick={() => removeTag(i)}
                          >
                            ×
                          </MKButton>
                        </MKTypography>
                      ))}
                    </MKBox>
                  </Grid>

                  {/* 제출 버튼 */}
                  <Grid item xs={12}>
                    <MKButton type="submit" variant="gradient" color="dark" fullWidth>
                      작성완료
                    </MKButton>
                  </Grid>
                </Grid>
              </MKBox>
            </MKBox>
          </Card>
        </MKBox>
      </Container>

      {/* 3. 푸터 */}
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default WritePost;
