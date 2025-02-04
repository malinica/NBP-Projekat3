import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";
import { useEffect, useState } from 'react';
import { EstateCategory, getEstateCategoryTranslation } from "../../Enums/EstateCategory.ts";
import { createEstateAPI } from "../../Services/EstateService";
import styles from "./CreateEstate.module.css";
import MapWithMarker from "../Map/MapWithMarker";


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

  const user = useAuth();

  const navigate = useNavigate();

  const handlePicturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPictures(e.target.files);
    }
  };

  const handleSubmit = async () => {
    if (price && squareMeters && totalRooms && long && lat && floorNumber && pictures!=null) {
      const formData = new FormData();
      formData.append("Title", title);
      formData.append("Description", desc);
      formData.append("Price", price.toString());
      formData.append("SquareMeters", squareMeters.toString());
      formData.append("TotalRooms", totalRooms.toString());
      formData.append("Category", category);
      formData.append("FloorNumber", floorNumber.toString());
      formData.append("Longitude", long.toString());
      formData.append("Latitude", lat.toString());

      Array.from(pictures).forEach((file) => {
        formData.append("Images", file);
      });

        try {
          const response = await createEstateAPI( formData);
          if (response) {
            setLat(null);
            setLong(null);
            setPrice(null);
            setFloornumber(null);
            setSquareMeters(null);
            setTotalRooms(null);
            setPictures(null);
            setDesc('');
            setTitle('');
            navigate(`/estate-page/${response.data.id}`);          
          }
        }
        catch (error) {
            toast.error("Greška pri kreiranju nekretnine.");
        }
      }
    
      else 
      toast.error("Unesite sve podatke!");
  }

  return (
    <>
      {user ? (
        <>
          <div className={`conatiner-fluid bg-beige d-flex justify-content-center`}>
            <div className={`col-xxl-7 col-xl-7 col-lg-8 col-md-10 col-sm-12 m-4 p-4 rounded-3 d-flex flex-column bg-white shadow`}>
              <div className={`row justify-content-center py-3 px-3`}>
                <h1 className={`text-center text-gray pb-5`}>Kreiraj Nekretninu</h1>
                <div className={`mb-2 row`}>
                  <label className={`col-sm-2 col-form-label text-blue`}>Naziv:</label>
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
                  <label className={`col-sm-2 col-form-label text-blue`}>Opis:</label>
                  <div className={`col-sm-10`}>
                    <textarea
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      className={`form-control ${styles.fields}`}
                    />
                  </div>
                </div>

                <div className={`mb-2 row`}>
                  <label className={`col-sm-2 col-form-label text-blue`}>Kategorija:</label>
                  <div className={`col-sm-10`}>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as EstateCategory)}
                      className={`form-control ${styles.fields}`}
                    >
                      {Object.values(EstateCategory).map((option) => (
                        <option key={option} value={option}>
                          {getEstateCategoryTranslation(option as EstateCategory)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={`mb-2 row`}>
                  <label className={`col-sm-2 col-form-label text-blue`}>Broj soba:</label>
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
                  <label className={`col-sm-2 col-form-label text-blue`}>Površina:</label>
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
                  <label className={`col-sm-2 col-form-label text-blue`}>Sprat:</label>
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
                  <label className={`col-sm-2 col-form-label text-blue`}>Cena:</label>
                  <div className={`col-sm-10`}>
                    <input
                      type="number"
                      value={price ?? ''}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className={`form-control ${styles.fields}`}
                    />
                  </div>
                </div>

                <div className={`mb-4 row`}>
                  <label className={`col-sm-2 col-form-label text-blue`}>Slike:</label>
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
                
                <div style={{ width: '100%', height: '500px', overflow: 'hidden' }}>
                  <MapWithMarker lat={lat} long={long} setLat={setLat} setLong={setLong} />
                </div>

                <div className={`d-flex justify-content-end me-4 mt-4`}>
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