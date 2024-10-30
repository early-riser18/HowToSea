"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import useSearchSpotForm from "@/app/(main)/utils/useSearchSpotForm";
import PlaceAutocomplete from "@/app/(main)/utils/PlaceAutocomplete";
import { radiusOptions, levelOptions } from "@/app/(main)/utils/spotSearchOptions";

export default function HomeSearchBar({ handleSubmit }): JSX.Element {
  const { placeField, onSubmit, onPlaceSelect, onChangePlaceField } =
    useSearchSpotForm(handleSubmit);

  return (
    <>
      <form
        className="my-3 inline-flex items-center rounded-lg border-slate-200 bg-slate-100 px-2"
        onSubmit={onSubmit}
      >
        <FormInput
          myLabel={<Label>Lieu</Label>}
          myInput={
            <PlaceAutocomplete
              onPlaceSelect={onPlaceSelect}
              onChange={onChangePlaceField}
              placeholder="Où veux-tu plonger?"
            >
              {placeField}
            </PlaceAutocomplete>
          }
        />
        <FormInput
          myLabel={<Label>Distance</Label>}
          myInput={
            <select
              className="w-32 rounded-md border-[1px] border-gray-200 bg-slate-50 p-1"
              id="rad"
            >
              {radiusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          }
        />
        <FormInput
          myLabel={<Label>Niveau</Label>}
          myInput={
            <select
              className="w-32 rounded-md border-[1px] border-gray-200 bg-slate-50 p-1"
              id="level"
            >
              {levelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          }
        />

        <div className="bg-gradient-to-r my-2 flex items-center justify-center rounded-xl bg-blue-400 px-5 py-3 text-white md:mr-2 md:rounded-lg">
          <button type="submit" className="flex items-center">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2" />
            Rechercher
          </button>
        </div>
      </form>
    </>
  );
}

function Label({ children, myHtmlFor }: { children: any; myHtmlFor?: string }) {
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
    <div className="flex w-full flex-1 flex-col flex-wrap rounded-xl bg-inherit bg-white px-4 py-3 md:bg-transparent">
      {myLabel}
      {myInput}
    </div>
  );
}
