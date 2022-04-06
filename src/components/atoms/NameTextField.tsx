import TextField from "@mui/material/TextField";
import { useState } from "react";
import { checkNameValidation } from "../../utils/validation";

type Props = {
  name: string;
  onNameChange: (text: string) => void;
  variant: "standard" | "outlined" | "filled";
};

const NameTextField: React.FC<Props> = ({ name, onNameChange, variant }) => {
  const [isNameError, setIsNameError] = useState<boolean>(false);
  const [nameValidationText, onNameChangeValidationText] = useState<string>("");

  const onInputName = (inputName: string) => {
    onNameChange(inputName);
    const nameErrorText = checkNameValidation(inputName);

    if (nameErrorText) {
      onNameChangeValidationText(nameErrorText);
      setIsNameError(true);
    } else {
      onNameChangeValidationText("");
      setIsNameError(false);
    }
  };

  return (
    <TextField
      error={isNameError}
      type="text"
      label="Name"
      defaultValue={name}
      placeholder="20文字以内"
      variant={variant}
      helperText={nameValidationText}
      onChange={(e) => {
        onInputName(e.target.value);
        onNameChange(e.target.value);
      }}
    />
  );
};

export default NameTextField;
