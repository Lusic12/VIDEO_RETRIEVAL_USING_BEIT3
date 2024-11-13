import axiosClient from '../../utils/axiosClient';
export const search = async (
  query: string,
  limit: number = 100,
  model: string = 'blip2_feature_extractor',
) => {
  const response = await axiosClient.post('/search', {
    query,
    model,
    limit,
  });
  return response.data;
};

export const neighborSearch = async (id: string, limit: number = 100) => {
  // /neighbor?id=123&limit=100
  const response = await axiosClient.post('/neighbor', {
    id,
    limit,
  });
  return response.data;
};
