import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";

export default function SearchBar({ handleSubmit }) {
  const [inputData, setInputData] = useState({ lat: 0, lng: 0, rad: "1" });
  const [placeField, setPlaceField] = useState("");
  const [placesService, setPlacesService] = useState(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places) return;
    const service = new places.PlacesService(document.createElement("div"));
    setPlacesService(service);
  }, [places]);

  async function onSubmit(e) {
    e.preventDefault();
    const res = await getPlaceFromInput(placeField);
    const selectedPlaceRes = res[0];

    const newInputData = {
      ...inputData,
      lat: selectedPlaceRes.geometry.location.lat(),
      lng: selectedPlaceRes.geometry.location.lng(),
      rad: e.target.elements.rad.value,
      level: e.target.elements.level.value,
    };
    const displayAddress = resolveDisplayAddress(selectedPlaceRes);
    setPlaceField(displayAddress);
    setInputData(newInputData);
    handleSubmit(newInputData);
  }

  function onPlaceSelect(val) {
    // Expects a PlaceResult Object https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult
    const displayAddress = resolveDisplayAddress(val);
    setPlaceField(displayAddress);
  }

  async function getPlaceFromInput(val) {
    const request = {
      fields: ["geometry", "formatted_address", "name"],
      query: val,
    };

    return new Promise((resolve, reject) => {
      placesService.findPlaceFromQuery(request, (arrPlaceResults, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(arrPlaceResults);
        } else {
          reject(status);
        }
      });
    });
  }

  function resolveDisplayAddress(placeRes) {
    // Autocomplete widget displays different addresses than the formatted address returned. https://stackoverflow.com/questions/50275296/google-maps-autocomplete-formatted-address-is-not-the-same-as-the-displayed-one
    return placeRes.formatted_address.includes(`${placeRes.name}`)
      ? placeRes.formatted_address
      : `${placeRes.name}, ${placeRes.formatted_address}`;
  }

  function onChangePlaceField(e) {
    setPlaceField(e.target.value);
  }

  return (
    <>
      <form className="flex" onSubmit={onSubmit}>
        <PlaceAutocomplete
          // onChange={onChangeLocationField}
          onPlaceSelect={onPlaceSelect}
          onChange={onChangePlaceField}
        >
          {placeField}
        </PlaceAutocomplete>

        <select id="rad">
          <option value="0.9">1 km</option>
          <option value="1.8">2 km</option>
          <option value="4.5">5 km</option>
          <option value="9">10 km</option>
          <option value="18">20 km</option>
          <option value="90">50 km</option>
        </select>
        <select id="level">
          <option value="easy">Facile</option>
          <option value="medium">Moyen</option>
          <option value="hard">Difficile</option>
        </select>
        <button type="submit">Rechercher</button>
      </form>
    </>
  );
}

const PlaceAutocomplete = ({ children, onPlaceSelect, onChange }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [placeAutocomplete]);
  return (
    <div className="autocomplete-container">
      <input ref={inputRef} onChange={onChange} value={children} />
    </div>
  );
};

/*
Could create a place.PlacesServices object
Take input field state 
run findPlaceFromQuery and take first one
update input field
update formData

problem is that it would make it run twice if user did select autocomplete
*/
