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
        <div className={`container`}>
            <h1 className="text-center my-4">Omiljene nekretnine</h1>
            <div className={`row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4`}>
                {favoriteEstates.length > 0 ? (
                    favoriteEstates.map((estate) => (
                        <div key={estate.id} >
                            <EstateCard estate={estate} type={2}></EstateCard>
                        </div>
                    ))
                ) : (
                    <p className={`text-center text-muted mx-auto`}>Korisnik trenutno nema omiljenih nekretnina.</p>
                )}
            </div>
        </div>
    );
};
