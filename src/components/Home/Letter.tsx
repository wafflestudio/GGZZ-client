import { TLLCoordinates, TXYCoordinates } from "../../types/locationTypes";
import styles from "./Letter.module.scss";
import { useMyPositionStore } from "../../../store/useMyPositionStore";
import closed_icon from "../../assets/icon/close.svg";
import opened_icon from "../../assets/icon/writing.svg";
import { useHomeModalStore } from "../../../store/useHomeModalStore";

const Letter = ({
  letter,
  radius,
  canOpen,
}: {
  letter: { LLCoordinates: TLLCoordinates; XYCoordinates: TXYCoordinates };
  radius: number;
  canOpen: boolean;
}) => {
  const select = useMyPositionStore((state) => state.setViewCoordinates);
  const openModal = useHomeModalStore((state) => state.selectLetter);
  const openDetailed = useHomeModalStore((state) => state.selectDetailedLetter);
  return (
    <li
      className={styles["letter"]}
      style={{
        width: `${(15 * 800) / radius}px`,
        transform: `translate(${(letter.XYCoordinates.x / (radius * 2)) * 100}vh, ${
          (letter.XYCoordinates.y / (radius * 2)) * 100
        }vh)`,
      }}
      onClick={() => {
        select(letter.LLCoordinates);
        //if(canOpen) {openModal(letter) } else {openDetailed(letter)}
      }}
    >
      {canOpen ? <img src={opened_icon} /> : <img src={closed_icon} />}
    </li>
  );
};

export default Letter;
