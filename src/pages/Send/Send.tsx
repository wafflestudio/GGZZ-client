import styles from "./Send.module.scss";
import mic_icon from "../../assets/icon/Send/VoiceSection/mic.svg";

const LocationSection = () => {
  return (
    <div className={styles["locationSection"]}>
      <div className={styles["label"]}>위치 등록</div>
      <div className={styles["chips"]}>
        <div className={styles["locationChip"]}>Hyundai Department Store</div>
      </div>
      <div className={styles["map"]}>
        <div className={styles["fakeMap"]} />
      </div>
    </div>
  );
};

const TextSection = () => {
  return (
    <div className={styles["textSection"]}>
      <textarea placeholder="끄적끄적..." />
    </div>
  );
};

const ImageSection = () => {
  return (
    <div className={styles["imageSection"]}>
      <div className={styles["imageSlide"]}>
        <div className={styles["fakeImage"]} />
        <div className={styles["fakeImage"]} />
        <div className={styles["fakeImage"]} />
        <div className={styles["fakeImage"]} />
        <div className={styles["fakeImage"]} />
      </div>
    </div>
  );
};

const VoiceSection = () => {
  return (
    <div className={styles["voiceSection"]}>
      <button className={styles["recordButton"]}>
        <img src={mic_icon} />
      </button>
      <div className={styles["playerWrapper"]}></div>
    </div>
  );
};

const Send = () => {
  return (
    <div className={styles["send"]}>
      <header className={styles["header"]}>
        <div className={styles["title"]}>끄적이기</div>
        <button className={styles["pasteButton"]}>붙이기</button>
      </header>
      <LocationSection />
      <TextSection />
      <ImageSection />
      <VoiceSection />
      <div className={styles["submit"]}>
        <button className={styles["mainPasteButton"]}>붙이기</button>
      </div>
    </div>
  );
};

export default Send;
