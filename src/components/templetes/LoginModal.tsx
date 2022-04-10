import { useEffect, useState } from "react";
import ModalForm from "../organisms/ModalForm";
import LoginForm from "./LoginForm";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

const LoginModal: React.FC<{ params: string }> = ({ params }) => {
  const [open, setOpen] = useState<boolean>(false);
  const toggleButton = () => {
    setOpen(!open);
  };
  const tags = <LoginForm redirectUrl={params} />;
  return (
    <>
      <ListItem button onClick={toggleButton}>
        <ListItemIcon>
          <LoginIcon />
        </ListItemIcon>
        <ListItemText primary="login" />
      </ListItem>
      <ModalForm setState={toggleButton} open={open} tags={tags} />
    </>
  );
};

export default LoginModal;
