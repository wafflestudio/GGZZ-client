import { useState } from "react";
import styles from "./Home.module.scss";
import Letter from "../components/Home/Letter";
import { useMyPositionStore } from "../../store/useMyPositionStore";
import me_icon from "../assets/icon/me.svg";
import { useNavigate } from "react-router-dom";
import { useHomeModalStore } from "../../store/useHomeModalStore";
import { ReceiveContainer } from "../components/Home/Receive/Receive";
import { apiGetLetters, useApiData } from "../lib/hooks/apiHooks";

const Home = () => {
  const [radius, setRadius] = useState<number>(400);

  const heading = useMyPositionStore((state) => state.heading); // useWatchLocation(geolocationOptions);
  const myPosition = useMyPositionStore((state) => state.currentCoordinates);
  const viewPosition = useMyPositionStore((state) => state.viewCoordinates);
  const setViewPosition = useMyPositionStore((state) => state.setViewCoordinates);
  const navigate = useNavigate();

  // 형석: Api 사용

  const currentLLCoordinates = () => {
    if (viewPosition) return viewPosition;
    return myPosition ? myPosition : { lat: -37.4780396, lon: -126.945793 };
  };

  const letters = useApiData<
    { id: number; title: string; summary: string; longitude: number; latitude: number }[]
  >(
    () => apiGetLetters(currentLLCoordinates().lon ?? 0, currentLLCoordinates().lat ?? 0),
    [],
    [myPosition]
  );

  const modalLetter = useHomeModalStore((state) => state.letter);

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
            {letters.map((letter) => (
              <Letter key={letter.id} letter={letter} radius={radius} />
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
      {modalLetter && <ReceiveContainer />}
    </div>
  );
};

export default Home;
