import { authAxios } from "../api/axiosClient";
// import Cookies from 'universal-cookie';
import { deleteFile, downloadFileURL, forgotPassword, getAllImage, getDetailModel, getListModels, importFileURL, manageBankURL, masterFileURL, renewPassURL, uploadFileDirect, userInfoURL } from "../constants";

export const usersApi = {
  getAll: (params) => {
    const url = "/api/users";
    return authAxios().get(url, { params });
  },
};

export const UserInfoUrlApi = (params = {}) => {
  //tắt
  const url = userInfoURL;
  return authAxios().get(url, params);
};

export const GetAllImageApi = (params = {}) => {
  //tắt
  const url = getAllImage;
  return authAxios().get(url, { params });
}

export const GetListModelsApi = (params = {}) => {
  //tắt
  const url = getListModels;
  return authAxios().get(url, { params });
};

export const GetDetailModelApi = (params = {}) => {
  //tắt
  const url = getDetailModel;
  return authAxios().get(url,  {params} );
};
