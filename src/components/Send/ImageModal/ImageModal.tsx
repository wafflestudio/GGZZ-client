import styles from "./ImageModal.module.scss";
import { useLetterFormStore } from "../../../../store/useLetterFormStore";
import { useRef, useState } from "react";
import { Camera, CameraType } from "react-camera-pro";

const ImageModal = () => {
  // justand store
  // getter blob
  const imageToSend = useLetterFormStore((state) => state.image);
  // setter blob
  const setImageToSend = useLetterFormStore((state) => state.setImage);
  const camera = useRef<CameraType | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  return (
    <div className={styles.imageModal}>
      이미지모달(Title)
      <div className={styles.imageContainer}>
        {imageToSend ? (
          <div className={styles.col}>
            <div className={styles.description}>촬영하신 사진</div>
            <img className={styles.image} src={imageToSend} />
          </div>
        ) : null}
      </div>
      <div className={styles.description}>이미지를 촬영해주세요</div>
      {isCameraOn ? (
        <div className={styles.cameraContainer}>
          <Camera
            ref={camera}
            aspectRatio={16 / 9}
            facingMode="environment"
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
          onClick={() => {
            if (camera.current !== null) {
              const image = camera.current.takePhoto();
              setImageToSend(image);
            } else {
              setIsCameraOn(true);
            }
          }}
        >
          {isCameraOn ? "촬영하기" : "카메라 켜기"}
        </button>
        {isCameraOn && (
          <button
            className={styles.changeCameraButton}
            onClick={() => {
              camera.current?.switchCamera();
            }}
          >
            전환
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
