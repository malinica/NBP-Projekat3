import axios from "axios";
import toast from "react-hot-toast";
import {Comment} from "../Interfaces/Comment/Comment.ts";
import {PaginatedResponseDTO} from "../Interfaces/Pagination/PaginatedResponseDTO.ts";

const apiUrl = `${import.meta.env.VITE_API_URL}/Comment`;

export const createCommentAPI = async (content: string, postId: string) => {
  try {
    return await axios.post<Comment>(`${apiUrl}/Create`, {content, postId});
  } catch (error: any) {
    toast.error(error.response?.data ?? "Greška pri kreiranju komentara.");
    return undefined;
  }
};

export const getCommentsForPostAPI = async (postId: string, page: number = 1, pageSize: number = 10) => {
  try {
    return await axios.get<PaginatedResponseDTO<Comment>>(`${apiUrl}/GetCommentsForPost/${postId}`, {
      params: { page, pageSize },
    });
  } catch (error: any) {
    toast.error(error.response?.data ?? "Greška pri učitavanju komentara.");
    return undefined;
  }
};