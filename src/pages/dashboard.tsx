import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

import nookies from "nookies";
import { useRouter } from "next/router";

import { logout } from "../../utils"; // 上記で実装したファイル
import { firebaseAdmin } from "../../firebaseAdmin"; // この後に実装するファイル
import { useEffect, useState } from "react";

import AccountCircle from "@mui/icons-material/AccountCircle";
import PersonAddAlt1 from "@mui/icons-material/PersonAddAlt1"

import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { Delete } from "@mui/icons-material";

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

  type DisplayName = {
    id: string;
    name: string;
    self_introduction: string | null;
  };

  const onLogout = async () => {
    await logout(); // ログアウトさせる
    router.push("/login"); // ログインページへ遷移させる
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
    console.log("Document deleted with ID: ", displayNameId);
  };

  const addDisplayName = async () => {
    const docRef = await addDoc(collection(db, "display_name"), {
      name: name,
      user: uid,
      recieve_question: false,
    });
    console.log("Document written with ID: ", docRef.id);
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
          self_introduction: doc.data().self_introduction,
        });
      });

      console.log("Current cities in CA: ", lists.join(", "));
      setDisplayNames([...lists]);
    });
  }, [uid]);

  return (
    <div>
      <h1>Dashboard Pages</h1>

      <h2>email: {email}</h2>
      <h3>plese add user(up to 10)</h3>
      <IconButton>
        <PersonAddAlt1 onClick={toggleInputButton} />
      </IconButton>
      {showButton ? (
        <>
          <input
            type="text"
            value={name}
            placeholder="20文字以内"
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={addDisplayName}
            disabled={displayNames.length >= 10 || name.length > 20}
          >
            add user
          </button>
        </>
      ) : (
        <></>
      )}
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {displayNames.map((displayName) => {
          return (
            <ListItem
              key={displayName.id}
              secondaryAction={
                <IconButton aria-label="Delete">
                  <Delete
                    fontSize="large"
                    onClick={() => deleteDisplayName(displayName.id)}
                  />
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

      <button onClick={onLogout}>Logout</button>
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
        destination: "/login",
        permanent: false,
      },
    };
  }
  console.log("user");

  return {
    props: {
      email: user.email,
      uid: user.uid,
    },
  };
};

export default DashboardPage;
