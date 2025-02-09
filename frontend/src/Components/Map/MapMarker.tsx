import React from "react";
import { useMapEvents } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import {GeoCoordinates} from "../../Interfaces/GeoCoordinates/GeoCoordinates "
interface Props {
    setLocation: (loc: GeoCoordinates | null) => void;
}

const MapMarker: React.FC<Props> = ({ setLocation }) => {
    useMapEvents({
        click: (e: LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;
            const newLocation: GeoCoordinates = { latitude: lat, longitude: lng };            
            setLocation(newLocation);
        }
    });

    return null;
}

export default MapMarker;