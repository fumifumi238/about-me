import type { GetServerSideProps, NextPage } from "next";

import nookies from "nookies";
import { useRouter } from "next/router";

import { logout } from "../../utils"; // 上記で実装したファイル
import { firebaseAdmin } from "../../firebaseAdmin"; // この後に実装するファイル
import { useEffect, useState } from "react";

import { db } from "../../utils";
import { collection, addDoc,query,where,onSnapshot} from "firebase/firestore";

const DashboardPage: NextPage<{ email: string,uid:string }> = ({ email,uid }) => {
  const router = useRouter();
  const [name,setName] = useState<string>("")
  const [display,setDisplay] = useState<boolean>(false)
  const [displayName,setDisplayName] = useState<DisplayName[]>([])

  type DisplayName = {
    id: string,
    name: string
  }

  const onLogout = async () => {
    await logout(); // ログアウトさせる
    router.push("/login"); // ログインページへ遷移させる
  };

  const toggleInputButton = () =>{
    setDisplay(!display)
  }

  const addDisplayName = async ()=>{
  const docRef = await addDoc(collection(db, "bbbb"), {
    name: name,
    user: uid,
  });
  console.log("Document written with ID: ", docRef.id);
  }

  useEffect(()=>{
    const citiesRef = collection(db, "bbbb");
    const q = query(citiesRef, where("user", "==", uid));
    onSnapshot(q, (querySnapshot) => {
      const lists:DisplayName[] = [];
      querySnapshot.forEach((doc) => {
        lists.push({name: doc.data().name,id:doc.id});
      });
      console.log("Current cities in CA: ", lists.join(", "));
      setDisplayName([...lists])
    });
  },[uid])
  return (
    <div>
      <h1>Dashboard Pages</h1>

      <h2>email: {email}</h2>
      <ul>
       {displayName.map((foo)=>{
         return <li key={foo.id}>{foo.id},{foo.name}</li>
       })}
      </ul>
      {display ? (
        <button onClick={toggleInputButton}>+</button>
      ) : (
        <>
          <button onClick={toggleInputButton}>-</button>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={addDisplayName}>add user</button>
        </>
      )}

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

  return {
    props: {
      email: user.email,
      uid: user.uid
    },
  };
};

export default DashboardPage;
