import axios from 'axios';
import useAppStore from './useAuthStore';

export const api = axios.create({
  baseURL: 'http://146.190.216.101:3000/api',
  timeout: 60000,
});
// export const api = axios.create({
//   baseURL: 'http://localhost:3000',
//   timeout: 60000,
// });
api.interceptors.request.use(
  (config) => {
    const token = useAppStore.getState().token;
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const endpoints = {
  getCities: 'cities',
  addCity: 'cities',
  deleteCity: 'cities',
  updateCity: 'cities',
  updateUser: 'user/update',
  deleteUser: 'user',
  getUsers: 'user',
  createUser: 'user',
  properties: 'property/filter',
  deleteProperty: 'property',
  updateProperty: 'property',
};
