import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
} from "@mui/material";
import { Box } from "@mui/system";
import { onAuthStateChanged } from "firebase/auth";
import { query, collection, where, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserLists } from "../../../types/type";
import { getFirebaseAuth, db } from "../../../utils";
import { onLogout } from "../../utils/functions";
import LoginModal from "../templetes/LoginModal";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";

type Props = {
  params: string;
  postOwnerId: string;
  currentUser: string;
};
const MenuDrawer: React.FC<Props> = ({ params, postOwnerId, currentUser }) => {
  const [userLists, setUserLists] = useState<UserLists[]>([]);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  useEffect(() => {
    const auth = getFirebaseAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        fetchData(uid);
      } else {
        return;
      }
    });

    const fetchData = async (uid: string) => {
      const q = query(collection(db, "display_name"), where("user", "==", uid));
      const querySnapshot = await getDocs(q);
      const lists: UserLists[] = [];
      const unsubscribe = querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data().name);
        if (doc.id !== params) {
          lists.push({ name: doc.data().name, id: doc.id });
        }
      });
      unsubscribe;
      setUserLists([...lists]);
    };
  }, [params, postOwnerId]);

  return (
    <>
      <IconButton onClick={() => setMenuOpen(!menuOpen)}>
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={() => setMenuOpen(!menuOpen)}
      >
        <Box sx={{ width: "33vw" }}>
          <List>
            {currentUser ? (
              <>
                <Link href="/dashboard" passHref>
                  <ListItem button>
                    <ListItemIcon>
                      <ArrowBackSharpIcon />
                    </ListItemIcon>
                    <ListItemText primary="back" />
                  </ListItem>
                </Link>
                <ListItem button onClick={onLogout}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>

                  <ListItemText primary="logout" />
                </ListItem>
                {userLists.map((user) => {
                  return (
                    <ListItem key={user.id}>
                      <Link href={user.id} passHref>
                        <ListItemButton>
                          <ListItemIcon>
                            <AccountCircleIcon fontSize="large" />
                          </ListItemIcon>
                          <ListItemText primary={user.name} />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                  );
                })}
              </>
            ) : (
              <>
                <Link href="/" passHref>
                  <ListItem button>
                    <ListItemIcon>
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                  </ListItem>
                </Link>
                <LoginModal params={params} />
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default MenuDrawer;
