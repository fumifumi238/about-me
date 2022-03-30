import { FormEvent, useEffect } from "react";

import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";

import { login, signUp } from "../../utils"; // 上記で実装したファイル
import nookies from "nookies";

import {
  checkPasswordValidation,
  checkEmailValidation,
} from "../../validation";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { firebaseAdmin } from "../../firebaseAdmin";

const Home: NextPage = () => {
  const useStyles = {
    signInNegative: {
      borderBottom: 1,
      borderLeft: 1,
      opacity: 0.5,
    },
    signUpNegative: {
      borderBottom: 1,
      borderRight: 1,
      opacity: 0.5,
    },
  };
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [signInActive, setSignInActive] = useState<boolean>(true);

  const [isEmailError, setIsEmailError] = useState<boolean>(false);
  const [emailValdationText, setEmailValidationText] = useState<string>("");

  const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
  const [passwordValdationText, setPasswordValidationText] =
    useState<string>("");

  const [isPasswordConfirmError, setIsPasswordConfirmError] =
    useState<boolean>(false);
  const [passwordConfirmValidationText, setPasswordConfirmValidationText] =
    useState<string>("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (signInActive) {
      const validation = checkPasswordConfirmValidation();
      if (!validation) {
        await signUp(email, password);
        router.push("/dashboard");
      }
      return;
    }
    await login(email, password); // email・passwordを使ってログイン
    router.push("/dashboard"); // ダッシュボードページへ遷移させる
  };

  const checkPasswordConfirmValidation = () => {
    if (password !== passwordConfirm) {
      setIsPasswordConfirmError(true);
      setPasswordConfirmValidationText("パスワードが一致しません");
      return true;
    } else {
      setIsPasswordConfirmError(false);
      setPasswordConfirmValidationText("");
      return false;
    }
  };

  const onInputPassword = (inputPassword: string) => {
    setPassword(inputPassword);
    const passwordErrorText = checkPasswordValidation(inputPassword);

    if (passwordErrorText) {
      setIsPasswordError(true);
      setPasswordValidationText(passwordErrorText);
    } else {
      setIsPasswordError(false);
      setPasswordValidationText("");
    }
  };
  const onInputEmail = (inputEmail: string) => {
    setEmail(inputEmail);
    const emailErrorText = checkEmailValidation(inputEmail);

    if (emailErrorText) {
      setIsEmailError(true);
      setEmailValidationText(emailErrorText);
    } else {
      setIsEmailError(false);
      setEmailValidationText("");
    }
  };

  return (
    <div>
      <h1>About me</h1>
      <Box></Box>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <Grid item>
          <Card variant="outlined" sx={{ border: 1 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid
                  item
                  xs={6}
                  sx={signInActive ? useStyles.signUpNegative : null}
                  onClick={() => setSignInActive(false)}
                >
                  <Typography variant="h5">ログイン</Typography>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={signInActive ? null : useStyles.signInNegative}
                  onClick={() => setSignInActive(true)}
                >
                  <Typography variant="h5">新規登録</Typography>
                </Grid>
              </Grid>
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                <form onSubmit={onSubmit}>
                  <Grid item py={3} mx={2}>
                    <TextField
                      fullWidth
                      error={isEmailError}
                      helperText={emailValdationText}
                      id="email"
                      label="メールアドレス"
                      placeholder="sample@about.me"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon />
                          </InputAdornment>
                        ),
                      }}
                      type="email"
                      variant="standard"
                      value={email}
                      onChange={(e) => onInputEmail(e.target.value)}
                    />
                  </Grid>
                  <Grid item mx={2} pt={1}>
                    <TextField
                      error={isPasswordError}
                      helperText={passwordValdationText}
                      id="password"
                      label="パスワード"
                      placeholder="8～20文字"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      type={showPassword ? "text" : "password"}
                      variant="standard"
                      value={password}
                      onChange={(e) => onInputPassword(e.target.value)}
                    />
                  </Grid>
                  {signInActive && (
                    <Grid item mx={2} pt={4}>
                      <TextField
                        error={isPasswordConfirmError}
                        helperText={passwordConfirmValidationText}
                        id="passwordConfirm"
                        label="パスワード(確認用)"
                        placeholder="8～20文字"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        type={showPassword ? "text" : "password"}
                        variant="standard"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                      />
                    </Grid>
                  )}
                  <Grid item pt={3}>
                    <div style={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        disabled={
                          isEmailError || isPasswordError || !email || !password
                        }
                        size="large"
                        type="submit"
                        onClick={onSubmit}
                      >
                        {signInActive ? "新規登録" : "ログイン"}
                      </Button>
                    </div>
                  </Grid>
                </form>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const session = cookies.session || "";
  // セッションIDを検証して、認証情報を取得する
  const user = await firebaseAdmin
    .auth()
    .verifySessionCookie(session, true)
    .catch(() => null);

  // 認証情報が無い場合は、ログイン画面へ遷移させる
  // ここfoodにも実装する
  if (user) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  console.log("user");
  // uidそのままは危険化かも
  return {
    props: {},
  };
};

export default Home;
