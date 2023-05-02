import { TLLCoordinates, TXYCoordinates } from "../../lib/types/locationTypes";
import styles from "./Letter.module.scss";
import { useMyPositionStore } from "../../store/useMyPositionStore";
import closed_icon from "../../assets/icon/close.svg";
import opened_icon from "../../assets/icon/writing.svg";
import { useHomeModalStore } from "../../store/useHomeModalStore";
import { LetterResponse } from "../../lib/types/letterTypes";
import { getDistanceFromLatLngInM } from "../../lib/lib";

const getDistPerLatOrLng = (coordinates: TLLCoordinates, forLatNotLng: boolean) => {
  const coordinatesForDistanceRatio = forLatNotLng
    ? { ...coordinates, lat: coordinates.lat + 0.01 }
    : { ...coordinates, lng: coordinates.lng + 0.01 };
  return getDistanceFromLatLngInM(coordinates, coordinatesForDistanceRatio) * 100;
};

const Letter = ({
  letter,
  radius,
}: {
  letter: { id: number; title: string; summary: string; lnggitude: number; latitude: number };
  radius: number;
  //canOpen: boolean;
}) => {
  const select = useMyPositionStore((state) => state.setViewCoordinates);
  const openModal = useHomeModalStore((state) => state.selectLetter);
  const openDetailed = useHomeModalStore((state) => state.selectDetailedLetter);
  const myPosition = useMyPositionStore((state) => state.currentCoordinates);
  const currentLLCoordinates = () => {
    return myPosition ? myPosition : { lat: -37.4780396, lng: -126.945793 };
  };
  const distPerLat = getDistPerLatOrLng(currentLLCoordinates(), true);
  const distPerLng = getDistPerLatOrLng(currentLLCoordinates(), false);
  const XYCoordinates = {
    x: (letter.lnggitude - currentLLCoordinates().lng) * distPerLng,
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
        select({ lat: letter.latitude, lng: letter.lnggitude });
        openModal({
          id: letter.id,
          title: letter.title,
          coordinates: { lat: letter.latitude, lng: letter.lnggitude },
        });
        //if(canOpen) {openModal(letter) } else {openDetailed(letter)}
      }}
    >
      <img src={opened_icon} />
    </li>
  );
};

export default Letter;
