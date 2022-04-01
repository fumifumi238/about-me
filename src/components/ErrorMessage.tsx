import Snackbar from "@mui/material/Snackbar";
import { useEffect, useState } from "react";

const ErrorMessage: React.FC<{ text: string }> = ({ text }) => {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        message={text}
      />
    </div>
  );
};

export default ErrorMessage;
