import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEstate } from "../../Services/EstateService";
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


export const EstatePage = () => {
  const { id } = useParams();
  const [estate, setEstate] = useState<Estate | null>(null);
  const [isEstateLoading, setIsEstateLoading] = useState<boolean>(true);
  const [isPostsLoading, setIsPostsLoading] = useState<boolean>(true);

  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPostsCount, setTotalPostsCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

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

  return (
    <div className={`container mt-5 ${styles.estateContainer}`}>
      {/*Nekretnina*/}
      {isEstateLoading ? (
        <p className={`text-center text-muted mt-3`}>Učitavanje nekretnine...</p>
      ) : (
        estate ? (
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
                <div className={`card-body p-4`}>
                  <h1 className={`card-title mb-4`}>{estate?.title}</h1>
                  <p className={`lead mb-4`}>{estate?.description}</p>
                  <div className="row mb-4">
                    <div className={`col-md-6 mb-3`}>
                      <h5 className={`text-muted`}>Cena</h5>
                      <p className={`text-blue fs-5`}>{estate?.price} €</p>
                    </div>
                    <div className={`col-md-6 mb-3`}>
                      <h5 className={`text-muted`}>Veličina</h5>
                      <p className={`fs-5`}>{estate?.squareMeters} m²</p>
                    </div>
                    <div className={`col-md-6 mb-3`}>
                      <h5 className={`text-muted`}>Broj soba</h5>
                      <p className={`fs-5`}>{estate?.totalRooms}</p>
                    </div>
                    <div className={`col-md-6 mb-3`}>
                      <h5 className={`text-muted`}>Kategorija</h5>
                      <p className={`fs-5`}>{estate?.category}</p>
                    </div>
                    <div className={`col-md-6 mb-3`}>
                      <h5 className={`text-muted`}>Sprat</h5>
                      <p className={`fs-5`}>{estate?.floorNumber ?? "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button className="position-absolute top-0 end-0 m-3 btn btn-outline-danger">
              <FontAwesomeIcon icon={faHeart} />
            </button>

          </div>
        ) : (
          <p className="text-center text-muted">Nema podataka o nekretnini.</p>
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
              )) : <p>Nema objava (stavi neku sliku bolje je)</p>}
            </>
          )}
          {totalPostsCount > 0 &&
            <Pagination totalLength={totalPostsCount} onPaginateChange={handlePaginateChange} currentPage={page}
              perPage={pageSize} />}
        </div>

        <div className="my-4"></div>
      </div>
    </div>
  );
};
