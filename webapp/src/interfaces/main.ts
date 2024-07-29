import { LevelOptions } from "@/app/utils/spotSearchOptions";

/*
Interface for How-To-Sea API Response
*/
export interface HTSAPIResponse {
  code: number;
  data?: any;
  errors?: {};
  message: string | null;
}

// Interface for /location/search endpoint
export interface Spot {
  _id: {
    $oid: string;
  };
  author_id: string;
  title: string;
  dateCreated: string;
  description: string;
  image: string[];
  isPublished: boolean;
  characteristics: any;
  updateTs: string;
  latitude: number;
  longitude: number;
  level: LevelOptions["value"];
  parking: string;
  access_instructions: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
}
