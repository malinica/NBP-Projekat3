import { EstateCategory } from "../../Enums/EstateCategory.ts";

export interface Estate {
  id: string;
  Title: string;
  Description: string;
  Price: number;
  SquareMeters : number;
  TotalRooms : number;
  Category : EstateCategory;
  FloorNumber ?: number;
  Images : string[];
  Longitude : number;
  Latitude : number
}