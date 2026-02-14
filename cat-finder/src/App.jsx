import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { FaSearch, FaRandom } from "react-icons/fa";

const CAT_API_BASE_URL = "https://api.thecatapi.com/v1";
const CAT_API_KEY = import.meta.env.VITE_CAT_API_KEY;
const DEFAULT_CAT = {
  name: "Loading...",
  imageUrl: "https://i.imgur.com/qeBuL8P.jpeg",
};

async function fetchCatApi(endpoint) {
  const response = await fetch(`${CAT_API_BASE_URL}${endpoint}`, {
    headers: CAT_API_KEY ? { "x-api-key": CAT_API_KEY } : {},
  });

  if (!response.ok) {
    throw new Error("The Cat API request failed.");
  }

  return response.json();
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cat, setCat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRandomCat = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const images = await fetchCatApi("/images/search?limit=1");
      const image = images[0];
      if (!image?.url) {
        throw new Error("No cat image found.");
      }

      setCat({
        name: image.breeds?.[0]?.name ?? "Random Cat",
        imageUrl: image.url,
      });
    } catch (error) {
      setErrorMessage(error.message || "Could not fetch a random cat.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleBreedSearch = useCallback(async () => {
    const term = searchTerm.trim();

    if (!term) {
      setErrorMessage("Type a breed name first.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");

    try {
      const breeds = await fetchCatApi(`/breeds/search?q=${encodeURIComponent(term)}`);
      if (!breeds.length) {
        throw new Error(`No breed found for "${term}".`);
      }

      const exactMatch = breeds.find(
        (breed) => breed.name.toLowerCase() === term.toLowerCase(),
      );
      const selectedBreed = exactMatch ?? breeds[0];
      const images = await fetchCatApi(`/images/search?limit=1&breed_ids=${selectedBreed.id}`);
      const image = images[0];
      if (!image?.url) {
        throw new Error(`No image found for "${selectedBreed.name}".`);
      }

      setCat({
        name: selectedBreed.name,
        imageUrl: image.url,
      });
    } catch (error) {
      setErrorMessage(error.message || "Could not search that breed.");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    void handleRandomCat();
  }, [handleRandomCat]);

  const shownCat = isLoading ? DEFAULT_CAT : cat;

  return (
    <div className="page">
      <h1 className="title">Cat Finder</h1>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search for a breed..."
          className="search-input"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              void handleBreedSearch();
            }
          }}
        />
        <button className="search-button" onClick={() => void handleBreedSearch()} disabled={isLoading}>
          <FaSearch />Search</button>

        <button className="random-button" onClick={() => void handleRandomCat()} disabled={isLoading}>
          <FaRandom />Random</button>
      </div>
      {errorMessage && <p className="status-text error-text">{errorMessage}</p>}

      {shownCat && (
        <div className="cat-section">
          <h2 className="cat-title">{shownCat.name}</h2>
          <img
            src={shownCat.imageUrl}
            alt={shownCat.name}
            className={`cat-image ${isLoading ? "cat-image-loading" : ""}`}
          />
        </div>
      )}
    </div>
  );
}

export default App;
