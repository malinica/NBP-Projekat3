import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEstate } from "../../Services/EstateService";
import { Estate } from "../../Interfaces/Estate/Estate";
import { toast } from "react-hot-toast";
import styles from "./EstatePage.module.css";

export const EstatePage = () => {
    const { id } = useParams();
    const [estate, setEstate] = useState<Estate | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchEstate = async () => {
            try {
                if (!id) {
                    toast.error("Nekretnina nije pronađena");
                    return;
                }
                const estateResponse = await getEstate(id);
                if (estateResponse) {
                    setEstate(estateResponse);
                }
            } catch (error) {
                toast.error("Greška pri učitavanju nekretnine");
            } finally {
                setLoading(false);
            }
        };

        fetchEstate();
    }, [id]);

    
    return (
        <div className={`container mt-5 ${styles.estateContainer}`}>
            {loading ? (
                <p className={`text-center text-muted mt-3`}>Učitavanje nekretnine...</p>
            ) : (
                console.log(estate), 
                estate ? (
                    <div className={`card shadow`}>
                        <div className={`row g-0`}>
                            <div className={`col-md-6`}>
                                <div className={styles.imageGallery}>
                                    {estate.images?.length > 0 ? (
                                        estate.images.map((img, index) => (
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
                            <div className={`col-md-6`}>
                                <div className={`card-body p-4`}>
                                    <h1 className={`card-title mb-4`}>{estate?.title}</h1>
                                    <p className={`lead mb-4`}>{estate?.description}</p>
                                    <div className="row mb-4">
                                        <div className={`col-md-6 mb-3`}>
                                            <h5 className={`text-muted`}>Cena</h5>
                                            <p className={`text-blue fs-5`}>{estate?.price} €</p>
                                            </div>
                                        <div className={`col-md-6 mb-3`}>
                                            <h5 className={`text-muted`}>Veličina</h5>
                                            <p className={`fs-5`}>{estate?.squareMeters} m²</p>
                                        </div>
                                        <div className={`col-md-6 mb-3`}>
                                            <h5 className={`text-muted`}>Broj soba</h5>
                                            <p className={`fs-5`}>{estate?.totalRooms}</p>
                                        </div>
                                        <div className={`col-md-6 mb-3`}>
                                            <h5 className={`text-muted`}>Kategorija</h5>
                                            <p className={`fs-5`}>{estate?.category}</p>
                                        </div>
                                        <div className={`col-md-6 mb-3`}>
                                            <h5 className={`text-muted`}>Sprat</h5>
                                            <p className={`fs-5`}>{estate?.floorNumber ?? "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-muted">Nema podataka o nekretnini.</p>
                )
            )}
        </div>
    );    
};
