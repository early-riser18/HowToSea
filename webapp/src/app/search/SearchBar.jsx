export default function SearchBar({ handleSubmit }) {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text"></input>
        <select id="rad">
          <option value="0.9">1 km</option>
          <option value="1.8">2 km</option>
          <option value="4.5">5 km</option>
          <option value="9">10 km</option>
          <option value="18">20 km</option>
          <option value="90">50 km</option>
        </select>
        <select id="level">
          <option value="all">Tous niveaux</option>
          <option value="easy">Facile</option>
          <option value="medium">Moyen</option>
          <option value="hard">Difficile</option>
        </select>
        <button type="submit">Rechercher</button>
      </form>
    </>
  );
}
