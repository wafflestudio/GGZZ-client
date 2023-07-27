import { PropsWithChildren, useEffect, useRef, useState } from "react";
import Marker from "./Marker";
import styles from "./Map.module.scss";
import { useDeepCompareEffectForMaps } from "../../../lib/hooks/mapHooks";

interface MapProps extends PropsWithChildren<google.maps.MapOptions> {
  className: string;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  letters: {
    id: number;
    createdAt: string;
    createdBy: string;
    title: string;
    summary: string;
    longitude: number;
    latitude: number;
  }[];
}

const Map = ({ onIdle, onClick, className, letters, ...options }: MapProps) => {
  const [map, setMap] = useState<google.maps.Map>();
  const [highLight, setHighlight] = useState<number>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, { ...options, disableDefaultUI: true }));
    }
  }, []);

  // because React does not do deep comparisons, a custom hook is used
  // see discussion in https://github.com/googlemaps/js-samples/issues/946
  useDeepCompareEffectForMaps(() => {
    if (map) {
      // TODO: mapId 추가하여 마커 로딩 확인
      map.setOptions({ ...options, mapId: process.env.REACT_APP_WEB_VECTOR_MAP_ID });
    }
  }, [map, options]);

  useEffect(() => {
    if (map) {
      ["click", "idle"].forEach((eventName) => google.maps.event.clearListeners(map, eventName));

      if (onClick) {
        map.addListener("click", onClick);
      }

      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);

  const onMarkerClick = (index: number) => {
    if (index === highLight) setHighlight(undefined);
    else setHighlight(index);
  };

  return (
    <>
      <div ref={ref} className={className} />
      {map &&
        letters.map((letter, i) => {
          return (
            <Marker
              key={i}
              map={map}
              position={{ lat: letter.latitude, lng: letter.longitude }}
              onClick={() => onMarkerClick(i)}
            >
              {highLight !== i ? (
                <div className={styles.marker} />
              ) : (
                <div className={`${styles.highlight}`}>
                  {/* styles.noImage는 이미지가 없는 경우의 클래스입니다. 
                  서버에서 letter response가 어떻게 오는지 몰라서 주석처리 해두었습니다. 
                  해당 필드값이 null이거나 한 경우 styles.noImage 클래스를 추가해서 아래 div처럼 바꾸면 됩니다. */}
                  {/* <div className={`${styles.highlight} ${img === null ? styles.noImage : ""}`}> */}
                  <div className={styles.letterHeader}>
                    <div className={styles.nickname}>닉네임</div>
                    <div className={styles.createTime}>1분 전</div>
                  </div>
                  <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1774&q=80" />
                  <p className={styles.content}>
                    내용 뭐 쓰지 내용 뭐 쓰지 내용 뭐 쓰지 내용 뭐 쓰지 내용 뭐 쓰지 내용 뭐 쓰지
                    내용 뭐 쓰지 내용 뭐 쓰지 내용 뭐 쓰지 내용 뭐 쓰지 내용 뭐 쓰지 내용 뭐 쓰지
                  </p>
                  <button className={styles.more}>더보기</button>
                </div>
              )}
            </Marker>
          );
        })}
    </>
  );
};

export default Map;
