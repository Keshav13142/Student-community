import { AxiosClient } from ".";

export const createNewPost = async (content) => {
  const { data } = await AxiosClient.post(`/posts`, content);
  return data;
};

export const updatePost = async (content) => {
  const { data } = await AxiosClient.patch(
    `/posts?postId=${content.postId}`,
    content
  );
  return data;
};

export const deletePost = async (postId) => {
  const { data } = await AxiosClient.delete(`/posts?postId=${postId}`);
  return data;
};

export const getAllCategories = async () => {
  const { data } = await AxiosClient.get(`/posts/categories`);
  return data;
};
