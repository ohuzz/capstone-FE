import React, { useState } from "react";
import { Box, Button, Typography, Grid, Card, CardContent, CardMedia } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";

export default function Test() {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom textAlign="center">
        모발이식 예측 시뮬레이터
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {/* 업로드 카드 */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                얼굴 이미지 업로드
              </Typography>
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                component="label"
              >
                이미지 선택
                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
              </Button>
              {image && (
                <CardMedia
                  component="img"
                  height="300"
                  image={image}
                  sx={{ mt: 2, borderRadius: 2 }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* 결과 카드 */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                예측 결과
              </Typography>
              {image ? (
                <>
                  <Typography>원본 이미지 기반 모발 시뮬레이션 결과</Typography>
                  {/* 결과 이미지나 텍스트로 결과 보여주기 */}
                  <Box mt={2} height={300} bgcolor="#f0f0f0" borderRadius={2} display="flex" alignItems="center" justifyContent="center">
                    <Typography>예측 이미지 영역</Typography>
                  </Box>
                </>
              ) : (
                <Typography color="text.secondary">이미지를 먼저 업로드해주세요.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
