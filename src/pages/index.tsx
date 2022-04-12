import { GetServerSideProps, NextPage } from "next";

import nookies from "nookies";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { firebaseAdmin } from "../../firebaseAdmin";
import LoginForm from "../components/templetes/LoginForm";

const Home: NextPage = () => {
  return (
    <div>
      <Typography variant="h2" sx={{ textAlign: "center" }}>
        Welcome to About me
      </Typography>
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

  const user = await firebaseAdmin
    .auth()
    .verifySessionCookie(session, true)
    .catch(() => null);

  if (user) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Home;
