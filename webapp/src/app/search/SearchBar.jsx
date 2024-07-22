import useSearchSpotForm from "../utils/useSearchSpotForm";
import PlaceAutocomplete from "../utils/PlaceAutocomplete";

const radiusOptions = [
  { value: "0.9", label: "1 km" },
  { value: "1.8", label: "2 km" },
  { value: "4.5", label: "5 km" },
  { value: "9", label: "10 km" },
  { value: "18", label: "20 km" },
  { value: "90", label: "50 km" },
];

const levelOptions = [
  { value: "easy", label: "Facile" },
  { value: "medium", label: "Moyen" },
  { value: "hard", label: "Difficile" },
];

export default function SearchBar({ handleSubmit }) {
  const { placeField, onSubmit, onPlaceSelect, onChangePlaceField } =
    useSearchSpotForm(handleSubmit);

  return (
    <>
      <form className="flex" onSubmit={onSubmit}>
        <PlaceAutocomplete
          onPlaceSelect={onPlaceSelect}
          onChange={onChangePlaceField}
        >
          {placeField}
        </PlaceAutocomplete>

        <select id="rad">
          {radiusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select id="level">
          {levelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button type="submit">Rechercher</button>
      </form>
    </>
  );
}
