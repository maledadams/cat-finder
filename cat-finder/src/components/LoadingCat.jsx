const DEFAULT_LOADING_CAT_URL = "https://i.imgur.com/qeBuL8P.jpeg";

function LoadingCat({ label = "Loading..." }) {
  return (
    <div className="loading-cat-wrap">
      <p className="status-text">{label}</p>
      <img
        src={DEFAULT_LOADING_CAT_URL}
        alt={label}
        className="cat-image cat-image-loading"
      />
    </div>
  );
}

export default LoadingCat;
