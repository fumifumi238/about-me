import type { FormEvent, SetStateAction } from "react";

import { NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";

import { login, signUp } from "../../utils"; // 上記で実装したファイル
import { Validation } from "../components/validation";
import { checkPasswordConfirmValidation } from "../components/validation";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

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
    event.preventDefault(); // デフォルトの<form />の挙動を無効にする
    const { emailErrorText, passwordErrorText } = Validation(email, password);
    if (emailErrorText || passwordErrorText) {
      if (emailErrorText) {
        setIsEmailError(true);
        setEmailValidationText(emailErrorText);
      }

      if (passwordErrorText) {
        setIsPasswordError(true);
        setPasswordValidationText(passwordErrorText);
      }

      console.log(emailErrorText, passwordErrorText);
      return;
    }
    if (signInActive) {
      if (password !== passwordConfirm) {
        console.log("パスワードが一致しません");
        return;
      }
      await signUp(email, password);
      router.push("/dashboard");
      return;
    }
    await login(email, password); // email・passwordを使ってログイン
    router.push("/dashboard"); // ダッシュボードページへ遷移させる
  };

  const onInputPasswordConfirm = (inputPasswordConfirm: string) => {
    setPasswordConfirm(inputPasswordConfirm);

    const passwordConfirmErrorText =
      checkPasswordConfirmValidation(inputPasswordConfirm);

    if (passwordConfirmErrorText) {
      setIsPasswordConfirmError(true);
      setPasswordConfirmValidationText(passwordConfirmErrorText);
    } else {
      setIsPasswordConfirmError(false);
      setPasswordConfirmValidationText("");
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
                  <Grid item px={3} py={3}>
                    <TextField
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
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>
                  <Grid item px={3} pt={1}>
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
                      }}
                      type="password"
                      variant="standard"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Grid>
                  {signInActive && (
                    <Grid item px={3} pt={4}>
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
                        }}
                        type="password"
                        variant="standard"
                        value={passwordConfirm}
                        onChange={(e) => onInputPasswordConfirm(e.target.value)}
                      />
                    </Grid>
                  )}
                  <Grid item pt={3}>
                    <div style={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        disabled={!email || !password}
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

export default Home;
