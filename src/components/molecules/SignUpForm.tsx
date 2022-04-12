import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { FormEvent, useState } from "react";

import { useRouter } from "next/router";

import { signUp } from "../../../utils"; // 上記で実装したファイル
import {
  checkEmailValidation,
  checkPasswordValidation,
} from "../../utils/validation";
import EmailTextField from "../atoms/EmailTextField";
import PasswordTextField from "../atoms/PasswordTextField";
import ErrorMessage from "../atoms/ErrorMessage";

type Props = {
  email: string;
  onEmailChange: (text: string) => void;
  password: string;
  onPasswordChange: (text: string) => void;
  passwordConfirm: string;
  onPasswordConfirmChange: (text: string) => void;
  redirectUrl: string;
};

const SignUpForm: React.FC<Props> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  passwordConfirm,
  onPasswordConfirmChange,
  redirectUrl,
}) => {
  const router = useRouter();

  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  const checkPasswordConfirmValidation = () => {
    if (password !== passwordConfirm) {
      setError(true);
      setErrorText("パスワードが一致しません");
      return true;
    }

    return false;
  };

  const errorMessageOpen = () => {
    setError(!error);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const validation = checkPasswordConfirmValidation();
    if (!validation) {
      await signUp(email, password);
      router.push(redirectUrl);
    }
  };

  return (
    <>
      <ErrorMessage error={error} text={errorText} open={errorMessageOpen} />
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
        <Grid item mx={2} pt={4}>
          <PasswordTextField
            password={passwordConfirm}
            onPasswordChange={onPasswordConfirmChange}
            variant="standard"
            label="パスワード(確認用)"
          />
        </Grid>
        <Grid item pt={3}>
          <div style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              disabled={
                !!checkEmailValidation(email) ||
                !!checkPasswordValidation(password) ||
                !!checkPasswordValidation(passwordConfirm)
              }
              size="large"
              type="submit"
              onClick={onSubmit}
            >
              新規登録
            </Button>
          </div>
        </Grid>
      </form>
    </>
  );
};

export default SignUpForm;
