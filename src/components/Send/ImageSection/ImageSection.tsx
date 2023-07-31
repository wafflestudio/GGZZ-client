import { useLetterFormStore } from "store/useLetterFormStore";
import { useEffect, useMemo } from "react";
import styles from "./ImageSection.module.scss";
import plus_icon from "assets/icon/Send/ImageSection/plus.svg";

const ImageSection = () => {
  const image = useLetterFormStore((state) => state.image);
  const setImage = useLetterFormStore((state) => state.setImage);
  const imagePreviewURL = useMemo(() => (image ? URL.createObjectURL(image) : ""), [image]);

  useEffect(() => {
    return URL.revokeObjectURL(imagePreviewURL);
  }, []);

  return (
    <section className={styles["imageSection"]}>
      <div className={styles["inputImage"]}>
        <label htmlFor="image">
          <img src={plus_icon} />
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => {
            {
              /*TODO: API가 복수 파일 업로드 지원하면 코드 구현 고치기*/
            }
            if (imagePreviewURL.length > 0) {
              URL.revokeObjectURL(imagePreviewURL);
            }
            if (e.target.files) {
              setImage(e.target.files[0]);
            }
          }}
        />
      </div>
      {imagePreviewURL && <img className={styles["imagePreview"]} src={imagePreviewURL} />}
    </section>
  );
};

export default ImageSection;
