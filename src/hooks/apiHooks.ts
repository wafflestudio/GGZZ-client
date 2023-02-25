import axios, { AxiosResponse } from "axios";
import { useCallback, useLayoutEffect, useState } from "react";
import { TLLCoordinates } from "../types/locationTypes";

const url = (path: string, param?: Record<string, any>): string => {
  const validParamData =
    param &&
    Object.fromEntries(
      Object.entries(param)
        .filter(([key, value]) => value)
        .map(([key, value]) => [key, String(value)])
    );
  return (
    "https://iwe-server.shop" + // TODO: 배포 후 수정
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
}) => axios.post(url("signup"), registerData, {});

export const apiLogin = (loginData: { username: string; password: string }) =>
  axios.post(url("/login"), loginData, {});
