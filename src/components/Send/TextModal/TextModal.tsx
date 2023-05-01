import styles from "./TextModal.module.scss";
import { useLetterFormStore } from "../../../store/useLetterFormStore";

const TextModal = () => {
  const text = useLetterFormStore((state) => state.text);
  const setText = useLetterFormStore((state) => state.setText);

  return (
    <div className={styles.textModal}>
      <div className={styles.description}>남기고 싶은 글</div>
      <textarea
        className={styles.textArea}
        value={text ? text : ""}
        onChange={(e) => setText(e.target.value)}
        placeholder="글을 입력하세요"
      />
    </div>
  );
};

export default TextModal;
