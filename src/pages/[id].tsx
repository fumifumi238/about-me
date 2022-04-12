import { GetServerSideProps, NextPage } from "next";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  updateDoc,
} from "firebase/firestore";

import { db, getFirebaseAuth } from "../../utils";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import ListItemButton from "@mui/material/ListItemButton";
import Paper from "@mui/material/Paper";

import ErrorMessage from "../components/atoms/ErrorMessage";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import CardActions from "@mui/material/CardActions";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import Questions from "../components/organisms/Questions";
import { Posts, UserLists } from "../../types/type";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { onLogout } from "../utils/functions";
import ProfileModal from "../components/templetes/ProfileModal";
import CreateQuestion from "../components/templetes/CreateQuestion";
import MenuDrawer from "../components/organisms/MenuDrawer";

export const Profile: NextPage<{
  params: string;
  postOwnerId: string;
}> = ({ params, postOwnerId }) => {
  const [owner, setOwner] = useState<boolean>(false);
  const [uid, setUid] = useState<string>("");
  const [posts, setPosts] = useState<Posts[]>([]);

  const [nameText, setNameText] = useState<string>("");

  const [introductionText, setIntroductionText] = useState<string>("");

  const [recieveQuestion, setRecieveQuestion] = useState<boolean>(false);

  const [value, setValue] = useState<string>("1");

  const [error, setError] = useState<boolean>(false);

  const [errorText, setErrorText] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const url: string = `http://localhost:3000/${params}`;

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    const auth = getFirebaseAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.uid === postOwnerId) {
          setOwner(true);
        }
        setUid(user.uid);
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
    const fetchDisplayName = async () => {
      const docRef = doc(db, "display_name", params);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setNameText(docSnap.data().name);
        setIntroductionText(docSnap.data().self_introduction);
        setRecieveQuestion(docSnap.data().recieve_question);
      }
    };
    fetchDisplayName();
    setLoading(true);
  }, [params]);

  const copyTextToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      function () {
        setErrorText("URL がコピーされました。");
        setError(true);
      },
      function (err) {
        setErrorText("コピーできませんでした。");
        setError(true);
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

  const errorMessageOpen = () => {
    setError(!error);
  };

  const updateIntroductionText = (text: string) => {
    setIntroductionText(text);
  };

  const updateNameText = (text: string) => {
    setNameText(text);
  };
  return (
    <>
      <ErrorMessage text={errorText} error={error} open={errorMessageOpen} />
      <Grid container alignItems="center" justifyContent="center" mt={2}>
        <Grid item>
          <Paper variant="outlined">
            <Card sx={{ minWidth: 300, width: "40vh" }}>
              <CardContent sx={{ pb: 0 }}>
                <Box sx={{ textAlign: "right" }}>
                  <MenuDrawer
                    params={params}
                    postOwnerId={postOwnerId}
                    currentUser={uid}
                  />
                </Box>
                <Typography variant="h5" sx={{ textAlign: "center" }}>
                  {nameText}
                </Typography>
                <Box sx={{ textAlign: "center", py: 1 }}>
                  <AccountCircleIcon sx={{ fontSize: 50 }} />
                </Box>
                <Typography variant="body2">{introductionText}</Typography>
                {owner && (
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
                )}
              </CardContent>
              <CardActions>
                {loading && owner && (
                  <ProfileModal
                    params={params}
                    nameText={nameText}
                    setNameText={updateNameText}
                    introductionText={introductionText}
                    setIntroductionText={updateIntroductionText}
                  />
                )}
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
        <CreateQuestion
          owner={owner}
          params={params}
          postOwnerId={postOwnerId}
          uid={uid}
          recieveQuestion={recieveQuestion}
        />
      </Box>
      <Box sx={{ width: "100%", typography: "body1" }}>
        {owner ? (
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
              <Questions posts={posts} answered={true} owner={true} />
            </TabPanel>
            <TabPanel value="2">
              <Questions posts={posts} answered={false} owner={true} />
            </TabPanel>
          </TabContext>
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: "divider", my: 3 }}>
              <Typography sx={{ textAlign: "center" }} variant="h4">
                回答済みの質問
              </Typography>
            </Box>
            <Questions posts={posts} answered={true} owner={false} />
          </>
        )}
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
