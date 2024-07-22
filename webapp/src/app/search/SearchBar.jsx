import useSearchSpotForm from "../utils/useSearchSpotForm";
import PlaceAutocomplete from "../utils/PlaceAutocomplete";
import { levelOptions, radiusOptions } from "@/app/utils/spotSearchOptions";

export default function SearchBar({ handleSubmit }) {
  const { placeField, onSubmit, onPlaceSelect, onChangePlaceField } =
    useSearchSpotForm(handleSubmit);

  return (
    <>
      <form className="flex" onSubmit={onSubmit}>
        <PlaceAutocomplete
          onPlaceSelect={onPlaceSelect}
          onChange={onChangePlaceField}
          placeholder="Où veux-tu plonger?"
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
