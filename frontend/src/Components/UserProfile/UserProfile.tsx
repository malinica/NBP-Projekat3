import {ChangeEvent, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getEstatesCreatedByUserAPI} from "../../Services/EstateService";
import {getUserPosts} from "../../Services/PostService";
import {Estate} from "../../Interfaces/Estate/Estate";
import EstateCard from "../../Components/EstateCard/EstateCard";
import {Post} from "../../Interfaces/Post/Post";
import {PostCard} from "../PostCard/PostCard";
import {User} from "../../Interfaces/User/User.ts";
import {getUserByIdAPI, updateUserAPI} from "../../Services/UserService.tsx";
import toast from "react-hot-toast";
import {useAuth} from "../../Context/useAuth.tsx";
import styles from './UserProfile.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPhone, faUser, faUserTag} from "@fortawesome/free-solid-svg-icons";


export const UserProfile = () => {
  const {id} = useParams<{ id: string }>();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const {user} = useAuth();
  const [estates, setEstates] = useState<Estate[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [newPhoneNumber, setNewPhoneNumber] = useState(user?.phoneNumber || "");

  useEffect(() => {
    if (id) {
      fetchUser(id);
      fetchEstates(id);
      fetchPosts(id);
    }
  }, [id]);

  const fetchUser = async (userId: string) => {
    try {
      const response = await getUserByIdAPI(userId);
      if (response?.status == 200) {
        setProfileUser(response.data);
        setNewUsername(response.data.username);
        setNewPhoneNumber(response.data.phoneNumber);
      }
    } catch {
      toast.error("Došlo je do greške prilikom učitavanja korisnika.");
    }
  };

  const fetchEstates = async (userId: string) => {
    const estates = await getEstatesCreatedByUserAPI(userId);
    setEstates(estates || []);
  };

  const fetchPosts = async (userId: string) => {
    const posts = await getUserPosts(userId);
    setPosts(posts || []);
  };

  const handleNewPhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9+ ]/g, "");
    setNewPhoneNumber(value);
  };

  const handleSaveChanges = async () => {
    if (!user) return;

    const trimmedNewUsername = newUsername.trim();
    if (!trimmedNewUsername) {
      toast.error("Unesite korisničko ime.");
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    if (!usernameRegex.test(trimmedNewUsername)) {
      toast.error("Korisničko ime nije u validnom formatu. Dozvoljena su mala i velika slova abecede, brojevi, _ i .");
      return;
    }

    const trimmedNewPhoneNumber = newPhoneNumber.trim();
    if (!trimmedNewPhoneNumber) {
      toast.error("Unesite broj telefona.")
      return;
    }

    try {
      const response = await updateUserAPI(trimmedNewUsername, trimmedNewPhoneNumber);

      if (response?.status === 200) {
        setProfileUser(response.data);
        toast.success("Podaci su uspešno ažurirani!");
        const currentUser = JSON.parse(localStorage.getItem("user")!);
        currentUser.username = trimmedNewUsername;
        currentUser.phoneNumber = newPhoneNumber;
        localStorage.setItem("user", JSON.stringify(currentUser));
        if (profileUser?.username != trimmedNewUsername)
          window.location.reload();
        setIsEditing(false);
      }
    } catch {
      toast.error("Greška prilikom ažuriranja podataka.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewUsername(profileUser?.username || "");
    setNewPhoneNumber(profileUser?.phoneNumber || "");
  }

  return (
    <div className={`container-fluid bg-beige`}>
      <div className={`container bg-beige`}>
        <div className={`mb-3`}>
          <h1 className={`text-center my-4 text-light-blue`}>Podaci o korisniku</h1>
          {isEditing ? (
            <>
              <label className={`form-label text-blue`}>Korisničko ime:</label>
              <input
                type="text"
                className={`form-control mb-2 ${styles.fields}`}
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <label className={`form-label text-blue`}>Broj telefona:</label>
              <input
                type="tel"
                className={`form-control ${styles.fields}`}
                value={newPhoneNumber}
                onChange={handleNewPhoneNumberChange}
              />
              <button
                className={`btn btn-sm text-white text-center rounded py-2 px-2 me-2 ${styles.dugme} ${styles.slova} mt-3`}
                onClick={handleSaveChanges}>
                Sačuvaj izmene
              </button>
              <button
                className={`btn btn-sm text-white text-center rounded py-2 px-2 me-2 ${styles.dugme1} ${styles.slova} mt-3`}
                onClick={handleCancel}>
                Otkaži
              </button>
            </>
          ) : (
            <div className={`d-flex flex-column align-items-center`}>
              <p className={`text-blue fs-4`}>
                <FontAwesomeIcon icon={faUser} className={`me-3`}/>
                <span className={`fw-bold`}>{profileUser?.username}</span>
              </p>
              <p className={`text-blue fs-4`}>
                <a href={`tel:${profileUser?.phoneNumber}`}
                   className={`fw-bold text-blue`}>
                  <FontAwesomeIcon icon={faPhone} className={`me-3`}/>
                  {profileUser?.phoneNumber}
                </a>
              </p>
              {user?.id == profileUser?.id &&
                <button
                  className={`btn btn-sm text-white text-center rounded py-2 px-2 ${styles.dugme1} ${styles.slova}`}
                  onClick={() => setIsEditing(true)}>
                  Izmeni podatke
                </button>
              }
            </div>
          )}
        </div>
        <hr className={`mt-5 text-golden`}></hr>
        <h1 className={`text-center my-4 text-light-blue`}>Nekretnine korisnika</h1>
        <div className={`row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4`}>
          {estates.length > 0 ? (
            estates.map((estate) => (
              <div key={estate.id} className={`col`}>
                <EstateCard estate={estate}/>
              </div>
            ))
          ) : (
            <p className={`text-center text-muted mx-auto`}>Korisnik nema nekretnina.</p>
          )}
        </div>
        <hr className={`mt-5 text-golden`}/>
        <h1 className={`text-center my-4 text-light-blue`}>Objave korisnika</h1>
        <div className={`row`}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className={`col-12`}>
                <PostCard post={post}/>
              </div>
            ))
          ) : (
            <p className={`text-center text-muted mb-5`}>Korisnik nema objava.</p>
          )}
        </div>
      </div>
    </div>
  );
};
