import axios from 'axios';

const baseUrl = '/api';

export const request = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

request.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem('ZERITHIUM_TOKEN');
    // Bearer
    config.headers.Authorization = `${access_token}`;
    return config;
  },
  (err) => {
    console.log(err);
  }
);

request.interceptors.response.use(
  function (response) {
    if (response.data) {
      const { code } = response.data;
      if (code !== 200) {
        return Promise.reject(response);
      }
    }
    return response;
  },
  async function (error) {
    if (error.response.status === 401) {
      console.log('Not logged in.');
      return Promise.reject(error);
    } else {
      return Promise.reject(error);
    }
  }
);
