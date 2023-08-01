import styles from "./SubmitSection.module.scss";
import { useLetterFormStore } from "store/useLetterFormStore";
import { useMyPositionStore } from "store/useMyPositionStore";

const SubmitSection = () => {
  const { text, audio, image } = useLetterFormStore((state) => state);
  const me = useMyPositionStore((state) => state.currentCoordinates);

  const fakePostLetter = (requestBody: {
    title: string;
    summary: string;
    longitude: number;
    latitude: number;
    text: string;
  }) => {
    return Promise.resolve({ id: 0, requestBody });
  };
  const fakePutLetter = (id: number, requestBody: FormData) => ({
    id,
    requestBody,
  });

  return (
    <section className={styles["submitSection"]}>
      <button
        className={`${styles["mainPasteButton"]} ${
          (text || audio || image) && styles["active"]
        }`}
        onClick={() => {
          if (me) {
            fakePostLetter({
              title: "",
              summary: "",
              longitude: me.lat,
              latitude: me.lng,
              text: text ?? "",
            }).then((res) => {
              const putBody = new FormData();
              if (image) {
                putBody.append("image", image);
              }
              if (audio) {
                putBody.append("voice", audio);
              }
              fakePutLetter(res.id, putBody);
            });
          }
        }}
      >
        붙이기
      </button>
    </section>
  );
};

export default SubmitSection;
