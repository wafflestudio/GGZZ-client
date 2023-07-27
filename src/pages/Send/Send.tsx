import styles from "./Send.module.scss";
import { useLayoutEffect, useState } from "react";
import writing_icon from "../../assets/icon/writing.svg";
import mic_icon from "../../assets/icon/mic.svg";
import camera_icon from "../../assets/icon/camera.svg";
import close_icon from "../../assets/icon/close.svg";
import submit_icon from "../../assets/icon/corner.svg";

import VoiceModal from "../../components/Send/VoiceModal/VoiceModal";
import TextModal from "../../components/Send/TextModal/TextModal";
import { useNavigate } from "react-router-dom";
import SubmitModal from "../../components/Send/SubmitModal/SubmitModal";
import ImageModal from "../../components/Send/ImageModal/ImageModal";
import React from "react";
import LocationSection from "../../components/Send/LocationSection/LocationSection";
import TextSection from "../../components/Send/TextSection/TextSection";
import ImageSection from "../../components/Send/ImageSection/ImageSection";
import VoiceSection from "../../components/Send/VoiceSection/VoiceSection";
import SubmitSection from "../../components/Send/SubmitSection/SubmitSection";

const Send = () => {
  const [inputModal, setInputModal] = useState<"none" | "writing" | "voice" | "image" | "submit">(
    "none"
  );
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
  });

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
      <SubmitSection />
    </div>
  );
};

export default Send;
