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
    "http://aaaa/api/v1" +
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

export const useApiGetLetters = ({ lat: latitude, lon: longitude }: TLLCoordinates) =>
  useCallback(() => axios.get(url("/letters"), { latitude, longitude }), [latitude, longitude]);
