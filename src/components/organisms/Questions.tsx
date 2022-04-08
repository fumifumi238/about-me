import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import { useState } from "react";
import { QuestionProps } from "../../../types/type";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import Counter from "../atoms/Counter";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../utils";
import { deleteDoc } from "firebase/firestore";

const Questions: React.FC<QuestionProps> = ({ posts, answered }) => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [postAnswer, setPostAnswer] = useState<string>("");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  const newPosts = posts.filter((post) => {
    if (answered) {
      return post.answer !== "";
    }
    return post.answer === "";
  });

  const onDelete = async (id: string) => {
    const confirm = window.confirm("本当に削除していいですか?");
    if (!confirm) {
      return;
    }
    const docRef = await deleteDoc(doc(db, "posts", id));
  };

  const onSave = async (id: string) => {
    console.log(postAnswer);
    const questionRef = doc(db, "posts", id);

    await updateDoc(questionRef, {
      answer: postAnswer,
    });
    setPostAnswer("");
  };
  return (
    <>
      <Box mx={3}>
        {newPosts.map((post) => {
          return (
            <Accordion
              key={post.id}
              expanded={expanded === post.id}
              onChange={handleChange(post.id)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel4bh-content"
                id="panel4bh-header"
              >
                <Typography
                  sx={{
                    flexShrink: 0,
                    flexWrap: "wrap",
                    fontSize: "1rem",
                    p: 2,
                    width: "100%",
                    wordBreak: "break-word",
                  }}
                >
                  {expanded === post.id || post.question.length <= 100
                    ? post.question
                    : `${post.question.slice(0, 100)} ...`}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {post.answer ? (
                  <>
                    <Typography sx={{ wordBreak: "break-word" }}>
                      {post.answer}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Grid container justifyContent="center">
                      <Grid item>
                        <TextField
                          label="Answer"
                          placeholder="回答を入力してください"
                          multiline
                          minRows={3}
                          id="answertext"
                          value={postAnswer}
                          onChange={(e) => {
                            setPostAnswer(e.target.value);
                          }}
                          sx={{ width: "50vw" }}
                        />
                      </Grid>
                    </Grid>
                    <Box sx={{ mr: 3 }}>
                      <Box sx={{ textAlign: "right" }}>
                        <Counter
                          maxLength={400}
                          currentLength={postAnswer.length}
                        />
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Button
                          onClick={() => onSave(post.id)}
                          disabled={!postAnswer || postAnswer.length > 400}
                        >
                          save
                        </Button>
                        <IconButton
                          aria-label="Delete"
                          onClick={() => onDelete(post.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </>
                )}
                {post.answer && (
                  <Box sx={{ textAlign: "right" }}>
                    <IconButton aria-label="Edit">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="Delete"
                      onClick={() => onDelete(post.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </>
  );
};

export default Questions;
