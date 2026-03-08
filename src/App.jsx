import { useState, useMemo } from "react";
import { pokemons } from "./data";
import PokemonCard from "./components/PokemonCard";
import FilterBar from "./components/FilterBar";
import "./App.css";

const types = [...new Set(pokemons.map((p) => p.type))].sort();

export default function App() {
  const [activeType, setActiveType] = useState("All");
  const [favorites, setFavorites] = useState(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("id");

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return pokemons
      .filter((p) => {
        const matchesType = activeType === "All" || p.type === activeType;
        const matchesFav = !showFavoritesOnly || favorites.has(p.id);
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesFav && matchesSearch;
      })
      .sort((a, b) => {
        if (sort === "name") return a.name.localeCompare(b.name);
        if (sort === "hp") return b.hp - a.hp;
        if (sort === "attack") return b.attack - a.attack;
        return a.id - b.id;
      });
  }, [activeType, showFavoritesOnly, favorites, search, sort]);

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <h1 className="title">Poké<span className="title-accent">dex</span></h1>
          <p className="subtitle">{filtered.length} of {pokemons.length} Pokémon</p>
        </div>
        <div className="header-controls">
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch("")}>×</button>
            )}
          </div>
          <select
            className="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="id">Sort: #ID</option>
            <option value="name">Sort: Name</option>
            <option value="hp">Sort: HP</option>
            <option value="attack">Sort: Attack</option>
          </select>
        </div>
      </header>

      <FilterBar
        types={types}
        activeType={activeType}
        onTypeChange={(type) => {
          setActiveType(type);
          setShowFavoritesOnly(false);
        }}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly((v) => !v)}
        favoriteCount={favorites.size}
      />

      {filtered.length === 0 ? (
        <div className="empty">
          {showFavoritesOnly && favorites.size === 0 ? (
            <>
              <p>No favorites yet — star some Pokémon first!</p>
              <button className="reset-btn" onClick={() => setShowFavoritesOnly(false)}>
                Show all Pokémon
              </button>
            </>
          ) : (
            <>
              <p>No Pokémon match your search.</p>
              <button className="reset-btn" onClick={() => { setSearch(""); setActiveType("All"); setShowFavoritesOnly(false); }}>
                Clear filters
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid">
          {filtered.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              isFavorite={favorites.has(pokemon.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
