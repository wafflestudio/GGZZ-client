import styles from "./Send.module.scss";
import mic_icon from "../../assets/icon/Send/VoiceSection/mic.svg";
import plus_icon from "../../assets/icon/Send/ImageSection/plus.svg";
import { useLetterFormStore } from "../../store/useLetterFormStore";
import { useReactMediaRecorder } from "react-media-recorder";
import React, { useCallback, useEffect, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useMyPositionStore } from "../../store/useMyPositionStore";
import Map from "../../components/Home/Map/Map";

const LocationSection = () => {
  const [clicks, setClicks] = useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = useState(15); // initial zoom
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null);
  const myPosition = useMyPositionStore((state) => state.currentCoordinates);
  const setViewPosition = useMyPositionStore((state) => state.setViewCoordinates);

  const render = useCallback(
    (status: Status) => {
      if (status === Status.FAILURE) return <h3>{status} ...</h3>;
      return <h3>{status} ..</h3>;
    },
    [center]
  );

  const onIdle = useCallback((m: google.maps.Map) => {
    const bounds = m.getBounds();
    if (!bounds) return;
    const newCenter = m.getCenter()?.toJSON();
    if (!newCenter) return;
    setZoom(m.getZoom() ?? 10);
    setCenter(newCenter);
    setViewPosition(newCenter);
  }, []);

  useEffect(() => {
    setCenter(myPosition);
  }, [myPosition]);

  return (
    <div className={styles["locationSection"]}>
      <div className={styles["label"]}>위치 등록</div>
      <div className={styles["chips"]}>
        <div className={styles["locationChip"]}>Hyundai Department Store</div>
      </div>
      <div className={styles["mapContainer"]}>
        <Wrapper
          apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY || ""}
          version="beta"
          libraries={["marker"]}
          render={render}
        >
          <Map
            center={center}
            onIdle={onIdle}
            zoom={zoom}
            clicks={clicks}
            className={styles["map"]}
          />
        </Wrapper>
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
  const image = useLetterFormStore((state) => state.image);
  const setImage = useLetterFormStore((state) => state.setImage);
  const [imagePreviewURL, setImagePreviewURL] = useState("");

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImagePreviewURL(url);
    }
  }, [image]);

  return (
    <div className={styles["imageSection"]}>
      <div className={styles["inputImage"]}>
        <label htmlFor="image">
          <img src={plus_icon} />
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              setImage(e.target.files[0]);
            }
          }}
        />
      </div>
      {imagePreviewURL && <img className={styles["imagePreview"]} src={imagePreviewURL} />}
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
