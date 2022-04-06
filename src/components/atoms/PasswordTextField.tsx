import TextField from "@mui/material/TextField";
import { useState } from "react";
import { checkPasswordValidation } from "../../utils/validation";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import InputAdornment from "@mui/material/InputAdornment";
import LockIcon from "@mui/icons-material/Lock";
import IconButton from "@mui/material/IconButton";

type Props = {
  password: string;
  onPasswordChange: (text: string) => void;
  variant: "standard" | "outlined" | "filled";
  label: string;
};

const PasswordTextField: React.FC<Props> = ({
  password,
  onPasswordChange,
  variant,
  label,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
  const [passwordValidationText, onPasswordChangeValidationText] =
    useState<string>("");

  const onInputPassword = (inputPassword: string) => {
    onPasswordChange(inputPassword);
    const passwordErrorText = checkPasswordValidation(inputPassword);

    if (passwordErrorText) {
      onPasswordChangeValidationText(passwordErrorText);
      setIsPasswordError(true);
    } else {
      onPasswordChangeValidationText("");
      setIsPasswordError(false);
    }
  };

  return (
    <TextField
      error={isPasswordError}
      helperText={passwordValidationText}
      label={label}
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
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      type={showPassword ? "text" : "password"}
      variant={variant}
      value={password}
      onChange={(e) => onInputPassword(e.target.value)}
    />
  );
};

export default PasswordTextField;
