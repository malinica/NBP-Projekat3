import axios from "axios";
import {AuthResponseDTO} from "../Interfaces/User/AuthResponseDTO.ts";
import toast from "react-hot-toast";
import {User} from "../Interfaces/User/User.ts";

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

export const registerAPI = async (email: string, username: string, password: string, phoneNumber: string) => {
  try {
    return await axios.post<AuthResponseDTO>(apiUrl + "/Register", {
      email,
      username,
      password,
      phoneNumber
    });
  }
  catch (error: any) {
    toast.error(error.response?.data ?? "Neuspešna registracija.");
    return undefined;
  }
}

export const getUserByIdAPI = async (id: string) => {
  try {
    return await axios.get<User>(`${apiUrl}/GetUserById/${id}`);
  }
  catch (error: any) {
    toast.error(error.response?.data ?? "Neuspešno učitavanja podataka o korisniku.");
    return undefined;
  }
}
