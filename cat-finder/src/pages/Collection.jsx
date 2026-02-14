import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingCat from "../components/LoadingCat";
import { getBreedById, getBreedImages } from "../api/catApi";

function Collection({ breeds }) {
  const { breedId } = useParams();
  const [images, setImages] = useState([]);
  const [breedName, setBreedName] = useState("Collection");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const localBreedName = useMemo(
    () => breeds.find((breed) => breed.id === breedId)?.name ?? "",
    [breedId, breeds],
  );

  useEffect(() => {
    async function loadCollection() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const imagesResponse = await getBreedImages(breedId, 20);
        setImages(imagesResponse);

        if (localBreedName) {
          setBreedName(localBreedName);
        } else {
          const breed = await getBreedById(breedId);
          setBreedName(breed.name ?? "Collection");
        }
      } catch (error) {
        setErrorMessage(error.message || "Could not load this collection.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadCollection();
  }, [breedId, localBreedName]);

  return (
    <div className="page">
      <div className="top-nav">
        <Link to="/" className="back-link">Back Home</Link>
      </div>

      <h1 className="title">{breedName} Collection</h1>

      {isLoading && <LoadingCat label="Loading collection..." />}
      {errorMessage && <p className="status-text error-text">{errorMessage}</p>}

      {!isLoading && !errorMessage && images.length === 0 && (
        <p className="status-text">No images found for this breed.</p>
      )}

      {!isLoading && !errorMessage && images.length > 0 && (
        <div className="collection-grid">
          {images.map((image) => (
            <Link key={image.id} to={`/image/${image.id}`} className="image-card">
              <img src={image.url} alt={`${breedName} cat`} className="collection-image" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Collection;
