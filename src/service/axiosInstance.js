import axios from "axios";
const BASE_BE_URL = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: BASE_BE_URL,
});


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
