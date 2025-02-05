import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEstatesCreatedByUserAPI } from "../../Services/EstateService";
import { getUserPosts } from "../../Services/PostService";
import { Estate } from "../../Interfaces/Estate/Estate";
import EstateCard from "../../Components/EstateCard/EstateCard";
import { Post } from "../../Interfaces/Post/Post";
import { PostCard } from "../PostCard/PostCard";

export const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [estates, setEstates] = useState<Estate[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (id) {
      fetchEstates(id);
      fetchPosts(id);
    }
  }, [id]);

  const fetchEstates = async (userId: string) => {
    const estates = await getEstatesCreatedByUserAPI(userId);
    setEstates(estates || []);
  };

  const fetchPosts = async (userId: string) => {
    const posts = await getUserPosts(userId);
    setPosts(posts || []);
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Nekretnine korisnika</h1>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {estates.length > 0 ? (
          estates.map((estate) => (
            <div key={estate.id} className="col">
              <EstateCard estate={estate} />
            </div>
          ))
        ) : (
          <p className="text-center col-span-3">Korisnik nema nekretnina.</p>
        )}
      </div>
      <hr className="mt-5" />
      <h1 className="text-center my-4">Objave korisnika</h1>
      <div className="row">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="col-12">
              <PostCard post={post} />
            </div>
          ))
        ) : (
          <p className="text-center">Korisnik nema objava.</p>
        )}
      </div>
    </div>
  );
};
