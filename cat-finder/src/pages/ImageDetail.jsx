import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingCat from "../components/LoadingCat";
import { getImageById } from "../api/catApi";

function ImageDetail() {
  const { imageId } = useParams();
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadImage() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const imageResponse = await getImageById(imageId);
        if (!imageResponse?.url) {
          throw new Error("Image not found.");
        }
        setImage(imageResponse);
      } catch (error) {
        setErrorMessage(error.message || "Could not load image details.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadImage();
  }, [imageId]);

  const breed = image?.breeds?.[0];

  return (
    <div className="page">
      <div className="top-nav">
        <Link to="/" className="back-link">Back Home</Link>
        {breed?.id && (
          <Link to={`/collection/${breed.id}`} className="back-link">Back to Collection</Link>
        )}
      </div>

      <h1 className="title">Cat Detail</h1>

      {isLoading && <LoadingCat label="Loading image details..." />}
      {errorMessage && <p className="status-text error-text">{errorMessage}</p>}

      {!isLoading && !errorMessage && image && (
        <div className="detail-layout">
          <img src={image.url} alt={breed?.name ?? "Cat"} className="detail-image" />

          <div className="detail-panel">
            <h2 className="detail-title">{breed?.name ?? "Unknown Breed"}</h2>
            <p><strong>Origin:</strong> {breed?.origin ?? "Unknown"}</p>
            <p><strong>Life Span:</strong> {breed?.life_span ? `${breed.life_span} years` : "Unknown"}</p>
            <p><strong>Temperament:</strong> {breed?.temperament ?? "Unknown"}</p>
            <p><strong>Image ID:</strong> {image.id}</p>
            <p><strong>Dimensions:</strong> {image.width}x{image.height}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageDetail;
