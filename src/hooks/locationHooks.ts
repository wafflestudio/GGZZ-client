import { useEffect, useRef, useState } from "react";
import { TLLCoordinates } from "../types/locationTypes";
import useMapStore from "../../store/useMapStore";
export const useGetCurrentLocation = (options: PositionOptions = {}) => {
  // if (!navigator.geolocation) {
  //   throw "위치 정보가 지원되지 않습니다.";
  // }
  const [coordinates, setCoordinates] = useState<TLLCoordinates>();
  const [errorMsg, setErrorMsg] = useState<string>();

  const handleSuccess = ({ coords }: { coords: GeolocationCoordinates }) => {
    const { latitude: lat, longitude: long } = coords;
    setCoordinates({ lat, long });
  };

  const handleError = (error: GeolocationPositionError) => {
    setErrorMsg(error.message);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
  }, [options]);

  // return { coordinates, errorMsg }; TODO: 추후 error handling 시 수정
  return coordinates;
};

// export const useGetmap = () => {
//   // if (!navigator.geolocation) {
//   //   throw "위치 정보가 지원되지 않습니다.";
//   // }
//   const [mapURL, setMapURL] = useState<string>();

//   const getMapURL = ({ coords }: { coords: GeolocationCoordinates }) => {
//     const { latitude: lat, longitude: long, accuracy } = coords;
//     // 위치가 부정확할 경우 축소한다.
//     const zoomlevel = accuracy <= 80 ? 20 : 20 - Math.round(Math.log(accuracy / 50) / Math.LN2);
//     setMapURL(
//       "http://maps.google.com/maps/api/staticmap" +
//         "?center=" +
//         lat +
//         "," +
//         long +
//         "&size=640x640&sensor=true" +
//         "&zoom=" +
//         zoomlevel
//     );
//   };

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(getMapURL);
//   }, [getMapURL]);

//   return mapURL;
// };

export const useWatchLocation = (options = {}) => {
  const [coordinates, setCoordinates] = useState<TLLCoordinates>();
  const [error, setError] = useState<string>();
  const locationWatchId = useRef<number | null>(null);
  // const { setCenter } = useMapStore((state) => state);

  const handleSuccess = ({ coords }: { coords: GeolocationCoordinates }) => {
    const { latitude: lat, longitude: long } = coords;
    // setCenter({ lat, long });
    setCoordinates({ lat, long });
  };

  const handleError = (error: GeolocationPositionError) => {
    setError(error.message);
  };

  // 저장된 `watchPosition` ID를 기반으로 감시 인스턴스를 지웁니다.
  const cancelLocationWatch = () => {
    const { geolocation } = navigator;
    if (locationWatchId.current && geolocation) {
      geolocation.clearWatch(locationWatchId.current);
    }
  };

  useEffect(() => {
    locationWatchId.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );
    return cancelLocationWatch;
  }, [options]);

  return { coordinates, cancelLocationWatch, error };
};
