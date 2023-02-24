import styles from "./Send.module.scss";
import writing_icon from "../../assets/icon/writing.svg";
import mic_icon from "../../assets/icon/mic.svg";
import camera_icon from "../../assets/icon/camera.svg";

const Send = () => {
  return (
    <div className={styles.send}>
      <div className={styles.description}>
        무엇이든 <br /> 남겨보세요
      </div>
      <div className={styles.writeMenus}>
        <button className={styles.menu} onClick={() => {}}>
          <img className={styles.icon} src={writing_icon} />
          <div className={styles.name}>쓰기</div>
        </button>
        <button className={styles.menu} onClick={() => {}}>
          <img className={styles.icon} src={mic_icon} />
          <div className={styles.name}>말하기</div>
        </button>
        <button className={styles.menu} onClick={() => {}}>
          <img className={styles.icon} src={camera_icon} />
          <div className={styles.name}>사진 찍기</div>
        </button>
      </div>
    </div>
  );
};

export default Send;
