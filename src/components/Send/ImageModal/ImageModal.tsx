import styles from "./ImageModal.module.scss";
import { useLetterFormStore } from "../../../../store/useLetterFormStore";

const ImageModal = () => {
  const imageToSend = useLetterFormStore((state) => state.image);
  const setImageToSend = useLetterFormStore((state) => state.image);
  return <div className={styles.image}>이미지모달</div>;
};
export default ImageModal;
