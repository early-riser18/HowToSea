export default function HomeSearchBar() {
  return (
    <>
      <div>
        <form id="searchBarBig">
          <div>
            <div>
              <label htmlFor="areaQuery">
                <div>Zone Géographique</div>
                <input
                  type="text"
                  name="areaQuery"
                  id="zoneQueryAutocomplete"
                  placeholder="Où veux-tu plonger?"
                />
              </label>
            </div>

            <div>
              <label htmlFor="keyWordQuery">
                <div>Niveau recommendé</div>
                <select name="keyWordQuery">
                  <option value="all">Tous niveaux</option>
                  <option value="easy">Facile</option>
                  <option value="medium">Intermédiaire</option>
                  <option value="hard">Avancé</option>
                </select>
              </label>
            </div>

            <div>
              <button type="submit">
                <img alt="" /> Rechercher
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
