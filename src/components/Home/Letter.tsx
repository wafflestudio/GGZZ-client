import { TLLCoordinates, TXYCoordinates } from "../../types/locationTypes";
import styles from "./Letter.module.scss";

const Letter = ({
  letter,
  radius,
}: {
  letter: { LLCoordinates: TLLCoordinates; XYCoordinates: TXYCoordinates };
  radius: number;
}) => {
  return (
    <li
      className={styles["letter"]}
      style={{
        transform: `translate(${(letter.XYCoordinates.x / (radius * 2)) * 100}vh, ${
          (letter.XYCoordinates.y / (radius * 2)) * 100
        }vh)`,
      }}
    >
      <button>편지</button>
    </li>
  );
};

export default Letter;
