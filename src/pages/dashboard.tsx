import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

import nookies from "nookies";
import { useRouter } from "next/router";

import { logout } from "../../utils"; // 上記で実装したファイル
import { firebaseAdmin } from "../../firebaseAdmin"; // この後に実装するファイル
import { useEffect, useState } from "react";

import AccountCircle from "@mui/icons-material/AccountCircle";
import PersonAddAlt1 from "@mui/icons-material/PersonAddAlt1";

import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import Delete from "@mui/icons-material/Delete";

import { db } from "../../utils";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

const DashboardPage: NextPage<{ email: string; uid: string }> = ({
  email,
  uid,
}) => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [showButton, setShowButton] = useState<boolean>(false);
  const [displayNames, setDisplayNames] = useState<DisplayName[]>([]);
  const [inputError, setInputError] = useState<boolean>(false);
  const [helperText, setHelperText] = useState<string>("");

  type DisplayName = {
    id: string;
    name: string;
  };

  const onLogout = async () => {
    const confirm = window.confirm("ログアウトしますか?");
    if (!confirm) {
      return;
    }
    await logout();
    router.push("/");
  };

  const toggleInputButton = () => {
    setShowButton(!showButton);
  };

  const deleteDisplayName = async (displayNameId: string) => {
    const confirm = window.confirm("本当に削除していいですか?");
    if (!confirm) {
      return;
    }
    const docRef = await deleteDoc(doc(db, "display_name", displayNameId));
  };

  const onInputName = (InputName: string) => {
    setName(InputName);
    const len = InputName.length;
    const min = 0;
    const max = 20;
    checkNameValidation(len > min, len < max);
  };

  const checkNameValidation = (min: boolean, max: boolean) => {
    if (!min) {
      setHelperText("空白にしないでください");
      setInputError(true);
    } else if (!max) {
      setHelperText("20文字以内で入力してください");
      setInputError(true);
    } else {
      setHelperText("");
      setInputError(false);
    }
  };

  const addDisplayName = async () => {
    const docRef = await addDoc(collection(db, "display_name"), {
      name: name,
      user: uid,
      recieve_question: false,
      self_introduction: `I am ${name} Nice to meet you`,
    });
    console.log("Document written with ID: ", docRef.id);
    setName("");
  };

  useEffect(() => {
    const displayNameRef = collection(db, "display_name");
    const q = query(displayNameRef, where("user", "==", uid));

    onSnapshot(q, (querySnapshot) => {
      const lists: DisplayName[] = [];
      querySnapshot.forEach((doc) => {
        lists.push({
          name: doc.data().name,
          id: doc.id,
        });
      });

      console.log("Current cities in CA: ", lists.join(", "));
      setDisplayNames([...lists]);
    });
  }, [uid]);

  useEffect(() => {
    if (displayNames.length >= 10) {
      setHelperText("作成できるユーザーは10人までです");
      setInputError(true);
      return;
    }
    setHelperText("");
    setInputError(false);
  }, [displayNames]);

  return (
    <div>
      {/* タイムスタンプを付ける */}
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <Grid item>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <h1>Welcome to About me</h1>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={onLogout}>
                Log out
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <h2>email: {email}</h2>
        </Grid>
        <Grid item>
          <Grid container alignItems="center" spacing={0.5}>
            <Grid item>
              <h3>ユーザーは10人まで作成できます</h3>
            </Grid>
            <Grid item>
              <IconButton onClick={toggleInputButton}>
                <PersonAddAlt1 />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container alignItems="center">
            {showButton ? (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addDisplayName;
                  }}
                >
                  <TextField
                    error={inputError}
                    type="text"
                    label="Name"
                    value={name}
                    placeholder="20文字以内"
                    variant="standard"
                    helperText={helperText}
                    onChange={(e) => onInputName(e.target.value)}
                    disabled={displayNames.length >= 10}
                  />
                  <Button
                    variant="contained"
                    endIcon={<PersonAddAlt1 />}
                    onClick={addDisplayName}
                    type="submit"
                    disabled={
                      !name || displayNames.length >= 10 || name.length > 20
                    }
                  >
                    作成
                  </Button>
                </form>
              </>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </Grid>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          margin: "auto",
        }}
      >
        {displayNames.map((displayName) => {
          return (
            <ListItem
              key={displayName.id}
              secondaryAction={
                <IconButton
                  aria-label="Delete"
                  onClick={() => deleteDisplayName(displayName.id)}
                >
                  <Delete fontSize="large" />
                </IconButton>
              }
              disablePadding
            >
              <Link href={displayName.id} passHref>
                <ListItemButton>
                  <ListItemIcon>
                    <AccountCircle fontSize="large" />
                  </ListItemIcon>
                  <ListItemText primary={displayName.name} />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const session = cookies.session || "";
  // セッションIDを検証して、認証情報を取得する
  const user = await firebaseAdmin
    .auth()
    .verifySessionCookie(session, true)
    .catch(() => null);

  // 認証情報が無い場合は、ログイン画面へ遷移させる
  // ここfoodにも実装する
  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  console.log("user");
  // uidそのままは危険化かも
  return {
    props: {
      email: user.email,
      uid: user.uid,
    },
  };
};

export default DashboardPage;
