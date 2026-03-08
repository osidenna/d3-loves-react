import { typeColors } from "../data";

export default function FilterBar({ types, activeType, onTypeChange, showFavoritesOnly, onToggleFavorites, favoriteCount }) {
  return (
    <nav className="filter-bar">
      <div className="filter-tabs">
        {["All", ...types].map((type) => (
          <button
            key={type}
            className={`filter-tab ${activeType === type && !showFavoritesOnly ? "active" : ""}`}
            style={activeType === type && !showFavoritesOnly && type !== "All"
              ? { "--tab-color": typeColors[type]?.bg }
              : {}
            }
            onClick={() => onTypeChange(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <button
        className={`fav-tab ${showFavoritesOnly ? "active" : ""}`}
        onClick={onToggleFavorites}
      >
        {showFavoritesOnly ? "♥" : "♡"}
        {favoriteCount > 0 && <span className="fav-count">{favoriteCount}</span>}
      </button>
    </nav>
  );
}
