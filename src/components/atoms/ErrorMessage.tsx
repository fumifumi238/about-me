import Snackbar from "@mui/material/Snackbar";
import { useEffect, useState } from "react";

const ErrorMessage: React.FC<{
  text: string;
  error: boolean;
  open: () => void;
}> = ({ text, open, error }) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={error}
      autoHideDuration={1200}
      onClose={open}
      message={text}
    />
  );
};

export default ErrorMessage;
