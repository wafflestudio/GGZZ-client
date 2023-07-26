import { useLetterFormStore } from "../../../store/useLetterFormStore";
import { useReactMediaRecorder } from "react-media-recorder-2";
import React, { useEffect } from "react";
import styles from "./VoiceSection.module.scss";
import mic_icon from "../../../assets/icon/Send/VoiceSection/mic.svg";

const VoiceSection = () => {
  const audio = useLetterFormStore((state) => state.audio);
  const setAudio = useLetterFormStore((state) => state.setAudio);
  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      video: false,
    });

  //녹음 정지 시 자동 저장
  useEffect(() => {
    if (status === "stopped") {
      if (mediaBlobUrl)
        fetch(mediaBlobUrl)
          .then((res) => res.blob())
          .then((audioBlob) => {
            setAudio(audioBlob);
          });
    }
  }, [status]);

  return (
    <section className={styles["voiceSection"]}>
      <button
        className={`${styles["recordButton"]} ${
          (status === "recording" || audio) && styles["recording"]
        } }`}
        onClick={() => {
          if (status === "idle") {
            startRecording();
          }
          if (status === "stopped") {
            if (audio) {
              clearBlobUrl();
              setAudio(null);
              startRecording();
            }
          }
          if (status === "recording") {
            stopRecording();
          }
        }}
      >
        <img src={mic_icon} />
      </button>
      <div className={styles["playerWrapper"]}>
        {<audio src={audio ? URL.createObjectURL(audio) : ""} controls />}
      </div>
    </section>
  );
};

export default VoiceSection;
