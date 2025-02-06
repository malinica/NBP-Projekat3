import { useEffect, useState } from "react";
import { Icon } from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

import MapMarker from "./MapMarker";
import { GeoCoordinates } from "../../Interfaces/GeoCoordinates/GeoCoordinates ";

import locationPin from "../../assets/location-pin.png";

interface Props {
    setLat: (latitude: number | null) => void;
    setLong: (longitude: number | null) => void;
    lat: number | null;
    long: number | null;
}

const MapWithMarker: React.FC<Props> = ({ setLat, setLong, long, lat }) => {
    const [location, setLocation] = useState<GeoCoordinates | null>(null);
    const mapaCentar = { lat: 43.32083030, lng: 21.89544071 };

    const customIcon = new Icon({
        iconUrl: locationPin,
        iconSize: [38, 38],
    });
    useEffect(() => {
        if(long!=null && lat!=null)
        {
            const newLocation: GeoCoordinates = { latitude: lat, longitude: long };            
            setLocation(newLocation);
        }
    },[]);
    useEffect(() => {
        if (location) {
            setLong(location.longitude);
            setLat(location.latitude);
        }
    }, [location, setLat, setLong]);

    return (
        <div>
            <div className={`container pb-5`}>
                <MapContainer
                    center={mapaCentar}
                    zoom={14}
                    style={{ width: '100%', height: '500px' }}
                    zoomControl={false}
                    attributionControl={false}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapMarker setLocation={setLocation} />
                    {location != null && lat != null && long != null && (
                        <Marker
                            position={{ lat: location.latitude, lng: location.longitude }}
                            icon={customIcon}
                        />
                    )}
                </MapContainer>
            </div>
        </div>
    );
};

export default MapWithMarker;
