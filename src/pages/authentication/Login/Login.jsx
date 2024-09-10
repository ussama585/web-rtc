import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Formik, Form } from "formik";
import { LoginSchema } from "../../../utils/Schemas";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import userAuthStore from "../../../store/userAuthStore/userAuthStore";
import url from "../../../utils/api";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="">
        Assessment Module
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const updateUser = userAuthStore((state) => state.setUser);
  const logout = userAuthStore((state) => state.logout);

  useEffect(() => {
    logout();
  }, []);

  //handle Login
  const loginMutation = useMutation({
    mutationFn: (values) => {
      const protocol = window.location.protocol;
      return axios.post(`${url}/accounts/login`, values);
    },

    onError: (error) => {
      console.log(error);
      toast.error("Error logging in user...");
    },
    onSuccess: (data) => {
      if (data.data.error) {
        toast.error(data.data.error, {});
        return;
      }
      console.log(data);
      toast.success(data.data.message, {});
      localStorage.setItem("access", data.data.access);

      updateUser(data.data.UserType);
      navigate("/");
    },
  });

  return (
    <div>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          loginMutation.mutate({
            email: values.email,
            password: values.password,
          });
        }}
      >
        {({
          errors,
          touched,
          values,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <Form>
            <ThemeProvider theme={defaultTheme}>
              <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                  sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    bgcolor: "background.paper",
                    boxShadow: 3,
                    padding: 3,
                    borderRadius: 1,
                  }}
                >
                  <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    Sign in
                  </Typography>
                  <Box component="form" noValidate sx={{ mt: 1 }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      error={errors.email && touched.email}
                      helperText={errors.email && touched.email && errors.email}
                      autoComplete="email"
                      autoFocus
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      error={errors.password && touched.password}
                      helperText={
                        errors.password && touched.password && errors.password
                      }
                      type="password"
                      id="password"
                      autoComplete="current-password"
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      onClick={handleSubmit}
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                    <Grid container>
                      <Grid item xs>
                        <Link href="#" variant="body2">
                          Forgot password?
                        </Link>
                      </Grid>
                      <Grid item>
                        <Link href="/sign-up" variant="body2">
                          {"Don't have an account? Sign Up"}
                        </Link>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
              </Container>
            </ThemeProvider>
          </Form>
        )}
      </Formik>
    </div>
  );
}
