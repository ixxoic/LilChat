import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,      // 跨域自动携带cookie
});

export default axiosInstance;