import styles from "./Send.module.scss";
import mic_icon from "../../assets/icon/Send/VoiceSection/mic.svg";
import { useLetterFormStore } from "../../store/useLetterFormStore";
import { useReactMediaRecorder } from "react-media-recorder";
import { useEffect } from "react";

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
  const text = useLetterFormStore((state) => state.text);
  const setText = useLetterFormStore((state) => state.setText);

  return (
    <div className={styles["textSection"]}>
      <textarea
        placeholder="끄적끄적..."
        value={text ? text : ""}
        onChange={(e) => setText(e.target.value)}
      />
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
    <div className={styles["voiceSection"]}>
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
    </div>
  );
};

const SubmitSection = () => {
  const { text, audio, image } = useLetterFormStore((state) => state);

  return (
    <div className={styles["submitSection"]}>
      <button
        className={`${styles["mainPasteButton"]} ${(text || audio || image) && styles["active"]}`}
      >
        붙이기
      </button>
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
      <SubmitSection />
    </div>
  );
};

export default Send;
