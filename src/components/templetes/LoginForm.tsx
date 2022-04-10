import Grid from "@mui/material/Grid";

import { useState } from "react";

import SignInForm from "../molecules/SignInForm";
import SignUpForm from "../molecules/SignUpForm";
import Box from "@mui/material/Box";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
type Value = "signin" | "signup";

const LoginForm: React.FC<{ redirectUrl?: string }> = ({
  redirectUrl = "dashboard",
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");

  const [value, setValue] = useState<Value>("signin");

  const handleChange = (event: React.SyntheticEvent, newValue: Value) => {
    setValue(newValue);
  };

  const onEmailChange = (text: string) => {
    setEmail(text);
  };

  const onPasswordChange = (text: string) => {
    setPassword(text);
  };

  const onPasswordConfirmChange = (text: string) => {
    setPasswordConfirm(text);
  };

  return (
    <>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            centered
          >
            <Tab label="ログイン" value="signin" />
            <Tab label="新規登録" value="signup" />
          </TabList>
        </Box>

        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <TabPanel value="signin">
            <SignInForm
              email={email}
              onEmailChange={onEmailChange}
              password={password}
              onPasswordChange={onPasswordChange}
              redirectUrl={redirectUrl}
            />
          </TabPanel>
          <TabPanel value="signup">
            <SignUpForm
              email={email}
              onEmailChange={onEmailChange}
              password={password}
              onPasswordChange={onPasswordChange}
              passwordConfirm={passwordConfirm}
              onPasswordConfirmChange={onPasswordConfirmChange}
              redirectUrl={redirectUrl}
            />
          </TabPanel>
        </Grid>
      </TabContext>
    </>
  );
};

export default LoginForm;
