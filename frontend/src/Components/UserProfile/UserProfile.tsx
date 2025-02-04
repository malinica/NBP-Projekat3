import { useEffect, useState } from "react";
import { getEstatesCreatedByUserAPI } from "../../Services/EstateService";
import { useAuth } from "../../Context/useAuth";
import { Estate } from "../../Interfaces/Estate/Estate";
import EstateCard from "../../Components/EstateCard/EstateCard";
import { Post } from "../../Interfaces/Post/Post";
import { getUserPosts } from "../../Services/PostService";
import { PostCard } from "../PostCard/PostCard";

export const UserProfile = () => {
  const { user } = useAuth();
  const [estates, setEstates] = useState<Estate[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetchEstates();
      fetchPosts();
    }
  }, [user]);

  const fetchEstates = async () => {
    const estates = await getEstatesCreatedByUserAPI(user!.id);
    setEstates(estates || []);
  };

  const fetchPosts = async () => {
    const posts = await getUserPosts(user!.id);
    console.log(posts);
    setPosts(posts || []);
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Moje nekretnine</h1>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {estates.length > 0 ? (
          estates.map((estate) => (
            <div key={estate.id} className="col">
              <EstateCard id={estate.id} title={estate.title} desc={estate.description} />
            </div>
          ))
        ) : (
          <p className="text-center col-span-3">Nemate nekretnine.</p>
        )}
      </div>
      <hr className="mt-5" />
      <h1 className="text-center my-4">Moje objave</h1>
      <div className="row">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="col-12">
              <PostCard post={post} />
            </div>
          ))
        ) : (
          <p className="text-center">Nemate objava.</p>
        )}
      </div>
    </div>
  );
};
