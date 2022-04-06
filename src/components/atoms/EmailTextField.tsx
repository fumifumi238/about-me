import TextField from "@mui/material/TextField";
import { useState } from "react";
import { checkEmailValidation } from "../../utils/validation";
import InputAdornment from "@mui/material/InputAdornment";
import EmailIcon from "@mui/icons-material/Email";

type Props = {
  email: string;
  onEmailChange: (text: string) => void;
  variant: "standard" | "outlined" | "filled";
};

const EmailTextField: React.FC<Props> = ({ email, onEmailChange, variant }) => {
  const [isEmailError, setIsEmailError] = useState<boolean>(false);
  const [emailValidationText, onEmailChangeValidationText] =
    useState<string>("");

  const onInputEmail = (inputEmail: string) => {
    onEmailChange(inputEmail);
    const emailErrorText = checkEmailValidation(inputEmail);

    if (emailErrorText) {
      onEmailChangeValidationText(emailErrorText);
      setIsEmailError(true);
    } else {
      onEmailChangeValidationText("");
      setIsEmailError(false);
    }
  };

  return (
    <TextField
      fullWidth
      error={isEmailError}
      type="email"
      label="メールアドレス"
      defaultValue={email}
      variant={variant}
      helperText={emailValidationText}
      placeholder="sample@about.me"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <EmailIcon />
          </InputAdornment>
        ),
      }}
      onChange={(e) => {
        onInputEmail(e.target.value);
        onEmailChange(e.target.value);
      }}
    />
  );
};

export default EmailTextField;
