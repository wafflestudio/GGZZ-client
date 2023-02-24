import { useEffect, useState } from "react";
import useMapStore from "../../store/useMapStore";
import { useGetCurrentLocation, useWatchLocation } from "../hooks/locationHooks";
import styles from "./Home.module.scss";
import { TLLCoordinates } from "../types/locationTypes";
import { getDistanceFromLatLonInM } from "../lib";

const getDistPerLatOrLon = (coordinates: TLLCoordinates, forLatNotLon: boolean) => {
  const coordinatesForDistanceRatio = forLatNotLon
    ? { ...coordinates, lat: coordinates.lat + 0.01 }
    : { ...coordinates, lon: coordinates.lon + 0.01 };

  return getDistanceFromLatLonInM(coordinates, coordinatesForDistanceRatio) * 100;
};

const geolocationOptions = {
  enableHighAccuracy: false,
  timeout: 10000, // 1 min (1000 ms * 60 sec * 1 minute = 60 000ms)
  maximumAge: 0, // 24 hour
};

const Home = () => {
  // const { coordinates, cancelLocationWatch, error } = useWatchLocation(geolocationOptions);
  // const currentLLCoordinates = useGetCurrentLocation(geolocationOptions) || {
  //   lat: 37.4,
  //   lon: 126.95,
  // };
  const currentLLCoordinates = { lat: 37.479, lon: 126.9407 - 0.005 };
  const distPerLat = getDistPerLatOrLon(currentLLCoordinates, true);
  const distPerLon = getDistPerLatOrLon(currentLLCoordinates, false);

  const radius = 1000; // m
  const dummyLetters = [{ LLCoordinates: { lat: 37.479, lon: 126.9407 } }];
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
        <li className={styles["current-location"]}>
          {getDistanceFromLatLonInM(currentLLCoordinates, dummyLetters[0].LLCoordinates)}
        </li>
        {LettersDataforDisplay.map((letter, index) => (
          <li
            className={styles["letter"]}
            key={index}
            style={{
              transform: `translate(${(letter.XYCoordinates.x / (1000 * 2)) * 100}vh, ${
                (letter.XYCoordinates.y / (1000 * 2)) * 100
              }vh)`,
            }}
          >
            <button>편지</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
