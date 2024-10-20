export type QueryStatus = "error" | "loading" | "success";
export type FormSubmissionStatus = "idle" | "submitting" | "success" | "failure"
export interface SearchRequestURLParams {
  lat: string;
  lng: string;
  rad: string;
  level?: string;
}

export interface SearchAPIParams {
  lat: number;
  lng: number;
  rad: string;
  level?: string;
}

