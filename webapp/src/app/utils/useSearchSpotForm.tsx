import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { ChangeEvent, useEffect, useState } from "react";
import { SearchAPIParams, SearchRequestURLParams } from "../search/interface";

/*
Defines the state and logic to produce the correct input when submitting the form
*/
export default function useSearchSpotForm(
  handleSubmit: (searchParams: SearchAPIParams) => any,
): {
  inputData: SearchRequestURLParams;
  placeField: string;
  onChangePlaceField: (e: ChangeEvent<HTMLFormElement>) => void;
  onPlaceSelect: (e: google.maps.places.PlaceResult) => void;
  onSubmit: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
} {
  const [inputData, setInputData] = useState<SearchRequestURLParams>({
    lat: "0",
    lng: "0",
    rad: "1",
  });
  const [placeField, setPlaceField] = useState<string>("");
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places) return;
    const service = new places.PlacesService(document.createElement("div"));
    setPlacesService(service);
  }, [places]);

  async function onSubmit(e: ChangeEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const res = await getPlaceFromInput(placeField);
    const selectedPlaceRes = res[0];

    const radInput = e.target.elements.namedItem("rad") as HTMLInputElement;
    const levelInput = e.target.elements.namedItem("level") as HTMLInputElement;

    const newInputData = {
      ...inputData,
      lat: selectedPlaceRes.geometry.location.lat(),
      lng: selectedPlaceRes.geometry.location.lng(),
      rad: radInput.value,
      level: levelInput.value,
    };
    const displayAddress = resolveDisplayAddress(selectedPlaceRes);
    setPlaceField(displayAddress);
    setInputData(newInputData);
    handleSubmit(newInputData);
  }

  function onPlaceSelect(val: google.maps.places.PlaceResult): void {
    const displayAddress = resolveDisplayAddress(val);
    setPlaceField(displayAddress);
  }

  async function getPlaceFromInput(placeInput: string) {
    const request = {
      fields: ["geometry", "formatted_address", "name"],
      query: placeInput,
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

  function resolveDisplayAddress(
    placeRes: google.maps.places.PlaceResult,
  ): string {
    // Autocomplete widget displays different addresses than the formatted address returned. https://stackoverflow.com/questions/50275296/google-maps-autocomplete-formatted-address-is-not-the-same-as-the-displayed-one
    return placeRes.formatted_address.includes(`${placeRes.name}`)
      ? placeRes.formatted_address
      : `${placeRes.name}, ${placeRes.formatted_address}`;
  }

  function onChangePlaceField(e: ChangeEvent<HTMLFormElement>): void {
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
