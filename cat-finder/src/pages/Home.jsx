import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRandom, FaSearch } from "react-icons/fa";
import LoadingCat from "../components/LoadingCat";
import { getRandomImage, resolveBreedFromTerm } from "../api/catApi";

function Home({ breeds, isBreedsLoading, breedsError }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isRandomLoading, setIsRandomLoading] = useState(true);
  const [randomCat, setRandomCat] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const latestRandomRequestRef = useRef(0);
  const ranInitialRandomRef = useRef(false);

  const suggestionBreeds = useMemo(() => {
    if (!breeds.length) {
      return [];
    }

    const shuffled = [...breeds];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }

    return shuffled.slice(0, 8);
  }, [breeds]);

  const handleSearch = useCallback(async () => {
    const term = searchTerm.trim();
    if (!term) {
      setErrorMessage("Type a breed name first.");
      return;
    }

    setIsSearching(true);
    setErrorMessage("");

    try {
      const matchedBreed = await resolveBreedFromTerm(term, breeds);
      if (!matchedBreed) {
        throw new Error(`No breed found for "${term}".`);
      }

      navigate(`/collection/${matchedBreed.id}`);
    } catch (error) {
      setErrorMessage(error.message || "Could not search that breed.");
    } finally {
      setIsSearching(false);
    }
  }, [breeds, navigate, searchTerm]);

  const handleRandomCat = useCallback(async () => {
    const requestId = latestRandomRequestRef.current + 1;
    latestRandomRequestRef.current = requestId;
    setIsRandomLoading(true);
    setErrorMessage("");

    try {
      const images = await getRandomImage();
      const image = images[0];
      if (!image?.url) {
        throw new Error("No cat image found.");
      }

      if (requestId === latestRandomRequestRef.current) {
        setRandomCat({
          id: image.id,
          name: image.breeds?.[0]?.name ?? "Random Cat",
          imageUrl: image.url,
        });
      }
    } catch (error) {
      if (requestId === latestRandomRequestRef.current) {
        setErrorMessage(error.message || "Could not fetch a random cat.");
      }
    } finally {
      if (requestId === latestRandomRequestRef.current) {
        setIsRandomLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (ranInitialRandomRef.current) {
      return;
    }

    ranInitialRandomRef.current = true;
    void handleRandomCat();
  }, [handleRandomCat]);

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
              void handleSearch();
            }
          }}
        />
        <button
          className="search-button"
          onClick={() => void handleSearch()}
          disabled={isSearching}
        >
          <FaSearch />
          Search
        </button>
        <button
          className="random-button"
          onClick={() => void handleRandomCat()}
          disabled={isRandomLoading}
        >
          <FaRandom />
          Random
        </button>
      </div>

      <div className="suggestions-section">
        <p className="section-label">Suggested</p>
        {isBreedsLoading && <p className="status-text">Loading suggestions...</p>}
        {!isBreedsLoading && breedsError && (
          <p className="status-text error-text">{breedsError}</p>
        )}
        {!isBreedsLoading && !breedsError && (
          <div className="suggestion-grid">
            {suggestionBreeds.map((breed) => (
              <button
                key={breed.id}
                type="button"
                className="suggestion-button"
                onClick={() => navigate(`/collection/${breed.id}`)}
              >
                {breed.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {errorMessage && <p className="status-text error-text">{errorMessage}</p>}

      <div className="cat-section">
        {isRandomLoading && <LoadingCat label="Loading random cat..." />}
        {!isRandomLoading && randomCat && (
          <>
            <h2 className="cat-title">{randomCat.name}</h2>
            <Link to={`/image/${randomCat.id}`} className="cat-link">
              <img src={randomCat.imageUrl} alt={randomCat.name} className="cat-image" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
