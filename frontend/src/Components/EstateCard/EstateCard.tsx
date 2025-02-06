import {useNavigate} from "react-router-dom";
import {Estate} from "../../Interfaces/Estate/Estate.ts";
import { useAuth } from "../../Context/useAuth.tsx";
import { deleteEstateAPI } from "../../Services/EstateService.tsx";
import toast from "react-hot-toast";

interface EstateCardProps {
  estate:Estate;
  loadEstates: (pageNumber?: number, pageSizeNumber?: number) => Promise<void>;
}

export const EstateCard = ({ estate, loadEstates }: EstateCardProps) => {
  const navigate = useNavigate();
  const user=useAuth();

  const handleDelete = async () => {
    const response = await deleteEstateAPI(estate.id);
    if (response) {
      toast.success("Nekretnina uspešno obrisana.");
      loadEstates(undefined,undefined);

    }
  };
  
  const handleChange = () => {
  navigate(`/estate-change/${estate.id}`, { state: { estate } });
  };

  const handleNavigate = () => {
    navigate(`/estate-details/${estate.id}`);
  };

  if(!estate)
    return null;

  return (
    <div className="card" style={{width: "18rem"}}>
      <img src={`${import.meta.env.VITE_SERVER_URL}/${estate.images[0]}`} className="card-img-top" alt={estate.title}/>
      <div className="card-body">
        <h5 className="card-title">{estate.title}</h5>
        <p className="card-text">{estate.price}&nbsp;€</p>
        <button className="btn btn-primary" onClick={handleNavigate}>
          Pogledaj Detalje
        </button>
        {user?.user?.id === estate?.userId && (
  <>
    <button className="btn btn-primary" onClick={handleDelete}>
      Obriši
    </button>
    <button className="btn btn-primary" onClick={handleChange}>
      Izmeni
    </button>
  </>
)}


        
      </div>
    </div>
  );
};

export default EstateCard;