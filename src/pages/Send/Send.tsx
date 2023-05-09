import styles from "./Send.module.scss";
import mic_icon from "../../assets/icon/Send/VoiceSection/mic.svg";
import { useLetterFormStore } from "../../store/useLetterFormStore";
import { useReactMediaRecorder } from "react-media-recorder";
import React, { PropsWithChildren, ReactElement, useCallback, useEffect, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { createCustomEqual, deepEqual, TypeEqualityComparator } from "fast-equals";
import { isLatLngLiteral } from "@googlemaps/typescript-guards";
import { useMyPositionStore } from "../../store/useMyPositionStore";

/* TODO: Home과 동일. 맵 코드 분리되면 임포트해서 사용할 것 */

type LatLngObject = google.maps.LatLng | google.maps.LatLngLiteral;

const customCompare: TypeEqualityComparator<LatLngObject, undefined> = (a: any, b: any) => {
  if (
    isLatLngLiteral(a) ||
    isLatLngLiteral(b) ||
    a instanceof google.maps.LatLng ||
    b instanceof google.maps.LatLng
  ) {
    if (isLatLngLiteral(a)) {
      a = new google.maps.LatLng(a);
    }
    if (isLatLngLiteral(b)) {
      b = new google.maps.LatLng(b);
    }
    return a.equals(b);
  }

  // TODO extend to other types

  // use fast-equals for other objects
  return deepEqual(a, b);
};

const deepCompareEqualsForMaps = createCustomEqual({
  createCustomConfig: () => ({
    areObjectsEqual: customCompare,
  }),
});
function useDeepCompareMemoize(value: any) {
  const ref = React.useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function useDeepCompareEffectForMaps(callback: React.EffectCallback, dependencies: unknown[]) {
  React.useEffect(callback, dependencies.map(useDeepCompareMemoize));
}

interface MapProps extends PropsWithChildren<google.maps.MapOptions> {
  className: string;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
}

const Map: React.FC<MapProps> = ({ children, onClick, onIdle, className, ...options }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map>();

  React.useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);

  // because React does not do deep comparisons, a custom hook is used
  // see discussion in https://github.com/googlemaps/js-samples/issues/946
  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  React.useEffect(() => {
    if (map) {
      ["idle"].forEach((eventName) => google.maps.event.clearListeners(map, eventName));

      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
    }
  }, [map, onIdle]);

  return (
    <>
      <div ref={ref} className={className} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};

/* 여기까지 Home과 동일.*/

const LocationSection = () => {
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null);
  const myPosition = useMyPositionStore((state) => state.currentCoordinates);
  /* TODO: Home과 동일. 맵 코드 분리되면 임포트해서 사용할 것 */

  const render = useCallback(
    (status: Status): ReactElement => {
      if (status === Status.LOADING || center === null) return <h3>{status} ..</h3>;
      if (status === Status.FAILURE) return <h3>{status} ...</h3>;
      else {
        return renderMap();
      }
    },
    [center]
  );

  const onIdle = useCallback((m: google.maps.Map) => {
    const bounds = m.getBounds();
    if (!bounds) return;
    const newCenter = m.getCenter()?.toJSON();
    if (!newCenter) return;
    setCenter(newCenter);
  }, []);

  const renderMap = useCallback((): ReactElement => {
    return <Map center={center} onIdle={onIdle} className={styles["map"]} />;
  }, [center]);
  /* TODO: 여기까지 동일 */

  useEffect(() => {
    setCenter(myPosition);
  }, [myPosition]);

  return (
    <div className={styles["locationSection"]}>
      <div className={styles["label"]}>위치 등록</div>
      <div className={styles["chips"]}>
        <div className={styles["locationChip"]}>Hyundai Department Store</div>
      </div>
      <div className={styles["map"]}>
        <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY || ""} render={render} />
      </div>
    </div>
  );
};

const TextSection = () => {
  const text = useLetterFormStore((state) => state.text);
  const setText = useLetterFormStore((state) => state.setText);

  return (
    <div className={styles["textSection"]}>
      <textarea
        placeholder="끄적끄적..."
        value={text ? text : ""}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
};

const ImageSection = () => {
  return (
    <div className={styles["imageSection"]}>
      <div className={styles["imageSlide"]}>
        <div className={styles["fakeImage"]} />
        <div className={styles["fakeImage"]} />
        <div className={styles["fakeImage"]} />
        <div className={styles["fakeImage"]} />
        <div className={styles["fakeImage"]} />
      </div>
    </div>
  );
};

const VoiceSection = () => {
  const audio = useLetterFormStore((state) => state.audio);
  const setAudio = useLetterFormStore((state) => state.setAudio);
  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      video: false,
    });

  //녹음 정지 시 자동 저장
  useEffect(() => {
    if (status === "stopped") {
      if (mediaBlobUrl)
        fetch(mediaBlobUrl)
          .then((res) => res.blob())
          .then((audioBlob) => {
            setAudio(audioBlob);
          });
    }
  }, [status]);

  return (
    <div className={styles["voiceSection"]}>
      <button
        className={`${styles["recordButton"]} ${
          (status === "recording" || audio) && styles["recording"]
        } }`}
        onClick={() => {
          if (status === "idle") {
            startRecording();
          }
          if (status === "stopped") {
            if (audio) {
              clearBlobUrl();
              setAudio(null);
              startRecording();
            }
          }
          if (status === "recording") {
            stopRecording();
          }
        }}
      >
        <img src={mic_icon} />
      </button>
      <div className={styles["playerWrapper"]}>
        {<audio src={audio ? URL.createObjectURL(audio) : ""} controls />}
      </div>
    </div>
  );
};

const SubmitSection = () => {
  const { text, audio, image } = useLetterFormStore((state) => state);

  return (
    <div className={styles["submitSection"]}>
      <button
        className={`${styles["mainPasteButton"]} ${(text || audio || image) && styles["active"]}`}
      >
        붙이기
      </button>
    </div>
  );
};

const Send = () => {
  return (
    <div className={styles["send"]}>
      <header className={styles["header"]}>
        <div className={styles["title"]}>끄적이기</div>
        <button className={styles["pasteButton"]}>붙이기</button>
      </header>
      <LocationSection />
      <TextSection />
      <ImageSection />
      <VoiceSection />
      <SubmitSection />
    </div>
  );
};

export default Send;
