import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

const PlaceAutocomplete = ({
  children,
  onPlaceSelect,
  onChange,
  placeholder,
}: {
  children?: any;
  onPlaceSelect: (e: google.maps.places.PlaceResult) => any;
  onChange: (e: ChangeEvent) => any;
  placeholder: string;
}): JSX.Element => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
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
      <input
        ref={inputRef}
        onChange={onChange}
        value={children}
        placeholder={placeholder || ""}
      />
    </div>
  );
};

export default PlaceAutocomplete;
