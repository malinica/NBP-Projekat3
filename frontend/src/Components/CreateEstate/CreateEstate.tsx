import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";
import { useState } from 'react';
import { EstateCategory } from "../../Enums/EstateCategory";
import { createEstateAPI } from "../../Services/EstateService";
import styles from "./CreateEstate.module.css";


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
              <div className={`conatiner-fluid bg-beige d-flex justify-content-center`}>
                <div className={`col-xxl-7 col-xl-7 col-lg-8 col-md-10 col-sm-12 m-4 p-4 rounded-3 d-flex flex-column bg-white shadow`}>
                  <div className={`row justify-content-center py-3 px-3`}>
                    <h1 className={`text-center text-gray pb-5`}>Kreiraj Nekretninu</h1>
                    <div className={`mb-2 row`}>
                      <label className={`col-sm-2 col-form-label text-blue`}>Title:</label>
                      <div className={`col-sm-10`}>
                        <input 
                          type="text" 
                          value={title} 
                          onChange={(e) => setTitle(e.target.value)}
                          className={`form-control ${styles.fields}`} 
                        />
                      </div>
                    </div>
                    
                    <div className={`mb-2 row`}>
                      <label className={`col-sm-2 col-form-label text-blue`}>Description:</label>
                      <div className={`col-sm-10`}>
                        <textarea 
                          value={desc} 
                          onChange={(e) => setDesc(e.target.value)} 
                          className={`form-control ${styles.fields}`}
                        />
                      </div>
                    </div>
              
                    <div className={`mb-2 row`}>
                      <label className={`col-sm-2 col-form-label text-blue`}>Category:</label>
                      <div className={`col-sm-10`}>
                        <select 
                          value={category} 
                          onChange={(e) => setCategory(e.target.value as EstateCategory)} 
                          className={`form-control ${styles.fields}`}
                        >
                          {Object.values(EstateCategory).map((option) => (
                            <option key={option} value={option} className={``}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
              
                    <div className={`mb-2 row`}>
                      <label className={`col-sm-2 col-form-label text-blue`}>Total Rooms:</label>
                      <div className={`col-sm-10`}>
                        <input 
                          type="number" 
                          value={totalRooms ?? ''} 
                          onChange={(e) => setTotalRooms(Number(e.target.value))}
                          className={`form-control ${styles.fields}`}
                        />
                        </div>
                    </div>
              
                    <div className={`mb-2 row`}>
                      <label className={`col-sm-2 col-form-label text-blue`}>Square Meters:</label>
                      <div className={`col-sm-10`}>
                        <input 
                          type="number" 
                          value={squareMeters ?? ''} 
                          onChange={(e) => setSquareMeters(Number(e.target.value))}
                          className={`form-control ${styles.fields}`}
                        />
                      </div>
                    </div>
              
                    <div className={`mb-2 row`}>
                      <label className={`col-sm-2 col-form-label text-blue`}>Floor Number:</label>
                      <div className={`col-sm-10`}>
                        <input 
                          type="number" 
                          value={floorNumber ?? ''} 
                          onChange={(e) => setFloornumber(Number(e.target.value))}
                          className={`form-control ${styles.fields}`}
                        />
                      </div>
                    </div>
              
                    <div className={`mb-2 row`}>
                      <label className={`col-sm-2 col-form-label text-blue`}>Price:</label>
                      <div className={`col-sm-10`}>
                        <input 
                          type="number" 
                          value={price ?? ''} 
                          onChange={(e) => setPrice(Number(e.target.value))}
                          className={`form-control ${styles.fields}`}
                        />
                      </div>
                    </div>
              
                    <div className={`mb-2 row`}>
                      <label className={`col-sm-2 col-form-label text-blue`}>Longitude:</label>
                      <div className={`col-sm-10`}>
                        <input 
                          type="number" 
                          value={long ?? ''} 
                          onChange={(e) => setLong(Number(e.target.value))}
                          className={`form-control ${styles.fields}`}
                        />
                      </div>
                    </div>
              
                    <div className={`mb-2 row`}>
                      <label className={`col-sm-2 col-form-label text-blue`}>Latitude:</label>
                      <div className={`col-sm-10`}>
                        <input 
                          type="number" 
                          value={lat ?? ''} 
                          onChange={(e) => setLat(Number(e.target.value))}
                          className={`form-control ${styles.fields}`}
                        />
                      </div>
                    </div>
              
                    <div className={`mb-4 row`}>
                      <label className={`col-sm-2 col-form-label text-blue`}>Pictures:</label>
                      <div className={`col-sm-10`}>
                        <input
                          type="file"
                          className={`form-control ${styles.fields}`}
                          onChange={handlePicturesChange}
                          multiple
                          required
                        />
                      </div>
                    </div>
              
                    <div className={`d-flex justify-content-end me-4`}>
                      <button className={`btn-lg text-white text-center rounded-3 border-0 py-2 px-2 ${styles.slova} ${styles.dugme1} ${styles.linija_ispod_dugmeta}`} onClick={handleSubmit}>Dodaj Nekretninu</button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className={`text-muted text-center`}>Morate se prijaviti da biste dodali nekretninu</p>
          )}
        </>
      );
      
  };
  
export default CreateEstate;