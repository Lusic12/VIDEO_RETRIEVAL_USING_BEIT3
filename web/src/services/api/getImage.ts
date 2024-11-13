import axiosClient from '../../utils/axiosClient';
export const getByIds = async (img_list: string[]) => {
  const response = await axiosClient.post('/getBySequence', {
    ids: img_list,
  });
  return response.data;
};
