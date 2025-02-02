import axios from "axios";
import toast from "react-hot-toast";
import {Comment} from "../Interfaces/Comment/Comment.ts";

const apiUrl = `${import.meta.env.VITE_API_URL}/Comment`;

export const createCommentAPI = async (content: string, postId: string) => {
  try {
    return await axios.post<Comment>(`${apiUrl}/Create`, {content, postId});
  } catch (error: any) {
    toast.error(error.response?.data ?? "Greška pri kreiranju komentara.");
    return undefined;
  }
};