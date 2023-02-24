import styles from "./Send.module.scss";
import { useState } from "react";
import writing_icon from "../../assets/icon/writing.svg";
import mic_icon from "../../assets/icon/mic.svg";
import camera_icon from "../../assets/icon/camera.svg";
import close_icon from "../../assets/icon/close.svg";
import submit_icon from "../../assets/icon/corner.svg";

import VoiceModal from "../../components/Send/VoiceModal/VoiceModal";
import TextModal from "../../components/Send/Text/TextModal";
import { useNavigate } from "react-router-dom";

const Send = () => {
  const [inputModal, setInputModal] = useState<"none" | "writing" | "voice">("none");
  const navigate = useNavigate();
  return (
    <div className={styles.send}>
      <button
        className={styles.back}
        onClick={() => {
          navigate("../");
        }}
      >
        돌아가기
      </button>
      <div className={styles.description}>
        무엇이든 <br /> 남겨보세요
      </div>
      <div className={styles.writeMenus}>
        <button
          className={styles.menu}
          onClick={() => {
            setInputModal("writing");
          }}
        >
          <img className={styles.icon} src={writing_icon} />
          <div className={styles.name}>쓰기</div>
        </button>
        <button
          className={styles.menu}
          onClick={() => {
            setInputModal("voice");
          }}
        >
          <img className={styles.icon} src={mic_icon} />
          <div className={styles.name}>말하기</div>
        </button>
        <button className={styles.menu} onClick={() => {}}>
          <img className={styles.icon} src={camera_icon} />
          <div className={styles.name}>사진 찍기</div>
        </button>
      </div>
      <div
        className={`${styles.modalContainer} ${inputModal !== "none" ? styles.on : styles.off}`}
        onClick={() => {
          setInputModal("none");
        }}
      >
        <div
          className={`${styles.modalWrapper} ${styles[inputModal]}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {inputModal === "writing" && <TextModal />}
          {inputModal === "voice" && <VoiceModal />}
          <button
            className={styles.closeModal}
            onClick={() => {
              setInputModal("none");
            }}
          >
            <img className={styles.icon} src={close_icon} />
          </button>
        </div>
      </div>
      <button
        className={styles.submit}
        onClick={() => {
          alert("쪽지를 남기겠습니까?");
        }}
      >
        <img src={submit_icon} />
        <div>남기기</div>
      </button>
    </div>
  );
};

export default Send;
