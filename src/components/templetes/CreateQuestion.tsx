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
import { addDoc, collection, doc } from "@firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { db, timeStamp } from "../../../utils";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

const CreateQuestion: React.FC<{
  owner: boolean;
  params: string;
  postOwnerId: string;
}> = ({ owner, params, postOwnerId }) => {
  const [questionOpen, setQuestionOpen] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");

  const [currentAnswer, setCurrentAnswer] = useState<string>("");

  const onCancelQuestionChange = () => {
    setCurrentQuestion("");
    setCurrentAnswer("");
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
    const docRef = await addDoc(collection(db, "posts"), {
      question: currentQuestion,
      answer: currentAnswer,
      user: postOwnerId || undefined,
      display_name: params,
      timestamp: timeStamp,
    });
    console.log("Document written with ID: ", docRef);
    setCurrentQuestion("");
    setCurrentAnswer("");
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
            question={currentQuestion}
            onQuestionChange={onQuestionChange}
            variant="outlined"
            rows={4}
          />
        </Grid>
        <Box sx={{ margin: "0 0 0 auto" }}>
          <Counter maxLength={400} currentLength={currentQuestion.length} />
        </Box>
        {owner && (
          <>
            <Grid item>
              <AnswerTextField
                answer={currentAnswer}
                onAnswerChange={onAnswerChange}
                variant="outlined"
                rows={4}
              />
            </Grid>
            <Box sx={{ margin: "0 0 0 auto" }}>
              <Counter maxLength={400} currentLength={currentAnswer.length} />
            </Box>
          </>
        )}
      </Grid>
    </>
  );
  return (
    <>
      <IconButton onClick={() => setQuestionOpen(true)}>
        <QuestionAnswerIcon sx={{ fontSize: 50 }} />
      </IconButton>
      <ModalForm
        tags={tags}
        setState={onCancelQuestionChange}
        open={questionOpen}
      />
    </>
  );
};

export default CreateQuestion;
