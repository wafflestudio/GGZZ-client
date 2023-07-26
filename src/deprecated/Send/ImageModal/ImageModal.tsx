import styles from "./ImageModal.module.scss";
import { useLetterFormStore } from "../../../store/useLetterFormStore";
import { useEffect, useRef, useState } from "react";
import { Camera, CameraType } from "react-camera-pro";

const ImageModal = () => {
  // justand store
  // getter blob
  const imageToSend = useLetterFormStore((state) => state.image);
  // setter blob
  const setImageToSend = useLetterFormStore((state) => state.setImage);
  const [previewImageURL, setPreviewImageURL] = useState<string | null>(null);
  const camera = useRef<CameraType | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | undefined>(undefined);

  // useEffect(() => {
  //   async function getDevices() {
  //     const devices = await navigator.mediaDevices.enumerateDevices();
  //     const videoDevices = devices.filter((i) => i.kind == "videoinput");
  //     setDevices(videoDevices);
  //   }
  //   getDevices();
  // }, [isCameraOn]);
  useEffect(() => {
    if (imageToSend && !previewImageURL) {
      setPreviewImageURL(URL.createObjectURL(imageToSend));
    }
  }, []);
  useEffect(() => {
    (async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((i) => i.kind == "videoinput");
      setDevices(videoDevices);
    })();
  });

  return (
    <div className={styles.imageModal}>
      이미지
      <div className={styles.imageContainer}>
        {imageToSend ? (
          <div className={styles.col}>
            <div className={styles.description}>촬영하신 사진</div>
            <img className={styles.image} src={previewImageURL ? previewImageURL : ""} />
          </div>
        ) : null}
      </div>
      <div className={styles.selectContainer}>
        {isCameraOn && devices.length > 0 && (
          <select
            className={styles.select}
            onChange={(event) => {
              setActiveDeviceId(event.target.value);
            }}
            placeholder="카메라를 선택해주세요"
          >
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className={styles.description}>이미지를 촬영해주세요</div>
      {isCameraOn ? (
        <div className={styles.cameraContainer}>
          <Camera
            ref={camera}
            aspectRatio={16 / 9}
            videoSourceDeviceId={activeDeviceId}
            errorMessages={{
              noCameraAccessible:
                "접근 가능한 카메라가 없습니다. 카메라를 연결하거나 다른 브라우저를 사용해보세요.",
              permissionDenied:
                "접근 권한이 없습니다. 새로고침 후 카메라 접근 권한을 부여해주세요.",
              switchCamera: "카메라를 전환할 수 없습니다. 접근 가능한 카메라가 하나뿐입니다.",
              canvas: "캔버스를 생성할 수 없습니다.",
            }}
          />
        </div>
      ) : null}
      <div className={styles.captureBtnContainer}>
        <button
          className={styles.captureButton}
          onClick={async () => {
            if (camera.current !== null) {
              const imageURL = camera.current.takePhoto();
              setPreviewImageURL(imageURL);
              const imageBlob = await fetch(imageURL).then((r) => r.blob());
              setImageToSend(imageBlob);
            } else {
              setIsCameraOn(true);
            }
          }}
        >
          {isCameraOn ? "촬영하기" : "카메라 켜기"}
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
