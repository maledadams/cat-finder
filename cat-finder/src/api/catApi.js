const CAT_API_BASE_URL = "https://api.thecatapi.com/v1";
const CAT_API_KEY = import.meta.env.VITE_CAT_API_KEY;

export async function fetchCatApi(endpoint) {
  const response = await fetch(`${CAT_API_BASE_URL}${endpoint}`, {
    headers: CAT_API_KEY ? { "x-api-key": CAT_API_KEY } : {},
  });

  if (!response.ok) {
    throw new Error("The Cat API request failed.");
  }

  return response.json();
}

export function getBreeds() {
  return fetchCatApi("/breeds");
}

export function searchBreeds(term) {
  return fetchCatApi(`/breeds/search?q=${encodeURIComponent(term)}`);
}

export function getBreedImages(breedId, limit = 20) {
  return fetchCatApi(`/images/search?limit=${limit}&breed_ids=${breedId}`);
}

export function getRandomImage() {
  return fetchCatApi("/images/search?limit=1");
}

export function getImageById(imageId) {
  return fetchCatApi(`/images/${imageId}`);
}

export function getBreedById(breedId) {
  return fetchCatApi(`/breeds/${breedId}`);
}

function normalize(value) {
  return value.toLowerCase().trim();
}

export function findLocalBreedMatch(term, breeds) {
  const normalizedTerm = normalize(term);

  if (!normalizedTerm || !breeds.length) {
    return null;
  }

  const exactMatch = breeds.find((breed) => normalize(breed.name) === normalizedTerm);
  if (exactMatch) {
    return exactMatch;
  }

  const startsWithMatch = breeds.find((breed) => normalize(breed.name).startsWith(normalizedTerm));
  if (startsWithMatch) {
    return startsWithMatch;
  }

  return breeds.find((breed) => normalize(breed.name).includes(normalizedTerm)) ?? null;
}

export async function resolveBreedFromTerm(term, breeds) {
  const localMatch = findLocalBreedMatch(term, breeds);
  if (localMatch) {
    return localMatch;
  }

  const apiResults = await searchBreeds(term);
  return apiResults[0] ?? null;
}
