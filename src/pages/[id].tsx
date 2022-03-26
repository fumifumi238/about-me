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
  FieldValue,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { db, getFirebaseAuth, timeStamp } from "../../utils";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

export const Profile: NextPage<{
  params: string;
  postOwnerId: string;
  displayName: string;
  selfIntroduction: string;
}> = ({ params, postOwnerId, displayName, selfIntroduction }) => {
  const nameRef = useRef<HTMLInputElement>(null!);
  const introductionRef = useRef<HTMLTextAreaElement>(null!);

  const [owner, setOwner] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [posts, setPosts] = useState<Posts[]>([]);
  const [introductionText, setIntroductionText] =
    useState<string>(selfIntroduction);
  const [nameText, setNameText] = useState<string>(displayName);

  const [profileOpen, setProfileOpen] = useState<boolean>(false);

  const [userLists, setUserLists] = useState<UserLists[]>([]);

  const answeredPosts = posts.filter((post) => {
    return post.answer;
  });

  type Posts = {
    id: string;
    question: string;
    answer?: string | null;
    user: string;
    display_name: string;
    timestamp: FieldValue;
  };

  type UserLists = {
    id: string;
    name: string;
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
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
    const q = query(
      collection(db, "display_name"),
      where("user", "==", postOwnerId)
    );
    const fetchData = onSnapshot(q, (querySnapshot) => {
      const lists: UserLists[] = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data().name);
        lists.push({ name: doc.data().name, id: doc.id });
      });
      setUserLists([...lists]);
    });
    fetchData;
  }, [postOwnerId]);

  const onProfileChange = async () => {
    const inputName = nameRef.current.value;
    setNameText(inputName);

    const inputIntroduction = introductionRef.current.value;
    setIntroductionText(inputIntroduction);

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
  return (
    <>
      {owner ? "i am owner" : "no owner"}
      <p>display_name: {displayName}</p>
      <p>user_id:{postOwnerId}</p>
      <p>display_name_id:{params}</p>
      <p>{selfIntroduction}</p>
      <p>{introductionText}</p>
      <p>{nameText}</p>
      <Button onClick={() => setProfileOpen(true)}>
        プロフィールを編集する
      </Button>
      <ul>
        {userLists.map((user) => {
          return (
            <li key={user.id}>
              <p>{user.name}</p>
            </li>
          );
        })}
      </ul>
      <Modal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <label htmlFor="nametext">名前</label>
          <input
            type="text"
            defaultValue={nameText}
            ref={nameRef}
            id="nametext"
          />
          <label htmlFor="introductiontext">自己紹介</label>
          <textarea
            defaultValue={introductionText}
            ref={introductionRef}
            id="introductiontext"
            cols={20}
            rows={20}
          ></textarea>
          <button onClick={() => setProfileOpen(false)} type="submit">
            キャンセル
          </button>
          <button onClick={onProfileChange} disabled={check(false)}>
            保存
          </button>
        </Box>
      </Modal>
      {/* まだ答えてない質問,質問ボタン */}
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
      <p>解答済みの質問</p>
      <ul>
        {answeredPosts.map((post) => {
          return (
            <li key={post.id}>
              <p>{post.question}</p>
              <p>{post.answer}</p>
              <p>{post.user}</p>
              <p>{post.display_name}</p>
            </li>
          );
        })}
      </ul>
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
    },
  };
};

export default Profile;
