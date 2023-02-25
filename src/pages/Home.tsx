import { useEffect, useState } from "react";
import { useGetCurrentLocation, useWatchLocation } from "../hooks/locationHooks";
import styles from "./Home.module.scss";
import { TLLCoordinates } from "../types/locationTypes";
import { getDistanceFromLatLonInM } from "../lib";
import Letter from "../components/Home/Letter";

const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 1000 * 60, // 1 min (1000 ms * 60 sec * 1 minute = 60 000ms)
  maximumAge: 0, // 24 hour
};

const getDistPerLatOrLon = (coordinates: TLLCoordinates, forLatNotLon: boolean) => {
  const coordinatesForDistanceRatio = forLatNotLon
    ? { ...coordinates, lat: coordinates.lat + 0.01 }
    : { ...coordinates, lon: coordinates.lon + 0.01 };

  return getDistanceFromLatLonInM(coordinates, coordinatesForDistanceRatio) * 100;
};

const Home = () => {
  const [radius, setRadius] = useState<number>(400);
  const {
    coordinates: currentLLCoordinates,
    heading,
    cancelLocationWatch,
    error,
  } = useWatchLocation(geolocationOptions);
  // const currentLLCoordinates = useGetCurrentLocation(geolocationOptions);

  if (!currentLLCoordinates) return <div />;
  const distPerLat = getDistPerLatOrLon(currentLLCoordinates, true);
  const distPerLon = getDistPerLatOrLon(currentLLCoordinates, false);

  const dummyLetters = [
    { LLCoordinates: { lat: 37.480803, lon: 126.950322 } },
    { LLCoordinates: { lat: 37.481276, lon: 126.950285 } },
    { LLCoordinates: { lat: 37.482551, lon: 126.952349 } },
    { LLCoordinates: { lat: 37.480197, lon: 126.9539 } },
    { LLCoordinates: { lat: 37.479101, lon: 126.95267 } },
    { LLCoordinates: { lat: 37.479137, lon: 126.95141 } },
    { LLCoordinates: { lat: 37.482334, lon: 126.953658 } },
  ];
  const filteredLetters = dummyLetters.filter(
    (letter) => getDistanceFromLatLonInM(currentLLCoordinates, letter.LLCoordinates) <= radius
  );
  const LettersDataforDisplay = filteredLetters.map((letter) => ({
    ...letter,
    XYCoordinates: {
      x: (letter.LLCoordinates.lon - currentLLCoordinates.lon) * distPerLon, // m
      y: -(letter.LLCoordinates.lat - currentLLCoordinates.lat) * distPerLat, // m
      // 1500m : 600px => 3/5
    },
  }));

  return (
    <div className={styles["home"]}>
      <ul className={styles["map"]}>
        <li
          className={styles["current-location"]}
          style={{
            width: `${(20 * 800) / radius}px`,
            height: `${(20 * 800) / radius}px`,
            fontSize: `${(15 * 800) / radius}px`,
            transform: `rotate(${!heading || isNaN(heading) ? 0 : heading}deg)`,
          }}
        >
          A
        </li>
        {LettersDataforDisplay.map((letter, index) => (
          <Letter key={index} letter={letter} radius={radius} />
        ))}
      </ul>

      <ul className={styles["zoom-buttons"]}>
        <li className={styles["zoom-button"]}>
          <button
            onClick={() => {
              setRadius((prev) => (prev - 200 >= 200 ? prev - 200 : 100));
            }}
          >
            +
          </button>
        </li>
        <li className={styles["zoom-button"]}>
          <button
            onClick={() => {
              setRadius((prev) => (prev + 200 <= 1400 ? prev + 200 : 1400));
            }}
          >
            -
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Home;
