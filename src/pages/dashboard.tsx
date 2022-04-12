import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

import nookies from "nookies";

import { onLogout } from "../utils/functions";
import { firebaseAdmin } from "../../firebaseAdmin";
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
import Button from "@mui/material/Button";

import Delete from "@mui/icons-material/Delete";

import { db, timeStamp } from "../../utils";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { checkNameValidation } from "../utils/validation";
import NameTextField from "../components/atoms/NameTextField";

const DashboardPage: NextPage<{ email: string; uid: string }> = ({
  email,
  uid,
}) => {
  const [name, setName] = useState<string>("");
  const [showButton, setShowButton] = useState<boolean>(false);
  const [displayNames, setDisplayNames] = useState<DisplayName[]>([]);

  type DisplayName = {
    id: string;
    name: string;
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

  const addDisplayName = async () => {
    const docRef = await addDoc(collection(db, "display_name"), {
      name: name,
      user: uid,
      recieve_question: false,
      self_introduction: `I am ${name} Nice to meet you`,
      timestamp: timeStamp,
    });

    setName("");
  };
  const onNameChange = (text: string) => {
    setName(text);
  };

  useEffect(() => {
    const displayNameRef = collection(db, "display_name");
    const q = query(
      displayNameRef,
      where("user", "==", uid),
      orderBy("timestamp", "desc")
    );

    onSnapshot(q, (querySnapshot) => {
      const lists: DisplayName[] = [];
      querySnapshot.forEach((doc) => {
        lists.push({
          name: doc.data().name,
          id: doc.id,
        });
      });

      setDisplayNames([...lists]);
    });
  }, [uid]);

  return (
    <div>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <Grid item>
          <Grid container alignItems="center" direction="row" spacing={2}>
            <Grid item>
              <h2>Welcome to About me</h2>
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
            {showButton && (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addDisplayName;
                  }}
                >
                  <NameTextField
                    name={name}
                    onNameChange={onNameChange}
                    variant="standard"
                  />
                  <Button
                    variant="contained"
                    endIcon={<PersonAddAlt1 />}
                    onClick={addDisplayName}
                    type="submit"
                    disabled={
                      !!checkNameValidation(name) || displayNames.length >= 10
                    }
                  >
                    作成
                  </Button>
                </form>
              </>
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

  const user = await firebaseAdmin
    .auth()
    .verifySessionCookie(session, true)
    .catch(() => null);

  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      email: user.email,
      uid: user.uid,
    },
  };
};

export default DashboardPage;
