import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBreeds } from "./api/catApi";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import ImageDetail from "./pages/ImageDetail";

function App() {
  const [breeds, setBreeds] = useState([]);
  const [isBreedsLoading, setIsBreedsLoading] = useState(true);
  const [breedsError, setBreedsError] = useState("");

  useEffect(() => {
    async function loadBreeds() {
      setIsBreedsLoading(true);
      setBreedsError("");

      try {
        const data = await getBreeds();
        setBreeds(data);
      } catch (error) {
        setBreedsError(error.message || "Could not load breed suggestions.");
      } finally {
        setIsBreedsLoading(false);
      }
    }

    void loadBreeds();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={(
          <Home
            breeds={breeds}
            isBreedsLoading={isBreedsLoading}
            breedsError={breedsError}
          />
        )}
      />
      <Route path="/collection/:breedId" element={<Collection breeds={breeds} />} />
      <Route path="/image/:imageId" element={<ImageDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
