import TextField from "@mui/material/TextField";
import type { NextPage } from "next";
import { useState } from "react";

const Home: NextPage = () => {
  const [inputError, setInputError] = useState(false);
  const [name, setName] = useState("");
  const [helperText, setHelperText] = useState<string>("");

  const handleChange = (InputName: string) => {
    setName(InputName);
    const len = InputName.length;
    console.log(len);
    const min = 0;
    const max = 20;
    checkNameValidation(len > min, len < max);
  };

  const checkNameValidation = (min: boolean, max: boolean) => {
    if (!min) {
      setHelperText("空白にしないでください");
      setInputError(true);
      console.log(min);
      return;
    } else if (!max) {
      setHelperText("20文字以内で入力してください");
      setInputError(true);
      console.log(max);
      return;
    } else {
      setHelperText("");
      setInputError(false);
    }
  };
  return (
    <form>
      <TextField
        error={inputError}
        id="outlined-basic"
        label="Outlined"
        variant="outlined"
        value={name}
        helperText={helperText}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
      />
    </form>
  );
};

export default Home;
