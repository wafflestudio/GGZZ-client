import { TLLCoordinates, TXYCoordinates } from "../../types/locationTypes";
import styles from "./Letter.module.scss";
import { useMyPositionStore } from "../../../store/useMyPositionStore";

const Letter = ({
  letter,
  radius,
}: {
  letter: { LLCoordinates: TLLCoordinates; XYCoordinates: TXYCoordinates };
  radius: number;
}) => {
  const select = useMyPositionStore((state) => state.setViewCoordinates);
  return (
    <li
      className={styles["letter"]}
      style={{
        transform: `translate(${(letter.XYCoordinates.x / (radius * 2)) * 100}vh, ${
          (letter.XYCoordinates.y / (radius * 2)) * 100
        }vh)`,
      }}
      onClick={() => {
        select(letter.LLCoordinates);
      }}
    >
      <button>편지</button>
    </li>
  );
};

export default Letter;
