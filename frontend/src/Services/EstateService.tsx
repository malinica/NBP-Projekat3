import axios from "axios";
import { Estate } from "../Interfaces/Estate/Estate.ts";
import toast from "react-hot-toast";
import { PaginatedResponseDTO } from "../Interfaces/Pagination/PaginatedResponseDTO.ts";
import { EstateCategory } from "../Enums/EstateCategory.ts";
const apiUrl = `${import.meta.env.VITE_API_URL}/Estate`;

export const createEstateAPI = async (createEstate: FormData) => {
    try {
        const response = await axios.post<Estate>(`${apiUrl}/CreateEstate`, createEstate, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    
        if (response.status === 200) {
            toast.success("Nekretnina je uspešno dodata.");
        }
    
        return response;
    }
    catch (error: any) {
        toast.error(error.response.data);
    }
}


export const updateEstateAPI = async (estateId: string, estateDto: FormData) => {
    try {
        return await axios.put<Estate>(`${apiUrl}/UpdateProject/${estateId}`, estateDto, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    }
    catch (error: any) {
        toast.error(error.response?.data ?? "Greška pri ažuriranju nekretnina.");
        return undefined;
    }
};
    

export const getEstatesCreatedByUserAPI = async (userId: string) => {
    try {
        const response = await axios.get<Estate[]>(`${apiUrl}/GetEstatesCreatedByUser/${userId}`);
        return response.data;
    } catch (error: any) {
        toast.error(error.response?.data ?? "Greška pri preuzimanju nekretnina.");
        return undefined;
    }
};

export const getEstate = async (id: string) => {
    try {
        const response = await axios.get<Estate>(`${apiUrl}/GetEstate/${id}`);
        return response.data;
    } catch (error: any) {
        toast.error(error.response?.data || "Došlo je do greške pri preuzimanju nekretnine.");
        return undefined;
    }
};


export const deleteEstateAPI = async (id: string) => {
    try {
        return await axios.delete<Estate>(apiUrl+`/RemoveEstate/${id}`, {});
    }
    catch(error:any) {
        toast.error(error.response?.data || "Došlo je do greške.");
        return undefined;
    }
}

export const searchEstatesAPI = async (
    title?: string, 
    priceMin?: number,
    priceMax?: number,
    categories?: string[],
    pagenumber: number = 1, 
    limit: number = 10
): Promise<PaginatedResponseDTO<Estate> | null> => {
    try {
        const params: Record<string, string | number> = {
            ...(title && { title }),
            ...(priceMin !== undefined && { priceMin }),
            ...(priceMax !== undefined && { priceMax }),
            ...(categories && categories.length ? { categories: categories.join(",") } : {}),
            skip: limit * (pagenumber - 1),
            limit
        };


        const url = `${apiUrl}/SearchEstates`;

        const response = await axios.get<PaginatedResponseDTO<Estate>>(url, { params });

        return response.data;
    } catch (error: unknown) {
        return null;
    }
};
