import { useLetterFormStore } from "../../../store/useLetterFormStore";
import React, { useEffect, useState } from "react";
import styles from "./ImageSection.module.scss";
import plus_icon from "../../../assets/icon/Send/ImageSection/plus.svg";

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
