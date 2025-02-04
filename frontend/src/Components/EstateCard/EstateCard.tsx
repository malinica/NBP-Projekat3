import { useState } from "react";
import { Estate } from "../../Interfaces/Estate/Estate";
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
        <button onClick={handleNavigate}>Pogledaj Detalje</button>
      </div>
    );
  };
  
export default EstateCard;