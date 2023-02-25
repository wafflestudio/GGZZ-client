import styles from "./Receive.module.scss";
import { useHomeModalStore } from "../../../../store/useHomeModalStore";

export const ReceiveContainer = () => {
  const data = useHomeModalStore((state) => state.letter);
  const isDetailed = useHomeModalStore((state) => state.isDetailed);
  const close = useHomeModalStore((state) => state.deselectLetter);

  return (
    <div
      className={styles.container}
      onClick={(e) => {
        e.stopPropagation();
        close();
      }}
    >
      <div className={styles.wrapper} onClick={(e) => e.stopPropagation()}>
        {data && (
          <div>
            <div>타이틀: 가나다</div>
            <div>텍스트: </div>
            <div>가나다라마바사</div>
            <div>음성</div>
            <div>이미지</div>
          </div>
        )}
      </div>
    </div>
  );
};
