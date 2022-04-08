import { useEffect, useState } from "react";
import ModalForm from "../organisms/ModalForm";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/system";
import {
  checkQuestionValidation,
  checkAnswerValidation,
} from "../../utils/validation";
import Counter from "../atoms/Counter";
import AnswerTextField from "../atoms/AnswerTextField";
import QuestionTextField from "../atoms/QuestionTextField";
import { doc } from "@firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { db } from "../../../utils";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

type Props = {
  id: string;
  questionText: string;
  setQuestionText: (text: string) => void;
  answerText: string;
  setAnswerText: (text: string) => void;
};

const QuestionModal: React.FC<Props> = ({
  id,
  questionText,
  setQuestionText,
  answerText,
  setAnswerText,
}) => {
  const [questionOpen, setQuestionOpen] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");

  const [currentAnswer, setCurrentAnswer] = useState<string>("");

  useEffect(() => {
    setCurrentQuestion(questionText);
    setCurrentAnswer(answerText);
  }, [questionText, answerText]);

  const toggleButton = () => {
    setQuestionOpen(!questionOpen);
  };

  const onCancelQuestionChange = () => {
    setCurrentQuestion(questionText);
    setCurrentAnswer(answerText);
    setQuestionOpen(false);
  };

  const onQuestionChange = (text: string) => {
    setCurrentQuestion(text);
  };

  const onAnswerChange = (text: string) => {
    setCurrentAnswer(text);
  };

  const onSaveQuestionChange = async () => {
    setQuestionOpen(false);

    const inputQuestion = currentQuestion;
    const inputAnswer = currentAnswer;

    if (inputQuestion === questionText && inputAnswer === answerText) {
      console.log("プロフィール変化なし");
      return;
    }
    setQuestionText(inputQuestion);
    setAnswerText(inputAnswer);
    console.log(inputQuestion, inputAnswer);

    const questionRef = doc(db, "posts", id);

    await updateDoc(questionRef, {
      question: inputQuestion,
      answer: inputAnswer,
    });
  };

  const tags = (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Grid item>
          <Button variant="text" onClick={onCancelQuestionChange}>
            Cancel
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="text"
            onClick={onSaveQuestionChange}
            disabled={
              !!checkQuestionValidation(currentQuestion) ||
              !!checkAnswerValidation(currentAnswer)
            }
          >
            Save
          </Button>
        </Grid>
      </Grid>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item py={2}>
          <QuestionTextField
            question={questionText}
            onQuestionChange={onQuestionChange}
            variant="outlined"
            rows={4}
          />
        </Grid>
        <Box sx={{ margin: "0 0 0 auto" }}>
          <Counter maxLength={400} currentLength={currentQuestion.length} />
        </Box>
        <Grid item>
          <AnswerTextField
            answer={answerText}
            onAnswerChange={onAnswerChange}
            variant="outlined"
            rows={4}
          />
        </Grid>
        <Box sx={{ margin: "0 0 0 auto" }}>
          <Counter maxLength={400} currentLength={currentAnswer.length} />
        </Box>
      </Grid>
    </>
  );
  return (
    <>
      <IconButton aria-label="Edit" onClick={() => setQuestionOpen(true)}>
        <EditIcon />
      </IconButton>
      <ModalForm tags={tags} setState={toggleButton} open={questionOpen} />
    </>
  );
};

export default QuestionModal;
