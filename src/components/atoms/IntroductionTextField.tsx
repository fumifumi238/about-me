import TextField from "@mui/material/TextField";
import { useState } from "react";
import { checkIntroductionValidation } from "../../utils/validation";

type Props = {
  introduction: string;
  onIntroductionChange: (text: string) => void;
  variant: "standard" | "outlined" | "filled";
  rows: number;
};

const IntroductionTextField: React.FC<Props> = ({
  introduction,
  onIntroductionChange,
  variant,
  rows,
}) => {
  const [isIntroductionError, setIsIntroductionError] =
    useState<boolean>(false);
  const [introductionValidationText, onIntroductionChangeValidationText] =
    useState<string>("");

  const onInputIntroduction = (inputIntroduction: string) => {
    onIntroductionChange(inputIntroduction);
    const introductionErrorText =
      checkIntroductionValidation(inputIntroduction);

    if (introductionErrorText) {
      onIntroductionChangeValidationText(introductionErrorText);
      setIsIntroductionError(true);
    } else {
      onIntroductionChangeValidationText("");
      setIsIntroductionError(false);
    }
  };

  return (
    <TextField
      error={isIntroductionError}
      type="text"
      label="自己紹介"
      defaultValue={introduction}
      placeholder="200文字以内"
      multiline
      rows={rows}
      variant={variant}
      helperText={introductionValidationText}
      onChange={(e) => {
        onInputIntroduction(e.target.value);
        onIntroductionChange(e.target.value);
      }}
    />
  );
};

export default IntroductionTextField;
