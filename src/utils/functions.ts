import Router from "next/router";
import { logout } from "../../utils";

export const foo = () => {};

export const onLogout = async () => {
  const confirm = window.confirm("ログアウトしますか?");
  if (!confirm) {
    return;
  }
  await logout();
  Router.push("/");
};
