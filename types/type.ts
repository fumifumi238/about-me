import { FieldValue } from "firebase/firestore";

export type Posts = {
  id: string;
  question: string;
  answer?: string | null;
  user: string;
  display_name: string;
  timestamp: FieldValue;
};

export type UserLists = {
  id: string;
  name: string;
};

export type QuestionProps = {
  posts: Posts[];
  answered: boolean;
};
