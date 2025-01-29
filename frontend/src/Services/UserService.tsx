import axios from "axios";
import {AuthResponseDTO} from "../Interfaces/User/AuthResponseDTO.ts";
import toast from "react-hot-toast";

const apiUrl = `${import.meta.env.VITE_API_URL}/User`;

export const loginAPI = async (email: string, password: string) => {
  try {
    return await axios.post<AuthResponseDTO>(apiUrl + "/Login", {
      email,
      password
    });
  }
  catch (error: any) {
    toast.error(error.response?.data ?? "Neuspešna prijava.");
    return undefined;
  }
}

export const registerAPI = async (email: string, username: string, password: string) => {
  try {
    return await axios.post<AuthResponseDTO>(apiUrl + "/Register", {
      email: email,
      username: username,
      password: password
    });
  }
  catch (error: any) {
    toast.error(error.response?.data ?? "Neuspešna registracija.");
    return undefined;
  }
}