import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Box,
  IconButton,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { QuestionProps } from "../../types/type";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Delete } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";

import Counter from "./Counter";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../utils";

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

  const onSave = async (id: string) => {
    const confirm = window.confirm("この内容で良いですか?");
    if (confirm) {
      console.log(postAnswer);
      const questionRef = doc(db, "posts", id);

      await updateDoc(questionRef, {
        answer: postAnswer,
      });
    }
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
                  <Typography sx={{ wordBreak: "break-word" }}>
                    {post.answer}
                  </Typography>
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
                        <IconButton aria-label="Delete">
                          <Delete />
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
                    <IconButton aria-label="Delete">
                      <Delete />
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
