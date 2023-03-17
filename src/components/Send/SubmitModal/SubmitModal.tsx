import styles from "./SubmitModal.module.scss";
import { useLetterFormStore } from "../../../../store/useLetterFormStore";
import axios from "axios";
import { useMyPositionStore } from "../../../../store/useMyPositionStore";
import { useIntervalToGetLocation } from "../../../lib/hooks/locationHooks";
import { useEffect } from "react";
import { apiCheckLogin, apiPostLetter, apiPutLetter } from "../../../lib/hooks/apiHooks";
import { useNavigate } from "react-router-dom";

const SubmitModal = () => {
  const { text, audio, image, title, setTitle } = useLetterFormStore((state) => state);
  const me = useMyPositionStore((state) => state.currentCoordinates);
  const navigate = useNavigate();

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
                if (me) {
                  apiPostLetter({
                    title: "테스트",
                    summary: "과연 될 것인가",
                    longitude: me.lon,
                    latitude: me.lat,
                    text: text ?? "",
                  }).then(
                    (res) => {
                      if (!image && !audio) {
                        navigate("/");
                        return Promise.resolve(null);
                      }
                      const putBody = new FormData();
                      if (image) {
                        putBody.append("image", image);
                      }
                      if (audio) {
                        putBody.append("voice", audio);
                      }
                      apiPutLetter(res.data.id, putBody).then((res) => {
                        navigate("/");
                      });
                    },
                    (e) => {
                      console.log(e);
                    }
                  );
                }
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
