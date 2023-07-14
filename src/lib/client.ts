import axios from "axios";

export const apiClient = axios.create({
  withCredentials: true
});
// TODO: refresh token 관련 처리
apiClient.interceptors.request.use(
  function (config) {
    // 요청이 전달되기 전에 작업 수행
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    // 요청 오류가 있는 작업 수행
    return Promise.reject(error);
  }
);
