import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function HomeSearchBar() {
  return (
    <>
      <div
        className="-mx-5 my-8 flex h-80 items-center justify-center bg-home_search bg-cover bg-center md:-mx-10 xl:-mx-20"
        id="wrapper"
      >
        <form
          className="xl-max-w-[1100px] flex max-w-[90%] basis-full flex-col flex-wrap justify-center rounded-xl md:flex-row md:items-center md:bg-white"
          id="search_spot"
        >
          <FormInput
            myLabel={<Label myHtmlFor="coord"> Zone Géographique</Label>}
            myInput={<input placeholder="Où veux-tu plonger?" id="coord" />}
          />
          <FormInput
            myLabel={<Label myHtmlFor="label">Niveau recommandé</Label>}
            myInput={
              <select id="level">
                <option value="all">Tous niveaux</option>
                <option value="easy">Facile</option>
                <option value="medium">Intermédiaire</option>
                <option value="hard">Avancé</option>
              </select>
            }
          />
          <div className="my-2 flex justify-center rounded-xl bg-search-gradient px-5 py-3 text-white md:mr-2 md:rounded-lg">
            <button>
              <FontAwesomeIcon className="pr-2" icon={faMagnifyingGlass} />
              Rechercher
            </button>
          </div>
        </form>
      </div>

      {/* <div>
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
      </div> */}
    </>
  );
}

function Label({ children, myHtmlFor }) {
  return (
    <label
      className="mb-1.5 text-xs font-semibold uppercase"
      htmlFor={myHtmlFor}
    >
      {children}
    </label>
  );
}
function FormInput({ myLabel, myInput }) {
  return (
    <div className="my-2 flex w-full min-w-64 flex-1 flex-col flex-wrap rounded-xl bg-white p-5 md:bg-transparent">
      {myLabel}
      {myInput}
    </div>
  );
}
