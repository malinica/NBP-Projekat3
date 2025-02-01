import  "./CreateEstate.module";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";
import { useState } from 'react';
import { EstateCategory } from "../../Enums/EstateCategory";
import { createEstateAPI } from "../../Services/EstateService";

const CreateEstate = () => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState<EstateCategory>(EstateCategory.House);
    const [pictures, setPictures] = useState<FileList | null>(null);
    const [totalRooms, setTotalRooms] = useState<number | null>(null);
    const [squareMeters, setSquareMeters] = useState<number | null>(null);
    const [floorNumber, setFloornumber] = useState<number | null>(null);
    const [price, setPrice] = useState<number | null>(null);
    const [long, setLong] = useState<number | null>(null);
    const [lat, setLat] = useState<number | null>(null);
    const user=useAuth();

    const handlePicturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setPictures(e.target.files);
      }
    };

    const handleSubmit = () => {
      if(price! && squareMeters && totalRooms && long && lat && floorNumber && pictures)
        createEstateAPI(category, {
          Title: title,
          Description: desc,
          Price: price,
          SquareMeters: squareMeters,
          TotalRooms: totalRooms,
          Category: category,
          FloorNumber: floorNumber,
          Images: Array.from(pictures).map(file => file.name),
          Longitude: long,
          Latitude: lat
        });
        
      else toast.error("Unesite sve podatke!");
    };
    return (
        <>
          {user ? (
            <>
              <div>
                <label>Title:</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                />
              </div>
              
              <div>
                <label>Description:</label>
                <textarea 
                  value={desc} 
                  onChange={(e) => setDesc(e.target.value)} 
                />
              </div>
        
              <div>
                <label>Category:</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value as EstateCategory)} 
                >
                  {Object.values(EstateCategory).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
        
              <div>
                <label>Total Rooms:</label>
                <input 
                  type="number" 
                  value={totalRooms ?? ''} 
                  onChange={(e) => setTotalRooms(Number(e.target.value))}
                />
              </div>
        
              <div>
                <label>Square Meters:</label>
                <input 
                  type="number" 
                  value={squareMeters ?? ''} 
                  onChange={(e) => setSquareMeters(Number(e.target.value))}
                />
              </div>
        
              <div>
                <label>Floor Number:</label>
                <input 
                  type="number" 
                  value={floorNumber ?? ''} 
                  onChange={(e) => setFloornumber(Number(e.target.value))}
                />
              </div>
        
              <div>
                <label>Price:</label>
                <input 
                  type="number" 
                  value={price ?? ''} 
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
        
              <div>
                <label>Longitude:</label>
                <input 
                  type="number" 
                  value={long ?? ''} 
                  onChange={(e) => setLong(Number(e.target.value))}
                />
              </div>
        
              <div>
                <label>Latitude:</label>
                <input 
                  type="number" 
                  value={lat ?? ''} 
                  onChange={(e) => setLat(Number(e.target.value))}
                />
              </div>
        
                <div>
                <label>Pictures:</label>
              <label className={`text-metal mb-1 mt-3`}>Slike:</label>
              <input
                type="file"
                className={`form-control`}
                onChange={handlePicturesChange}
                multiple
                required
              />
            </div>
        
            <button onClick={handleSubmit}>Dodaj nekretninu</button>

            </>
          ) : (
            <p>Morate se prijaviti da biste dodali nekretninu</p>
          )}
        </>
      );
      
  };
  
export default CreateEstate;