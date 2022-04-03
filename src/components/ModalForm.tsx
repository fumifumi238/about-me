import { Modal, Grid, Button, TextField, Box } from "@mui/material";
import { useState } from "react";
import Counter from "./Counter";

const ModalForm: React.FC = () => {
  const [profileOpen, setProfileOpen] = useState<boolean>(false);

  const onSave = () => {};
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
    <></>
    // <Modal
    //   open={profileOpen}
    //   onClose={() => setProfileOpen(false)}
    //   aria-labelledby="modal-modal-title"
    //   aria-describedby="modal-modal-description"
    // >
    //   <Box sx={style}>
    //     <Grid
    //       container
    //       direction="row"
    //       justifyContent="space-between"
    //       alignItems="flex-start"
    //     >
    //       <Grid item>
    //         <Button variant="text" onClick={() => setProfileOpen(false)}>
    //           Cancel
    //         </Button>
    //       </Grid>
    //       <Grid item>
    //         <Button variant="text" onClick={onProfileChange} disabled={false}>
    //           Save
    //         </Button>
    //       </Grid>
    //     </Grid>
    //     <Grid
    //       container
    //       direction="column"
    //       justifyContent="center"
    //       alignItems="center"
    //     >
    //       <Grid item py={2}>
    //         <TextField
    //           label="名前"
    //           type="text"
    //           defaultValue={nameText}
    //           inputRef={nameRef}
    //           id="nametext"
    //         />
    //       </Grid>
    //       <Grid item>
    //         <TextField
    //           label="自己紹介"
    //           multiline
    //           rows={10}
    //           defaultValue={introductionText}
    //           inputRef={introductionRef}
    //           id="introductiontext"
    //           onChange={(e) => setintroductionCount(e.target.value.length)}
    //         />
    //       </Grid>
    //       <Box sx={{ margin: "0 0 0 auto" }}>
    //         <Counter maxLength={200} currentLength={introductionCount} />
    //       </Box>
    //     </Grid>
    //   </Box>
    // </Modal>
  );
};

export default ModalForm;
