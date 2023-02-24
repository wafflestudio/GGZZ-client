import { useEffect, useState } from "react";
import { Tcoordinates } from "../types/locationTypes";

export const useCurrentLocation = (options: PositionOptions = {}) => {
  // if (!navigator.geolocation) {
  //   throw "위치 정보가 지원되지 않습니다.";
  // }
  const [coordinates, setCoordinates] = useState<Tcoordinates>();
  const [errorMsg, setErrorMsg] = useState<string>();

  const handleSuccess = ({ coords }: { coords: GeolocationCoordinates }) => {
    const { latitude, longitude } = coords;
    setCoordinates({ latitude, longitude });
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

export const useGetmap = () => {
  // if (!navigator.geolocation) {
  //   throw "위치 정보가 지원되지 않습니다.";
  // }
  const [mapURL, setMapURL] = useState<string>();

  const getMapURL = ({ coords }: { coords: GeolocationCoordinates }) => {
    const { latitude, longitude, accuracy } = coords;
    // 위치가 부정확할 경우 축소한다.
    const zoomlevel = accuracy <= 80 ? 20 : 20 - Math.round(Math.log(accuracy / 50) / Math.LN2);
    setMapURL(
      "http://maps.google.com/maps/api/staticmap" +
        "?center=" +
        latitude +
        "," +
        longitude +
        "&size=640x640&sensor=true" +
        "&zoom=" +
        zoomlevel
    );
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(getMapURL);
  }, [getMapURL]);

  return mapURL;
};
