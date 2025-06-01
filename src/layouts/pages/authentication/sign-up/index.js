import { useState } from "react";

// react-router-dom components
// import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
// import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
// import MuiLink from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";

// @mui icons

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";

// Material Kit 2 React example components
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import SimpleFooter from "examples/Footers/SimpleFooter";

// Material Kit 2 React page layout routes
import routes from "routes";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function SignUpBasic() {
  const [dropdown, setDropdown] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    confirmPassword: "",
    name: "",
    sex: "male",
    email: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState({
    id: "",
    password: "",
    confirmPassword: "",
    name: "",
    sex: "",
    email: "",
    address: "",
  });

  const openDropdown = ({ currentTarget }) => setDropdown(currentTarget);
  const closeDropdown = () => setDropdown(null);
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };
  const handleSubmit = () => {
    const errors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "올바른 이메일 형식이 아닙니다.";
    }

    if (!/[^a-zA-Z0-9]/.test(formData.password)) {
      errors.password = "특수문자를 반드시 포함해야 합니다.";
    }

    if (!/[0-9]/.test(formData.password)) {
      errors.password = "숫자를 반드시 포함해야 합니다.";
    }

    if (!/[a-zA-Z]/.test(formData.password)) {
      errors.password = "알파벳을 반드시 포함해야 합니다.";
    }

    if (formData.password.length < 10) {
      errors.password = "비밀번호는 10자 이상이어야 합니다.";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // 유효하면 회원가입 로직 진행!
  };

  const iconStyles = {
    // fontWeight: "bold",
    transition: "transform 200ms ease-in-out",
  };

  const dropdownIconStyles = {
    transform: dropdown ? "rotate(180deg)" : "rotate(0)",
    ...iconStyles,
  };
  return (
    <>
      <DefaultNavbar
        routes={routes}
        action={{
          type: "internal",
          route: "/authentication/sign-in",
          label: "sign-in",
          color: "info",
        }}
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
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
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
                  Sign up
                </MKTypography>
              </MKBox>
              <MKBox pt={4} pb={3} px={3}>
                <MKBox component="form" role="form">
                  <MKBox mb={2}>
                    <MKInput
                      onChange={(e) => handleChange("email", e.target.value)}
                      error={!!formErrors.id}
                      helperText={formErrors.id}
                      variant="standard"
                      type="id"
                      label="Id"
                      fullWidth
                    />
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput
                      onChange={(e) => handleChange("password", e.target.value)}
                      error={!!formErrors.password}
                      helperText={formErrors.password}
                      variant="standard"
                      type="password"
                      label="Password"
                      fullWidth
                    />
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      error={!!formErrors.confirmPassword}
                      helperText={formErrors.confirmPassword}
                      variant="standard"
                      type="password"
                      label="Confirm Password"
                      fullWidth
                    />
                  </MKBox>
                  <Grid container spacing={2} mb={2}>
                    <Grid item xs={6}>
                      <MKBox fullWidth>
                        <MKInput
                          onChange={(e) => handleChange("name", e.target.value)}
                          error={!!formErrors.name}
                          helperText={formErrors.name}
                          variant="standard"
                          type="text"
                          label="Name"
                          fullWidth
                        />
                      </MKBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MKBox fullWidth>
                        <MKButton color="white" onClick={openDropdown}>
                          {formData.sex} <Icon sx={dropdownIconStyles}>expand_more</Icon>
                        </MKButton>
                        <Menu anchorEl={dropdown} open={Boolean(dropdown)} onClose={closeDropdown}>
                          <MenuItem
                            onClick={() => {
                              closeDropdown();
                              handleChange("sex", "male");
                            }}
                          >
                            male
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              closeDropdown();
                              handleChange("sex", "female");
                            }}
                          >
                            female
                          </MenuItem>
                          {/* <MenuItem onClick={()=>{closeDropdown();setSex("none");}}>none</MenuItem> */}
                        </Menu>
                      </MKBox>
                    </Grid>
                  </Grid>
                  <MKBox mb={2}>
                    <MKInput
                      onChange={(e) => handleChange("email", e.target.value)}
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                      variant="standard"
                      type="email"
                      label="Email"
                      fullWidth
                    />
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput
                      onChange={(e) => handleChange("address", e.target.value)}
                      error={!!formErrors.address}
                      helperText={formErrors.address}
                      variant="standard"
                      type="text"
                      label="Address"
                      fullWidth
                    />
                  </MKBox>
                  <MKBox mt={4} mb={1}>
                    <MKButton onClick={handleSubmit} variant="gradient" color="info" fullWidth>
                      sign up
                    </MKButton>
                  </MKBox>
                </MKBox>
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

export default SignUpBasic;
