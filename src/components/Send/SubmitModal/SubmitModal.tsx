import styles from "./SubmitModal.module.scss";
import { useLetterFormStore } from "../../../../store/useLetterFormStore";
import axios from "axios";
import { useMyPositionStore } from "../../../../store/useMyPositionStore";

const SubmitModal = () => {
  const { text, audio, image, title, setTitle } = useLetterFormStore((state) => state);
  const me = useMyPositionStore((state) => state.currentCoordinates);
  return (
    <div className={styles.submit}>
      <div className={styles.description}>쪽지 남기기</div>
      {!text && !audio && !image ? (
        <div className={styles.noContent}>
          쪽지를 남기려면 <br /> 내용을 입력하세요
        </div>
      ) : (
        <>
          <div className={styles.pleaseWrite}>당신의 쪽지를 한 줄로 소개하세요!</div>
          <input
            className={styles.writeInput}
            value={title ? title : ""}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className={styles.status}>
            <div>{text ? "글" : ""}</div>
            <div>{audio ? "음성" : ""}</div>
            <div>{image ? "사진" : ""}</div>
          </div>
          <div className={styles.youLeft}>을 쪽지에 담았습니다!</div>
          <button
            className={styles.confirmButton}
            onClick={() => {
              if (!title) {
                alert("한 줄 소개를 입력하세요");
              } else {
                /*
                (async () => {
                  axios.post(
                    "https://iwe-server.shop/api/v1/letters",
                    text
                      ? {
                          title: title,
                          summary: "summary",
                          icon_type: "DEFAULT",
                          longitude: me?.lon ? me.lon : 0,
                          latitude: me?.lat ? me.lat : 0,
                          text: text,
                        }
                      : {
                          title: title,
                          summary: "summary",
                          icon_type: "DEFAULT",
                          longitude: me?.lon ? me.lon : 0,
                          latitude: me?.lat ? me.lat : 0,
                          text: "",
                        },
                    {}
                  );
                })();*/
                alert("아직 준비중입니다");
              }
            }}
          >
            남기기
          </button>
        </>
      )}
    </div>
  );
};

export default SubmitModal;
