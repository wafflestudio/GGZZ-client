import { TLLCoordinates, TXYCoordinates } from "../../types/locationTypes";
import styles from "./Letter.module.scss";
import { useMyPositionStore } from "../../../store/useMyPositionStore";
import closed_icon from "../../assets/icon/close.svg";
import opened_icon from "../../assets/icon/writing.svg";
import { useHomeModalStore } from "../../../store/useHomeModalStore";
import { LetterResponse } from "../../types/letterTypes";
import { getDistanceFromLatLonInM } from "../../lib/lib";

const getDistPerLatOrLon = (coordinates: TLLCoordinates, forLatNotLon: boolean) => {
  const coordinatesForDistanceRatio = forLatNotLon
    ? { ...coordinates, lat: coordinates.lat + 0.01 }
    : { ...coordinates, lon: coordinates.lon + 0.01 };
  return getDistanceFromLatLonInM(coordinates, coordinatesForDistanceRatio) * 100;
};

const Letter = ({
  letter,
  radius,
}: {
  letter: { id: number; title: string; summary: string; longitude: number; latitude: number };
  radius: number;
  //canOpen: boolean;
}) => {
  const select = useMyPositionStore((state) => state.setViewCoordinates);
  const openModal = useHomeModalStore((state) => state.selectLetter);
  const openDetailed = useHomeModalStore((state) => state.selectDetailedLetter);
  const myPosition = useMyPositionStore((state) => state.currentCoordinates);
  const currentLLCoordinates = () => {
    return myPosition ? myPosition : { lat: -37.4780396, lon: -126.945793 };
  };
  const distPerLat = getDistPerLatOrLon(currentLLCoordinates(), true);
  const distPerLon = getDistPerLatOrLon(currentLLCoordinates(), false);
  const XYCoordinates = {
    x: (letter.longitude - currentLLCoordinates().lon) * distPerLon,
    y: -(letter.latitude - currentLLCoordinates().lat) * distPerLat,
  };
  return (
    <li
      className={styles["letter"]}
      style={{
        width: `${(15 * 800) / radius}px`,
        transform: `translate(${(XYCoordinates.x / (radius * 2)) * 100}vh, ${
          (XYCoordinates.y / (radius * 2)) * 100
        }vh)`,
      }}
      onClick={() => {
        select({ lat: letter.latitude, lon: letter.longitude });
        openModal({
          id: letter.id,
          title: letter.title,
          coordinates: { lat: letter.latitude, lon: letter.longitude },
        });
        //if(canOpen) {openModal(letter) } else {openDetailed(letter)}
      }}
    >
      <img src={opened_icon} />
    </li>
  );
};

export default Letter;
