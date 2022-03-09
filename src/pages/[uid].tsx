
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { firebaseAdmin } from "../../firebaseAdmin";

export const Profile: NextPage<{uid: string}> = ({uid}) =>{
  return (
    <>
    <p>a</p>
      <p>{uid}</p>
    </>
  );
}

export const getServerSideProps:GetServerSideProps = async (context)=>{
  // context.paramsでurlを受け取る。context.queryで?以下を受け取れる
 const uid = context.params?context.params.uid:null;
 let err;
 
 await firebaseAdmin.auth().getUser(String(uid)).then((userRecord)=>{
  console.log(userRecord)
 }).catch(error =>{
   console.log(error)
  err = true
 })

 if (err) {
   return {
     notFound: true,
   };
 }

 return {
   props: { uid },
 };
}

export default Profile
