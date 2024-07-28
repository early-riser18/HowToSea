export interface RadiusOptions {
  value: "0.9" | "1.8" | "4.5" | "9" | "18" | "90";
  label: "1 km" | "2 km" | "5 km" | "10 km" | "20 km" | "50 km";
}

export interface LevelOptions {
  value: "easy" | "medium" | "hard";
  label: "Facile" | "Intermédiaire" | "Avancé";
}

const radiusOptions: RadiusOptions[] = [
  { value: "0.9", label: "1 km" },
  { value: "1.8", label: "2 km" },
  { value: "4.5", label: "5 km" },
  { value: "9", label: "10 km" },
  { value: "18", label: "20 km" },
  { value: "90", label: "50 km" },
];

const levelOptions: LevelOptions[] = [
  { value: "easy", label: "Facile" },
  { value: "medium", label: "Intermédiaire" },
  { value: "hard", label: "Avancé" },
];

export { levelOptions, radiusOptions };
