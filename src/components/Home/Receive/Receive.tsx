import styles from "./Receive.module.scss";
import { useHomeModalStore } from "../../../store/useHomeModalStore";
import { useEffect, useState } from "react";
import { useMyPositionStore } from "../../../store/useMyPositionStore";
import { getDistanceFromLatLngInM } from "../../../lib/lib";

import { apiGetLetter } from "../../../lib/hooks/apiHooks";

//type;

export const ReceiveContainer = () => {
  const [detailed, setDetailed] = useState<{ text: string; image: string; voice: string } | false>(
    false
  );
  const letter = useHomeModalStore((state) => state.letter);
  const close = useHomeModalStore((state) => state.deselectLetter);
  const myCoordination = useMyPositionStore((state) => state.currentCoordinates);
  /*
  useEffect(() => {
    if (myCoordination && letter) {
      const dist = getDistanceFromLatLngInM(myCoordination, letter.coordinates);
      if (dist < 30) {
        const index = dummyLetters2.findIndex((item) => item.id === letter.id);
        if (index >= 0) {
          setDetailed(dummyLetters2[index]);
        } else {
          (async () => {
            const res = await axios.get("https://iwe-server.shop/api/v1/letters");
            const result: LetterResponse[] = res.data.data.map(
              (dt: any): LetterResponse => ({
                id: dt.id,
                title: dt.title,
                LLCoordinates: { lat: dt.longitude, lng: dt.latitude },
                text: dt.text ? dt.text : dt.summary,
                image: dt.image ? dt.image : null,
                audio: dt.audio ? dt.image : null,
              })
            );
            const index2 = result.findIndex((item) => item.id === letter.id);
            if (index2 >= 0) {
              setDetailed(result[index2]);
            }
          })();
        }
      }
    }
  }, []);
*/
  useEffect(() => {
    if (letter && myCoordination) {
      apiGetLetter(letter.id, myCoordination.lng, myCoordination.lat).then((res) =>
        setDetailed(res.data)
      );
    }
  }, [letter, myCoordination]);

  return (
    <div
      className={styles.container}
      onClick={(e) => {
        e.stopPropagation();
        close();
      }}
    >
      <div className={styles.wrapper} onClick={(e) => e.stopPropagation()}>
        {letter && (
          <div>
            <div>타이틀: {letter.title}</div>
            {detailed ? (
              <>
                {detailed.text && <div>텍스트: {detailed.text}</div>}
                {detailed.image && <img style={{ width: "100%" }} src={detailed.image} />}
                {detailed.voice && <audio controls src={detailed.voice} />}
              </>
            ) : (
              <>
                <div>
                  거리:
                  {myCoordination
                    ? `${Math.round(
                        getDistanceFromLatLngInM(myCoordination, letter.coordinates)
                      )}` + "m"
                    : "확인 안 됨"}
                </div>
                <div className={styles.small}>메시지를 확인하려면 30m 안쪽으로 들어가세요!</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
