import { typeColors } from "../data";

export default function PokemonCard({ pokemon, isFavorite, onToggleFavorite }) {
  const colors = typeColors[pokemon.type] || { bg: "#9E9E9E", light: "#F5F5F5" };
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

  return (
    <div
      className="pokemon-card"
      style={{ "--type-color": colors.bg, "--type-light": colors.light }}
    >
      <div className="card-top">
        <span className="pokemon-id">#{String(pokemon.id).padStart(3, "0")}</span>
        <button
          className={`favorite-btn ${isFavorite ? "active" : ""}`}
          onClick={() => onToggleFavorite(pokemon.id)}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>

      <img src={spriteUrl} alt={pokemon.name} className="pokemon-sprite" />

      <div className="card-body">
        <h3 className="pokemon-name">{pokemon.name}</h3>
        <span className="pokemon-type">
          <span className="type-dot" style={{ backgroundColor: colors.bg }} />
          {pokemon.type}
        </span>
      </div>

      <div className="pokemon-stats">
        <div className="stat-item">
          <span className="stat-label">HP</span>
          <span className="stat-number">{pokemon.hp}</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-label">ATK</span>
          <span className="stat-number">{pokemon.attack}</span>
        </div>
      </div>
    </div>
  );
}
