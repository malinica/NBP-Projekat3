import {useNavigate} from "react-router-dom";
import {Estate} from "../../Interfaces/Estate/Estate.ts";

interface EstateCardProps {
  estate:Estate;
}

export const EstateCard = ({estate}: EstateCardProps) => {
  const navigate = useNavigate();

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
      </div>
    </div>
  );
};

export default EstateCard;