import { GetServerSideProps, NextPage } from "next";
import { firebaseAdmin } from "../../firebaseAdmin";
import { doc,getDoc } from "firebase/firestore";
import { db, getFirebaseAuth } from "../../utils";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export const Profile: NextPage<{ params: string,postOwnerId: string}> = ({params,postOwnerId}) => {
  const [owner,setOwner] = useState<boolean>(false)
    type Posts = {
      quention: string;
      answer?: string;
      user: string;
      display_name:string;
    };
    useEffect(()=>{
      const auth = getFirebaseAuth();
      onAuthStateChanged(auth, (user) => {
        if (user && user.uid === postOwnerId) {
          setOwner(true)
          console.log(user.uid,"you are owner");
        } else {
          console.log("no user");
        }
      });
    },[postOwnerId])
  return (
    <>
      <p>a</p>
      {owner?"i am owner":"no owner"}
      <p>user_id:{postOwnerId}</p>
      <p>display_name_id:{params}</p>
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
      postOwnerId: docSnap.data().user
    },
  };
};

export default Profile;
