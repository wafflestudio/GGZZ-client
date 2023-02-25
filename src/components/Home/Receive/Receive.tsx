import styles from "./Receive.module.scss";
import { useHomeModalStore } from "../../../../store/useHomeModalStore";
import { useEffect, useState } from "react";
import { LetterResponse } from "../../../../types/letterTypes";
import { useMyPositionStore } from "../../../../store/useMyPositionStore";
import { getDistanceFromLatLonInM } from "../../../lib";
import { dummyLetters2 } from "../../../pages/Home";

//type;

export const ReceiveContainer = () => {
  const [detailed, setDetailed] = useState<LetterResponse | false>(false);
  const letter = useHomeModalStore((state) => state.letter);
  const close = useHomeModalStore((state) => state.deselectLetter);
  const myCoordination = useMyPositionStore((state) => state.currentCoordinates);

  useEffect(() => {
    if (myCoordination && letter) {
      const dist = getDistanceFromLatLonInM(myCoordination, letter.coordinates);
      if (dist < 30) {
        const index = dummyLetters2.findIndex((item) => item.id === letter.id);
        if (index >= 0) {
          setDetailed(dummyLetters2[index]);
        }
      }
    }
  }, []);

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
              <>{detailed.text && <div>텍스트: {detailed.text}</div>}</>
            ) : (
              <>
                <div>
                  거리:
                  {myCoordination
                    ? `${Math.round(
                        getDistanceFromLatLonInM(myCoordination, letter.coordinates)
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
