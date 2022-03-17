import type { FormEvent } from "react";

import { NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";

import { login, signUp } from "../../utils"; // 上記で実装したファイル

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

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault(); // デフォルトの<form />の挙動を無効にする
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
                      id="email"
                      label="メールアドレス"
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
                      id="password"
                      label="パスワード"
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
                        id="passwordConfirm"
                        label="パスワード(確認用)"
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
                        onChange={(e) => setPasswordConfirm(e.target.value)}
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
        <Grid item>
          <h1>a</h1>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
