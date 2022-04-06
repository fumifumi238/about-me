import { useState } from "react";
import ModalForm from "../components/organisms/ModalForm";

const Foo = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const onButtonOpen = () => {
    setOpen(!open);
  };
  const tags: JSX.Element = (
    <>
      <h1>hello</h1>
      <h2>Nice to meet you</h2>
      <h1>{value}</h1>
      <button onClick={() => setValue("aaaaaa")}></button>
    </>
  );

  return (
    <>
      <button onClick={onButtonOpen}>質問を投稿しよう</button>
      <ModalForm setState={onButtonOpen} open={open} tags={tags} />
    </>
  );
};

export default Foo;
