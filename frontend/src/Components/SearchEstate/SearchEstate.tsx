import { useEffect, useState } from "react";
import { Estate } from "../../Interfaces/Estate/Estate";
import { PaginatedResponseDTO } from "../../Interfaces/Pagination/PaginatedResponseDTO";
import { Pagination } from "../Pagination/Pagination";
import EstateCard from "../EstateCard/EstateCard";
import { EstateCategory, EstateCategoryTranslations } from "../../Enums/EstateCategory";
import toast from "react-hot-toast";
import { searchEstatesAPI } from "../../Services/EstateService";


export const SearchEstate=()=>
{
    const [estates, setEstates] = useState<Estate[] | null>(null);
    const [page,setPage]=useState<number>(1);
    const [pageSize,setPageSize]=useState<number>(10);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [totalEstatesCount, setEstatesCount] = useState<number>(0);
    const [searchTitle,setTitleSearch]=useState<string>('');
    const [searchPriceMin,setPriceMinSearch]=useState<number|null>(null);
    const [searchPriceMax,setPriceMaxSearch]=useState<number|null>(null);
    const [searchCategory, setSearchCategory] = useState<EstateCategory[]>([]);
    const handleSearch = () => {
      loadEstates(page, pageSize);
     
      };

      useEffect(() => {
        loadEstates(page, pageSize);
      }, []); 

      const loadEstates = async (page: number, pageSize: number) => {
        setIsLoading(true);
        const result = await searchEstatesAPI(
          searchTitle ?? undefined,
    searchPriceMin ?? undefined,
    searchPriceMax ?? undefined,
    searchCategory ?? undefined,
    page ?? undefined,
    pageSize ?? undefined
          );
        if (!result) {
          toast.error("Nema podataka za prikaz!");
          setEstates(null);
          setEstatesCount(0);
        } else {
          setEstates(result.data);
          setEstatesCount(result?.totalLength ?? 0);
        }
        setIsLoading(false);
      };
    

    const handlePaginateChange = async (page: number, pageSize: number) => {
        await loadEstates(page, pageSize);
        setIsLoading(false);
      }

      return (
        <>
          <div className="search-container">
            <h3>Pretraga Nekretnina</h3>
      
            <div>
              <label htmlFor="title">Naziv:</label>
              <input
                id="title"
                type="text"
                value={searchTitle}
                onChange={(e) => setTitleSearch(e.target.value)}
              />
            </div>
      
            <div>
              <label htmlFor="priceMin">Minimalna cena:</label>
              <input
                id="priceMin"
                type="number"
                value={searchPriceMin || ""}
                onChange={(e) => setPriceMinSearch(e.target.value ? +e.target.value : null)}
              />
            </div>
      
            <div>
              <label htmlFor="priceMax">Maksimalna cena:</label>
              <input
                id="priceMax"
                type="number"
                value={searchPriceMax ?? ""}
onChange={(e) => setPriceMaxSearch(e.target.value ? +e.target.value : null)}

              />
            </div>
      
            <div>
              <label>Kategorije:</label>
                {
    Object.values(EstateCategory).map((category) => (
        <div key={category}>
        <input
            type="checkbox"
            id={category}
            name={category}
            value={category}
            onChange={(e) => {
            if (e.target.checked) {
                setSearchCategory((prev) => [...(prev || []), category]);
            } else {
                setSearchCategory((prev) =>
                prev ? prev.filter((item) => item !== category) : []
                );
            }
            }}
            checked={searchCategory?.includes(category)}
        />
        <label htmlFor={category}>{EstateCategoryTranslations[category]}</label>
        </div>
    ))
    }
            </div>
      
            <button onClick={() => handleSearch()}>Pretrazi</button>
          </div>
      
          {isLoading ? (
            <div>Učitava se...</div>
          ) : (
            <>
              {estates != null && estates.length > 0 ? (
                <div className="estate-cards-container">
                  {estates.map((estate) => (
                    <EstateCard
                    key={estate.id}
                      estate={estate}
                    />
                  ))}
                </div>
              ) : (
                <div>Nemate nijednu nekretninu</div>
              )}
      
              {totalEstatesCount > 0 && (
                <div className="my-4">
                  <Pagination totalLength={totalEstatesCount} onPaginateChange={handlePaginateChange} />
                </div>
              )}
            </>
          )}
        </>
      );
      
}
export default SearchEstate;