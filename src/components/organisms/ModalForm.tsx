import { Modal, Grid, Button, TextField, Box } from "@mui/material";
import { useState } from "react";
import Counter from "../atoms/Counter";

type Props = {
  setState: () => void;
  open: boolean;
  tags: JSX.Element;
};
const ModalForm: React.FC<Props> = ({ setState, open, tags }) => {
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "33%",
    minWidth: 275,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => setState()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            {tags}
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default ModalForm;
