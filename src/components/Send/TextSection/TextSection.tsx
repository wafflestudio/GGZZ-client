import { useLetterFormStore } from "../../../store/useLetterFormStore";
import styles from "./TextSection.module.scss";
import React from "react";

const TextSection = () => {
  const text = useLetterFormStore((state) => state.text);
  const setText = useLetterFormStore((state) => state.setText);

  return (
    <section className={styles["textSection"]}>
      <textarea
        placeholder="끄적끄적..."
        value={text ? text : ""}
        onChange={(e) => setText(e.target.value)}
      />
    </section>
  );
};

export default TextSection;
