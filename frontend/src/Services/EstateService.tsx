import axios from "axios";
import {Estate} from "../Interfaces/Estate/Estate.ts";
import toast from "react-hot-toast";
const apiUrl = `${import.meta.env.VITE_API_URL}/Estate`;

export const createEstateAPI = async (category:string,createEstate: Estate) => {
    try {
        const response = await axios.post<Estate>(apiUrl + `/CreateEstate/${category}}`, createEstate, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response;
    }
    catch(error:any) {
        toast.error(error.response.data);
    }
}