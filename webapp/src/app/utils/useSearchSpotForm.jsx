import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

export default function useSearchSpotForm(handleSubmit) {
  // Defines the state and logic to produce the correct input when submitting the form
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

  return {
    inputData,
    placeField,
    onSubmit,
    onPlaceSelect,
    onChangePlaceField,
  };
}
