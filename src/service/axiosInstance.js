import axios from "axios";
const BASE_BE_URL = "http://localhost:5000/api";

// Setting baseUrl for request
// Example: in this url http://localhost:3000/user/refresh, you just need call /user/refresh
const axiosInstance = axios.create({
  baseURL: BASE_BE_URL,
});

// Setting default request have access token in header

axiosInstance.interceptors.response.use(
  function (response) {
    console.log(response);
    return response;
  },
  async function (error) {
    console.log(error);
    throw error;
  }
);

export default axiosInstance;
