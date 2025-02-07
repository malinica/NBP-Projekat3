import { useNavigate } from "react-router-dom";
import { Estate } from "../../Interfaces/Estate/Estate.ts";
import { useAuth } from "../../Context/useAuth.tsx";
import { deleteEstateAPI } from "../../Services/EstateService.tsx";
import toast from "react-hot-toast";
import styles from './EstateCard.module.css'


interface EstateCardProps {
  estate: Estate;
  loadEstates: () => Promise<void>;
}

export const EstateCard = ({ estate, loadEstates }: EstateCardProps) => {
  const navigate = useNavigate();
  const user = useAuth();

  const handleDelete = async () => {
    const response = await deleteEstateAPI(estate.id);
    if (response) {
      toast.success("Nekretnina uspešno obrisana.");
      await loadEstates();
    }
  };

  const handleChange = () => {
    navigate(`/estate-page/${estate.id}`, { state: { setEdit: true } });
  };

  const handleNavigate = () => {
    navigate(`/estate-details/${estate.id}`);
  };

  if (!estate) return null;

  return (
    <div className={`card my-2 p-2 shadow`} style={{ width: "18rem" }}>
      <img
        src={`${import.meta.env.VITE_SERVER_URL}/${estate.images[0]}`}
        className={`card-img-top`}
        alt={estate.title}
      />
      <div className={`card-body`}>
        <h5 className={`text-blue`}>{estate.title}</h5>
        <p className={`text-golden`}>{estate.price}&nbsp;€</p>
        <button className={`btn btn-sm text-white text-center rounded py-2 px-2 ${styles.dugme} ${styles.slova}`} onClick={handleNavigate}>
          Pogledaj Detalje
        </button>
        {user?.user?.id === estate?.userId && (
          <>
            <div className={`mt-2`}>
              <button className={`btn btn-sm text-white text-center rounded py-2 px-2 me-2 ${styles.dugme1} ${styles.slova}`} onClick={handleDelete}>
                Obriši
              </button>
              <button className={`btn btn-sm text-gray text-center rounded py-2 px-2 ${styles.dugme2} ${styles.slova}`} onClick={handleChange}>
                Izmeni
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EstateCard;
