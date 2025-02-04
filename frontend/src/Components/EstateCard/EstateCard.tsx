import { useNavigate } from "react-router-dom";

interface EstateCardProps {
    id: string;
    title: string;
    desc: string;
  }
  
  export const EstateCard = ({ id, title, desc }: EstateCardProps) => {
    const navigate = useNavigate();

  const handleNavigate = () => {
    
    navigate(`/estate-details/${id}`);
  };
    return (
      <div className="estate-card">
        <h3>{title}</h3>
        <p>{desc}</p>
        <span>ID: {id}</span>
        <br></br>
        <button onClick={handleNavigate}>Pogledaj Detalje</button>
      </div>
    );
  };
  
export default EstateCard;