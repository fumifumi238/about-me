import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Box,
} from "@mui/material";
import { useState } from "react";
import { QuestionProps } from "../../types/type";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Questions: React.FC<QuestionProps> = ({ posts, answered }) => {
  const [expanded, setExpanded] = useState<string | false>(false);

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
                  <div>
                    <input type="text" />
                  </div>
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
