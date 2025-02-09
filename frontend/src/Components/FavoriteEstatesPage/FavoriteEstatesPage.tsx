import { useEffect, useState } from "react";
import { useAuth } from "../../Context/useAuth";
import { Estate } from "../../Interfaces/Estate/Estate";
import { getFavoriteEstatesForUserAPI } from "../../Services/EstateService";
import EstateCard from "../EstateCard/EstateCard";

export const FavoriteEstates = () => {
    const { user } = useAuth();
    const [favoriteEstates, setFavoriteEstates] = useState<Estate[]>([]);

    useEffect(() => {
        if (user) {
            fetchEstates(user.id);
        }
    }, [user]);

    const fetchEstates = async (userId: string) => {
        const favoriteEstates = await getFavoriteEstatesForUserAPI(userId);
        setFavoriteEstates(favoriteEstates || []);
    }

    return (
        <div className={`container-fluid bg-beige`}>
            <div className={`container bg-beige my-5`}>
                <h1 className={`text-center my-5 text-blue`}>Omiljene nekretnine</h1>
                <div className={`container`}>
                    <div className={`row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center`}>
                        {favoriteEstates.length > 0 ? (
                            favoriteEstates.map((estate) => (
                                <div key={estate.id} className={`col d-flex justify-content-center`}>
                                    <EstateCard estate={estate} type={2}></EstateCard>
                                </div>
                            ))
                        ) : (
                            <p className={`text-center text-muted mx-auto`}>Korisnik trenutno nema omiljenih nekretnina.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
