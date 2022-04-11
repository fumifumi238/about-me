import { Grid, Button } from "@mui/material";
import { FormEvent, useEffect } from "react";

import { useRouter } from "next/router";

import { login } from "../../../utils"; // 上記で実装したファイル
import {
  checkEmailValidation,
  checkPasswordValidation,
} from "../../utils/validation";
import EmailTextField from "../atoms/EmailTextField";
import PasswordTextField from "../atoms/PasswordTextField";

type Props = {
  email: string;
  onEmailChange: (text: string) => void;
  password: string;
  onPasswordChange: (text: string) => void;
  redirectUrl: string;
};

const SignInForm: React.FC<Props> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  redirectUrl,
}) => {
  const router = useRouter();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await login(email, password);
    router.push(redirectUrl);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <Grid item py={3} mx={2}>
          <EmailTextField
            email={email}
            onEmailChange={onEmailChange}
            variant="standard"
          />
        </Grid>
        <Grid item mx={2} pt={1}>
          <PasswordTextField
            password={password}
            onPasswordChange={onPasswordChange}
            variant="standard"
            label="パスワード"
          />
        </Grid>
        <Grid item pt={3}>
          <div style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              disabled={
                !!checkEmailValidation(email) ||
                !!checkPasswordValidation(password)
              }
              size="large"
              type="submit"
              onClick={onSubmit}
            >
              ログイン
            </Button>
          </div>
        </Grid>
      </form>
    </>
  );
};

export default SignInForm;
