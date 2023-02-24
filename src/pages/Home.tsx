import { useEffect } from "react";
import useMapStore from "../../store/useMapStore";
import { useGetCurrentLocation, useWatchLocation } from "../hooks/locationHooks";
import styles from "./Home.module.scss";

const Home = () => {
  // const { coordinates: currentCoordinates, errorMsg } = useGetCurrentLocation(); TODO: 추후 error handling 시 수정
  const geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 1000 * 60 * 1, // 1 min (1000 ms * 60 sec * 1 minute = 60 000ms)
    maximumAge: 1000 * 3600 * 24, // 24 hour
  };
  const { coordinates, cancelLocationWatch, error } = useWatchLocation();
  // const currentCoordinates = useGetCurrentLocation();
  // const { mapInfo } = useMapStore((state) => state);

  // const latLongToXY = (latitude: number, longitude: number) => {
  //   const mapWidth = 1000;
  //   const mapHeight = 1000;

  //   const maxLong = 127.269;
  //   const minLong = 126.734;
  //   const maxLat = 37.6;
  //   const minLat = 37.4;

  //   const x = (longitude - minLong) * (mapWidth / (maxLong - minLong));
  //   const latRad = (latitude * Math.PI) / 180;
  //   const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  //   const y = mapHeight / 2 - (mapWidth * mercN) / (2 * Math.PI);

  //   return { x, y };
  // };
  // const { lat, long } = currentCoordinates || {
  //   lat: 0,
  //   long: 0,
  // };
  // const { x, y } = latLongToXY(lat, long);
  // const { x, y } = latLongToXY(currentCoordinates!.latitude, currentCoordinates!.longitude);

  useEffect(() => {
    console.log(1);
    // console.log(useMapStore.getState().mapInfo);
  });

  return <div className={styles.test}>ddd</div>;
};

export default Home;
