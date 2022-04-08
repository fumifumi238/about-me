import TextField from "@mui/material/TextField";
import { useState } from "react";
import { checkAnswerValidation } from "../../utils/validation";

type Props = {
  answer: string;
  onAnswerChange: (text: string) => void;
  variant: "standard" | "outlined" | "filled";
  rows: number;
};

const AnswerTextField: React.FC<Props> = ({
  answer,
  onAnswerChange,
  variant,
  rows,
}) => {
  const [isAnswerError, setIsAnswerError] = useState<boolean>(false);
  const [answerValidationText, onAnswerChangeValidationText] =
    useState<string>("");

  const onInputAnswer = (inputAnswer: string) => {
    onAnswerChange(inputAnswer);
    const answerErrorText = checkAnswerValidation(inputAnswer);

    if (answerErrorText) {
      onAnswerChangeValidationText(answerErrorText);
      setIsAnswerError(true);
    } else {
      onAnswerChangeValidationText("");
      setIsAnswerError(false);
    }
  };

  return (
    <TextField
      error={isAnswerError}
      type="text"
      label="Answer"
      defaultValue={answer}
      placeholder="200文字以内"
      multiline
      rows={rows}
      variant={variant}
      helperText={answerValidationText}
      onChange={(e) => {
        onInputAnswer(e.target.value);
        onAnswerChange(e.target.value);
      }}
    />
  );
};

export default AnswerTextField;
