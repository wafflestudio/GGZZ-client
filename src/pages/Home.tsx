import { useCurrentLocation, useGetmap } from "../hooks/locationHooks";
import styles from "./Home.module.scss";

const Home = () => {
  // const { coordinates: currentCoordinates, errorMsg } = useCurrentLocation(); TODO: 추후 error handling 시 수정
  const currentCoordinates = useCurrentLocation();
  const mapURL = useGetmap();

  const latLongToXY = (latitude: number, longitude: number) => {
    const mapWidth = 1000;
    const mapHeight = 1000;

    const maxLong = 127.269;
    const minLong = 126.734;
    const maxLat = 37.6;
    const minLat = 37.4;

    const x = (longitude - minLong) * (mapWidth / (maxLong - minLong));
    const latRad = (latitude * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = mapHeight / 2 - (mapWidth * mercN) / (2 * Math.PI);

    return { x, y };
  };
  const { latitude, longitude } = currentCoordinates || {
    latitude: 0,
    longitude: 0,
  };
  const { x, y } = latLongToXY(latitude, longitude);
  // const { x, y } = latLongToXY(currentCoordinates!.latitude, currentCoordinates!.longitude);
  return (
    <div className={styles.test}>
      <p>
        {x}, {y}
      </p>
      <img src={mapURL} alt="" />
    </div>
  );
};

export default Home;
