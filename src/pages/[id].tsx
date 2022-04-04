import { GetServerSideProps, NextPage } from "next";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  updateDoc,
  getDocs,
} from "firebase/firestore";

import { db, getFirebaseAuth, timeStamp } from "../../utils";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef, useState } from "react";

import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import ListItemButton from "@mui/material/ListItemButton";
import Paper from "@mui/material/Paper";

import ErrorMessage from "../components/ErrorMessage";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import CardActions from "@mui/material/CardActions";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import Questions from "../components/Questions";
import Counter from "../components/Counter";
import { Posts, UserLists } from "../../types/type";

import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Link from "next/link";

import { onLogout } from "../utils/functions";
import {
  checkIntroductionValidation,
  checkNameValidation,
} from "../utils/validation";

export const Profile: NextPage<{
  params: string;
  postOwnerId: string;
}> = ({ params, postOwnerId }) => {
  const nameRef = useRef<HTMLInputElement>(null!);
  const introductionRef = useRef<HTMLInputElement>(null!);

  const [owner, setOwner] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [posts, setPosts] = useState<Posts[]>([]);
  const [introductionText, setIntroductionText] = useState<string>("");
  const [nameText, setNameText] = useState<string>("");

  const [profileOpen, setProfileOpen] = useState<boolean>(false);

  const [userLists, setUserLists] = useState<UserLists[]>([]);

  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const [recieveQuestion, setRecieveQuestion] = useState<boolean>(false);

  const [value, setValue] = useState<string>("1");

  const [introductionCount, setintroductionCount] = useState<number>(
    introductionText ? introductionText.length : 0
  );

  const [clickCopy, setClickCopy] = useState<boolean>(false);

  const [errorText, setErrorText] = useState<string>("");

  const [isNameError, setIsNameError] = useState<boolean>(false);
  const [nameValidationText, setNameValidationText] = useState<string>("");

  const [isIntroductionError, setIsIntroductionError] =
    useState<boolean>(false);
  const [introductionValidationText, setIntroductionValidationText] =
    useState<string>("");

  const url: string = `https://localhost:3000/${params}`;

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

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

  const addPost = async () => {
    console.log(question, answer);
    const docRef = await addDoc(collection(db, "posts"), {
      question: question,
      answer: answer,
      user: postOwnerId,
      display_name: params,
      timestamp: timeStamp,
    });
    console.log("Document written with ID: ", docRef);
    setQuestion("");
    setAnswer("");
  };

  useEffect(() => {
    const auth = getFirebaseAuth();
    onAuthStateChanged(auth, (user) => {
      if (user && user.uid === postOwnerId) {
        setOwner(true);
        console.log(user.uid, "you are owner");
      } else {
        console.log("no user");
      }
    });
  }, [postOwnerId]);

  useEffect(() => {
    const postsRef = collection(db, "posts");
    const q = query(
      postsRef,
      where("display_name", "==", params),
      orderBy("timestamp", "desc")
    );

    onSnapshot(q, (querySnapshot) => {
      const lists: Posts[] = [];
      querySnapshot.forEach((doc) => {
        const data: Posts = {
          id: doc.id,
          question: doc.data().question,
          answer: doc.data().answer,
          user: doc.data().user,
          display_name: doc.data().display_name,
          timestamp: doc.data().timestamp,
        };
        lists.push(data);
      });
      console.log("Current cities in CA: ", lists.join(", "));
      setPosts([...lists]);
    });
  }, [params]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "display_name"),
        where("user", "==", postOwnerId)
      );
      const querySnapshot = await getDocs(q);
      const lists: UserLists[] = [];
      const unsubscribe = querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data().name);
        if (doc.id !== params) {
          lists.push({ name: doc.data().name, id: doc.id });
        }
      });
      unsubscribe;
      setUserLists([...lists]);
    };
    fetchData();
  }, [params, postOwnerId]);

  useEffect(() => {
    const fetchDisplayName = async () => {
      const docRef = doc(db, "display_name", params);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setNameText(docSnap.data().name);
        setIntroductionText(docSnap.data().self_introduction);
        setRecieveQuestion(docSnap.data().recieve_question);
        setintroductionCount(docSnap.data().self_introduction.length);
      }
    };
    fetchDisplayName();
  }, [params]);

  const onProfileChange = async () => {
    const inputName = nameRef.current.value;
    const inputIntroduction = introductionRef.current.value;

    if (inputName === nameText && inputIntroduction === introductionText) {
      setProfileOpen(false);
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

    setProfileOpen(false);
  };

  const copyTextToClipboard = (text: string) => {
    setClickCopy(false);
    navigator.clipboard.writeText(text).then(
      function () {
        console.log("Async: Copying to clipboard was successful!");
        setErrorText("URL がコピーされました。");
        setClickCopy(true);
      },
      function (err) {
        setErrorText("コピーできませんでした。");
        setClickCopy(true);
        console.error("Async: Could not copy text: ", err);
      }
    );
  };

  const onCheckBoxChange = async (bool: boolean) => {
    setRecieveQuestion(bool);
    const profileRef = doc(db, "display_name", params);
    await updateDoc(profileRef, {
      recieve_question: bool,
    });
    console.log(bool);
  };

  const onInputName = (inputName: string) => {
    const nameErrorText = checkNameValidation(inputName);

    if (nameErrorText) {
      setNameValidationText(nameErrorText);
      setIsNameError(true);
    } else {
      setNameValidationText("");
      setIsNameError(false);
    }
  };

  const onInputIntroduction = (inputIntroduction: string) => {
    setintroductionCount(inputIntroduction.length);
    const introductionErrorText =
      checkIntroductionValidation(inputIntroduction);

    if (introductionErrorText) {
      setIntroductionValidationText(introductionErrorText);
      setIsIntroductionError(true);
    } else {
      setIntroductionValidationText("");
      setIsIntroductionError(false);
    }
  };

  return (
    <>
      {owner ? "i am owner" : "no owner"}
      {clickCopy && <ErrorMessage text={errorText} />}
      <Grid container alignItems="center" justifyContent="center">
        <Grid item>
          <Paper variant="outlined">
            <Card sx={{ minWidth: 300, width: "40vh" }}>
              <CardContent sx={{ pb: 0 }}>
                <Box sx={{ textAlign: "right" }}>
                  <IconButton onClick={() => setMenuOpen(!menuOpen)}>
                    <MenuIcon />
                  </IconButton>
                </Box>
                <Typography variant="h5" sx={{ textAlign: "center" }}>
                  {nameText}
                </Typography>
                <Box sx={{ textAlign: "center", py: 1 }}>
                  <AccountCircleIcon sx={{ fontSize: 50 }} />
                </Box>
                <Typography variant="body2">{introductionText}</Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={recieveQuestion}
                        size="small"
                        onChange={(e) => onCheckBoxChange(e.target.checked)}
                      />
                    }
                    label="他の人からの質問を受け取る"
                  />
                </FormGroup>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => setProfileOpen(true)}
                  sx={{ margin: "auto" }}
                  variant="outlined"
                >
                  プロフィールを編集する
                </Button>
              </CardActions>
              <CardActions>
                <input
                  type="text"
                  value={url}
                  readOnly
                  style={{ width: "80%" }}
                />
                <Tooltip title="copy">
                  <IconButton
                    sx={{ margin: "0 0 0 auto" }}
                    onClick={() => copyTextToClipboard(url)}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ textAlign: "center" }}>
        <IconButton>
          <QuestionAnswerIcon sx={{ fontSize: 50 }} />
        </IconButton>
        {/* 質問募集中 */}
        <Typography variant="h5">質問を投稿しよう</Typography>
      </Box>
      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={() => setMenuOpen(!menuOpen)}
      >
        <Box sx={{ width: "33vw" }}>
          <List>
            <Link href="/dashboard" passHref>
              <ListItem button>
                <ListItemIcon>
                  <ArrowBackSharpIcon />
                </ListItemIcon>
                <ListItemText primary="prev" />
              </ListItem>
            </Link>
            <ListItem button onClick={onLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>

              <ListItemText primary="logout" />
            </ListItem>
            {userLists.map((user) => {
              return (
                <ListItem key={user.id}>
                  <Link href={user.id} passHref>
                    <ListItemButton>
                      <ListItemIcon>
                        <AccountCircleIcon fontSize="large" />
                      </ListItemIcon>
                      <ListItemText primary={user.name} />
                    </ListItemButton>
                  </Link>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
      <Modal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
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
            <Grid item>
              <Button variant="text" onClick={() => setProfileOpen(false)}>
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="text"
                onClick={onProfileChange}
                disabled={!isNameError}
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
              <TextField
                label="名前"
                type="text"
                defaultValue={nameText}
                inputRef={nameRef}
                id="nametext"
                error={isNameError}
                helperText={nameValidationText}
                onChange={(e) => onInputName(e.target.value)}
              />
            </Grid>
            <Grid item>
              <TextField
                label="自己紹介"
                multiline
                rows={10}
                defaultValue={introductionText}
                inputRef={introductionRef}
                id="introductiontext"
                error={isIntroductionError}
                helperText={introductionValidationText}
                onChange={(e) => {
                  onInputIntroduction(e.target.value);
                }}
              />
            </Grid>
            <Box sx={{ margin: "0 0 0 auto" }}>
              <Counter maxLength={200} currentLength={introductionCount} />
            </Box>
          </Grid>
        </Box>
      </Modal>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addPost();
        }}
        autoComplete="off"
      >
        <label htmlFor="question">question</label>
        <input
          type="text"
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <label htmlFor="answer">answer</label>
        <input
          type="text"
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <button type="submit" disabled={!question}>
          submit
        </button>
      </form>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              centered
            >
              <Tab label="回答済み" value="1" />
              <Tab label="未回答" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <Questions posts={posts} answered={true} />
          </TabPanel>
          <TabPanel value="2">
            <Questions posts={posts} answered={false} />
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // context.paramsでurlを受け取る。context.queryで?以下を受け取れる
  const id = context.params ? context.params.id : null;
  const docRef = doc(db, "display_name", String(id));
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      params: id,
      postOwnerId: docSnap.data().user,
    },
  };
};

export default Profile;
