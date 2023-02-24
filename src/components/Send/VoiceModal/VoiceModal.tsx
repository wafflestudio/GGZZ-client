import styles from "./VoiceModal.module.scss";
import { useReactMediaRecorder } from "react-media-recorder";
import { useLetterFormStore } from "../../../../store/useLetterFormStore";

const VoiceModal = () => {
  const audio = useLetterFormStore((state) => state.audio);
  const setAudio = useLetterFormStore((state) => state.setAudio);

  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      video: false,
    });

  return (
    <div className={styles.voice}>
      <div className={styles.description}>남기고 싶은 소리</div>
      {audio ? (
        <>
          <div className={styles.playBack}>
            <div className={styles.savedVoice}>저장된 목소리</div>
            <audio src={URL.createObjectURL(audio)} controls />
          </div>
          <div
            className={styles.deleteVoice}
            onClick={() => {
              clearBlobUrl();
              setAudio(null);
            }}
          >
            다시 녹음할래요!
          </div>
        </>
      ) : (
        <>
          <div className={styles.record}>
            {status === "idle" && (
              <button className={styles.recordButton} onClick={startRecording}>
                녹음하기
              </button>
            )}
            {status === "recording" && (
              <button className={styles.recordButton} onClick={stopRecording}>
                정지
              </button>
            )}
            {status === "stopped" && (
              <>
                <audio src={mediaBlobUrl} controls />
                <button
                  className={styles.recordAgainButton}
                  onClick={() => {
                    clearBlobUrl();
                  }}
                >
                  다시 녹음하기
                </button>
              </>
            )}
          </div>
          <button
            className={`${styles.save} ${mediaBlobUrl ? styles.canSave : styles.cantSave} `}
            onClick={async () => {
              if (mediaBlobUrl) {
                const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob());
                setAudio(audioBlob);
              }
            }}
          >
            저장하기
          </button>
        </>
      )}
    </div>
  );
};

export default VoiceModal;
