export interface LogInResponse {
  status_code: number;
  body:
    | {
        access_token: string;
        expires_in: number;
        token_type: "Bearer";
      }
    | string;
}

export type Auth0Connection = "GOOGLE";
