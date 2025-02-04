/*import { useParams } from 'react-router-dom';
//za id ucitaj estate dodao sam ovo samo da bih povezao na svoju stranicu 
export const EstatePage = () => {
  const { id } = useParams();

  return (<></>);
}
export default EstatePage;*/

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEstate } from "../../Services/EstateService";
import { Estate } from "../../Interfaces/Estate/Estate";
import { toast } from "react-hot-toast";
//import { useAuth } from "../../Context/useAuth"; 
import styles from "./EstatePage.module.css";  
import { EstateCategory } from "../../Enums/EstateCategory";

export const EstatePage = () => {
    const { id } = useParams();
    const [estate, setEstate] = useState<Estate | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    //const { user } = useAuth(); 
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<Partial<Estate>>({});

    useEffect(() => {
        const fetchEstate = async () => {
            try {
                if (!id) {
                    toast.error("Nekretnina nije pronađena");
                    return;
                }

                const data = await getEstate(id);
                if (data) {
                    setEstate(data);
                    setEditedData(data); 
                }
            } catch (error) {
                toast.error("Greška pri učitavanju nekretnine");
            } finally {
                setLoading(false);
            }
        };

        fetchEstate();
    }, [id]);

    const handleEdit = async () => {
        //deo za azuriranje
        try {
            toast.success("Nekretnina uspešno ažurirana");
            setIsEditing(false);
        } catch (error) {
            toast.error("Greška pri ažuriranju nekretnine");
        }
    };

    if (loading) {
        return <div className="text-center mt-5">Učitavanje...</div>;
    }

    if (!estate) {
        return <div className="text-center mt-5">Nekretnina nije pronađena</div>;
    }

    return (
        <div className={`container mt-5 ${styles.estateContainer}`}>
            <div className="card shadow-lg">
                <div className="row g-0">
                    <div className="col-md-6">
                        <div className={styles.imageGallery}>
                            {estate.Images?.length > 0 ? (
                                estate.Images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={`${import.meta.env.VITE_SERVER_URL}/${img}`}
                                        alt={`Nekretnina ${index + 1}`}
                                        className={`img-fluid ${styles.mainImage}`}
                                    />
                                ))
                            ) : (
                                <div className={styles.noImage}>Nema dostupnih slika</div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card-body p-4">
                            <h1 className="card-title mb-4">
                                {isEditing ? (
                                    <input
                                        value={editedData.Title || ""}
                                        onChange={(e) => setEditedData({...editedData, Title: e.target.value})}
                                        className="form-control mb-3"
                                    />
                                ) : (
                                    estate.Title
                                )}
                            </h1>
                            
                            {isEditing ? (
                                <textarea
                                    value={editedData.Description || ""}
                                    onChange={(e) => setEditedData({...editedData, Description: e.target.value})}
                                    className="form-control mb-3"
                                />
                            ) : (
                                <p className="lead mb-4">{estate.Description}</p>
                            )}

                            <div className="row mb-4">
                                <div className="col-md-6 mb-3">
                                    <h5 className="text-muted">Cena</h5>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editedData.Price || ""}
                                            onChange={(e) => setEditedData({...editedData, Price: Number(e.target.value)})}
                                            className="form-control"
                                        />
                                    ) : (
                                        <p className="fs-5">{estate.Price} €</p>
                                    )}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <h5 className="text-muted">Veličina</h5>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editedData.SquareMeters || ""}
                                            onChange={(e) => setEditedData({...editedData, SquareMeters: Number(e.target.value)})}
                                            className="form-control"
                                        />
                                    ) : (
                                        <p className="fs-5">{estate.SquareMeters} m²</p>
                                    )}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <h5 className="text-muted">Broj soba</h5>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editedData.TotalRooms || ""}
                                            onChange={(e) => setEditedData({...editedData, TotalRooms: Number(e.target.value)})}
                                            className="form-control"
                                        />
                                    ) : (
                                        <p className="fs-5">{estate.TotalRooms}</p>
                                    )}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <h5 className="text-muted">Kategorija</h5>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedData.Category || ""}
                                            //onChange={(e) => setEditedData({...editedData, Category: EstateCategory(e.target.value)})}
                                            className="form-control"
                                        />
                                    ) : (
                                        <p className="fs-5">{estate.Category}</p>
                                    )}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <h5 className="text-muted">Sprat</h5>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editedData.FloorNumber || ""}
                                            onChange={(e) => setEditedData({...editedData, FloorNumber: Number(e.target.value)})}
                                            className="form-control"
                                        />
                                    ) : (
                                        <p className="fs-5">{estate.FloorNumber || "N/A"}</p>
                                    )}
                                </div>
                            </div>

                            {/*user?.id && */(
                                <div className="mt-4">
                                    {!isEditing ? (
                                        <>
                                            <button 
                                                className="btn btn-primary me-2"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                Izmeni
                                            </button>
                                            <button className="btn btn-danger">
                                                Obriši
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button 
                                                className="btn btn-success me-2"
                                                onClick={handleEdit}
                                            >
                                                Sačuvaj
                                            </button>
                                            <button 
                                                className="btn btn-secondary"
                                                onClick={() => setIsEditing(false)}
                                            >
                                                Odustani
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
