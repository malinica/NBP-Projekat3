import axios from "axios";
import {Estate} from "../Interfaces/Estate/Estate.ts";
import toast from "react-hot-toast";
const apiUrl = `${import.meta.env.VITE_API_URL}/Estate`;

export const createEstateAPI = async (category:string,createEstate: FormData) => {
    try {
        const response = await axios.post<Estate>(apiUrl + `/CreateEstate/${category}}`, createEstate, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response.status === 200)
            toast.success("Nekretnina je uspešno dodata.");
        return response;
    }
    catch(error:any) {
        toast.error(error.response.data);
    }
}

/*
export const updateProjectAPI = async (projectId: string, projectDto: FormData) => {
    try {
        return await axios.put<Project>(api+`/UpdateProject/${projectId}`, projectDto, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    }
    */