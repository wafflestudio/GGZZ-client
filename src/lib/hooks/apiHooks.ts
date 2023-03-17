import axios, { AxiosResponse } from "axios";
import { useCallback, useLayoutEffect, useState } from "react";
import { TLLCoordinates } from "../../types/locationTypes";

const url = (path: string, param?: Record<string, any>): string => {
  const validParamData =
    param &&
    Object.fromEntries(
      Object.entries(param)
        .filter(([key, value]) => value)
        .map(([key, value]) => [key, String(value)])
    );
  return (
    "https://52.79.248.196.nip.io" + // TODO: 배포 후 수정
    path +
    (param ? "?" + new URLSearchParams(validParamData).toString() : "")
  );
};
// 사용예시: url("/letters", {paramName1, paramName2, ...})
// 구체적 사용에시는 아래 useApiGetLetters hook 참고

export function useApiData<T>(fetch: () => Promise<AxiosResponse<T>>) {
  const [data, setData] = useState<T>();
  useLayoutEffect(() => {
    fetch().then((res) => {
      setData(res.data);
    });
  }, [fetch]);
  return data;
}

export const useApiGetLetters = () => useCallback(() => axios.get(url("/letters"), {}), []);

export const apiRegister = (registerData: {
  username: string;
  password: string;
  nickname: string;
}) => axios.post(url("/signup"), registerData, { withCredentials: true });

export const apiLogin = (loginData: { username: string; password: string }) =>
  axios.post(url("/login"), loginData, { withCredentials: true });

export const apiCheckLogin = () => axios.get(url("/login"), { withCredentials: true });

export const apiPostLetter = (postLetterData: {
  title: string;
  summary: string;
  longitude: number;
  latitude: number;
  text: string;
}) =>
  axios.post(url("/api/v1/letters"), postLetterData, {
    withCredentials: true,
  });

export const apiPutLetter = (id: number, postLetterData: FormData) =>
  axios.put(url(`/api/v1/letters/${id}/source`), postLetterData, {
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
  });

export const apiGetLetters = (longitude: number, latitude: number) =>
  axios.get(url("/api/v1/letters", { longitude: longitude, latitude: latitude }), {});

export const apiGetLetter = (id: number, longitude: number, latitude: number) =>
  axios.get(url(`/api/v1/letters/${id}`, { longitude, latitude }), { withCredentials: true });
