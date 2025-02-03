import { useEffect, useState } from "react";
import { getEstatesCreatedByUserAPI } from "../../Services/EstateService";
import { useAuth } from "../../Context/useAuth";
import { Estate } from "../../Interfaces/Estate/Estate";

export const UserProfile = () => {
  const { user } = useAuth();
  const [estates, setEstates] = useState<Estate[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetchEstates();
    }
  }, [user]);

  const fetchEstates = async () => {
    const estates = await getEstatesCreatedByUserAPI(user!.id);
    setEstates(estates || []);
    console.log(estates);
    if(estates != undefined)
    {
      console.log(estates[0].Description);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Moje nekretnine</h1>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
        {estates.length > 0 ? (
          estates.map((estate) => (
            <div key={estate.id} className="col">
              <div className="card shadow-lg">
                <div className="card-body">
                  <h5 className="card-title">{estate.Title}</h5>
                  <p className="card-text">
                    <strong>Description:</strong> {estate.Description}
                  </p>
                  <p className="card-text">
                    <strong>Longitude:</strong> {estate.Longitude}
                  </p>
                  <p className="card-text">
                    <strong>Latitude:</strong> {estate.Latitude}
                  </p>
                  <p className="card-text">
                    <strong>Price:</strong> {estate.Price}
                  </p>
                  <p className="card-text">
                    <strong>Category:</strong> {estate.Category}
                  </p>
                  <p className="card-text">
                    <strong>FloorNumber:</strong> {estate.FloorNumber}
                  </p>
                  <p className="card-text">
                    <strong>TotalRooms:</strong> {estate.TotalRooms}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3">Nemate dodate nekretnine.</p>
        )}
      </div>

    </div>
  );
};
