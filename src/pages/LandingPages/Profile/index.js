/**
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";
import { PropTypes } from "prop-types";

// react-router-dom components
// import { Link } from "react-router-dom";

// @mui material components
import { Card, CardContent, CardHeader, CardMedia, Grid, IconButton, Popover } from "@mui/material";

// @mui icons
// import GoogleIcon from "@mui/icons-material/Google";
import { MoreVert } from "@mui/icons-material";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKAvatar from "components/MKAvatar";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";

// Material Kit 2 React example components
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import SimpleFooter from "examples/Footers/SimpleFooter";

// Material Kit 2 React page layout routes
import routes from "routes";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function HistoryCard({ cardInfo }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    alert(`DELETE FROM table WHERE id = ${cardInfo.id}`);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "delete-popover" : undefined;

  return (
    <Card>
      <CardHeader
        title={cardInfo.date}
        action={
          <>
            <IconButton aria-label="settings" onClick={handleClick}>
              <MoreVert />
            </IconButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 20,
                horizontal: 15,
              }}
              transformOrigin={{
                horizontal: "right",
                vertical: "top",
              }}
            >
              <MKButton variant="outlined" color="error" onClick={handleDelete}>
                Delete
              </MKButton>
            </Popover>
          </>
        }
      />
      <CardMedia component="img" image={cardInfo.imgSrc} sx={{ width: 255, height: 255 }} />
      <CardContent>
        <MKTypography variant="body1" mb={-2} sx={{ textAlign: "right" }}>
          {cardInfo.modelName}
        </MKTypography>
      </CardContent>
    </Card>
  );
}
HistoryCard.propTypes = {
  cardInfo: PropTypes.shape({
    id: PropTypes.number,
    date: PropTypes.string,
    imgSrc: PropTypes.string,
    modelName: PropTypes.string,
    modelParameter: PropTypes.shape({
      value: PropTypes.number,
    }),
  }),
};

function InfoBox({ label, text, editing }) {
  return (
    <MKBox mx={1} my={1} p={1} borderRadius="lg" variant="gradient" textAlign="center">
      <MKTypography variant="body2" fontWeight="light">
        {label}
      </MKTypography>
      {!editing ? (
        <MKTypography variant="h4" fontWeight="medium">
          {text}
        </MKTypography>
      ) : (
        <MKInput variant="standard" defaultValue={text}></MKInput>
      )}
    </MKBox>
  );
}
InfoBox.propTypes = {
  label: PropTypes.string,
  text: PropTypes.string,
  editing: PropTypes.bool,
};

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleConfirm = () => {
    setIsEditing(false);
  };

  return (
    <>
      <DefaultNavbar
        routes={routes}
        // action={{
        //   type: "internal",
        //   route: "/authentication/sign-in",
        //   label: "sign-in",
        //   color: "info",
        // }}
        transparent
        light
      />
      <MKBox
        position="absolute"
        top={0}
        left={0}
        zIndex={1}
        width="100%"
        minHeight="100vh"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <MKBox px={1} width="100%" height="100vh" mx="auto" position="relative" zIndex={2}>
        <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
          <Grid item xs={11} sm={10} md={9} lg={8} xl={8}>
            <Card>
              <MKBox
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                mx={2}
                mt={-3}
                p={2}
                mb={1}
                textAlign="center"
              >
                <MKTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                  Profile
                </MKTypography>
              </MKBox>
              <MKBox my={2} textAlign="center">
                <Grid container justifyContent="center">
                  <Grid item>
                    <MKAvatar
                      src={
                        "https://health.chosun.com/site/data/img_dir/2024/12/13/2024121302504_0.jpg"
                      }
                      size="xxl"
                    />
                  </Grid>
                </Grid>
                <MKBox display="flex" alignItems="center" width="100%">
                  <MKBox flex={1} />
                  <MKTypography>학정이</MKTypography>
                  <MKBox flex={1} display="flex" justifyContent="flex-end">
                    {isEditing ? (
                      <MKButton variant="outlined" sx={{ mr: 2 }} color="success" onClick={handleConfirm}>
                        CONFIRM
                      </MKButton>
                    ) : (
                      <MKButton variant="outlined" sx={{ mr: 2 }} color="info" onClick={handleEdit}>
                        Edit
                      </MKButton>
                    )}
                  </MKBox>
                </MKBox>
              </MKBox>
              <Grid container spacing={0} justifyContent="center">
                <Grid item xs={3}>
                  <InfoBox label="BASP" text="2" editing={isEditing} />
                </Grid>
                <Grid item xs={0.1}>
                  <MKBox sx={{ width: "2px", height: "75px", bgcolor: "grey.300" }}></MKBox>
                </Grid>
                <Grid item xs={3}>
                  <InfoBox label="AGE" text="5" />
                </Grid>
                <Grid item xs={0.1}>
                  <MKBox sx={{ width: "2px", height: "75px", bgcolor: "grey.300" }}></MKBox>
                </Grid>
                <Grid item xs={3}>
                  <InfoBox label="POINT" text="500" />
                </Grid>
              </Grid>
              <Grid container spacing={0} justifyContent="center">
                <Grid item xs={5}>
                  <InfoBox label="email" text="hakjung@sju.ac.kr" />
                </Grid>
                <Grid item xs={0.1}>
                  <MKBox sx={{ width: "2px", height: "75px", bgcolor: "grey.300" }}></MKBox>
                </Grid>
                <Grid item xs={5}>
                  <InfoBox label="address" text="서울특별시 광진구 능동로" />
                </Grid>
              </Grid>
              <MKBox bgColor="secondary" mx={2} my={2} borderRadius="lg">
                <Grid container spacing={2} justifyContent="center" my={2}>
                  <Grid item>
                    <HistoryCard
                      cardInfo={{
                        id: 250416,
                        date: "2025-04-16",
                        imgSrc: "https://picsum.photos/255/255",
                        modelName: "Hair-GAN",
                        modelParameter: {
                          value: 2000,
                        },
                      }}
                    ></HistoryCard>
                  </Grid>
                </Grid>
              </MKBox>
            </Card>
          </Grid>
        </Grid>
      </MKBox>
      <MKBox width="100%" position="absolute" zIndex={2} bottom="1.625rem">
        <SimpleFooter light />
      </MKBox>
    </>
  );
}

export default Profile;
