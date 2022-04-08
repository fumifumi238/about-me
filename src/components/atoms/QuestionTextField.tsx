import TextField from "@mui/material/TextField";
import { useState } from "react";
import { checkQuestionValidation } from "../../utils/validation";

type Props = {
  question: string;
  onQuestionChange: (text: string) => void;
  variant: "standard" | "outlined" | "filled";
  rows: number;
};

const QuestionTextField: React.FC<Props> = ({
  question,
  onQuestionChange,
  variant,
  rows,
}) => {
  const [isQuestionError, setIsQuestionError] = useState<boolean>(false);
  const [questionValidationText, onQuestionChangeValidationText] =
    useState<string>("");

  const onInputQuestion = (inputQuestion: string) => {
    onQuestionChange(inputQuestion);
    const questionErrorText = checkQuestionValidation(inputQuestion);

    if (questionErrorText) {
      onQuestionChangeValidationText(questionErrorText);
      setIsQuestionError(true);
    } else {
      onQuestionChangeValidationText("");
      setIsQuestionError(false);
    }
  };

  return (
    <TextField
      error={isQuestionError}
      type="text"
      label="Question"
      defaultValue={question}
      placeholder="200文字以内"
      multiline
      rows={rows}
      variant={variant}
      helperText={questionValidationText}
      onChange={(e) => {
        onInputQuestion(e.target.value);
        onQuestionChange(e.target.value);
      }}
    />
  );
};

export default QuestionTextField;
