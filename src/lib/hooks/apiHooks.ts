import { useCallback, useLayoutEffect, useState } from "react";
import { apiClient as axios } from "../client";
const url = (path: string, param?: Record<string, any>): string => {
  const validParamData =
    param &&
    Object.fromEntries(
      Object.entries(param)
        .filter(([key, value]) => value)
        .map(([key, value]) => [key, String(value)])
    );
  return (
    "https://ggzz-api-dev.wafflestudio.com" + // TODO: 배포 후 수정
    path +
    (param ? "?" + new URLSearchParams(validParamData).toString() : "")
  );
};
// 사용예시: url("/letters", {paramName1, paramName2, ...})
// 구체적 사용에시는 아래 useApiGetLetters hook 참고

export function useApiData<T>(fetch: () => Promise<T>, initialValue: T, deps: any[]): T {
  const [data, setData] = useState<T>(initialValue);
  useLayoutEffect(() => {
    fetch().then((res) => {
      setData(res);
    });
  }, [...deps]);
  return data;
}

export const useApiGetLetters = () => useCallback(() => axios.get(url("/letters"), {}), []);

export const apiRegister = (registerData: {
  username: string;
  password: string;
  nickname: string;
}) => axios.post(url("/signup"), registerData);

export const apiLogin = (loginData: { username: string; password: string }) =>
  axios.post(url("/login"), loginData);

// export const apiCheckLogin = () => axios.get(url("/login"), { withCredentials: true });

export const apiPostLetter = (postLetterData: {
  title: string;
  summary: string;
  longitude: number;
  latitude: number;
  text: string;
}) => axios.post(url("/api/v1/letters"), postLetterData, {});

export const apiPutLetter = (id: number, postLetterData: FormData) =>
  axios.put(url(`/api/v1/letters/${id}/source`), postLetterData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const apiGetLetters = (longitude: number, latitude: number) =>
  axios
    .get(url("/api/v1/letters", { longitude: longitude, latitude: latitude }), {})
    .then((res) => {
      return Promise.resolve(res.data.data);
    });

export const apiGetLetter = (id: number, longitude: number, latitude: number) =>
  axios.get(url(`/api/v1/letters/${id}`, { longitude, latitude }));
