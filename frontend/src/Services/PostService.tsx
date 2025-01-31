import axios from "axios";
import {CreatePostDTO} from "../Interfaces/Post/CreatePostDTO.ts";
import {Post} from "../Interfaces/Post/Post.ts";
import toast from "react-hot-toast";
import {PaginatedResponseDTO} from "../Interfaces/Pagination/PaginatedResponseDTO.ts";

const apiUrl = `${import.meta.env.VITE_API_URL}/Post`;

export const createPostAPI = async (postDto: CreatePostDTO) => {
  try {
    return await axios.post<Post>(`${apiUrl}/Create`, postDto);
  } catch (error: any) {
    toast.error(error.response?.data ?? "Greška pri kreiranju objave.");
    return undefined;
  }
};

export const getAllPostsAPI = async (page: number = 1, pageSize: number = 10) => {
  try {
    return await axios.get<PaginatedResponseDTO<Post>>(`${apiUrl}/GetAll`, {
      params: { page, pageSize }
    });
  } catch (error: any) {
    toast.error(error.response?.data ?? "Greška pri preuzimanju objava.");
    return undefined;
  }
};

export const updatePostAPI = async (postId: string, title: string, content: string) => {
  try {
    return await axios.put<boolean>(`${apiUrl}/Update/${postId}`, {title, content});
  } catch (error: any) {
    toast.error(error.response?.data ?? "Greška pri ažuriranju objave.");
    return undefined;
  }
};

export const deletePostAPI = async (postId: string) => {
  try {
    return await axios.delete(`${apiUrl}/Delete/${postId}`);
  } catch (error: any) {
    toast.error(error.response?.data ?? "Greška pri brisanju objave.");
    return undefined;
  }
};