import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEstate, updateEstateAPI } from "../../Services/EstateService";
import { Estate } from "../../Interfaces/Estate/Estate";
import { toast } from "react-hot-toast";
import styles from "./EstatePage.module.css";
import { CreatePost } from "../CreatePost/CreatePost.tsx";
import { PostCard } from "../PostCard/PostCard.tsx";
import { Pagination } from "../Pagination/Pagination.tsx";
import { Post } from "../../Interfaces/Post/Post.ts";
import { createPostAPI, getAllPostsForEstateAPI } from "../../Services/PostService.tsx";
import { CreatePostDTO } from "../../Interfaces/Post/CreatePostDTO.ts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { EstateCategory } from "../../Enums/EstateCategory.ts";
import noposts from "../../Assets/noposts.png";
import MapWithMarker from "../Map/MapWithMarker";

export const EstatePage = () => {
  const { id } = useParams();
  const [estate, setEstate] = useState<Estate | null>(null);
  const [isEstateLoading, setIsEstateLoading] = useState<boolean>(true);
  const [isPostsLoading, setIsPostsLoading] = useState<boolean>(true);

  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPostsCount, setTotalPostsCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [editMode, setEditMode] = useState(false);
  const [updatedName, setUpdatedName] = useState(estate?.title || "");
  const [updatedDescription, setUpdatedDescription] = useState(estate?.description || "");
  const [updatedCategory, setUpdatedCategory] = useState(estate?.category || "");
  const [updatedPictures, setUpdatedPictures] = useState<FileList | null>(null);
  const [updatedPrice, setUpdatedPrice] = useState(estate?.price || '');
  const [updatedRooms, setUpdatedRooms] = useState(estate?.totalRooms || '');
  const [updatedFloor, setUpdatedFloor] = useState(estate?.floorNumber || '');
  const [updatedSize, setUpdatedSize] = useState(estate?.squareMeters || '');


  useEffect(() => {
    const fetchEstate = async () => {
      try {
        if (!id) {
          toast.error("Nekretnina nije pronađena");
          return;
        }
        const estateResponse = await getEstate(id);
        if (estateResponse) {
          setEstate(estateResponse);
        }
      } catch {
        toast.error("Greška pri učitavanju nekretnine");
      } finally {
        setIsEstateLoading(false);
      }
    };

    fetchEstate();
    loadPosts(1, 10);
  }, [id]);

  useEffect(() => {
    if (estate) {
      setUpdatedName(estate.title);
      setUpdatedDescription(estate.description);
      setUpdatedCategory(estate.category);
      setUpdatedPrice(estate.price);
      setUpdatedRooms(estate.totalRooms);
      setUpdatedFloor(estate.floorNumber ?? 0);
      setUpdatedSize(estate.squareMeters);
    }
  }, [estate]);


  const handleCreatePost = async (title: string, content: string) => {
    try {
      const postDto: CreatePostDTO = {
        title,
        content,
        estateId: id ?? null
      }
      const response = await createPostAPI(postDto);

      if (response?.status == 200) {
        toast.success("Uspešno kreirana objava.");
        setPage(1);
        await loadPosts(1, pageSize);
      }
    } catch {
      toast.error("Došlo je do greške prilikom kreiranja objave.");
    }
  }

  const handlePaginateChange = async (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
    await loadPosts(page, pageSize);
  }

  const loadPosts = async (page: number, pageSize: number) => {
    try {
      setIsPostsLoading(true);
      const response = await getAllPostsForEstateAPI(id!, page, pageSize);

      if (response?.status == 200) {
        setPosts(response.data.data);
        setTotalPostsCount(response.data.totalLength);
      }
    } catch {
      toast.error("Došlo je do greške prilikom učitavanja objava.");
    } finally {
      setIsPostsLoading(false);
    }
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUpdatedCategory(e.target.value);
  };

  const handlePicturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUpdatedPictures(e.target.files);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!estate) return;

      const formData = new FormData();
      formData.append('title', updatedName);
      formData.append('description', updatedDescription);
      formData.append('category', updatedCategory);
      /*formData.append za ostalo */

      if (updatedPictures) {
        for (let i = 0; i < updatedPictures.length; i++) {
          formData.append('pictures', updatedPictures[i]);
        }
      }

      const response = await updateEstateAPI(estate.id, formData);

      if (response?.status === 200) {
        toast.success("Nekretnina je uspešno ažurirana.");
        setEstate(response.data);
        setEditMode(false);
      }
    } catch {
      toast.error("Došlo je do greške prilikom ažuriranja nekretnine.");
    }
  };

  return (
    <div className={`container-fluid bg-beige d-flex justify-content-center`}>
      <div className={`container mt-5`}>
        {/*Nekretnina*/}
        {isEstateLoading ? (
          <p className={`text-center text-muted mt-3`}>Učitavanje nekretnine...</p>
        ) : (
          estate ? (
            <>
              <div className={`card shadow`}>
                <div className={`row g-0`}>
                  <div className={`col-md-6`}>
                    <div className={`${styles.imageGallery} p-3`}>
                      <div id="carouselExampleIndicators" className={`carousel slide shadow rounded overflow-hidden`}>
                        <div className={`carousel-indicators`}>
                          {estate.images.map((_, i) =>
                            <button type="button" key={i} data-bs-target="#carouselExampleIndicators"
                              data-bs-slide-to={`${i}`} className={`${i == 0 ? 'active' : ''}`}></button>
                          )}
                        </div>
                        <div className={`carousel-inner`}>
                          {estate.images.map((pictureName, i) => (
                            <div className={`carousel-item ${i === 0 ? "active" : ""}`} key={i}>
                              <img src={`${import.meta.env.VITE_SERVER_URL}${pictureName}`} className={`d-block w-100`}
                                alt="..." />
                            </div>
                          )
                          )}
                        </div>
                        <button className={`carousel-control-prev`} type="button"
                          data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                          <span className={`carousel-control-prev-icon`} aria-hidden="true"></span>
                          <span className={`visually-hidden`}>Previous</span>
                        </button>
                        <button className={`carousel-control-next`} type="button"
                          data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                          <span className={`carousel-control-next-icon`} aria-hidden="true"></span>
                          <span className={`visually-hidden`}>Next</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className={`col-md-6`}>
                  {!editMode ? (
                    <div className={`card-body`}>
                      <div className={`d-flex justify-content-between align-items-start mb-4`}>
                        <div>
                          <h1 className={`mb-4 text-blue`}>{estate?.title}</h1>
                          <p className={`lead mb-4 text-gray`}>{estate?.description}</p>
                        </div>
                        <div className={`mt-1`}>
                          <button className={`btn btn-outline-danger me-2`}>
                            <FontAwesomeIcon icon={faHeart} />
                          </button>
                          <button
                            className={`btn btn-sm my-2 text-white text-center rounded py-2 px-2 ${styles.dugme1} ${styles.linija_ispod_dugmeta} ${styles.slova}`}
                            onClick={() => setEditMode(true)}
                          >
                            Ažuriraj
                          </button>
                          <button
                            className={`btn btn-sm ms-2 my-2 text-gray text-center rounded py-2 px-2 ${styles.dugme2} ${styles.linija_ispod_dugmeta} ${styles.slova}`}
                            onClick={() => setEditMode(false)}
                          >
                            Obriši
                          </button>
                        </div>
                      </div>
                      <div className={`row mb-4`}>
                        <div className={`col-md-6 mb-3`}>
                          <h5 className={`text-golden`}>Cena</h5>
                          <p className={`text-blue fs-5`}>{estate?.price} €</p>
                        </div>
                        <div className={`col-md-6 mb-3`}>
                          <h5 className={`text-golden`}>Veličina</h5>
                          <p className={`text-blue fs-5`}>{estate?.squareMeters} m²</p>
                        </div>
                        <div className={`col-md-6 mb-3`}>
                          <h5 className={`text-golden`}>Broj soba</h5>
                          <p className={`text-blue fs-5`}>{estate?.totalRooms}</p>
                        </div>
                        <div className={`col-md-6 mb-3`}>
                          <h5 className={`text-golden`}>Kategorija</h5>
                          <p className={`text-blue fs-5`}>{estate?.category}</p>
                        </div>
                        <div className={`col-md-6 mb-3`}>
                          <h5 className={`text-golden`}>Sprat</h5>
                          <p className={`text-blue fs-5`}>{estate?.floorNumber ?? "N/A"}</p>
                        </div>
                      </div>
                      {/*<div style={{ width: '100%', height: '500px', overflow: 'hidden' }}>
                        <MapWithMarker
                        /*lat={estate ? estate.latitude : lat}
                        long={estate ? estate.longitude : long}
                        setLat={setLat}
                        setLong={setLong}
                        />
                      </div>*/}
                    </div>
                      ) : (
                      <div className={`p-3`}>
                        <div className={`mb-3`}>
                          <label className="form-label text-blue">Naziv:</label>
                          <input
                            type="text"
                            className={`form-control`}
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                          />
                        </div>
                        <div className={`mb-3`}>
                          <label className="form-label text-blue">Opis:</label>
                          <textarea
                            className={`form-control`}
                            value={updatedDescription}
                            onChange={(e) => setUpdatedDescription(e.target.value)}
                          ></textarea>
                        </div>
                        <div className={`mb-3`}>
                          <label className="form-label text-blue">Cena:</label>
                          <input
                            type="number"
                            className={`form-control`}
                            value={updatedPrice}
                            onChange={(e) => setUpdatedPrice(e.target.value)}
                          />
                        </div>
                        <div className={`mb-3`}>
                          <label className="form-label text-blue">Broj soba:</label>
                          <input
                            type="number"
                            className={`form-control`}
                            value={updatedRooms}
                            onChange={(e) => setUpdatedRooms(e.target.value)}
                          />
                        </div>
                        <div className={`mb-3`}>
                          <label className="form-label text-blue">Sprat:</label>
                          <input
                            type="number"
                            className={`form-control`}
                            value={updatedFloor}
                            onChange={(e) => setUpdatedFloor(e.target.value)}
                          />
                        </div>
                        <div className={`mb-3`}>
                          <label className="form-label text-blue">Površina:</label>
                          <input
                            type="number"
                            className={`form-control`}
                            value={updatedSize}
                            onChange={(e) => setUpdatedSize(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className={`form-label text-blue`}>Kategorija:</label>
                          <select
                            className={`form-select ${styles.fields} mb-3`}
                            value={updatedCategory}
                            onChange={handleCategoryChange}
                            required
                          >
                            {Object.values(EstateCategory).map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className={`mb-3`}>
                          <label className="form-label text-blue">Slike:</label>
                          <input
                            type="file"
                            className={`form-control`}
                            onChange={handlePicturesChange}
                            multiple
                          />
                        </div>
                        <button
                          className={`btn btn-sm my-2 text-white text-center rounded py-2 px-2 ${styles.dugme1} ${styles.linija_ispod_dugmeta} ${styles.slova}`}
                          onClick={handleUpdate}
                        >
                          Sačuvaj
                        </button>
                        <button
                          className={`btn btn-sm ms-2 my-2 text-gray text-center rounded py-2 px-2 ${styles.dugme2} ${styles.linija_ispod_dugmeta} ${styles.slova}`}
                          onClick={() => setEditMode(false)}
                        >
                          Otkaži
                        </button>
                      
                      </div>
                      )}
                    </div>
                  </div>    

                </div>
            </>
          ) : (
            <p className={`text-center text-muted`}>Nema podataka o nekretnini.</p>
          )
        )}

        {/*Objave*/}
        <div className={`row`}>
          <div className={`col-md-4`}>
            <CreatePost onCreatePost={handleCreatePost} />
          </div>

          <div className={`col-md-8 my-5`}>
            <h2 className={`text-blue`}>Objave</h2>
            {isPostsLoading ? (<>
              <p className={`text-center text-muted`}>Učitavanje objava...</p>
            </>) : (
              <>
                {posts.length > 0 ? posts.map(post => (
                  <PostCard key={post.id} post={post} />
                )) : <div className={`d-flex justify-content-center`}>
                      <img src={noposts} alt="noposts" className={`img-fluid ${styles.slika}`}/>
                    </div>
}
              </>
            )}
            {totalPostsCount > 0 &&
              <Pagination totalLength={totalPostsCount} onPaginateChange={handlePaginateChange} currentPage={page}
                perPage={pageSize} />}
            </div>

          <div className={`my-4`}></div>
        </div>
      </div>
    </div>
  );
};
