import { useLetterFormStore } from "../../../store/useLetterFormStore";
import styles from "./SubmitSection.module.scss";
import React from "react";

const SubmitSection = () => {
  const { text, audio, image } = useLetterFormStore((state) => state);

  return (
    <section className={styles["submitSection"]}>
      <button
        className={`${styles["mainPasteButton"]} ${(text || audio || image) && styles["active"]}`}
      >
        붙이기
      </button>
    </section>
  );
};

export default SubmitSection;
