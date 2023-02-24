import styles from "./VoiceModal.module.scss";
import writing_icon from "../../../assets/icon/writing.svg";

const VoiceModal = () => {
  return (
    <div className={styles.voice}>
      <div className={styles.description}>음성!</div>
    </div>
  );
};

export default VoiceModal;
