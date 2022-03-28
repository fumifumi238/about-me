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
                    width: "100%",
                    flexShrink: 0,
                    fontSize: "1rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {post.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{post.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </>
  );
};

export default Questions;
