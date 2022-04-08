import { useEffect, useState } from "react";
import ModalForm from "../organisms/ModalForm";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/system";
import {
  checkNameValidation,
  checkIntroductionValidation,
} from "../../utils/validation";
import Counter from "../atoms/Counter";
import IntroductionTextField from "../atoms/IntroductionTextField";
import NameTextField from "../atoms/NameTextField";
import { doc } from "@firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { db } from "../../../utils";

type Props = {
  params: string;
  nameText: string;
  setNameText: (text: string) => void;
  introductionText: string;
  setIntroductionText: (text: string) => void;
};

const ProfileModal: React.FC<Props> = ({
  params,
  nameText,
  setNameText,
  introductionText,
  setIntroductionText,
}) => {
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [currentName, setCurrentName] = useState<string>("");

  const [currentIntroduction, setCurrentIntroduction] = useState<string>("");

  useEffect(() => {
    setCurrentName(nameText);
    setCurrentIntroduction(introductionText);
  }, [nameText, introductionText]);

  const toggleButton = () => {
    setProfileOpen(!profileOpen);
  };

  const onCancelProfileChange = () => {
    setCurrentName(nameText);
    setCurrentIntroduction(introductionText);
    setProfileOpen(false);
  };

  const onNameChange = (text: string) => {
    setCurrentName(text);
  };

  const onIntroductionChange = (text: string) => {
    setCurrentIntroduction(text);
  };

  const onSaveProfileChange = async () => {
    setProfileOpen(false);

    const inputName = currentName;
    const inputIntroduction = currentIntroduction;

    if (inputName === nameText && inputIntroduction === introductionText) {
      console.log("プロフィール変化なし");
      return;
    }
    setNameText(inputName);
    setIntroductionText(inputIntroduction);
    console.log(inputName, inputIntroduction);

    const profileRef = doc(db, "display_name", params);

    await updateDoc(profileRef, {
      name: inputName,
      self_introduction: inputIntroduction,
    });
  };

  const tags = (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Grid item>
          <Button variant="text" onClick={onCancelProfileChange}>
            Cancel
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="text"
            onClick={onSaveProfileChange}
            disabled={
              !!checkNameValidation(currentName) ||
              !!checkIntroductionValidation(currentIntroduction)
            }
          >
            Save
          </Button>
        </Grid>
      </Grid>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item py={2}>
          <NameTextField
            name={nameText}
            onNameChange={onNameChange}
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <IntroductionTextField
            introduction={introductionText}
            onIntroductionChange={onIntroductionChange}
            variant="outlined"
            rows={10}
          />
        </Grid>
        <Box sx={{ margin: "0 0 0 auto" }}>
          <Counter maxLength={200} currentLength={currentIntroduction.length} />
        </Box>
      </Grid>
    </>
  );
  return (
    <>
      <Button
        onClick={() => setProfileOpen(true)}
        sx={{ margin: "auto" }}
        variant="outlined"
      >
        プロフィールを編集する
      </Button>
      <ModalForm tags={tags} setState={toggleButton} open={profileOpen} />;
    </>
  );
};

export default ProfileModal;
