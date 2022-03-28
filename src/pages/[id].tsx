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
import { db, getFirebaseAuth, logout, timeStamp } from "../../utils";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef, useState } from "react";

import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import ShareIcon from "@mui/icons-material/Share";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { Checkbox, FormControlLabel, FormGroup, Paper } from "@mui/material";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Card,
  CardActions,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import Questions from "../components/Questions";
import { Posts, UserLists } from "../../types/type";
import { useRouter } from "next/router";

export const Profile: NextPage<{
  params: string;
  postOwnerId: string;
  displayName: string;
  selfIntroduction: string;
  recieveQuestion: boolean;
}> = ({
  params,
  postOwnerId,
  displayName,
  selfIntroduction,
  recieveQuestion,
}) => {
  const nameRef = useRef<HTMLInputElement>(null!);
  const introductionRef = useRef<HTMLInputElement>(null!);

  const [owner, setOwner] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [posts, setPosts] = useState<Posts[]>([]);
  const [introductionText, setIntroductionText] =
    useState<string>(selfIntroduction);
  const [nameText, setNameText] = useState<string>(displayName);

  const [profileOpen, setProfileOpen] = useState<boolean>(false);

  const [userLists, setUserLists] = useState<UserLists[]>([]);

  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const [allowQuestion, setAllowQuestion] = useState<boolean>(recieveQuestion);

  const [value, setValue] = useState<string>("1");

  const router = useRouter();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "33%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const onLogout = async () => {
    const confirm = window.confirm("ログアウトしますか?");
    if (!confirm) {
      return;
    }
    await logout();
    router.push("/");
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
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data().name);
        if (doc.id !== params) {
          lists.push({ name: doc.data().name, id: doc.id });
        }
      });
      setUserLists([...lists]);
    };
    fetchData();
  }, [params, postOwnerId]);

  const onProfileChange = async () => {
    const inputName = nameRef.current.value;
    setNameText(inputName);

    const inputIntroduction = introductionRef.current.value;
    setIntroductionText(inputIntroduction);
    console.log(inputName, inputIntroduction);

    const profileRef = doc(db, "display_name", params);

    await updateDoc(profileRef, {
      name: inputName,
      self_introduction: inputIntroduction,
    });

    setProfileOpen(false);
  };

  const check = (bool: boolean) => {
    return bool;
  };

  const copyTextToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      function () {
        console.log("Async: Copying to clipboard was successful!");
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  };

  const onCheckBoxChange = async (bool: boolean) => {
    setAllowQuestion(bool);
    const profileRef = doc(db, "display_name", params);
    await updateDoc(profileRef, {
      recieve_question: bool,
    });
    console.log(bool);
  };

  const bull = (
    <Box
      component="span"
      sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
    ></Box>
  );
  return (
    <>
      {owner ? "i am owner" : "no owner"}
      <Grid container alignItems="center" justifyContent="center">
        <Grid item>
          <Paper variant="outlined">
            <Card sx={{ minWidth: 275 }}>
              <CardContent sx={{ pb: 0 }}>
                <IconButton onClick={() => setMenuOpen(!menuOpen)}>
                  <MenuIcon />
                </IconButton>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Word of the Day
                </Typography>
                <Typography variant="h5" component="div">
                  be{bull}nev{bull}o{bull}lent
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  adjective
                </Typography>
                <Typography variant="body2">
                  well meaning and kindly.
                  <br />
                  {'"a benevolent smile"'}
                </Typography>
                <Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={allowQuestion}
                          size="small"
                          onChange={(e) => onCheckBoxChange(e.target.checked)}
                        />
                      }
                      label="他の人からの質問を受け取る"
                    />
                  </FormGroup>
                </Typography>
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
                <IconButton sx={{ margin: "0 0 0 auto" }}>
                  <ShareIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Paper>
        </Grid>
      </Grid>

      <p>自己紹介　{introductionText}</p>
      <p>名前　{nameText}</p>
      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={() => setMenuOpen(!menuOpen)}
      >
        <Box sx={{ width: 400 }}>
          <List>
            <ListItem button onClick={onLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="logout" />
            </ListItem>
          </List>
          <ul>
            {userLists.map((user) => {
              return (
                <li key={user.id}>
                  <p>{user.name}</p>
                </li>
              );
            })}
          </ul>
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
                disabled={check(false)}
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
              />
            </Grid>
            <Grid item>
              <TextField
                label="自己紹介"
                multiline
                minRows={4}
                defaultValue={introductionText}
                inputRef={introductionRef}
                id="introductiontext"
              />
            </Grid>
          </Grid>
        </Box>
      </Modal>
      {/* 質問ボタン */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addPost();
        }}
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
            <TabList onChange={handleChange} aria-label="lab API tabs example">
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
      displayName: docSnap.data().name,
      selfIntroduction: docSnap.data().self_introduction,
      recieveQuestion: docSnap.data().recieve_question,
    },
  };
};

export default Profile;
