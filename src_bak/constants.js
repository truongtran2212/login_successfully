import { localhost } from "./server";
const apiURL = "/api";

export const endpoint = `${localhost}${apiURL}`;
// export const endpoints = `${localhost}${apiURLS}`;

export const loginURL = `${endpoint}/token/`;
export const authURL = `${endpoint}/verify_token_login/`;
// export const authURL = `${endpoint}/token/verify/`;
export const token_refresh_URL = `${endpoint}/token/refresh/`;
export const logoutURL = `${endpoint}/logout/`;
export const userInfoURL = `${endpoint}/infor-user/`;
export const forgotPassword = `${endpoint}/forgot_password/`;

export const renewPassURL = tok => `${endpoint}/renewpass/${tok}`;

export const getAllImage = `${endpoint}/import-img/`;

export const getListModels = `${endpoint}/list-models/`;
export const getDetailModel = `${endpoint}/detail-model/`;



