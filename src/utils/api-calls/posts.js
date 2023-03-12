import { AxiosClient } from ".";

export const createNewPost = async (content) => {
  const { data } = await AxiosClient.post(`/posts/`, content);
  return data;
};

export const getAllCategories = async () => {
  const { data } = await AxiosClient.get(`/posts/categories`);
  return data;
};
