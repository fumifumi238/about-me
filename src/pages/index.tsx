import { GetServerSideProps, NextPage } from "next";

import nookies from "nookies";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";

import { firebaseAdmin } from "../../firebaseAdmin";
import LoginForm from "../components/templetes/LoginForm";
import LoginModal from "../components/templetes/LoginModal";

const Home: NextPage = () => {
  return (
    <div>
      <h1>About me</h1>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <Grid item>
          <Card variant="outlined" sx={{ border: 1 }}>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
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
  if (user) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  console.log("user");
  // uidそのままは危険化かも
  return {
    props: {},
  };
};

export default Home;
