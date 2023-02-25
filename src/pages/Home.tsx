import { useEffect, useState } from "react";
import {
  useGetCurrentLocation,
  useIntervalToGetLocation,
  useWatchLocation,
} from "../hooks/locationHooks";
import styles from "./Home.module.scss";
import { TLLCoordinates } from "../types/locationTypes";
import { getDistanceFromLatLonInM } from "../lib";
import Letter from "../components/Home/Letter";
import { useMyPositionStore } from "../../store/useMyPositionStore";
import me_icon from "../assets/icon/me.svg";
import { useNavigate } from "react-router-dom";

const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 60 * 1000, // 1 min (1000 ms * 60 sec * 1 minute = 60 000ms)
  maximumAge: 0, // 24 hour
};

const getDistPerLatOrLon = (coordinates: TLLCoordinates, forLatNotLon: boolean) => {
  const coordinatesForDistanceRatio = forLatNotLon
    ? { ...coordinates, lat: coordinates.lat + 0.01 }
    : { ...coordinates, lon: coordinates.lon + 0.01 };

  return getDistanceFromLatLonInM(coordinates, coordinatesForDistanceRatio) * 100;
};
const dummyLetters = [
  { id: 0, LLCoordinates: { lat: 37.480803, lon: 126.950322 } },
  { id: 1, LLCoordinates: { lat: 37.481276, lon: 126.950285 } },
  { id: 2, LLCoordinates: { lat: 37.482551, lon: 126.952349 } },
  { id: 3, LLCoordinates: { lat: 37.480197, lon: 126.9539 } },
  { id: 4, LLCoordinates: { lat: 37.479101, lon: 126.95267 } },
  { id: 5, LLCoordinates: { lat: 37.479137, lon: 126.95141 } },
  { id: 6, LLCoordinates: { lat: 37.482334, lon: 126.953658 } },
];
const dummyLetters2 = [
  { id: 7, LLCoordinates: { lat: 37.4789582, lon: 126.944854 } },
  { id: 8, LLCoordinates: { lat: 37.479733, lon: 126.944718 } },
];

const canOpenRadius = 30;

const Home = () => {
  const [radius, setRadius] = useState<number>(400);
  const { heading } = { heading: null }; // useWatchLocation(geolocationOptions);
  const myPosition = useMyPositionStore((state) => state.currentCoordinates);
  const viewPosition = useMyPositionStore((state) => state.viewCoordinates);
  const setViewPosition = useMyPositionStore((state) => state.setViewCoordinates);
  const navigate = useNavigate();
  const currentLLCoordinates = () => {
    if (viewPosition) return viewPosition;
    return myPosition ? myPosition : { lat: -37.4780396, lon: -126.945793 };
  };
  useIntervalToGetLocation(geolocationOptions);

  const distPerLat = getDistPerLatOrLon(currentLLCoordinates(), true);
  const distPerLon = getDistPerLatOrLon(currentLLCoordinates(), false);

  const filteredFarLetters = dummyLetters2.filter(
    (letter) =>
      getDistanceFromLatLonInM(currentLLCoordinates(), letter.LLCoordinates) <= radius &&
      getDistanceFromLatLonInM(
        myPosition ? myPosition : { lat: -1, lon: -1 },
        letter.LLCoordinates
      ) > canOpenRadius
  );
  const filteredCloseLetters = dummyLetters2.filter(
    (letter) =>
      getDistanceFromLatLonInM(
        myPosition ? myPosition : { lat: -1, lon: -1 },
        letter.LLCoordinates
      ) <= canOpenRadius
  );
  const farLettersDataforDisplay = filteredFarLetters.map((letter) => ({
    ...letter,
    XYCoordinates: {
      x: (letter.LLCoordinates.lon - currentLLCoordinates().lon) * distPerLon, // m
      y: -(letter.LLCoordinates.lat - currentLLCoordinates().lat) * distPerLat, // m
    },
  }));
  const closeLettersDataforDisplay = filteredCloseLetters.map((letter) => ({
    ...letter,
    XYCoordinates: {
      x: (letter.LLCoordinates.lon - currentLLCoordinates().lon) * distPerLon, // m
      y: -(letter.LLCoordinates.lat - currentLLCoordinates().lat) * distPerLat, // m
    },
  }));
  useEffect(() => {
    console.log(currentLLCoordinates());
    console.log(myPosition);
  }, [myPosition]);

  return (
    <div className={styles["home"]}>
      {!currentLLCoordinates() ? (
        <div />
      ) : (
        <>
          <ul className={styles["map"]}>
            <li
              key="me"
              className={styles["current-location"]}
              style={{
                width: `${(20 * 800) / radius}px`,
                height: `${(20 * 800) / radius}px`,
                fontSize: `${(15 * 800) / radius}px`,
                transform: `rotate(${!heading || isNaN(heading) ? 0 : heading}deg)`,
              }}
            >
              <img
                className={`${viewPosition ? styles.invisible : styles.visibile}`}
                src={me_icon}
              />
            </li>
            {farLettersDataforDisplay.map((letter, index) => (
              <Letter key={letter.id} letter={letter} radius={radius} canOpen={false} />
            ))}
            {closeLettersDataforDisplay.map((letter, index) => (
              <Letter key={letter.id} letter={letter} radius={radius} canOpen={true} />
            ))}
          </ul>
          <ul className={styles["zoom-buttons"]}>
            <li className={styles["zoom-button"]}>
              <button
                onClick={() => {
                  setRadius((prev) => (prev - 200 >= 200 ? prev - 200 : 200));
                }}
              >
                가까이
              </button>
            </li>
            <li className={styles["rad"]}>{radius}m</li>
            <li className={styles["zoom-button"]}>
              <button
                onClick={() => {
                  setRadius((prev) => (prev + 200 <= 1400 ? prev + 200 : 1400));
                }}
              >
                멀리
              </button>
            </li>
            <li className={styles["zoom-button"]}>
              {viewPosition && (
                <button
                  onClick={() => {
                    setViewPosition(null);
                  }}
                >
                  현위치로
                </button>
              )}
            </li>
          </ul>
          <button
            className={styles["new"]}
            onClick={() => {
              setViewPosition(null);
              navigate("./send");
            }}
          >
            새 편지 남기기
          </button>
        </>
      )}
    </div>
  );
};

export default Home;
