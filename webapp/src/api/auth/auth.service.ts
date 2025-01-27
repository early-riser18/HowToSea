import { api } from "../api";

export const getTestUser = async () => {
  const url = "auth/test_user";
  const response = await api.get(url);
  return response.data;
};
